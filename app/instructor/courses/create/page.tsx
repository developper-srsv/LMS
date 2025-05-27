"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../src/lib/supabase";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function CreateCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Optimized file upload function
  const uploadFile = async (file: File, path: string) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return null;
    const userId = userData.user.id;

    // Store file in user-specific folder
    const filePath = `${path}/${userId}/${file.name}`;
    const { data, error } = await supabase.storage.from("course-assets").upload(filePath, file);

    if (error) {
      console.error(`Error uploading ${path}:`, error);
      return null;
    }

    return data.path; // Returns relative path for easy deletion later
  };

  const handleCreateCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      toast.error("User not authenticated!");
      return;
    }
    const userId = userData.user.id;

    try {
      // Upload thumbnail and video in parallel for speed
      const [thumbnailPath, videoPath] = await Promise.all([
        thumbnail ? uploadFile(thumbnail, "thumbnails") : Promise.resolve(null),
        video ? uploadFile(video, "videos") : Promise.resolve(null),
      ]);

      // Insert course into the database
      const { error } = await supabase.from("courses").insert({
        title,
        description,
        price,
        instructor_id: userId,
        thumbnail_url: thumbnailPath ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/course-assets/${thumbnailPath}` : null,
        video_url: videoPath ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/course-assets/${videoPath}` : null,
      });

      if (error) {
        console.error("Error adding course:", error);
        toast.error("Error creating course.");
      } else {
        toast.success("Course created successfully!", { autoClose: 1000 });
        router.push("/instructor/dashboard");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Create a New Course</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateCourse} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter course title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Course Description</Label>
              <Textarea
                id="description"
                placeholder="Enter course description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Course Price</Label>
              <Input
                id="price"
                type="number"
                placeholder="Enter course price"
                value={price}
                onChange={(e) => setPrice(e.target.value ? Number.parseFloat(e.target.value) : "")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="thumbnail">Course Thumbnail</Label>
              <Input
                id="thumbnail"
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="video">Course Video</Label>
              <Input id="video" type="file" accept="video/*" onChange={(e) => setVideo(e.target.files?.[0] ?? null)} />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Course...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Create Course
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


