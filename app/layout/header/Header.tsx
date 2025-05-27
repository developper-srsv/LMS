import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/src/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const AdminHeader = () => {
  const router = useRouter();
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (!error) {
      router.push("/auth/login"); // Redirect to login page after logout
      toast.warn("Log out successfull", { autoClose: 1000 });
    } else {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-slate-900 text-white shadow-md">
      <Link
        href="/"
        className="flex items-center gap-2 text-2xl font-bold text-emerald-600"
      >
        <span className="bg-emerald-500 text-white px-3 py-1 rounded-lg">
          L
        </span>
        <span>LMS</span>
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/admin/courses" className="hover:text-gray-300">
          Courses
        </Link>
        <Link href="/admin/users" className="hover:text-gray-300">
          Users
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-2">
              <User className="w-6 h-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

const InstructorHeader = () => {
  const router = useRouter();
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (!error) {
      router.push("/auth/login"); // Redirect to login page after logout
      toast.warn("Log out successfull", { autoClose: 1000 });
    } else {
      console.error("Logout failed:", error.message);
    }
  };
  return (
    <header className="z-50 sticky top-0 flex items-center justify-between p-4 bg-slate-400 text-black shadow-md">
      <Link
        href="/"
        className="flex items-center gap-2 text-2xl font-bold text-emerald-600"
      >
        <span className="bg-emerald-500 text-white px-3 py-1 rounded-lg">
          L
        </span>
        <span>LMS</span>
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/instructor/dashboard" className="hover:text-gray-300">
          Courses
        </Link>
        <Link href="/instructor/dashboard" className="hover:text-gray-300">
          Dashboard
        </Link>
        <Link href="/instructor/profile" className="hover:text-gray-300">
          Profile
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-2">
              <User className="w-6 h-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link href="/instructor/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

const UserHeader = () => {
  const router = useRouter();
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (!error) {
      router.push("/auth/login"); // Redirect to login page after logout
      toast.warn("Log out successfull", { autoClose: 1000 });
    } else {
      console.error("Logout failed:", error.message);
    }
  };
  return (
    <header className="flex items-center justify-between p-4 bg-slate-400 text-black shadow-md">
      <Link
        href="/"
        className="flex items-center gap-2 text-2xl font-bold text-emerald-600"
      >
        <span className="bg-emerald-500 text-white px-3 py-1 rounded-lg">
          L
        </span>
        <span>LMS</span>
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/users/enrollments" className="hover:text-gray-300">
          Enrollments
        </Link>
        <Link href="/users/profile" className="hover:text-gray-300">
          Profile
        </Link>
        <Link href="/users/wishlist" className="hover:text-gray-300">
          Wishlist
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-2">
              <User className="w-6 h-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link href="/users/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export { AdminHeader, InstructorHeader, UserHeader };
