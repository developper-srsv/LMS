'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link href="/">Udemy Clone</Link>
        </h1>
        <ul className="flex space-x-4">
          <li><Link href="/">Courses</Link></li>
          <li><Link href="/instructor/courses">Instructor Dashboard</Link></li>
          <li><Link href="/auth/login">Login</Link></li>
        </ul>
      </nav>
    </header>
  );
}
