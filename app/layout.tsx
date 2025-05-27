"use client"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AdminHeader, InstructorHeader, UserHeader} from "./layout/header/Header";
import Footer from "./layout/footer/Footer";
import { SearchProvider } from "@/components/SearchContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import Header from "./layout/header/CustomHeader";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch user role
    const fetchUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();

        if (!error && data) {
          setRole(data.role);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    };

    fetchUserRole(); // Fetch role on mount

    // Listen for authentication state changes (LOGIN / LOGOUT)
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchUserRole(); // Update role dynamically when user logs in or out
    });

    return () => {
      authListener.subscription.unsubscribe(); // Cleanup listener
    };
  }, []);

  return (
    <SearchProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {loading ? null : role === "admin" ? (
            <AdminHeader />
          ) : role === "instructor" ? (
            <InstructorHeader />
          ) : role === "user" ? (
            <UserHeader />
          ) : (
            <Header />
          )}
          
          {children}
          <ToastContainer />
          <Footer />
        </body>
      </html>
    </SearchProvider>
  );
}
