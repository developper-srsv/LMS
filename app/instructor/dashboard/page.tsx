"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../src/lib/supabase";
import { PlusCircle, Pencil, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  instructor_id: string;
  thumbnail_url?: string;
  video_url?: string; // Ensure video URL is included in the schema
}

export default function InstructorDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const fetchCourses = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase.from("courses").select("*").eq("instructor_id", user.id);
      if (error) console.error("Error fetching courses:", error);
      else setCourses(data || []);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openDeleteModal = (courseId: string) => {
    setCourseToDelete(courseId);
    setIsDeleteModalOpen(true);
  };

  const deleteCourseAssets = async (course: Course) => {
    try {
      const assetPaths: string[] = [];
  
      if (course.thumbnail_url) {
        const match = course.thumbnail_url.match(/course-assets\/thumbnails\/.+/);
        if (match) assetPaths.push(match[0]);
      }
  
      if (course.video_url) {
        const match = course.video_url.match(/course-assets\/videos\/.+/);
        if (match) assetPaths.push(match[0]);
      }
  
      if (assetPaths.length > 0) {
        console.log("Deleting files:", assetPaths); // Debugging log
        const { error } = await supabase.storage.from("course-assets").remove(assetPaths);
        if (error) console.error("Error deleting course assets:", error);
      }
    } catch (err) {
      console.error("Error processing asset deletion:", err);
    }
  };
  


  const confirmDeleteCourse = async () => {
    if (!courseToDelete) return;

    const { data: course, error: fetchError } = await supabase
      .from("courses")
      .select("*")
      .eq("id", courseToDelete)
      .single();

    if (fetchError) {
      console.error("Error fetching course details:", fetchError);
      return;
    }

    await deleteCourseAssets(course);

    const { error: deleteError } = await supabase.from("courses").delete().eq("id", courseToDelete);

    if (deleteError) {
      console.error("Error deleting course:", deleteError);
      alert("Error deleting course.");
    } else {
      setIsDeleteModalOpen(false);
      fetchCourses();
    }
  };

  const filteredCourses = courses.filter((course) => course.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
        <Button onClick={() => router.push("/instructor/courses/create")} className="bg-blue-500 hover:bg-blue-600">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Course
        </Button>
      </div>

      <div className="relative">
        <Input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-[32%]"
        />
        <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-gray-600">{`${course.description.slice(0, 300)}.....`}</p>
              <p className="mt-2 font-semibold">${course.price.toFixed(2)}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push(`/instructor/courses/edit/${course.id}`)}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button variant="destructive" onClick={() => openDeleteModal(course.id)}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {isDeleteModalOpen && (
        <Dialog isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogDescription>
        Are you sure you want to delete this course? This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
        Cancel
      </Button>
      <Button variant="destructive" onClick={confirmDeleteCourse}>
        Delete
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

      )}
    </div>
  );
}
