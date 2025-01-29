// import { NextResponse } from "next/server";
// import { NextRequest } from "next/server";

// export async function middleware(req: NextRequest) {
//   const token = req.cookies.get("sb-access-token")?.value; // Get the Supabase session token

//   if (!token) {
//     // Redirect to login if user is not authenticated
//     const loginUrl = new URL("/login", req.url);
//     return NextResponse.redirect(loginUrl);
//   }

//   // Map role-based paths
//   const roleBasedPaths: Record<string, string[]> = {
//     "/admin": ["admin"],
//     "/instructor": ["instructor", "admin"],
//     "/dashboard": ["user", "instructor", "admin"],
//   };

//   // Check if the requested route matches the user's allowed roles
//   for (const [path, roles] of Object.entries(roleBasedPaths)) {
//     if (req.nextUrl.pathname.startsWith(path)) {
//       const userRole = req.cookies.get("user-role")?.value; // Fetch the role from cookies

//       if (!roles.includes(userRole || "")) {
//         const forbiddenUrl = new URL("/403", req.url); // Redirect unauthorized users to a 403 page
//         return NextResponse.rewrite(forbiddenUrl);
//       }
//     }
//   }

//   return NextResponse.next(); // Allow access if all checks pass
// }


// import { NextRequest, NextResponse } from "next/server";
// import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

// export async function middleware(req: NextRequest) {
//   const res = NextResponse.next();

//   // Initialize Supabase client
//   const supabase = createMiddlewareClient({ req, res });

//   // Get the user's session
//   const {
//     data: { session },
//   } = await supabase.auth.getSession();

//   // Redirect to login if session is not found
//   if (!session) {
//     console.log("No session found, redirecting to login.");
//     return NextResponse.redirect(new URL("/auth/login", req.url));
//   }

//   // Fetch the user's role from the profiles table
//   const { data: profile, error } = await supabase
//     .from("profiles")
//     .select("role")
//     .eq("id", session.user.id)
//     .single();

//   if (error || !profile) {
//     console.error("Error fetching user profile or role:", error);
//     return NextResponse.redirect(new URL("/auth/login", req.url));
//   }

//   const userRole = profile.role; // 'admin' or 'client'
//   const pathname = req.nextUrl.pathname;

//   // Role-based access control
//   if (pathname.startsWith("/admin") && userRole !== "admin") {
//     console.warn("Unauthorized access to /admin by non-admin user.");
//     return NextResponse.redirect(new URL("/auth/login", req.url));
//   }

//   if (pathname.startsWith("/customer") && userRole !== "client") {
//     console.warn("Unauthorized access to /customer by non-client user.");
//     return NextResponse.redirect(new URL("/auth/login", req.url));
//   }

//   return res; // Allow access if all checks pass
// }

// export const config = {
//   matcher: ["/admin/:path*", "/customer/:path*"], // Match /admin and /customer routes
// };

import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Initialize Supabase client
  const supabase = createMiddlewareClient({ req, res });

  // Get the user's session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect to login if session is not found
  if (!session) {
    console.log("No session found, redirecting to login.");
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Fetch the user's role from the profiles table
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (error || !profile) {
    console.error("Error fetching user profile or role:", error);
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const userRole = profile.role; // e.g., 'admin', 'instructor', 'user'
  const pathname = req.nextUrl.pathname;

  // Define role-based access control
  const roleBasedPaths: Record<string, string[]> = {
    "/admin": ["admin"],
    "/instructor": ["instructor", "admin"],
    "/dashboard": ["user", "instructor", "admin"],
  };

  // Check if the user has access to the requested path
  for (const [path, roles] of Object.entries(roleBasedPaths)) {
    if (pathname.startsWith(path)) {
      if (!roles.includes(userRole)) {
        console.warn(
          `Unauthorized access to ${path} by user with role: ${userRole}`
        );
        return NextResponse.redirect(new URL("/403", req.url)); // Redirect unauthorized users to a 403 page
      }
    }
  }

  return res; // Allow access if all checks pass
}

export const config = {
  matcher: ["/admin/:path*", "/instructor/:path*", "/dashboard/:path*"], // Match these routes
};
