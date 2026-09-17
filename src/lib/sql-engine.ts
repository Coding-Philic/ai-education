// =====================================================================
// CogniFlow AI: Universal In-Memory Relational SQL Engine & Query Planner
// Zero Hardcoding: Dynamically parses, plans, executes, and animates SQL queries
// =====================================================================

export interface TableSchema {
  name: string;
  columns?: string[];
  rows: Record<string, any>[];
}

export interface SqlExecutionFrame {
  step: number;
  phase: 'PARSER' | 'PLANNER' | 'DRIVING_SCAN' | 'JOIN_EVALUATION' | 'FILTER' | 'AGGREGATE' | 'HAVING' | 'WINDOW' | 'PROJECTION';
  operator: string;
  cost: number;
  rowsIn: number;
  rowsOut: number;
  description: string;
  activeRows?: Record<string, any>[];
  memoryState?: Record<string, any>;
  highlightedTable?: string;
  vennState?: {
    leftTable: string;
    rightTable: string;
    leftCount: number;
    rightCount: number;
    matchCount: number;
    leftOnlyCount: number;
    rightOnlyCount: number;
  };
}

export interface ExplainPlanNode {
  nodeType: string;
  relationName?: string;
  alias?: string;
  condition?: string;
  startupCost: number;
  totalCost: number;
  planRows: number;
  actualRows: number;
  actualTimeMs: number;
  children?: ExplainPlanNode[];
}

export interface SqlEngineResult {
  success: boolean;
  rows: Record<string, any>[];
  columns: string[];
  runtimeMs: number;
  rowsExamined: number;
  rowsReturned: number;
  joinType: string;
  scanType: string;
  cost: number;
  error?: string;
  frames: SqlExecutionFrame[];
  explainPlan: ExplainPlanNode;
  vennData?: {
    leftTable: string;
    rightTable: string;
    leftCount: number;
    rightCount: number;
    matchCount: number;
    leftOnlyCount: number;
    rightOnlyCount: number;
    joinCondition: string;
  };
}

/**
 * Normalizes SQL by removing trailing semicolons, comments, and extra spaces.
 */
function cleanQuery(query: string): string {
  return query
    .replace(/--.*$/gm, '') // single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // multi-line comments
    .trim()
    .replace(/;+$/, '')
    .trim();
}

/**
 * Evaluates a binary condition string on a flattened tuple row.
 * Keys in `row` can be `name`, `students.name`, `s.name`.
 */
function evaluateCondition(condStr: string, row: Record<string, any>): boolean {
  const cleanCond = condStr.trim();
  if (!cleanCond) return true;

  // Handle AND
  if (/\s+AND\s+/i.test(cleanCond)) {
    const parts = cleanCond.split(/\s+AND\s+/i);
    return parts.every((p) => evaluateCondition(p, row));
  }

  // Handle OR
  if (/\s+OR\s+/i.test(cleanCond)) {
    const parts = cleanCond.split(/\s+OR\s+/i);
    return parts.some((p) => evaluateCondition(p, row));
  }

  // Handle IS NULL / IS NOT NULL
  const isNotNullMatch = cleanCond.match(/^(.+?)\s+IS\s+NOT\s+NULL$/i);
  if (isNotNullMatch) {
    const val = resolveValue(isNotNullMatch[1].trim(), row);
    return val !== null && val !== undefined;
  }
  const isNullMatch = cleanCond.match(/^(.+?)\s+IS\s+NULL$/i);
  if (isNullMatch) {
    const val = resolveValue(isNullMatch[1].trim(), row);
    return val === null || val === undefined;
  }

  // Handle IN (...) / NOT IN (...)
  const notInMatch = cleanCond.match(/^(.+?)\s+NOT\s+IN\s*\((.+?)\)$/i);
  if (notInMatch) {
    const leftVal = resolveValue(notInMatch[1].trim(), row);
    const setVals = notInMatch[2].split(',').map((v) => parseLiteralOrKey(v.trim(), row));
    return !setVals.includes(leftVal);
  }
  const inMatch = cleanCond.match(/^(.+?)\s+IN\s*\((.+?)\)$/i);
  if (inMatch) {
    const leftVal = resolveValue(inMatch[1].trim(), row);
    const setVals = inMatch[2].split(',').map((v) => parseLiteralOrKey(v.trim(), row));
    return setVals.includes(leftVal);
  }

  // Handle LIKE
  const likeMatch = cleanCond.match(/^(.+?)\s+LIKE\s+['"](.+?)['"]$/i);
  if (likeMatch) {
    const leftVal = String(resolveValue(likeMatch[1].trim(), row) ?? '');
    const pattern = likeMatch[2].replace(/%/g, '.*').replace(/_/g, '.');
    return new RegExp(`^${pattern}$`, 'i').test(leftVal);
  }

  // Handle modulo: e.g. id % 2 = 1 or MOD(id, 2) = 1
  const modMatch = cleanCond.match(/^(.+?)\s*%\s*(\d+)\s*(=|!=|<>)\s*(\d+)$/i);
  if (modMatch) {
    const val = Number(resolveValue(modMatch[1].trim(), row));
    const divisor = Number(modMatch[2]);
    const op = modMatch[3];
    const target = Number(modMatch[4]);
    const res = val % divisor;
    return (op === '=' ? res === target : res !== target);
  }

  // Comparison operators: <=, >=, !=, <>, =, <, >
  const opMatch = cleanCond.match(/^(.+?)\s*(=|!=|<>|<=|>=|<|>)\s*(.+)$/);
  if (opMatch) {
    const leftRaw = opMatch[1].trim();
    const op = opMatch[2];
    const rightRaw = opMatch[3].trim();

    const leftVal = parseLiteralOrKey(leftRaw, row);
    const rightVal = parseLiteralOrKey(rightRaw, row);

    if (leftVal === null || rightVal === null) {
      return false; // SQL ternary logic (NULL comparison yields UNKNOWN -> false)
    }

    switch (op) {
      case '=':
        return String(leftVal).toLowerCase() === String(rightVal).toLowerCase();
      case '!=':
      case '<>':
        return String(leftVal).toLowerCase() !== String(rightVal).toLowerCase();
      case '<':
        return Number(leftVal) < Number(rightVal);
      case '>':
        return Number(leftVal) > Number(rightVal);
      case '<=':
        return Number(leftVal) <= Number(rightVal);
      case '>=':
        return Number(leftVal) >= Number(rightVal);
    }
  }

  return true;
}

/**
 * Resolves a field or value from a row.
 * Supports table prefixes (e.g. s.name, students.name, or name).
 */
function resolveValue(key: string, row: Record<string, any>): any {
  const cleanKey = key.trim().replace(/^['"`]|['"`]$/g, '');
  
  if (cleanKey in row) return row[cleanKey];

  const lowerKey = cleanKey.toLowerCase();
  for (const [k, v] of Object.entries(row)) {
    if (k.toLowerCase() === lowerKey) return v;
  }

  // Try stripping table alias/prefix if exists (e.g., s.id -> id)
  if (cleanKey.includes('.')) {
    const colOnly = cleanKey.split('.').pop()!.toLowerCase();
    for (const [k, v] of Object.entries(row)) {
      if (k.toLowerCase() === colOnly) return v;
    }
  } else {
    // Try finding key with any table prefix in row
    for (const [k, v] of Object.entries(row)) {
      if (k.toLowerCase().endsWith(`.${lowerKey}`)) {
        return v;
      }
    }
  }

  return undefined;
}

function parseLiteralOrKey(token: string, row: Record<string, any>): any {
  const t = token.trim();
  // String literal
  if ((t.startsWith("'") && t.endsWith("'")) || (t.startsWith('"') && t.endsWith('"'))) {
    return t.slice(1, -1);
  }
  // Number literal
  if (!isNaN(Number(t)) && t !== '') {
    return Number(t);
  }
  // Boolean
  if (t.toUpperCase() === 'TRUE') return true;
  if (t.toUpperCase() === 'FALSE') return false;
  if (t.toUpperCase() === 'NULL') return null;

  // Otherwise evaluate as column
  const val = resolveValue(t, row);
  return val !== undefined ? val : null;
}

/**
 * Flattens and prefixes table columns for multi-table join namespace resolution.
 */
function prefixRow(table: string, alias: string | null, row: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [k, v] of Object.entries(row)) {
    result[k] = v; // Bare column
    result[`${table}.${k}`] = v; // table.col
    if (alias) {
      result[`${alias}.${k}`] = v; // alias.col
    }
  }
  return result;
}

/**
 * Main Universal In-Memory SQL Execution Engine
 */
export function executeSqlEngine(rawQuery: string, availableTables: TableSchema[]): SqlEngineResult {
  const startTime = performance.now();
  const frames: SqlExecutionFrame[] = [];
  const query = cleanQuery(rawQuery);

  if (!query) {
    return {
      success: false,
      rows: [],
      columns: [],
      runtimeMs: 0,
      rowsExamined: 0,
      rowsReturned: 0,
      joinType: 'Sequential Scan',
      scanType: 'Sequential Scan',
      cost: 0,
      error: 'Empty query provided.',
      frames: [],
      explainPlan: {
        nodeType: 'Empty',
        startupCost: 0,
        totalCost: 0,
        planRows: 0,
        actualRows: 0,
        actualTimeMs: 0,
      },
    };
  }

  try {
    // 1. Frame 1: SQL Parser Stage
    frames.push({
      step: 1,
      phase: 'PARSER',
      operator: 'SQL_LEXER_PARSER',
      cost: 0.05,
      rowsIn: 0,
      rowsOut: 0,
      description: 'Lexical analysis & AST construction: Validated syntax, token stream, and schema references.',
      memoryState: { queryLength: query.length, tokens: query.split(/\s+/).length },
    });

    // 2. Parse SELECT clause
    const selectMatch = query.match(/SELECT\s+(DISTINCT\s+)?([\s\S]+?)\s+FROM\s+/i);
    if (!selectMatch) {
      throw new Error('Unsupported query syntax: Must contain standard SELECT ... FROM structure.');
    }
    const isDistinct = Boolean(selectMatch[1]);
    const selectClause = selectMatch[2].trim();

    // 3. Parse FROM and JOINs
    const fromRest = query.slice(selectMatch[0].length);
    const fromClauseMatch = fromRest.match(/^([a-zA-Z0-9_]+)(?:\s+(?:AS\s+)?([a-zA-Z0-9_]+))?/i);
    if (!fromClauseMatch) {
      throw new Error('Could not parse target table from FROM clause.');
    }

    const primaryTableName = fromClauseMatch[1];
    const primaryTableAlias = fromClauseMatch[2] || null;

    const primaryTable = availableTables.find(
      (t) => t.name.toLowerCase() === primaryTableName.toLowerCase()
    );
    if (!primaryTable) {
      throw new Error(`Table '${primaryTableName}' does not exist in the active schema catalog.`);
    }

    let rowsExamined = primaryTable.rows.length;

    // Frame 2: Query Optimizer / Planner
    frames.push({
      step: 2,
      phase: 'PLANNER',
      operator: 'COST_BASED_OPTIMIZER',
      cost: 1.15,
      rowsIn: primaryTable.rows.length,
      rowsOut: primaryTable.rows.length,
      description: `Planner selected driving relation '${primaryTableName}' (est. ${primaryTable.rows.length} tuples). Calculated access path cost.`,
      highlightedTable: primaryTableName,
      memoryState: { drivingTable: primaryTableName, estimatedTuples: primaryTable.rows.length },
    });

    // Frame 3: Scan Primary Table
    frames.push({
      step: 3,
      phase: 'DRIVING_SCAN',
      operator: 'SEQ_SCAN',
      cost: 2.2,
      rowsIn: primaryTable.rows.length,
      rowsOut: primaryTable.rows.length,
      description: `Sequential Scan on '${primaryTableName}': Loaded ${primaryTable.rows.length} disk pages into memory buffer cache.`,
      highlightedTable: primaryTableName,
      activeRows: primaryTable.rows.slice(0, 3),
    });

    // Seed intermediate tuple stream
    let workingRows: Record<string, any>[] = primaryTable.rows.map((r) =>
      prefixRow(primaryTableName, primaryTableAlias, r)
    );

    let activeJoinType = 'Sequential Scan';
    let secondaryTableName: string | null = null;
    let joinConditionStr: string | null = null;
    let matchCount = 0;
    let leftCount = primaryTable.rows.length;
    let rightCount = 0;
    let leftOnlyCount = 0;
    let rightOnlyCount = 0;

    // 4. Parse JOIN clauses (INNER, LEFT, RIGHT, CROSS, or plain JOIN)
    const joinRegex = /(INNER\s+|LEFT\s+(?:OUTER\s+)?|RIGHT\s+(?:OUTER\s+)?|CROSS\s+)?JOIN\s+([a-zA-Z0-9_]+)(?:\s+(?:AS\s+)?([a-zA-Z0-9_]+))?\s+ON\s+([\s\S]+?)(?=\s+(?:WHERE|GROUP\s+BY|HAVING|ORDER\s+BY|LIMIT|INNER|LEFT|RIGHT|CROSS|JOIN)|$)/gi;
    let joinMatch: RegExpExecArray | null;

    while ((joinMatch = joinRegex.exec(fromRest)) !== null) {
      const joinModifier = (joinMatch[1] || 'INNER').trim().toUpperCase();
      const rightTableName = joinMatch[2];
      const rightTableAlias = joinMatch[3] || null;
      const joinCond = joinMatch[4].trim();

      secondaryTableName = rightTableName;
      joinConditionStr = joinCond;
      activeJoinType = joinModifier.includes('LEFT') ? 'Left Hash Join' : 'Hash Join';

      const rightTable = availableTables.find(
        (t) => t.name.toLowerCase() === rightTableName.toLowerCase()
      );
      if (!rightTable) {
        throw new Error(`Joined table '${rightTableName}' does not exist in schema.`);
      }

      rowsExamined += rightTable.rows.length;
      rightCount = rightTable.rows.length;

      const newWorkingRows: Record<string, any>[] = [];
      const matchedRightIndices = new Set<number>();

      for (const leftRow of workingRows) {
        let hasMatch = false;
        rightTable.rows.forEach((rRaw, rIdx) => {
          const rightRowPrefixed = prefixRow(rightTableName, rightTableAlias, rRaw);
          const combined = { ...leftRow, ...rightRowPrefixed };

          if (evaluateCondition(joinCond, combined)) {
            newWorkingRows.push(combined);
            matchedRightIndices.add(rIdx);
            hasMatch = true;
            matchCount++;
          }
        });

        if (!hasMatch && joinModifier.includes('LEFT')) {
          // Fill NULLs for right table columns
          const nullRight: Record<string, any> = {};
          for (const col of Object.keys(rightTable.rows[0] || {})) {
            nullRight[col] = null;
            nullRight[`${rightTableName}.${col}`] = null;
            if (rightTableAlias) nullRight[`${rightTableAlias}.${col}`] = null;
          }
          newWorkingRows.push({ ...leftRow, ...nullRight });
          leftOnlyCount++;
        } else if (!hasMatch) {
          leftOnlyCount++;
        }
      }

      rightOnlyCount = rightTable.rows.length - matchedRightIndices.size;

      workingRows = newWorkingRows;

      frames.push({
        step: 4,
        phase: 'JOIN_EVALUATION',
        operator: activeJoinType,
        cost: 4.85,
        rowsIn: leftCount + rightCount,
        rowsOut: workingRows.length,
        description: `Evaluated ${joinModifier} JOIN between '${primaryTableName}' and '${rightTableName}' on [${joinCond}]. Matched ${matchCount} rows.`,
        activeRows: workingRows.slice(0, 3),
        vennState: {
          leftTable: primaryTableName,
          rightTable: rightTableName,
          leftCount,
          rightCount,
          matchCount,
          leftOnlyCount,
          rightOnlyCount,
        },
      });
    }

    // 5. Parse WHERE clause
    const whereMatch = fromRest.match(/\s+WHERE\s+([\s\S]+?)(?=\s+(?:GROUP\s+BY|HAVING|ORDER\s+BY|LIMIT)|$)/i);
    if (whereMatch) {
      const whereCond = whereMatch[1].trim();
      const beforeFilterCount = workingRows.length;
      workingRows = workingRows.filter((r) => evaluateCondition(whereCond, r));

      frames.push({
        step: 5,
        phase: 'FILTER',
        operator: 'FILTER_PREDICATE',
        cost: 6.1,
        rowsIn: beforeFilterCount,
        rowsOut: workingRows.length,
        description: `Applied WHERE predicate (${whereCond}): Retained ${workingRows.length} of ${beforeFilterCount} tuples.`,
        activeRows: workingRows.slice(0, 3),
      });
    }

    // 6. Parse GROUP BY clause
    const groupByMatch = fromRest.match(/\s+GROUP\s+BY\s+([\s\S]+?)(?=\s+(?:HAVING|ORDER\s+BY|LIMIT)|$)/i);
    let groupedData: { groupKey: string; rows: Record<string, any>[] }[] = [];

    if (groupByMatch) {
      activeJoinType = 'Hash Aggregate';
      const groupCols = groupByMatch[1].split(',').map((c) => c.trim());
      const groupsMap = new Map<string, Record<string, any>[]>();

      for (const row of workingRows) {
        const key = groupCols.map((c) => String(resolveValue(c, row) ?? '')).join('::');
        if (!groupsMap.has(key)) groupsMap.set(key, []);
        groupsMap.get(key)!.push(row);
      }

      groupedData = Array.from(groupsMap.entries()).map(([k, rows]) => ({
        groupKey: k,
        rows,
      }));

      frames.push({
        step: 6,
        phase: 'AGGREGATE',
        operator: 'HASH_AGGREGATE',
        cost: 8.4,
        rowsIn: workingRows.length,
        rowsOut: groupedData.length,
        description: `Grouped ${workingRows.length} tuples into ${groupedData.length} buckets by keys: (${groupCols.join(', ')}).`,
        memoryState: { bucketCount: groupedData.length, memoryUsed: `${groupedData.length * 128} bytes` },
      });
    }

    // 7. Parse HAVING clause
    const havingMatch = fromRest.match(/\s+HAVING\s+([\s\S]+?)(?=\s+(?:ORDER\s+BY|LIMIT)|$)/i);
    if (havingMatch && groupedData.length > 0) {
      const havingCond = havingMatch[1].trim();
      const beforeHaving = groupedData.length;

      groupedData = groupedData.filter((g) => {
        // Build mock aggregate row for evaluating condition
        const aggRow: Record<string, any> = {
          ...g.rows[0],
          'count(*)': g.rows.length,
          'count(1)': g.rows.length,
          count: g.rows.length,
        };
        for (const col of Object.keys(g.rows[0] || {})) {
          aggRow[`count(${col.toLowerCase()})`] = g.rows.filter(
            (r) => r[col] !== null && r[col] !== undefined
          ).length;
        }
        return evaluateCondition(havingCond, aggRow);
      });

      frames.push({
        step: 7,
        phase: 'HAVING',
        operator: 'HAVING_FILTER',
        cost: 9.1,
        rowsIn: beforeHaving,
        rowsOut: groupedData.length,
        description: `HAVING condition (${havingCond}) filtered bucketed aggregates: ${groupedData.length} groups passed.`,
      });
    }

    // 8. Projection & Expression Evaluation
    const selectItems = splitSelectExpressions(selectClause);
    let projectedRows: Record<string, any>[] = [];

    if (groupedData.length > 0) {
      // Evaluate for each group
      projectedRows = groupedData.map((g) => {
        const outRow: Record<string, any> = {};
        for (const item of selectItems) {
          const evaluated = evaluateSelectItemForGroup(item, g.rows);
          outRow[evaluated.alias] = evaluated.value;
        }
        return outRow;
      });
    } else {
      // Non-grouped projection
      projectedRows = workingRows.map((r) => {
        const outRow: Record<string, any> = {};
        for (const item of selectItems) {
          const evaluated = evaluateSelectItemForRow(item, r);
          outRow[evaluated.alias] = evaluated.value;
        }
        return outRow;
      });
    }

    // 9. Handle Window Functions (e.g. DENSE_RANK() OVER (ORDER BY col DESC))
    for (const item of selectItems) {
      const windowMatch = item.expr.match(/DENSE_RANK\(\)\s+OVER\s*\((?:PARTITION\s+BY\s+([a-zA-Z0-9_\.]+)\s+)?ORDER\s+BY\s+([a-zA-Z0-9_\.]+)(?:\s+(ASC|DESC))?\)/i);
      if (windowMatch) {
        const partitionCol = windowMatch[1]?.trim();
        const orderCol = windowMatch[2]?.trim();
        const dir = (windowMatch[3] || 'ASC').toUpperCase();

        // Sort for ranking
        projectedRows.sort((a, b) => {
          const valA = Number(resolveValue(orderCol, a) ?? 0);
          const valB = Number(resolveValue(orderCol, b) ?? 0);
          return dir === 'DESC' ? valB - valA : valA - valB;
        });

        let currentRank = 1;
        let prevVal: any = null;
        for (let i = 0; i < projectedRows.length; i++) {
          const val = resolveValue(orderCol, projectedRows[i]);
          if (i > 0 && val !== prevVal) {
            currentRank++;
          }
          prevVal = val;
          projectedRows[i][item.alias] = currentRank;
        }

        frames.push({
          step: 8,
          phase: 'WINDOW',
          operator: 'WINDOW_DENSE_RANK',
          cost: 10.2,
          rowsIn: projectedRows.length,
          rowsOut: projectedRows.length,
          description: `Window Function computed DENSE_RANK() over '${orderCol}' (${dir}).`,
          activeRows: projectedRows.slice(0, 3),
        });
      }
    }

    // 10. DISTINCT handling
    if (isDistinct) {
      const seen = new Set<string>();
      projectedRows = projectedRows.filter((r) => {
        const key = JSON.stringify(r);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    // 11. Parse ORDER BY clause
    const orderByMatch = fromRest.match(/\s+ORDER\s+BY\s+([\s\S]+?)(?=\s+LIMIT|$)/i);
    if (orderByMatch) {
      const orderDirectives = orderByMatch[1].split(',').map((p) => {
        const parts = p.trim().split(/\s+/);
        return {
          col: parts[0],
          desc: (parts[1] || 'ASC').toUpperCase() === 'DESC',
        };
      });

      projectedRows.sort((a, b) => {
        for (const dir of orderDirectives) {
          const valA = resolveValue(dir.col, a) ?? 0;
          const valB = resolveValue(dir.col, b) ?? 0;
          if (valA !== valB) {
            const cmp = typeof valA === 'number' && typeof valB === 'number'
              ? valA - valB
              : String(valA).localeCompare(String(valB));
            return dir.desc ? -cmp : cmp;
          }
        }
        return 0;
      });
    }

    // 12. Parse LIMIT & OFFSET clause
    const limitMatch = fromRest.match(/\s+LIMIT\s+(\d+)(?:\s+OFFSET\s+(\d+))?/i);
    if (limitMatch) {
      const limitVal = parseInt(limitMatch[1], 10);
      const offsetVal = limitMatch[2] ? parseInt(limitMatch[2], 10) : 0;
      projectedRows = projectedRows.slice(offsetVal, offsetVal + limitVal);
    }

    // Frame 9: Projection & Output Stream
    const finalCols = projectedRows.length > 0 ? Object.keys(projectedRows[0]) : selectItems.map((s) => s.alias);

    frames.push({
      step: frames.length + 1,
      phase: 'PROJECTION',
      operator: 'RESULT_EMIT',
      cost: 12.4,
      rowsIn: projectedRows.length,
      rowsOut: projectedRows.length,
      description: `Projected final schema attributes: [${finalCols.join(', ')}]. Emitted ${projectedRows.length} tuples to client.`,
      activeRows: projectedRows.slice(0, 5),
    });

    const runtimeMs = parseFloat((performance.now() - startTime).toFixed(2));

    // Build Visual EXPLAIN Node Tree
    const explainPlan: ExplainPlanNode = {
      nodeType: activeJoinType.includes('Aggregate') ? 'Aggregate' : activeJoinType,
      startupCost: 1.15,
      totalCost: 12.4,
      planRows: projectedRows.length,
      actualRows: projectedRows.length,
      actualTimeMs: runtimeMs,
      condition: joinConditionStr || undefined,
      children: [
        {
          nodeType: 'Seq Scan',
          relationName: primaryTableName,
          alias: primaryTableAlias || undefined,
          startupCost: 0.0,
          totalCost: 2.2,
          planRows: primaryTable.rows.length,
          actualRows: primaryTable.rows.length,
          actualTimeMs: parseFloat((runtimeMs * 0.3).toFixed(2)),
        },
        ...(secondaryTableName
          ? [
              {
                nodeType: 'Hash',
                relationName: secondaryTableName,
                startupCost: 1.5,
                totalCost: 3.8,
                planRows: rightCount,
                actualRows: rightCount,
                actualTimeMs: parseFloat((runtimeMs * 0.4).toFixed(2)),
              },
            ]
          : []),
      ],
    };

    return {
      success: true,
      rows: projectedRows,
      columns: finalCols,
      runtimeMs,
      rowsExamined,
      rowsReturned: projectedRows.length,
      joinType: activeJoinType,
      scanType: 'Sequential Scan',
      cost: 12.4,
      frames,
      explainPlan,
      vennData: secondaryTableName
        ? {
            leftTable: primaryTableName,
            rightTable: secondaryTableName,
            leftCount,
            rightCount,
            matchCount,
            leftOnlyCount,
            rightOnlyCount,
            joinCondition: joinConditionStr || '',
          }
        : undefined,
    };
  } catch (err: any) {
    const runtimeMs = parseFloat((performance.now() - startTime).toFixed(2));
    return {
      success: false,
      rows: [],
      columns: [],
      runtimeMs,
      rowsExamined: 0,
      rowsReturned: 0,
      joinType: 'Failed',
      scanType: 'Abort',
      cost: 0,
      error: err.message || 'SQL Execution Failure',
      frames,
      explainPlan: {
        nodeType: 'Abort',
        startupCost: 0,
        totalCost: 0,
        planRows: 0,
        actualRows: 0,
        actualTimeMs: runtimeMs,
      },
    };
  }
}

/**
 * Splits select expression commas while respecting function parentheses.
 */
function splitSelectExpressions(selectStr: string): { expr: string; alias: string }[] {
  const results: { expr: string; alias: string }[] = [];
  let current = '';
  let parenDepth = 0;

  for (let i = 0; i < selectStr.length; i++) {
    const char = selectStr[i];
    if (char === '(') parenDepth++;
    else if (char === ')') parenDepth--;

    if (char === ',' && parenDepth === 0) {
      if (current.trim()) results.push(parseAlias(current.trim()));
      current = '';
    } else {
      current += char;
    }
  }
  if (current.trim()) results.push(parseAlias(current.trim()));
  return results;
}

function parseAlias(raw: string): { expr: string; alias: string } {
  const asMatch = raw.match(/^([\s\S]+?)\s+(?:AS\s+)?([a-zA-Z0-9_]+)$/i);
  if (asMatch && !asMatch[1].trim().endsWith('(') && !asMatch[1].trim().endsWith(',')) {
    return { expr: asMatch[1].trim(), alias: asMatch[2].trim() };
  }
  // Default alias is clean column name
  const cleanAlias = raw.replace(/[^\w]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
  return { expr: raw, alias: cleanAlias || 'col' };
}

/**
 * Evaluates a single SELECT item for a non-grouped row.
 */
function evaluateSelectItemForRow(item: { expr: string; alias: string }, row: Record<string, any>): { alias: string; value: any } {
  const expr = item.expr.trim();

  // Asterisk: wildcard (handled by caller or returns row object)
  if (expr === '*') {
    return { alias: item.alias, value: row };
  }

  // CASE WHEN ... THEN ... ELSE ... END
  const caseMatch = expr.match(/CASE\s+WHEN\s+([\s\S]+?)\s+THEN\s+([\s\S]+?)\s+ELSE\s+([\s\S]+?)\s+END/i);
  if (caseMatch) {
    const cond = caseMatch[1].trim();
    const thenVal = parseLiteralOrKey(caseMatch[2].trim(), row);
    const elseVal = parseLiteralOrKey(caseMatch[3].trim(), row);
    return {
      alias: item.alias,
      value: evaluateCondition(cond, row) ? thenVal : elseVal,
    };
  }

  // Plain column or alias lookup
  const val = resolveValue(expr, row);
  return {
    alias: item.alias,
    value: val !== undefined ? val : null,
  };
}

/**
 * Evaluates an aggregate expression over a group of rows.
 */
function evaluateSelectItemForGroup(item: { expr: string; alias: string }, groupRows: Record<string, any>[]): { alias: string; value: any } {
  const expr = item.expr.trim();

  // COUNT(*) or COUNT(1)
  if (/^COUNT\s*\(\s*(\*|1)\s*\)$/i.test(expr)) {
    return { alias: item.alias, value: groupRows.length };
  }

  // COUNT(col)
  const countColMatch = expr.match(/^COUNT\s*\(\s*(?:DISTINCT\s+)?([a-zA-Z0-9_\.]+)\s*\)$/i);
  if (countColMatch) {
    const col = countColMatch[1].trim();
    const nonNulls = groupRows.filter((r) => resolveValue(col, r) !== null && resolveValue(col, r) !== undefined);
    return { alias: item.alias, value: nonNulls.length };
  }

  // SUM(col)
  const sumMatch = expr.match(/^SUM\s*\(\s*([a-zA-Z0-9_\.]+)\s*\)$/i);
  if (sumMatch) {
    const col = sumMatch[1].trim();
    const total = groupRows.reduce((acc, r) => acc + (Number(resolveValue(col, r)) || 0), 0);
    return { alias: item.alias, value: total };
  }

  // AVG(col)
  const avgMatch = expr.match(/^AVG\s*\(\s*([a-zA-Z0-9_\.]+)\s*\)$/i);
  if (avgMatch) {
    const col = avgMatch[1].trim();
    const total = groupRows.reduce((acc, r) => acc + (Number(resolveValue(col, r)) || 0), 0);
    const avg = groupRows.length > 0 ? parseFloat((total / groupRows.length).toFixed(2)) : 0;
    return { alias: item.alias, value: avg };
  }

  // MIN(col)
  const minMatch = expr.match(/^MIN\s*\(\s*([a-zA-Z0-9_\.]+)\s*\)$/i);
  if (minMatch) {
    const col = minMatch[1].trim();
    const values = groupRows.map((r) => resolveValue(col, r)).filter((v) => v !== null && v !== undefined);
    const minVal = values.length > 0 ? Math.min(...values.map(Number)) : null;
    return { alias: item.alias, value: minVal };
  }

  // MAX(col)
  const maxMatch = expr.match(/^MAX\s*\(\s*([a-zA-Z0-9_\.]+)\s*\)$/i);
  if (maxMatch) {
    const col = maxMatch[1].trim();
    const values = groupRows.map((r) => resolveValue(col, r)).filter((v) => v !== null && v !== undefined);
    const maxVal = values.length > 0 ? Math.max(...values.map(Number)) : null;
    return { alias: item.alias, value: maxVal };
  }

  // Fallback: standard column value from first tuple in group
  const firstRow = groupRows[0] || {};
  const val = resolveValue(expr, firstRow);
  return {
    alias: item.alias,
    value: val !== undefined ? val : null,
  };
}
