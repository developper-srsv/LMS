// "use client";

// import { useState, useEffect } from "react";
// import { useParams } from "next/navigation"; // For accessing dynamic route params
// import { supabase } from "../../../../src/lib/supabase"; // Supabase client

// export default function CourseDetailsPage() {
//   const { id } = useParams(); // Get the course ID from the dynamic route
//   const [course, setCourse] = useState<any>(null); // Store course details
//   const [loading, setLoading] = useState(true); // Loading state

//   useEffect(() => {
//     const fetchCourseDetails = async () => {
//       const { data, error } = await supabase
//         .from("courses")
//         .select("*")
//         .eq("id", id)
//         .single(); // Fetch course by ID

//       if (error) {
//         console.error("Error fetching course details:", error);
//       } else {
//         setCourse(data);
//       }
//       setLoading(false);
//     };

//     fetchCourseDetails();
//   }, [id]);

//   if (loading) {
//     return <div className="text-center mt-20">Loading course details...</div>;
//   }

//   if (!course) {
//     return <div className="text-center mt-20">Course not found.</div>;
//   }

//   return (
//     <div className="container mx-auto p-6">
//       {/* Course Thumbnail */}
//       <div className="flex flex-col lg:flex-row gap-6">
//         <img
//           src={course.thumbnail_url}
//           alt={course.title}
//           className="w-full lg:w-1/3 h-64 object-cover rounded"
//         />

//         {/* Course Info */}
//         <div className="flex-1">
//           <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
//           <p className="text-gray-600 mb-4">{course.description}</p>
//           <p className="text-sm text-gray-500 mb-4">
//             Instructor: <span className="font-medium">{course.instructor}</span>
//           </p>
//           <p className="text-blue-600 font-bold text-2xl">${course.price}</p>
//         </div>
//       </div>

//       {/* Course Syllabus */}
//       <div className="mt-10">
//         <h2 className="text-2xl font-bold mb-4">Course Syllabus</h2>
//         {course.syllabus ? (
//           <ul className="list-disc pl-6">
//             {course.syllabus.split("\n").map((item:string, index:number) => (
//               <li key={index} className="mb-2">
//                 {item}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-gray-500">No syllabus available for this course.</p>
//         )}
//       </div>

//       {/* Course Reviews */}
//       <div className="mt-10">
//         <h2 className="text-2xl font-bold mb-4">Reviews</h2>
//         {course.reviews && course.reviews.length > 0 ? (
//           <ul>
//             {course.reviews.map((review: any, index: number) => (
//               <li key={index} className="mb-4">
//                 <p className="font-medium">{review.author}</p>
//                 <p>{review.content}</p>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-gray-500">No reviews yet.</p>
//         )}
//       </div>
//     </div>
//   );
// }



// "use client";

// import { useState, useEffect } from "react";
// import { useParams } from "next/navigation"; // For accessing dynamic route params
// import { supabase } from "../../../../src/lib/supabase"; // Supabase client

// export default function CourseDetailsPage() {
//   const { id } = useParams(); // Get the course ID from the dynamic route
//   const [course, setCourse] = useState<any>(null); // Store course details
//   const [videoUrl, setVideoUrl] = useState<string | null>(null); // Store video URL
//   const [loading, setLoading] = useState(true); // Loading state

//   useEffect(() => {
//     const fetchCourseDetails = async () => {
//       const { data, error } = await supabase
//         .from("courses")
//         .select("*")
//         .eq("id", id)
//         .single(); // Fetch course by ID

//       if (error) {
//         console.error("Error fetching course details:", error);
//       } else {
//         setCourse(data);

//         // Generate public video URL from Supabase Storage
//         if (data.video_url) {
//           const { data: videoData } = supabase.storage
//             .from("course-assets")
//             .getPublicUrl(data.video_url);

//           setVideoUrl(videoData.publicUrl);
//         }
//       }
//       setLoading(false);
//     };

//     fetchCourseDetails();
//   }, [id]);

//   if (loading) {
//     return <div className="text-center mt-20">Loading course details...</div>;
//   }

//   if (!course) {
//     return <div className="text-center mt-20">Course not found.</div>;
//   }

//   return (
//     <div className="container mx-auto p-6">
//       {/* Course Video Player */}
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

//         {/* Course Info */}
//         <div className="flex-1">
//           <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
//           <p className="text-gray-600 mb-4">{course.description}</p>
//           <p className="text-sm text-gray-500 mb-4">
//             Instructor: <span className="font-medium">{course.instructor}</span>
//           </p>
//           <p className="text-blue-600 font-bold text-2xl">${course.price}</p>
//         </div>
//       </div>

//       {/* Course Syllabus */}
//       <div className="mt-10">
//         <h2 className="text-2xl font-bold mb-4">Course Syllabus</h2>
//         {course.syllabus ? (
//           <ul className="list-disc pl-6">
//             {course.syllabus.split("\n").map((item: string, index: number) => (
//               <li key={index} className="mb-2">
//                 {item}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-gray-500">No syllabus available for this course.</p>
//         )}
//       </div>

//       {/* Course Reviews */}
//       <div className="mt-10">
//         <h2 className="text-2xl font-bold mb-4">Reviews</h2>
//         {course.reviews && course.reviews.length > 0 ? (
//           <ul>
//             {course.reviews.map((review: any, index: number) => (
//               <li key={index} className="mb-4">
//                 <p className="font-medium">{review.author}</p>
//                 <p>{review.content}</p>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-gray-500">No reviews yet.</p>
//         )}
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import { supabase } from "../../../../src/lib/supabase";

// export default function CourseDetailsPage() {
//   const { id } = useParams();
//   const [course, setCourse] = useState<any>(null);
//   const [videoUrl, setVideoUrl] = useState<string | null>(null);
//   const [instructorName, setInstructorName] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCourseDetails = async () => {
//       const { data, error } = await supabase
//         .from("courses")
//         .select("*")
//         .eq("id", id)
//         .single();
//         if (error) {
//             console.error("Error fetching course details:", error);
//         } else {
//             setCourse(data);
//             console.log(course)

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
//       }
//       setLoading(false);
//     };

//     fetchCourseDetails();
//   }, [id]);

// //   const addToWishlist = async () => {
// //     const user = supabase.auth.getUser();

// //     if (!user) {
// //       alert("Please log in to add to wishlist.");
// //       return;
// //     }

// //     const { error } = await supabase.from("wishlist").insert([
// //       {
// //         user_id: user.id,
// //         course_id: id,
// //       },
// //     ]);

// //     if (error) {
// //       console.error("Error adding to wishlist:", error);
// //     } else {
// //       alert("Added to wishlist!");
// //     }
// //   };
// const addToWishlist = async (courseId: string) => {
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
//       course_id: courseId,
//     });
  
//     if (error) {
//       console.error("Error adding to wishlist:", error);
//     } else {
//       console.log("Course added to wishlist!");
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
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../../src/lib/supabase";

export default function CourseDetailsPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [instructorName, setInstructorName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    const fetchCourseDetails = async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching course details:", error);
      } else {
        setCourse(data);

        // Fetch instructor name
        const { data: instructorData, error: instructorError } = await supabase
          .from("users")
          .select("name")
          .eq("id", data.instructor_id)
          .single();

        if (instructorError) {
          console.error("Error fetching instructor:", instructorError);
        } else {
          setInstructorName(instructorData.name);
        }

        // Generate public video URL
        if (data.video_url) {
          const { data: videoData } = supabase.storage
            .from("course-assets")
            .getPublicUrl(data.video_url);

          setVideoUrl(videoData.publicUrl);
        }

        // Fetch reviews with user names
        fetchReviews();
      }
      setLoading(false);
    };

    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("rating, comment, created_at, user_id, users(name)")
        .eq("course_id", id)
        .order("created_at", { ascending: false })
        
      if (error) {
        console.error("Error fetching reviews:", error);
      } else {
        setReviews(data || []);
      }
    };

    fetchCourseDetails();
  }, [id]);

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
      console.log("Course added to wishlist!");
    }
  };

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

          <button
            onClick={addToWishlist}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add to Wishlist
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>

        {/* Previous Reviews */}
        {reviews.length > 0 ? (
          <ul>
            {reviews.map((review, index) => (
              <li key={index} className="mb-4 border p-4 rounded shadow">
                <p className="font-medium">
                  User: {review.users ? review.users.name : "Unknown"}
                </p>
                <p className="text-yellow-500">Rating: {review.rating}/5</p>
                <p>{review.comment}</p>
                <p className="text-gray-500 text-sm">{new Date(review.created_at).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}

        {/* Add Review Form */}
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
