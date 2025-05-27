"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../src/lib/supabase";
import { useRouter } from "next/navigation";




type Course = {
  id: string;
  title: string;
  instructor: string;
  price: number;
  thumbnail_url: string;
  rating?: number;
  reviews?: number;
};

// 🟢 Course Card Component
function CourseCard({
  title,
  instructor,
  price,
  image,
  rating,
  reviews,
  color = "bg-white",
  onClick,
}: {
  title: string;
  instructor: string;
  price: string;
  image: string;
  rating: number;
  reviews: number;
  color?: string;
  onClick?: () => void;
}) {
  return (
    <Card
      className={`group hover:shadow-lg transition-shadow cursor-pointer ${color}`}
      onClick={onClick} // ✅ Make the entire card clickable
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Image
            src={image || "/placeholder.svg"}
            alt={instructor}
            width={50}
            height={50}
            className="rounded-full"
          />
          <div className="space-y-1">
            <h3 className="font-medium line-clamp-2">{title}</h3>
            <p className="text-sm text-muted-foreground">{instructor}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{rating}</span>
            <span className="text-sm text-muted-foreground">({reviews})</span>
          </div>
          <span className="font-bold">${price}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// 🟢 Instructor Card Component
function InstructorCard({ name, image }: { name: string; image: string }) {
  return (
    <div className="text-center space-y-2">
      <div className="relative w-32 h-32 mx-auto">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="rounded-full object-cover"
        />
      </div>
      <h3 className="font-medium">{name}</h3>
    </div>
  );
}

// 🟢 Home Page Component
export default function HomePage() {
const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase.from("courses").select("*");
      if (error) {
        console.error("Error fetching courses:", error);
      } else {
        // ✅ Generate public URLs for course thumbnails
        const updatedCourses = data.map((course) => ({
          ...course,
          thumbnail_url: course.thumbnail_url
            ? supabase.storage.from("course-assets").getPublicUrl(course.thumbnail_url).data.publicUrl
            : "/placeholder.svg",
        }));
        setCourses(updatedCourses);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen">
      {/* 🟢 Hero Section */}
      <section className="relative h-[400px]">
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{
      backgroundImage: "url('/banner.jpg')", // Path to your image in the public folder
    }}
  />
  <div className="relative h-full flex items-center justify-start px-8 max-w-7xl mx-auto">
    <div className="max-w-lg">
      <h1 className="text-4xl font-bold text-white mb-4">Learn something new every day</h1>
      <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
        Browse Courses
      </Button>
    </div>
  </div>
</section>



      <main className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        {/* 🟢 Most Popular Courses */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Most Popular Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses?.map((course) => (
              <CourseCard
                key={course.id}
                onClick={() => router.push(`/courses/${course.id}`)}
                title={course.title}
                instructor={course.instructor || "Unknown Instructor"} // ✅ Dynamic instructor name
                price={course.price ? `${course.price.toFixed(2)}` : "Free"} // ✅ Format price
                image={course.thumbnail_url}
                rating={course.rating || 4.8} // ✅ Use dynamic rating
                reviews={course.reviews || 0} // ✅ Use dynamic reviews count
                // color="bg-red-100"
              />
            ))}
          </div>
        </section>

        {/* 🟢 Trending Courses */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Trending Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CourseCard title="Machine Learning Basics" instructor="David Wilson" price="39.99" image="/ml.jpg" rating={4.8} reviews={920} color="bg-emerald-100" />
            <CourseCard title="Business Analytics" instructor="Lisa Anderson" price="29.99" image="/business.jpg" rating={4.7} reviews={1250} color="bg-yellow-100" />
            <CourseCard title="Python Programming" instructor="James Miller" price="24.99" image="/python.jpg" rating={4.9} reviews={2100} color="bg-blue-100" />
            <CourseCard title="Project Management" instructor="Rachel Smith" price="44.99" image="/project.jpg" rating={4.8} reviews={890} color="bg-gray-100" />
          </div>
        </section>

        {/* 🟢 Popular Instructors */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Popular Instructors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <InstructorCard name="Alexander Burton" image="/man1.jpg" />
            <InstructorCard name="Leslie Constantine" image="/woman1.jpg" />
            <InstructorCard name="Jonathan Doe" image="/man2.jpg" />
            <InstructorCard name="Carol Gonzalez" image="/woman2.jpg" />
          </div>
        </section>

        {/* 🟢 Discount Banner */}
        <section className="relative h-[200px] rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-blue-600" />
          <div className="relative h-full flex items-center justify-between px-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Join and get amazing discount</h2>
              <p className="text-blue-100">Sign up now and save on your next course purchase</p>
            </div>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Sign Up Now
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}



