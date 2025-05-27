"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../src/lib/supabase";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);

    // Step 1: Authenticate user
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({ email, password });
    console.log(authData);
    if (authError) {
      setLoading(false);
      toast.error(authError.message, { autoClose: 1500 });
      return;
    }

    const user = authData.user;
    if (!user) {
      setLoading(false);
      toast.error("Failed to retrieve user data", { autoClose: 1500 });
      return;
    }

    // Step 2: Fetch user role from 'profiles' table
    const { data: profileData, error: profileError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    setLoading(false);

    if (profileError || !profileData) {
      toast.error("Failed to fetch user role", { autoClose: 1500 });
      return;
    }

    // Step 3: Redirect user based on role
    const userRole = profileData.role;
    if (userRole === "user") {
      toast.success("Welcome, User!", { autoClose: 1500 });
      router.push("/");
    } else if (userRole === "instructor") {
      toast.success("Welcome, Instructor!", { autoClose: 1500 });
      router.push("/instructor/dashboard");
    } else if (userRole === "admin") {
      toast.success("Welcome, Admin!", { autoClose: 1500 });
      router.push("/admin");
    } else {
      toast.info("Unknown role, redirecting to home", { autoClose: 1500 });
      router.push("/");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
          LMS
        </h1>
        <p className="text-gray-600 mb-4 text-center">
          Welcome back to your learning journey
        </p>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="flex items-center justify-center w-full p-3 text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-70"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login"}
        </button>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <hr className="flex-grow border-gray-300" />
        </div>

        <p className="text-sm text-center text-gray-600">
          Need an Account?{" "}
          <Link
            href="/auth/signup"
            className="text-emerald-500 hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
