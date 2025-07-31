/* eslint-disable @typescript-eslint/no-unused-vars */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}


import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Load secret key from environment variables
const SECRET_KEY = "secret-key";

// Define the expected shape of the JWT payload
interface JwtPayload {
  userId: string;
  role: 'admin' | 'user' | string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// Set standard CORS headers
export function setCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set("Access-Control-Allow-Origin", "*"); // ⚠ Consider restricting this in production
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-user-override");
  return response;
}

// Verify JWT token using secret key
export function verifyTokenWithSecret(token: string): { valid: boolean; decoded?: JwtPayload; response?: NextResponse } {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
    return { valid: true, decoded };
  } catch (error) {
    return {
      valid: false,
      response: setCorsHeaders(NextResponse.json({ message: "Invalid token" }, { status: 401 })),
    };
  }
}

// Extract user info from request headers
export function getUserIdFromRequest(request: NextRequest): {
  role?: string | null;
  userId: string | null;
  response?: NextResponse;
} {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return {
      userId: null,
      response: setCorsHeaders(NextResponse.json({ error: "Unauthorized: Token missing" }, { status: 401 })),
    };
  }

  const { valid, decoded, response } = verifyTokenWithSecret(token);
  if (!valid || !decoded) {
    return {
      userId: null,
      response: response ?? setCorsHeaders(NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 })),
    };
  }

  const overrideUserId = request.headers.get("x-user-override");
  let effectiveUserId = decoded.userId;

  if (overrideUserId && decoded.role === "admin") {
    effectiveUserId = overrideUserId;
    console.log(`🔐 Admin override: ${decoded.userId} acting as ${overrideUserId}`);
  }

  return { userId: effectiveUserId, role: decoded.role };
}
