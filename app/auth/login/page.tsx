// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "../../../src/lib/supabase";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const { data } = await supabase.from("users").select("*");
//       if (error) {
//         console.log(error);
//       } else {
//         console.log(data);
//       }
//     };
//     fetchUsers();
//   }, []);
// // console.log(user)
// // const usr=user.find((us)=>us.email==email)
// // const userRole=usr.role
//   const handleLogin = async () => {
//     setError("");
//     try {
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });

//       if (error) throw error;
//       console.log("login data", data);

//       router.push("/instructor/courses"); // Redirect to dashboard after login
//     } catch (err: any) {
//       setError(err.message || "Invalid email or password!");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <h1 className="text-2xl font-bold mb-6">Login</h1>
//       {error && <p className="text-red-500">{error}</p>}
//       <div className="w-full max-w-sm space-y-4">
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full px-4 py-2 border rounded"
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full px-4 py-2 border rounded"
//         />
//         <button
//           onClick={handleLogin}
//           className="w-full px-4 py-2 bg-blue-500 text-white rounded"
//         >
//           Login
//         </button>
//         <p>
//           Don't have an account?
//           <span
//             onClick={() => router.push("/auth/signup")}
//             style={{ cursor: "pointer" }}
//           >
//             Sign up
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// }






// role based

// "use client";

// import { useState } from "react";
// import { supabase } from "../../../src/lib/supabase"; // Your Supabase client file
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });

//       if (error) {
//         setError("Invalid email or password.");
//         return;
//       }

//       // Fetch the logged-in user's role
//       const user = data.user;
//       const role = user?.app_metadata?.role; // Get role from app_metadata

//       if (!role) {
//         setError("Role not assigned. Please contact support.");
//         return;
//       }

//       // Store role in a cookie for middleware to use
//       document.cookie = `user-role=${role}; Path=/; SameSite=Strict`;

//       // Redirect based on role
//       if (role === "admin") {
//         router.push("/admin");
//       } else if (role === "instructor") {
//         router.push("/instructor");
//       } else if (role === "user") {
//         router.push("/dashboard");
//       } else {
//         setError("Unknown role. Please contact support.");
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       setError("An error occurred. Please try again.");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <form
//         onSubmit={handleLogin}
//         className="p-6 bg-white rounded shadow-md w-80"
//       >
//         <h1 className="text-2xl font-bold mb-4">Login</h1>
//         {error && <p className="text-red-500 mb-4">{error}</p>}
//         <div className="mb-4">
//           <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//             Email
//           </label>
//           <input
//             id="email"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="w-full px-3 py-2 border rounded"
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//             Password
//           </label>
//           <input
//             id="password"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="w-full px-3 py-2 border rounded"
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const Login = () => {
  const supabase = createClientComponentClient();
  const router = useRouter();

  // Form state
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { email, password } = form;

    try {
      // Log in the user
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const user = data.user;
      console.log(user)

      if (user) {
        // Fetch the user's role
        //       const { data } = await supabase.from("users").select("*");
//       if (error) {
//         console.log(error);
//       } else {
//         console.log(data);
//       }
//     };
        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          console.log(profile)
        if (profileError) throw profileError;

        const userRole = profile[0].role;
        console.log("role",userRole)

        // Redirect based on the role
        if (userRole === "admin") {
          router.push("/admin");
        } else if (userRole === "instructor") {
          router.push("/instructor");
        } else {
          throw new Error("Invalid role. Please contact support.");
        }
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
