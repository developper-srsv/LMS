// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//       <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={180}
//           height={38}
//           priority
//         />
//         <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
//           <li className="mb-2">
//             Get started by editing{" "}
//             <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
//               app/page.tsx
//             </code>
//             .
//           </li>
//           <li>Save and see your changes instantly.</li>
//         </ol>

//         <div className="flex gap-4 items-center flex-col sm:flex-row">
//           <a
//             className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={20}
//               height={20}
//             />
//             Deploy now
//           </a>
//           <a
//             className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Read our docs
//           </a>
//         </div>
//       </main>
//       <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/file.svg"
//             alt="File icon"
//             width={16}
//             height={16}
//           />
//           Learn
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/window.svg"
//             alt="Window icon"
//             width={16}
//             height={16}
//           />
//           Examples
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/globe.svg"
//             alt="Globe icon"
//             width={16}
//             height={16}
//           />
//           Go to nextjs.org →
//         </a>
//       </footer>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { supabase } from "./../src/lib/supabase";
// import { useRouter } from "next/navigation";

// export default function HomePage() {
//   const [courses, setCourses] = useState<any[]>([]); // Store courses
//   const router = useRouter();

//   useEffect(() => {
//     const fetchCourses = async () => {
//       const { data, error } = await supabase.from("courses").select("*");
//       if (error) {
//         console.error("Error fetching courses:", error);
//       } else {
//         setCourses(data || []);
//       }
//     };

//     fetchCourses();
//   }, []);
// console.log(courses)
//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6">Featured Courses</h1>
//       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {courses.map((course) => (
//           <div
//             key={course.id}
//             className="p-4 bg-white rounded shadow cursor-pointer"
//             onClick={() => router.push(`/courses/${course.id}`)}
//           >
//             <img
//               src={course.thumbnail_url}
//               alt={course.title}
//               className="w-full h-40 object-cover rounded mb-4"
//             />
//             <h2 className="text-xl font-semibold">{course.title}</h2>
//             <p className="text-gray-500 text-sm">{course.instructor}</p>
//             <p className="text-blue-600 font-bold">${course.price}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { supabase } from "../src/lib/supabase";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [courses, setCourses] = useState<any[]>([]); // Store courses
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]); // For applying filters
  const [searchQuery, setSearchQuery] = useState(""); // Search input
  const [category, setCategory] = useState(""); // Selected category
  const [priceRange, setPriceRange] = useState(""); // Selected price range
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase.from("courses").select("*");
      if (error) {
        console.error("Error fetching courses:", error);
      } else {
        setCourses(data || []);
        setFilteredCourses(data || []); // Initialize filtered courses
      }
    };

    fetchCourses();
  }, []);

  // Handle filtering logic
  const applyFilters = () => {
    let filtered = courses;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (category) {
      filtered = filtered.filter((course) => course.category === category);
    }

    // Filter by price range
    if (priceRange) {
      filtered = filtered.filter((course) => {
        const price = parseFloat(course.price);
        if (priceRange === "free") return price === 0;
        if (priceRange === "under50") return price < 50;
        if (priceRange === "50to100") return price >= 50 && price <= 100;
        if (priceRange === "above100") return price > 100;
      });
    }

    setFilteredCourses(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchQuery, category, priceRange]);

  return (
    <div className="container mx-auto p-6 flex">
      {/* Sidebar */}
      <div className="w-1/4 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-bold mb-4">Filters</h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search courses"
          className="w-full p-2 border rounded mb-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Category Filter */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Category</h3>
          <select
            className="w-full p-2 border rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="programming">Programming</option>
            <option value="design">Design</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>

        {/* Price Filter */}
        <div>
          <h3 className="font-semibold mb-2">Price</h3>
          <select
            className="w-full p-2 border rounded"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          >
            <option value="">All Prices</option>
            <option value="free">Free</option>
            <option value="under50">Under $50</option>
            <option value="50to100">$50 - $100</option>
            <option value="above100">Above $100</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-6">
        <h1 className="text-3xl font-bold mb-6">Featured Courses</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="p-4 bg-white rounded shadow cursor-pointer"
              onClick={() => router.push(`/instructor/courses/${course.id}`)}
            >
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="w-full h-40 object-cover rounded mb-4"
              />
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p className="text-gray-500 text-sm">{course.instructor}</p>
              <p className="text-blue-600 font-bold">${course.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
