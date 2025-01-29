import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold mb-6">Admin Panel</h1>
        <nav className="space-y-4">
          <Link href="/admin/dashboard" className="block text-gray-300 hover:text-white">
            Dashboard
          </Link>
          <Link href="/admin/users" className="block text-gray-300 hover:text-white">
            User Management
          </Link>
          <Link href="/admin/courses" className="block text-gray-300 hover:text-white">
            Course Management
          </Link>
          <Link href="/admin/categories" className="block text-gray-300 hover:text-white">
            Categories
          </Link>
          <Link href="/admin/reviews" className="block text-gray-300 hover:text-white">
            Reviews
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}

