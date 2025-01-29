"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../src/lib/supabase";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchWishlist = async () => {
//       const user = supabase.auth.getUser();

//       if (!user) {
//         setLoading(false);
//         return;
//       }

//       const { data, error } = await supabase
//         .from("wishlist")
//         .select("courses(id, title, thumbnail_url)")
//         .eq("user_id", user.id);

//       if (error) {
//         console.error("Error fetching wishlist:", error);
//       } else {
//         setWishlist(data);
//       }
//       setLoading(false);
//     };

//     fetchWishlist();
//   }, []);
useEffect(() => {
    const fetchWishlist = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
  
      if (authError || !user) {
        console.error("User not authenticated", authError);
        return;
      }
  
      const { data, error } = await supabase
        .from("wishlist")
        .select("courses(id, title, thumbnail_url)")
        .eq("user_id", user.id);
  
      if (error) {
        console.error("Error fetching wishlist:", error);
      } else {
        setWishlist(data);
      }
    };
  
    fetchWishlist();
  }, []);
  

//   if (loading) {
//     return <div className="text-center mt-10">Loading wishlist...</div>;
//   }

  if (wishlist.length === 0) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Your Wishlist</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item) => (
          <div key={item.courses.id} className="border p-4 rounded shadow">
            <img
              src={item.courses.thumbnail_url}
              alt={item.courses.title}
              className="w-full h-40 object-cover rounded"
            />
            <h3 className="text-lg font-medium mt-2">{item.courses.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
