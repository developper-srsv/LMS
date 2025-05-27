
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../src/lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Book, Clock, DollarSign, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type Course = {
  id: string;
  title: string;
  description: string;
  price: number;
  video_url: string | null;
};

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Course[]>([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchEnrollments = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
        alert("Please log in to view your enrollments.");
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("enrollments")
        .select("courses(id, title, description, price, video_url)")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching enrollments:", error);
        setLoading(false);
        return;
      }

      setEnrollments(data.map((item) => item.courses).flat());

      setLoading(false);
    };

    fetchEnrollments();
  }, [router]);

  useEffect(() => {
    setFilteredEnrollments(
      enrollments.filter((course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, enrollments]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (loading) return <SkeletonLoader />;

  return (
    <div className="container mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-2">Your Learning Journey</h1>
        <p className="text-gray-600 mb-6">
          You&apos;re enrolled in {enrollments.length} course
          {enrollments.length !== 1 && "s"}
        </p>
      </motion.div>

      <div className="mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search your courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredEnrollments.length === 0 ? (
        <EmptyState searchTerm={searchTerm} router={router} />
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredEnrollments.map((course) => (
            <motion.div
              key={course.id}
              className="p-6 border rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300"
              variants={itemVariants}
            >
              <h2 className="text-2xl font-bold mb-3">{course.title}</h2>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex items-center mb-4">
                <Clock className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-500">
                  8 hours of content
                </span>
              </div>
              <div className="flex items-center mb-4">
                <Book className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-500">12 lessons</span>
              </div>
              <div className="flex items-center mb-6">
                <DollarSign className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-lg font-bold text-green-600">
                  ${course.price.toFixed(2)}
                </span>
              </div>
              <Button
                onClick={() => router.push(`/courses/${course.id}`)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
              >
                Continue Learning
              </Button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className="container mx-auto p-6">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4 bg-white">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({
  searchTerm,
  router,
}: {
  searchTerm: string;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <motion.div
      className="text-center mt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {searchTerm ? (
        <>
          <p className="text-2xl font-bold mb-2">No courses found</p>
          <p className="text-gray-500">
            We couldn&apos;t find any courses matching &quot;{searchTerm}&quot;.
          </p>
        </>
      ) : (
        <>
          <p className="text-2xl font-bold mb-2">No enrolled courses yet</p>
          <p className="text-gray-500">
            Start your learning journey by enrolling in a course!
          </p>
          <Button
            onClick={() => router.push("/courses")}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
          >
            Explore Courses
          </Button>
        </>
      )}
    </motion.div>
  );
}
