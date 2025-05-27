import Link from "next/link";

const Header = () => {
  return (
    <header className="  z-50 flex items-center justify-between px-6 py-4 bg-slate-300 shadow-md">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-emerald-600">
        <span className="bg-emerald-500 text-white px-3 py-1 rounded-lg">L</span>
        <span>LMS</span>
      </Link>

      {/* Authentication Buttons */}
      <div className="flex gap-4">
        <Link
          href="/auth/login"
          className="px-4 py-2 text-emerald-600 border border-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition"
        >
          Login
        </Link>
        <Link
          href="/auth/signup"
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-transparent border border-emerald-500 transition"
        >
          Sign Up
        </Link>
      </div>
    </header>
  );
};

export default Header;