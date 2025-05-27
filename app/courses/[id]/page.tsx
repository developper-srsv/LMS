"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../src/lib/supabase";
import { Button } from "@/components/ui/button"; // ShadCN Button
import { Input } from "@/components/ui/input"; // ShadCN Input
import { Textarea } from "@/components/ui/textarea"; // ShadCN Textarea
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react"; // Loader icon from Lucide React

type Review = {
  id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_name: string;
};

export default function CourseDetailsPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<{
    id: string;
    title: string;
    description: string;
    price: number;
    instructor_id: string;
    video_url: string | null;
  } | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [instructorName, setInstructorName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    fetchCourseDetails();
    fetchReviews();
  }, [id]);

  const fetchCourseDetails = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching course details:", error);
      setLoading(false);
      return;
    }

    setCourse(data);

    const { data: instructorData, error: instructorError } = await supabase
      .from("users")
      .select("name")
      .eq("id", data.instructor_id)
      .single();

    if (!instructorError && instructorData) {
      setInstructorName(instructorData.name);
    }

    if (data.video_url) {
      const { data: videoData } = supabase.storage
        .from("course-assets")
        .getPublicUrl(data.video_url);

      setVideoUrl(videoData.publicUrl);
    }

    setLoading(false);
  };

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("id, rating, comment, created_at, user_id, users(name)")
      .eq("course_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
      return;
    }

    const formattedReviews: Review[] = data.map((review) => ({
      id: review.id,
      user_id: review.user_id,
      rating: review.rating,
      comment: review.comment,
      created_at: review.created_at,
      user_name: review.users?.[0]?.name || "Unknown",
    }));

    setReviews(formattedReviews);
  };

  const addToWishlist = async () => {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("User not authenticated", authError);
      return;
    }

    const { error } = await supabase.from("wishlist").insert({
      user_id: user.id,
      course_id: id,
    });

    if (error) {
      console.error("Error adding to wishlist:", error);
    } else {
      toast.success("Course added to wishlist!",{autoClose:1000});
    }
  };

  // const handleEnrollment= async ()=>{
  //   const {data:{user},error:authError,}= await supabase.auth.getUser()
  //   if(authError || !user){
  //     console.error("User not aunthenticated",authError)
  //     return;
  //   }
  //   const {error}=await supabase.from("enrollments").insert({
  //     user_id=user.id,
  //     course_id=id
  //   })
  //   if(error){
  //     console.log("Error adding to enrollments",error)
  //   }
  //   else{
  //     toast.success("Course Enrollment Successful")
  //   }
  // }
  const handleEnrollment = async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
  
    if (authError || !user) {
      console.error("User not authenticated", authError);
      return;
    }
  
    if (!id) {
      console.error("Course ID is missing");
      return;
    }
  
    const enrollmentData = {
      user_id: user.id, // Ensure user_id is explicitly assigned
      course_id: id, // Ensure 'id' is defined before calling this function
    };
  
    const { error } = await supabase.from("enrollments").insert(enrollmentData);
  
    if (error) {
      console.error("Error adding to enrollments", error);
    } else {
      toast.success("Course Enrollment Successful",{autoClose:1000});
    }
  };
  

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-12 h-12 text-gray-600 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return <div className="text-center mt-20">Course not found.</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50">
      <div className="flex flex-col lg:flex-row gap-6">
        {videoUrl ? (
          <video
            src={videoUrl}
            controls
            className="w-full lg:w-2/3 h-80 object-cover rounded"
          />
        ) : (
          <p className="text-gray-500">No video available for this course.</p>
        )}

        <div className="flex-1 bg-white shadow-lg rounded p-6">
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <p className="text-gray-600 mb-4">{course.description}</p>
          <p className="text-sm text-gray-500 mb-4">
            Instructor:{" "}
            <span className="font-medium">{instructorName || "N/A"}</span>
          </p>
          <div className="flex items-center justify-between mb-4">
            <p className="text-blue-600 font-bold text-2xl">
              ${course.price.toFixed(2)}
            </p>
          </div>
          <div className="flex gap-4">
            <Button onClick={handleEnrollment} className="bg-green-500 w-full">
              Buy Now
            </Button>
            <Button variant="outline" onClick={addToWishlist} className="w-full">
              Add to Wishlist
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-10 w-[50%]">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        {reviews.length > 0 ? (
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li
                key={review.id}
                className="p-4 bg-white shadow rounded-lg border"
              >
                <p className="font-medium text-gray-700">
                  {review.user_name} -{" "}
                  <span className="text-yellow-500">{review.rating}/5</span>
                </p>
                <p className="text-gray-600">{review.comment}</p>
                <p className="text-gray-400 text-sm">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}

        <div className="mt-6 bg-white shadow-lg rounded p-6">
          <h3 className="text-xl font-bold mb-2">Leave a Review</h3>
          <label className="block mb-2">Rating (1-5):</label>
          <Input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="mb-4"
          />
          <label className="block mb-2">Comment:</label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mb-4"
          />
          <Button onClick={() => {}} className="bg-blue-500">
            Submit Review
          </Button>
        </div>
      </div>
    </div>
  );
}

