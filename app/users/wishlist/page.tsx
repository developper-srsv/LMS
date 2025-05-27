
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../../../src/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Skeleton } from "@/components/ui/skeleton"
import { Heart, BookOpen, DollarSign, Trash2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "react-toastify"

type Course = {
  id: string
  title: string
  description: string
  price: number
  video_url: string | null
}

type WishlistItem = {
  courses: Course[]
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        toast.error(
        "Authentication required,Please log in to view your wishlist."
        )
        router.push("/login")
        return
      }

      const { data, error } = await supabase
        .from("wishlist")
        .select("courses(id, title, description, price, video_url)")
        .eq("user_id", user.id)

      if (error) throw error

      // Extract courses from the nested array structure
      const courses = (data as WishlistItem[])
        .flatMap((item) => item.courses)
        .filter((course): course is Course => course !== null)

      setWishlist(courses)
    } catch (error) {
      console.error("Error fetching wishlist:", error)
      toast.error(
        
        "Failed to fetch wishlist. Please try again."
       
      )
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (courseId: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const { error } = await supabase.from("wishlist").delete().eq("user_id", user.id).eq("course_id", courseId)

      if (error) throw error

      setWishlist((prev) => prev.filter((course) => course.id !== courseId))
      toast.success("Course removed from wishlist.")
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      toast.error(
        "Error,Failed to remove course from wishlist. Please try again.")
    }
  }

  if (loading) {
    return <WishlistSkeleton />
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Heart className="mr-2 text-red-500" /> Your Wishlist
      </h1>
      {wishlist.length === 0 ? (
        <EmptyWishlist />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((course) => (
            <WishlistCard
              key={course.id}
              course={course}
              onRemove={() => removeFromWishlist(course.id)}
              onViewCourse={() => router.push(`/courses/${course.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function WishlistCard({
  course,
  onRemove,
  onViewCourse,
}: { course: Course; onRemove: () => void; onViewCourse: () => void }) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-xl">{course.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 mb-4">{course.description}</p>
        <p className="text-blue-600 font-bold flex items-center">
          <DollarSign className="mr-1 h-4 w-4" />
          {course.price.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={onViewCourse} className="flex-1 mr-2">
          <BookOpen className="mr-2 h-4 w-4" /> View Course
        </Button>
        <Button variant="outline" onClick={onRemove} className="flex-shrink-0">
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

function EmptyWishlist() {
  const router = useRouter()
  
  return (
    <div className="text-center mt-20">
      <Heart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
      <p className="text-xl text-gray-500 mb-4">Your wishlist is empty.</p>
      <Button onClick={() => router.push("/")}>
        <BookOpen className="mr-2 h-4 w-4" /> Explore Courses
      </Button>
    </div>
  )
}

function WishlistSkeleton() {
  return (
    <div className="container mx-auto p-6">
      <Skeleton className="h-10 w-48 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="flex flex-col h-full">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="flex-grow">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-2" />
              <Skeleton className="h-4 w-4/6 mb-4" />
              <Skeleton className="h-6 w-24" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Skeleton className="h-10 w-full mr-2" />
              <Skeleton className="h-10 w-10" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

