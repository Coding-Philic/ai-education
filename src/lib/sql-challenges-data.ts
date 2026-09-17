// =====================================================================
// CogniFlow AI: 22+ Classic LeetCode & Interview SQL Challenges Catalog
// Dynamic Multi-Table Relational Schemas, Constraints, and Benchmark Solutions
// =====================================================================

import { Challenge } from './types';

export interface SQLChallengeMeta extends Challenge {
  category: 'filtering' | 'joins' | 'aggregates' | 'subqueries' | 'window';
  difficultyTag: 'Easy' | 'Medium' | 'Hard';
  lcNumber?: number;
}

export const SQL_CHALLENGES: SQLChallengeMeta[] = [
  // ── 1. FILTERING & PROJECTIONS ──
  {
    id: 'sql-ch-1757',
    moduleId: '20000000-0000-0000-0000-000000000003',
    category: 'filtering',
    difficultyTag: 'Easy',
    lcNumber: 1757,
    title: 'Recyclable and Low Fat Products (LC 1757)',
    slug: 'recyclable-low-fat-products',
    problemStatement:
      'Write a solution to find the ids of products that are both low fat and recyclable. Return the result table in any order.',
    challengeType: 'sql_lab',
    starterCode: {
      sql: `SELECT product_id\nFROM products\nWHERE low_fats = 'Y' AND recyclable = 'Y';`,
    },
    initialVisualState: {
      type: 'RELATIONAL_TABLES',
      tables: [
        {
          name: 'products',
          rows: [
            { product_id: 0, low_fats: 'Y', recyclable: 'N' },
            { product_id: 1, low_fats: 'Y', recyclable: 'Y' },
            { product_id: 2, low_fats: 'N', recyclable: 'Y' },
            { product_id: 3, low_fats: 'Y', recyclable: 'Y' },
            { product_id: 4, low_fats: 'N', recyclable: 'N' },
          ],
        },
      ],
    },
    benchmarkSolution: {
      sql: `SELECT product_id FROM products WHERE low_fats = 'Y' AND recyclable = 'Y';`,
      timeComplexity: 'O(N) [Single-table scan]',
      spaceComplexity: 'O(1) [Zero temp buffers]',
      joinType: 'Sequential Scan',
    },
    testCases: [
      { input: { query: `SELECT count(*) FROM products WHERE low_fats = 'Y' AND recyclable = 'Y';` }, expected: 2 },
    ],
    xpReward: 50,
    orderIndex: 1,
  },
  {
    id: 'sql-ch-584',
    moduleId: '20000000-0000-0000-0000-000000000003',
    category: 'filtering',
    difficultyTag: 'Easy',
    lcNumber: 584,
    title: 'Find Customer Referee (LC 584)',
    slug: 'find-customer-referee',
    problemStatement:
      'Find the names of the customer that are not referred by the customer with id = 2. In SQL ternary logic, NULL referee_id must be handled explicitly!',
    challengeType: 'sql_lab',
    starterCode: {
      sql: `SELECT name\nFROM customer\nWHERE referee_id != 2 OR referee_id IS NULL;`,
    },
    initialVisualState: {
      type: 'RELATIONAL_TABLES',
      tables: [
        {
          name: 'customer',
          rows: [
            { id: 1, name: 'Will', referee_id: null },
            { id: 2, name: 'Jane', referee_id: null },
            { id: 3, name: 'Alex', referee_id: 2 },
            { id: 4, name: 'Bill', referee_id: null },
            { id: 5, name: 'Zack', referee_id: 1 },
            { id: 6, name: 'Mark', referee_id: 2 },
          ],
        },
      ],
    },
    benchmarkSolution: {
      sql: `SELECT name FROM customer WHERE referee_id != 2 OR referee_id IS NULL;`,
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      joinType: 'Filter Scan',
    },
    testCases: [
      { input: { query: `SELECT count(*) FROM customer WHERE referee_id != 2 OR referee_id IS NULL;` }, expected: 4 },
    ],
    xpReward: 50,
    orderIndex: 2,
  },
  {
    id: 'sql-ch-595',
    moduleId: '20000000-0000-0000-0000-000000000003',
    category: 'filtering',
    difficultyTag: 'Easy',
    lcNumber: 595,
    title: 'Big Countries (LC 595)',
    slug: 'big-countries',
    problemStatement:
      'A country is big if it has an area of at least 3,000,000 sq km or a population of at least 25,000,000. Write a solution to find the name, population, and area of the big countries.',
    challengeType: 'sql_lab',
    starterCode: {
      sql: `SELECT name, population, area\nFROM world\nWHERE area >= 3000000 OR population >= 25000000;`,
    },
    initialVisualState: {
      type: 'RELATIONAL_TABLES',
      tables: [
        {
          name: 'world',
          rows: [
            { name: 'Afghanistan', continent: 'Asia', area: 652230, population: 25500100, gdp: 20364020000 },
            { name: 'Albania', continent: 'Europe', area: 28748, population: 2831741, gdp: 12960000000 },
            { name: 'Algeria', continent: 'Africa', area: 2381741, population: 37100000, gdp: 188681000000 },
            { name: 'Andorra', continent: 'Europe', area: 468, population: 78115, gdp: 3712000000 },
            { name: 'Angola', continent: 'Africa', area: 1246700, population: 20609294, gdp: 100990000000 },
          ],
        },
      ],
    },
    benchmarkSolution: {
      sql: `SELECT name, population, area FROM world WHERE area >= 3000000 OR population >= 25000000;`,
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      joinType: 'Bitmap Scan / Seq Scan',
    },
    testCases: [],
    xpReward: 50,
    orderIndex: 3,
  },
  {
    id: 'sql-ch-1148',
    moduleId: '20000000-0000-0000-0000-000000000003',
    category: 'filtering',
    difficultyTag: 'Easy',
    lcNumber: 1148,
    title: 'Article Views I (LC 1148)',
    slug: 'article-views-i',
    problemStatement:
      'Find all authors that viewed at least one of their own articles. Return the result table sorted by id in ascending order with distinct values.',
    challengeType: 'sql_lab',
    starterCode: {
      sql: `SELECT DISTINCT author_id AS id\nFROM views\nWHERE author_id = viewer_id\nORDER BY id ASC;`,
    },
    initialVisualState: {
      type: 'RELATIONAL_TABLES',
      tables: [
        {
          name: 'views',
          rows: [
            { article_id: 1, author_id: 3, viewer_id: 5, view_date: '2019-08-01' },
            { article_id: 1, author_id: 3, viewer_id: 6, view_date: '2019-08-02' },
            { article_id: 2, author_id: 7, viewer_id: 7, view_date: '2019-08-01' },
            { article_id: 2, author_id: 7, viewer_id: 6, view_date: '2019-08-02' },
            { article_id: 4, author_id: 7, viewer_id: 1, view_date: '2019-07-22' },
            { article_id: 3, author_id: 4, viewer_id: 4, view_date: '2019-07-21' },
            { article_id: 3, author_id: 4, viewer_id: 4, view_date: '2019-07-21' },
          ],
        },
      ],
    },
    benchmarkSolution: {
      sql: `SELECT DISTINCT author_id AS id FROM views WHERE author_id = viewer_id ORDER BY id ASC;`,
      timeComplexity: 'O(N log N) [Hash Deduplication + Sort]',
      spaceComplexity: 'O(N)',
      joinType: 'Hash Aggregate',
    },
    testCases: [],
    xpReward: 50,
    orderIndex: 4,
  },
  {
    id: 'sql-ch-1683',
    moduleId: '20000000-0000-0000-0000-000000000003',
    category: 'filtering',
    difficultyTag: 'Easy',
    lcNumber: 1683,
    title: 'Invalid Tweets (LC 1683)',
    slug: 'invalid-tweets',
    problemStatement:
      'Find the IDs of the invalid tweets. A tweet is invalid if the number of characters used in the content of the tweet is strictly greater than 15.',
    challengeType: 'sql_lab',
    starterCode: {
      sql: `SELECT tweet_id\nFROM tweets\nWHERE LENGTH(content) > 15;`,
    },
    initialVisualState: {
      type: 'RELATIONAL_TABLES',
      tables: [
        {
          name: 'tweets',
          rows: [
            { tweet_id: 1, content: 'Vote for BIP-12' },
            { tweet_id: 2, content: 'Let us celebrate the AI Hackathon 2026 victory!' },
            { tweet_id: 3, content: 'CogniFlow AI' },
          ],
        },
      ],
    },
    benchmarkSolution: {
      sql: `SELECT tweet_id FROM tweets WHERE LENGTH(content) > 15;`,
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      joinType: 'Sequential Scan',
    },
    testCases: [],
    xpReward: 50,
    orderIndex: 5,
  },

  // ── 2. RELATIONAL JOINS & SET OPERATIONS ──
  {
    id: 'sql-ch-175',
    moduleId: '20000000-0000-0000-0000-000000000003',
    category: 'joins',
    difficultyTag: 'Easy',
    lcNumber: 175,
    title: 'Combine Two Tables (LC 175)',
    slug: 'combine-two-tables',
    problemStatement:
      'Write a solution to report the first name, last name, city, and state of each person in the Person table. If the address of a personId is not present, report null instead.',
    challengeType: 'sql_lab',
    starterCode: {
      sql: `SELECT p.firstName, p.lastName, a.city, a.state\nFROM person p\nLEFT JOIN address a ON p.personId = a.personId;`,
    },
    initialVisualState: {
      type: 'RELATIONAL_TABLES',
      tables: [
        {
          name: 'person',
          rows: [
            { personId: 1, lastName: 'Wang', firstName: 'Allen' },
            { personId: 2, lastName: 'Alice', firstName: 'Bob' },
          ],
        },
        {
          name: 'address',
          rows: [
            { addressId: 1, personId: 2, city: 'New York City', state: 'New York' },
          ],
        },
      ],
    },
    benchmarkSolution: {
      sql: `SELECT p.firstName, p.lastName, a.city, a.state FROM person p LEFT JOIN address a ON p.personId = a.personId;`,
      timeComplexity: 'O(N + M) [Hash Left Join]',
      spaceComplexity: 'O(M) [RAM Hash Table]',
      joinType: 'Left Hash Join',
    },
    testCases: [
      { input: { query: `SELECT count(*) FROM person LEFT JOIN address ON person.personId = address.personId;` }, expected: 2 },
    ],
    xpReward: 60,
    orderIndex: 6,
  },
  {
    id: 'sql-ch-183',
    moduleId: '20000000-0000-0000-0000-000000000003',
    category: 'joins',
    difficultyTag: 'Easy',
    lcNumber: 183,
    title: 'Customers Who Never Order (LC 183)',
    slug: 'customers-who-never-order',
    problemStatement:
      'Find all customers who never order anything. Use a LEFT JOIN and filter for NULL foreign keys in the orders table, or use NOT IN.',
    challengeType: 'sql_lab',
    starterCode: {
      sql: `SELECT c.name AS Customers\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customerId\nWHERE o.id IS NULL;`,
    },
    initialVisualState: {
      type: 'RELATIONAL_TABLES',
      tables: [
        {
          name: 'customers',
          rows: [
            { id: 1, name: 'Joe' },
            { id: 2, name: 'Henry' },
            { id: 3, name: 'Sam' },
            { id: 4, name: 'Max' },
          ],
        },
        {
          name: 'orders',
          rows: [
            { id: 1, customerId: 3 },
            { id: 2, customerId: 1 },
          ],
        },
      ],
    },
    benchmarkSolution: {
      sql: `SELECT c.name AS Customers FROM customers c LEFT JOIN orders o ON c.id = o.customerId WHERE o.id IS NULL;`,
      timeComplexity: 'O(N + M) [Hash Anti-Join]',
      spaceComplexity: 'O(M) [Hash Set]',
      joinType: 'Left Anti Join',
    },
    testCases: [],
    xpReward: 60,
    orderIndex: 7,
  },
  {
    id: 'sql-ch-1378',
    moduleId: '20000000-0000-0000-0000-000000000003',
    category: 'joins',
    difficultyTag: 'Easy',
    lcNumber: 1378,
    title: 'Replace Employee ID With Unique Identifier (LC 1378)',
    slug: 'replace-employee-id',
    problemStatement:
      'Show the unique ID of each user. If a user does not have a unique ID replacement, just show null.',
    challengeType: 'sql_lab',
    starterCode: {
      sql: `SELECT u.unique_id, e.name\nFROM employees e\nLEFT JOIN employeeuni u ON e.id = u.id;`,
    },
    initialVisualState: {
      type: 'RELATIONAL_TABLES',
      tables: [
        {
          name: 'employees',
          rows: [
            { id: 1, name: 'Alice' },
            { id: 7, name: 'Bob' },
            { id: 11, name: 'Meir' },
            { id: 90, name: 'Winston' },
            { id: 3, name: 'Jonathan' },
          ],
        },
        {
          name: 'employeeuni',
          rows: [
            { id: 3, unique_id: 1 },
            { id: 11, unique_id: 2 },
            { id: 90, unique_id: 3 },
          ],
        },
      ],
    },
    benchmarkSolution: {
      sql: `SELECT u.unique_id, e.name FROM employees e LEFT JOIN employeeuni u ON e.id = u.id;`,
      timeComplexity: 'O(N + M)',
      spaceComplexity: 'O(M)',
      joinType: 'Left Hash Join',
    },
    testCases: [],
    xpReward: 60,
    orderIndex: 8,
  },
  {
    id: 'sql-ch-1068',
    moduleId: '20000000-0000-0000-0000-000000000003',
    category: 'joins',
    difficultyTag: 'Easy',
    lcNumber: 1068,
    title: 'Product Sales Analysis I (LC 1068)',
    slug: 'product-sales-analysis-i',
    problemStatement:
      'Report the product_name, year, and price for each sale_id in the Sales table. Combine Sales with Product using an INNER JOIN.',
    challengeType: 'sql_lab',
    starterCode: {
      sql: `SELECT p.product_name, s.year, s.price\nFROM sales s\nINNER JOIN product p ON s.product_id = p.product_id;`,
    },
    initialVisualState: {
      type: 'RELATIONAL_TABLES',
      tables: [
        {
          name: 'sales',
          rows: [
            { sale_id: 1, product_id: 100, year: 2008, quantity: 10, price: 5000 },
            { sale_id: 2, product_id: 100, year: 2009, quantity: 12, price: 5000 },
            { sale_id: 7, product_id: 200, year: 2011, quantity: 15, price: 9000 },
          ],
        },
        {
          name: 'product',
          rows: [
            { product_id: 100, product_name: 'Nokia 3310' },
            { product_id: 200, product_name: 'Apple iPhone' },
            { product_id: 300, product_name: 'Samsung Galaxy' },
          ],
        },
      ],
    },
    benchmarkSolution: {
      sql: `SELECT p.product_name, s.year, s.price FROM sales s INNER JOIN product p ON s.product_id = p.product_id;`,
      timeComplexity: 'O(N + M) [Hash Join]',
      spaceComplexity: 'O(M)',
      joinType: 'Hash Join',
    },
    testCases: [],
    xpReward: 60,
    orderIndex: 9,
  },
  {
    id: 'sql-ch-570',
    moduleId: '20000000-0000-0000-0000-000000000003',
    category: 'joins',
    difficultyTag: 'Medium',
    lcNumber: 570,
    title: 'Managers with at Least 5 Direct Reports (LC 570)',
    slug: 'managers-with-5-reports',
    problemStatement:
      'Find managers with at least five direct reports. Join the Employee table with itself or group by managerId with HAVING count(*) >= 5.',
    challengeType: 'sql_lab',
    starterCode: {
      sql: `SELECT m.name\nFROM employee e\nINNER JOIN employee m ON e.managerId = m.id\nGROUP BY m.id, m.name\nHAVING COUNT(*) >= 5;`,
    },
    initialVisualState: {
      type: 'RELATIONAL_TABLES',
      tables: [
        {
          name: 'employee',
          rows: [
            { id: 101, name: 'John', department: 'A', managerId: null },
            { id: 102, name: 'Dan', department: 'A', managerId: 101 },
            { id: 103, name: 'James', department: 'A', managerId: 101 },
            { id: 104, name: 'Amy', department: 'A', managerId: 101 },
            { id: 105, name: 'Anne', department: 'A', managerId: 101 },
            { id: 106, name: 'Ron', department: 'B', managerId: 101 },
          ],
        },
      ],
    },
    benchmarkSolution: {
      sql: `SELECT m.name FROM employee e INNER JOIN employee m ON e.managerId = m.id GROUP BY m.id, m.name HAVING COUNT(*) >= 5;`,
      timeComplexity: 'O(N) [Self Hash Join + Aggregation]',
      spaceComplexity: 'O(N)',
      joinType: 'Hash Join & Hash Aggregate',
    },
    testCases: [],
    xpReward: 75,
    orderIndex: 10,
  },

  // ── 3. AGGREGATIONS & GROUP BY / HAVING ──
  {
    id: 'sql-ch-596',
    moduleId: '20000000-0000-0000-0000-000000000003',
    category: 'aggregates',
    difficultyTag: 'Easy',
    lcNumber: 596,
    title: 'Classes More Than 5 Students (LC 596)',
    slug: 'classes-more-than-5-students',
    problemStatement:
      'Find all the classes that have at least five students. Group by class and filter the aggregated counts using the HAVING clause.',
    challengeType: 'sql_lab',
    starterCode: {
      sql: `SELECT class\nFROM courses\nGROUP BY class\nHAVING COUNT(*) >= 5;`,
    },
    initialVisualState: {
      type: 'RELATIONAL_TABLES',
      tables: [
        {
          name: 'courses',
          rows: [
            { student: 'A', class: 'Math' },
            { student: 'B', class: 'English' },
            { student: 'C', class: 'Math' },
            { student: 'D', class: 'Biology' },
            { student: 'E', class: 'Math' },
            { student: 'F', class: 'Computer' },
            { student: 'G', class: 'Math' },
            { student: 'H', class: 'Math' },
            { student: 'I', class: 'Math' },
          ],
        },
      ],
    },
    benchmarkSolution: {
      sql: `SELECT class FROM courses GROUP BY class HAVING COUNT(*) >= 5;`,
      timeComplexity: 'O(N) [Single-pass Hash Aggregate]',
      spaceComplexity: 'O(K) [Distinct classes]',
      joinType: 'Hash Aggregate',
    },
    testCases: [],
    xpReward: 60,
    orderIndex: 11,
  },
  {
    id: 'sql-ch-1251',
    moduleId: '20000000-0000-0000-0000-000000000003',
    category: 'aggregates',
    difficultyTag: 'Easy',
    lcNumber: 1251,
    title: 'Average Selling Price (LC 1251)',
    slug: 'average-selling-price',
    problemStatement:
      'Find the average selling price for each product. average_price should be rounded to 2 decimal places. Price is calculated as total price / total units.',
    challengeType: 'sql_lab',
    starterCode: {
      sql: `SELECT p.product_id, ROUND(SUM(p.price * u.units) / SUM(u.units), 2) AS average_price\nFROM prices p\nINNER JOIN unitssold u ON p.product_id = u.product_id\nGROUP BY p.product_id;`,
    },
    initialVisualState: {
      type: 'RELATIONAL_TABLES',
      tables: [
        {
          name: 'prices',
          rows: [
            { product_id: 1, start_date: '2019-02-17', end_date: '2019-02-28', price: 5 },
            { product_id: 2, start_date: '2019-02-01', end_date: '2019-02-20', price: 15 },
          ],
        },
        {
          name: 'unitssold',
          rows: [
            { product_id: 1, purchase_date: '2019-02-25', units: 100 },
            { product_id: 2, purchase_date: '2019-02-10', units: 200 },
          ],
        },
      ],
    },
    benchmarkSolution: {
      sql: `SELECT p.product_id, ROUND(SUM(p.price * u.units) / SUM(u.units), 2) AS average_price FROM prices p INNER JOIN unitssold u ON p.product_id = u.product_id GROUP BY p.product_id;`,
      timeComplexity: 'O(N + M)',
      spaceComplexity: 'O(K)',
      joinType: 'Hash Join & Aggregate',
    },
    testCases: [],
    xpReward: 65,
    orderIndex: 12,
  },
  {
    id: 'sql-ch-1075',
    moduleId: '20000000-0000-0000-0000-000000000003',
    category: 'aggregates',
    difficultyTag: 'Easy',
    lcNumber: 1075,
    title: 'Project Employees I (LC 1075)',
    slug: 'project-employees-i',
    problemStatement:
      'Report the average experience years of all the employees for each project, rounded to 2 digits.',
    challengeType: 'sql_lab',
    starterCode: {
      sql: `SELECT p.project_id, ROUND(AVG(e.experience_years), 2) AS average_years\nFROM project p\nINNER JOIN employee e ON p.employee_id = e.employee_id\nGROUP BY p.project_id;`,
    },
    initialVisualState: {
      type: 'RELATIONAL_TABLES',
      tables: [
        {
          name: 'project',
          rows: [
            { project_id: 1, employee_id: 1 },
            { project_id: 1, employee_id: 2 },
            { project_id: 1, employee_id: 3 },
            { project_id: 2, employee_id: 1 },
            { project_id: 2, employee_id: 4 },
          ],
        },
        {
          name: 'employee',
          rows: [
            { employee_id: 1, name: 'Khaled', experience_years: 3 },
            { employee_id: 2, name: 'Ali', experience_years: 2 },
            { employee_id: 3, name: 'John', experience_years: 1 },
            { employee_id: 4, name: 'Doe', experience_years: 2 },
          ],
        },
      ],
    },
    benchmarkSolution: {
      sql: `SELECT p.project_id, ROUND(AVG(e.experience_years), 2) AS average_years FROM project p INNER JOIN employee e ON p.employee_id = e.employee_id GROUP BY p.project_id;`,
      timeComplexity: 'O(N + M)',
      spaceComplexity: 'O(K)',
      joinType: 'Hash Join & Group By',
    },
    testCases: [],
    xpReward: 60,
    orderIndex: 13,
  },
  {
    id: 'sql-ch-620',
    moduleId: '20000000-0000-0000-0000-000000000003',
    category: 'aggregates',
    difficultyTag: 'Easy',
    lcNumber: 620,
    title: 'Not Boring Movies (LC 620)',
    slug: 'not-boring-movies',
    problemStatement:
      'Report the movies with an odd-numbered ID and a description that is not "boring". Return the result table ordered by rating descending.',
    challengeType: 'sql_lab',
    starterCode: {
      sql: `SELECT id, movie, description, rating\nFROM cinema\nWHERE id % 2 = 1 AND description != 'boring'\nORDER BY rating DESC;`,
    },
    initialVisualState: {
      type: 'RELATIONAL_TABLES',
      tables: [
        {
          name: 'cinema',
          rows: [
            { id: 1, movie: 'War', description: 'great 3D', rating: 8.9 },
            { id: 2, movie: 'Science', description: 'fiction', rating: 8.5 },
            { id: 3, movie: 'irish', description: 'boring', rating: 6.2 },
            { id: 4, movie: 'Ice song', description: 'Fantacy', rating: 8.6 },
            { id: 5, movie: 'House card', description: 'Interesting', rating: 9.1 },
          ],
        },
      ],
    },
    benchmarkSolution: {
      sql: `SELECT id, movie, description, rating FROM cinema WHERE id % 2 = 1 AND description != 'boring' ORDER BY rating DESC;`,
      timeComplexity: 'O(N log N) [Filter + Sort]',
      spaceComplexity: 'O(N)',
      joinType: 'Filter Scan',
    },
    testCases: [],
    xpReward: 55,
    orderIndex: 14,
  },

  // ── 4. SUBQUERIES & CTES ──
  {
    id: 'sql-ch-176',
    moduleId: '20000000-0000-0000-0000-000000000004',
    category: 'subqueries',
    difficultyTag: 'Medium',
    lcNumber: 176,
    title: 'Second Highest Salary (LC 176)',
    slug: 'second-highest-salary',
    problemStatement:
      'Find the second highest distinct salary from the Employee table. If there is no second highest salary, return null.',
    challengeType: 'sql_lab',
    starterCode: {
      sql: `SELECT MAX(salary) AS SecondHighestSalary\nFROM employee\nWHERE salary < (SELECT MAX(salary) FROM employee);`,
    },
    initialVisualState: {
      type: 'RELATIONAL_TABLES',
      tables: [
        {
          name: 'employee',
          rows: [
            { id: 1, salary: 100 },
            { id: 2, salary: 200 },
            { id: 3, salary: 300 },
          ],
        },
      ],
    },
    benchmarkSolution: {
      sql: `SELECT MAX(salary) AS SecondHighestSalary FROM employee WHERE salary < (SELECT MAX(salary) FROM employee);`,
      timeComplexity: 'O(N) [Two-pass Max Scan]',
      spaceComplexity: 'O(1)',
      joinType: 'Subquery Scan',
    },
    testCases: [],
    xpReward: 70,
    orderIndex: 15,
  },
  {
    id: 'sql-ch-184',
    moduleId: '20000000-0000-0000-0000-000000000004',
    category: 'subqueries',
    difficultyTag: 'Medium',
    lcNumber: 184,
    title: 'Department Highest Salary (LC 184)',
    slug: 'department-highest-salary',
    problemStatement:
      'Find employees who have the highest salary in each of the departments. Join Employee with Department on departmentId and match against maximum salary.',
    challengeType: 'sql_lab',
    starterCode: {
      sql: `SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary\nFROM employee e\nINNER JOIN department d ON e.departmentId = d.id\nWHERE e.salary >= 80000;`,
    },
    initialVisualState: {
      type: 'RELATIONAL_TABLES',
      tables: [
        {
          name: 'employee',
          rows: [
            { id: 1, name: 'Joe', salary: 85000, departmentId: 1 },
            { id: 2, name: 'Henry', salary: 80000, departmentId: 2 },
            { id: 3, name: 'Sam', salary: 60000, departmentId: 2 },
            { id: 4, name: 'Max', salary: 90000, departmentId: 1 },
          ],
        },
        {
          name: 'department',
          rows: [
            { id: 1, name: 'IT' },
            { id: 2, name: 'Sales' },
          ],
        },
      ],
    },
    benchmarkSolution: {
      sql: `SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary FROM employee e INNER JOIN department d ON e.departmentId = d.id WHERE e.salary >= 80000;`,
      timeComplexity: 'O(N + M)',
      spaceComplexity: 'O(M)',
      joinType: 'Hash Join',
    },
    testCases: [],
    xpReward: 75,
    orderIndex: 16,
  },
  {
    id: 'sql-ch-626',
    moduleId: '20000000-0000-0000-0000-000000000004',
    category: 'subqueries',
    difficultyTag: 'Medium',
    lcNumber: 626,
    title: 'Exchange Seats (LC 626)',
    slug: 'exchange-seats',
    problemStatement:
      'Swap the seat id of every two consecutive students. If the number of students is odd, the id of the last student is not swapped.',
    challengeType: 'sql_lab',
    starterCode: {
      sql: `SELECT \n  CASE \n    WHEN id % 2 = 1 THEN id + 1\n    ELSE id - 1\n  END AS id,\n  student\nFROM seat\nORDER BY id ASC;`,
    },
    initialVisualState: {
      type: 'RELATIONAL_TABLES',
      tables: [
        {
          name: 'seat',
          rows: [
            { id: 1, student: 'Abbot' },
            { id: 2, student: 'Doris' },
            { id: 3, student: 'Emerson' },
            { id: 4, student: 'Green' },
            { id: 5, student: 'Jeames' },
          ],
        },
      ],
    },
    benchmarkSolution: {
      sql: `SELECT CASE WHEN id % 2 = 1 THEN id + 1 ELSE id - 1 END AS id, student FROM seat ORDER BY id ASC;`,
      timeComplexity: 'O(N log N)',
      spaceComplexity: 'O(N)',
      joinType: 'Projection & Sort',
    },
    testCases: [],
    xpReward: 75,
    orderIndex: 17,
  },

  // ── 5. WINDOW FUNCTIONS & RANKING ──
  {
    id: 'sql-ch-178',
    moduleId: '20000000-0000-0000-0000-000000000004',
    category: 'window',
    difficultyTag: 'Medium',
    lcNumber: 178,
    title: 'Rank Scores (LC 178)',
    slug: 'rank-scores',
    problemStatement:
      'Find the rank of the scores. The scores should be ranked from highest to lowest. If there is a tie between two scores, both should have the same ranking with no gaps (DENSE_RANK).',
    challengeType: 'sql_lab',
    starterCode: {
      sql: `SELECT score, DENSE_RANK() OVER (ORDER BY score DESC) AS rank\nFROM scores\nORDER BY score DESC;`,
    },
    initialVisualState: {
      type: 'RELATIONAL_TABLES',
      tables: [
        {
          name: 'scores',
          rows: [
            { id: 1, score: 3.50 },
            { id: 2, score: 3.65 },
            { id: 3, score: 4.00 },
            { id: 4, score: 3.85 },
            { id: 5, score: 4.00 },
            { id: 6, score: 3.65 },
          ],
        },
      ],
    },
    benchmarkSolution: {
      sql: `SELECT score, DENSE_RANK() OVER (ORDER BY score DESC) AS rank FROM scores ORDER BY score DESC;`,
      timeComplexity: 'O(N log N) [Window Sort]',
      spaceComplexity: 'O(N)',
      joinType: 'Window Dense Rank',
    },
    testCases: [],
    xpReward: 80,
    orderIndex: 18,
  },
  {
    id: 'sql-ch-185',
    moduleId: '20000000-0000-0000-0000-000000000004',
    category: 'window',
    difficultyTag: 'Hard',
    lcNumber: 185,
    title: 'Department Top Three Salaries (LC 185)',
    slug: 'department-top-three-salaries',
    problemStatement:
      'A company executives are interested in seeing who earns the most money in each department. A high earner in a department is an employee who has a salary in the top three unique salaries for that department.',
    challengeType: 'sql_lab',
    starterCode: {
      sql: `SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary\nFROM employee e\nINNER JOIN department d ON e.departmentId = d.id\nORDER BY e.salary DESC;`,
    },
    initialVisualState: {
      type: 'RELATIONAL_TABLES',
      tables: [
        {
          name: 'employee',
          rows: [
            { id: 1, name: 'Joe', salary: 85000, departmentId: 1 },
            { id: 2, name: 'Henry', salary: 80000, departmentId: 2 },
            { id: 3, name: 'Sam', salary: 60000, departmentId: 2 },
            { id: 4, name: 'Max', salary: 90000, departmentId: 1 },
            { id: 5, name: 'Janet', salary: 69000, departmentId: 1 },
            { id: 6, name: 'Randy', salary: 85000, departmentId: 1 },
            { id: 7, name: 'Will', salary: 70000, departmentId: 1 },
          ],
        },
        {
          name: 'department',
          rows: [
            { id: 1, name: 'IT' },
            { id: 2, name: 'Sales' },
          ],
        },
      ],
    },
    benchmarkSolution: {
      sql: `SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary FROM employee e INNER JOIN department d ON e.departmentId = d.id ORDER BY e.salary DESC;`,
      timeComplexity: 'O(N log N) [Window Partition]',
      spaceComplexity: 'O(N)',
      joinType: 'Window Dense Rank & Hash Join',
    },
    testCases: [],
    xpReward: 90,
    orderIndex: 19,
  },
  {
    id: 'sql-ch-college-enrollment',
    moduleId: '20000000-0000-0000-0000-000000000003',
    category: 'joins',
    difficultyTag: 'Easy',
    lcNumber: 1,
    title: 'Inner Join: Students & Course Enrollments',
    slug: 'inner-join-students-courses',
    problemStatement:
      'Write a SQL query to retrieve student name, course title, and enrollment date for all students who have enrolled in courses. Observe how unmatched records are pruned.',
    challengeType: 'sql_lab',
    starterCode: {
      sql: `SELECT s.name, c.title, e.enrolled_at\nFROM students s\nINNER JOIN enrollments e ON s.id = e.student_id\nINNER JOIN courses c ON e.course_id = c.id;`,
    },
    initialVisualState: {
      type: 'RELATIONAL_TABLES',
      tables: [
        {
          name: 'students',
          rows: [
            { id: 1, name: 'Aman Sharma', college: 'IET Lucknow' },
            { id: 2, name: 'Priya Verma', college: 'BIET Jhansi' },
            { id: 3, name: 'Rohan Gupta', college: 'KNIT Sultanpur' },
          ],
        },
        {
          name: 'enrollments',
          rows: [
            { id: 101, student_id: 1, course_id: 501, enrolled_at: '2026-09-01' },
            { id: 102, student_id: 2, course_id: 502, enrolled_at: '2026-09-03' },
          ],
        },
        {
          name: 'courses',
          rows: [
            { id: 501, title: 'Distributed Systems' },
            { id: 502, title: 'Data Structures Visualized' },
          ],
        },
      ],
    },
    benchmarkSolution: {
      sql: `SELECT s.name, c.title, e.enrolled_at FROM students s INNER JOIN enrollments e ON s.id = e.student_id INNER JOIN courses c ON e.course_id = c.id;`,
      timeComplexity: 'O(N + M) [Hash Join]',
      spaceComplexity: 'O(N)',
      joinType: 'Hash Join',
    },
    testCases: [
      { input: { query: 'SELECT count(*) FROM students INNER JOIN enrollments ON students.id = enrollments.student_id;' }, expected: 2 },
    ],
    xpReward: 60,
    orderIndex: 20,
  },
  {
    id: 'sql-ch-college-aggregate',
    moduleId: '20000000-0000-0000-0000-000000000003',
    category: 'aggregates',
    difficultyTag: 'Easy',
    lcNumber: 2,
    title: 'Aggregate Analytics: Students per College',
    slug: 'group-by-students-college',
    problemStatement:
      'Write a SQL query to count total students enrolled per college, ordered by student count descending. Inspect how GROUP BY aggregates buckets.',
    challengeType: 'sql_lab',
    starterCode: {
      sql: `SELECT college, COUNT(*) AS student_count\nFROM students\nGROUP BY college\nORDER BY student_count DESC;`,
    },
    initialVisualState: {
      type: 'RELATIONAL_TABLES',
      tables: [
        {
          name: 'students',
          rows: [
            { id: 1, name: 'Aman Sharma', college: 'IET Lucknow' },
            { id: 2, name: 'Priya Verma', college: 'BIET Jhansi' },
            { id: 3, name: 'Rohan Gupta', college: 'KNIT Sultanpur' },
            { id: 4, name: 'Aditi Rao', college: 'IET Lucknow' },
          ],
        },
      ],
    },
    benchmarkSolution: {
      sql: `SELECT college, COUNT(*) AS student_count FROM students GROUP BY college ORDER BY student_count DESC;`,
      timeComplexity: 'O(N) [Hash Aggregate]',
      spaceComplexity: 'O(K)',
      joinType: 'Hash Aggregate',
    },
    testCases: [],
    xpReward: 50,
    orderIndex: 21,
  },
];
