// =====================================================================
// CogniFlow AI: Role-Based Access Control (RBAC) Middleware
// Enforces Least Privilege access to administrative and student routes
// =====================================================================

import { AuthenticatedUser } from './authMiddleware';
import { NextResponse } from 'next/server';

export function enforceRole(user: AuthenticatedUser | null, allowedRoles: Array<'student' | 'mentor' | 'admin'>) {
  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Authentication required.' },
      { status: 401 }
    );
  }

  if (!allowedRoles.includes(user.role)) {
    return NextResponse.json(
      {
        success: false,
        error: `Forbidden: User role '${user.role}' does not have permission. Required: [${allowedRoles.join(', ')}]`,
      },
      { status: 403 }
    );
  }

  return null;
}
