"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Tags,
  MessageSquare,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Courses",
    href: "/admin/courses",
    icon: BookOpen,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: Tags,
  },
  {
    title: "Reviews",
    href: "/admin/reviews",
    icon: MessageSquare,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      {/* <header className="w-full bg-white shadow py-4 px-6 fixed top-0 left-0 right-0 z-40">
        <h1 className="text-lg font-semibold">Admin Panel</h1>
      </header> */}

      <div className="flex flex-1 pt-1"> {/* Push content below header */}
        {/* Mobile Sidebar */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="lg:hidden fixed left-4 top-4 z-50">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <Sidebar pathname={pathname} />
          </SheetContent>
        </Sheet>

        {/* Desktop Sidebar */}
        <div className="hidden lg:flex w-64 bg-white border-r">
          <Sidebar pathname={pathname} />
        </div>

        {/* Main Content */}
        <div className="flex-1 px-6 py-6">{children}</div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-4 px-6 shadow mt-auto">
        <p className="text-center text-sm text-gray-500">© 2025 LMS Admin</p>
      </footer>
    </div>
  );
}

function Sidebar({ pathname }: { pathname: string }) {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px]">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <BookOpen className="h-6 w-6" />
          <span>LMS Admin</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-auto py-2">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
              pathname === item.href && "bg-gray-100 text-gray-900"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  );
}
