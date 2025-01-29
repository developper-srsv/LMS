"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // For accessing dynamic route params
import { supabase } from "../../../../src/lib/supabase"; // Supabase client

export default function CourseDetailsPage() {
  const { id } = useParams(); // Get the course ID from the dynamic route
  const [course, setCourse] = useState<any>(null); // Store course details
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchCourseDetails = async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single(); // Fetch course by ID

      if (error) {
        console.error("Error fetching course details:", error);
      } else {
        setCourse(data);
      }
      setLoading(false);
    };

    fetchCourseDetails();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-20">Loading course details...</div>;
  }

  if (!course) {
    return <div className="text-center mt-20">Course not found.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      {/* Course Thumbnail */}
      <div className="flex flex-col lg:flex-row gap-6">
        <img
          src={course.thumbnail_url}
          alt={course.title}
          className="w-full lg:w-1/3 h-64 object-cover rounded"
        />

        {/* Course Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <p className="text-gray-600 mb-4">{course.description}</p>
          <p className="text-sm text-gray-500 mb-4">
            Instructor: <span className="font-medium">{course.instructor}</span>
          </p>
          <p className="text-blue-600 font-bold text-2xl">${course.price}</p>
        </div>
      </div>

      {/* Course Syllabus */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Course Syllabus</h2>
        {course.syllabus ? (
          <ul className="list-disc pl-6">
            {course.syllabus.split("\n").map((item:string, index:number) => (
              <li key={index} className="mb-2">
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No syllabus available for this course.</p>
        )}
      </div>

      {/* Course Reviews */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        {course.reviews && course.reviews.length > 0 ? (
          <ul>
            {course.reviews.map((review: any, index: number) => (
              <li key={index} className="mb-4">
                <p className="font-medium">{review.author}</p>
                <p>{review.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
