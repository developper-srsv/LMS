
// "use client";

// import { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import { supabase } from "../../../../src/lib/supabase";

// export default function CourseDetailsPage() {


//     interface Course {
//         id: string;
//         title: string;
//         description: string;
//         price: number;
//         video_url: string | null;
//         instructor_id: string;
//       }
      
//       interface Review {
//         id: string;
//         user_id: string;
//         rating: number;
//         comment: string;
//         created_at: string;
//         user_name?: string; // We will populate this later
//       }
      
//       interface User {
//         id: string;
//         name: string;
//       }
      
//   const { id } = useParams();
//   const [course, setCourse] = useState<Course | null>(null);
//   const [videoUrl, setVideoUrl] = useState<string | null>(null);
//   const [instructorName, setInstructorName] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [reviews, setReviews] = useState<Review[]>([]);
//   const [rating, setRating] = useState<number>(0);
//   const [comment, setComment] = useState<string>("");

//   useEffect(() => {
//     const fetchCourseDetails = async () => {
//       const { data, error } = await supabase
//         .from("courses")
//         .select("*")
//         .eq("id", id)
//         .single();

//       if (error) {
//         console.error("Error fetching course details:", error);
//       } else {
//         setCourse(data);

//         // Fetch instructor name
//         const { data: instructorData, error: instructorError } = await supabase
//           .from("users")
//           .select("name")
//           .eq("id", data.instructor_id)
//           .single();

//         if (instructorError) {
//           console.error("Error fetching instructor:", instructorError);
//         } else {
//           setInstructorName(instructorData.name);
//         }

//         // Generate public video URL
//         if (data.video_url) {
//           const { data: videoData } = supabase.storage
//             .from("course-assets")
//             .getPublicUrl(data.video_url);

//           setVideoUrl(videoData.publicUrl);
//         }

//         // Fetch reviews with user names
//         fetchReviews();
//       }
//       setLoading(false);
//     };

//     const fetchReviews = async () => {
//       const { data, error } = await supabase
//         .from("reviews")
//         .select("rating, comment, created_at, user_id, users(name)")
//         .eq("course_id", id)
//         .order("created_at", { ascending: false })
        
//       if (error) {
//         console.error("Error fetching reviews:", error);
//       } else {
//         setReviews(data || []);
//       }
//     };

//     fetchCourseDetails();
//   }, [id]);

//   const addToWishlist = async () => {
//     const {
//       data: { user },
//       error: authError,
//     } = await supabase.auth.getUser();

//     if (authError || !user) {
//       console.error("User not authenticated", authError);
//       return;
//     }

//     const { error } = await supabase.from("wishlist").insert({
//       user_id: user.id,
//       course_id: id,
//     });

//     if (error) {
//       console.error("Error adding to wishlist:", error);
//     } else {
//       console.log("Course added to wishlist!");
//     }
//   };

//   const submitReview = async () => {
//     if (!rating || !comment.trim()) {
//       alert("Please enter a rating and comment.");
//       return;
//     }

//     const {
//       data: { user },
//       error: authError,
//     } = await supabase.auth.getUser();

//     if (authError || !user) {
//       console.error("User not authenticated", authError);
//       return;
//     }

//     const { error } = await supabase.from("reviews").insert({
//       user_id: user.id,
//       course_id: id,
//       rating,
//       comment,
//     });

//     if (error) {
//       console.error("Error submitting review:", error);
//     } else {
//       setComment("");
//       setRating(0);
//       fetchReviews(); // Refresh reviews after submission
//     }
//   };

//   if (loading) {
//     return <div className="text-center mt-20">Loading course details...</div>;
//   }

//   if (!course) {
//     return <div className="text-center mt-20">Course not found.</div>;
//   }

//   return (
//     <div className="container mx-auto p-6">
//       <div className="flex flex-col lg:flex-row gap-6">
//         {videoUrl ? (
//           <video
//             src={videoUrl}
//             controls
//             className="w-full lg:w-2/3 h-80 object-cover rounded"
//           />
//         ) : (
//           <p className="text-gray-500">No video available for this course.</p>
//         )}

//         <div className="flex-1">
//           <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
//           <p className="text-gray-600 mb-4">{course.description}</p>
//           <p className="text-sm text-gray-500 mb-4">
//             Instructor: <span className="font-medium">{instructorName || "N/A"}</span>
//           </p>
//           <p className="text-blue-600 font-bold text-2xl">${course.price}</p>

//           <button
//             onClick={addToWishlist}
//             className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
//           >
//             Add to Wishlist
//           </button>
//         </div>
//       </div>

//       {/* Reviews Section */}
//       <div className="mt-10">
//         <h2 className="text-2xl font-bold mb-4">Reviews</h2>

//         {/* Previous Reviews */}
//         {reviews.length > 0 ? (
//           <ul>
//             {reviews.map((review, index) => (
//               <li key={index} className="mb-4 border p-4 rounded shadow">
//                 <p className="font-medium">
//                   User: {review.users ? review.users.name : "Unknown"}
//                 </p>
//                 <p className="text-yellow-500">Rating: {review.rating}/5</p>
//                 <p>{review.comment}</p>
//                 <p className="text-gray-500 text-sm">{new Date(review.created_at).toLocaleDateString()}</p>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-gray-500">No reviews yet.</p>
//         )}

//         {/* Add Review Form */}
//         <div className="mt-6">
//           <h3 className="text-xl font-bold mb-2">Leave a Review</h3>
//           <label className="block mb-2">Rating (1-5):</label>
//           <input
//             type="number"
//             min="1"
//             max="5"
//             value={rating}
//             onChange={(e) => setRating(Number(e.target.value))}
//             className="border p-2 w-full mb-4 rounded"
//           />
//           <label className="block mb-2">Comment:</label>
//           <textarea
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             className="border p-2 w-full mb-4 rounded"
//             rows={3}
//           />
//           <button
//             onClick={submitReview}
//             className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//           >
//             Submit Review
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../../src/lib/supabase";

// Define Review Type
type Review = {
  id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_name: string; // Fetching from users table
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

  // ✅ Fetch Course Details
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

    // ✅ Fetch Instructor Name
    const { data: instructorData, error: instructorError } = await supabase
      .from("users")
      .select("name")
      .eq("id", data.instructor_id)
      .single();

    if (!instructorError && instructorData) {
      setInstructorName(instructorData.name);
    }

    // ✅ Get Public Video URL (if available)
    if (data.video_url) {
      const { data: videoData } = supabase.storage
        .from("course-assets")
        .getPublicUrl(data.video_url);

      setVideoUrl(videoData.publicUrl);
    }

    setLoading(false);
  };

  // ✅ Fetch Reviews & Include User Names
  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("id, rating, comment, created_at, user_id, users(name)") // Fetch user name
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
      user_name: review.users?.[0]?.name || "Unknown", // ✅ Fix: Access first item in array
    }));
  
    setReviews(formattedReviews);
  };
  

  // ✅ Submit Review
  const submitReview = async () => {
    if (!rating || !comment.trim()) {
      alert("Please enter a rating and comment.");
      return;
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("User not authenticated", authError);
      return;
    }

    const { error } = await supabase.from("reviews").insert({
      user_id: user.id,
      course_id: id,
      rating,
      comment,
    });

    if (error) {
      console.error("Error submitting review:", error);
    } else {
      setComment("");
      setRating(0);
      fetchReviews(); // Refresh reviews after submission
    }
  };

  if (loading) {
    return <div className="text-center mt-20">Loading course details...</div>;
  }

  if (!course) {
    return <div className="text-center mt-20">Course not found.</div>;
  }

  return (
    <div className="container mx-auto p-6">
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

        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <p className="text-gray-600 mb-4">{course.description}</p>
          <p className="text-sm text-gray-500 mb-4">
            Instructor: <span className="font-medium">{instructorName || "N/A"}</span>
          </p>
          <p className="text-blue-600 font-bold text-2xl">${course.price}</p>
        </div>
      </div>

      {/* ✅ Reviews Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>

        {/* ✅ Display Reviews with User Name */}
        {reviews.length > 0 ? (
          <ul>
            {reviews.map((review) => (
              <li key={review.id} className="mb-4 border p-4 rounded shadow">
                <p className="font-medium">User: {review.user_name}</p>
                <p className="text-yellow-500">Rating: {review.rating}/5</p>
                <p>{review.comment}</p>
                <p className="text-gray-500 text-sm">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}

        {/* ✅ Add Review Form */}
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">Leave a Review</h3>
          <label className="block mb-2">Rating (1-5):</label>
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border p-2 w-full mb-4 rounded"
          />
          <label className="block mb-2">Comment:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border p-2 w-full mb-4 rounded"
            rows={3}
          />
          <button
            onClick={submitReview}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}
