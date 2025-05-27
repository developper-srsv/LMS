"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "../../../../../src/lib/supabase";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Upload } from "lucide-react";
import Image from "next/image";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail_url?: string;
}

export default function EditCourse() {
  const router = useRouter();
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [existingThumbnail, setExistingThumbnail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        console.error("Error fetching course:", error);
        toast.error("Error fetching course details.");
        return;
      }
      setCourse(data);
      setTitle(data.title);
      setDescription(data.description);
      setPrice(data.price);
      setExistingThumbnail(data.thumbnail_url || "");
    };

    if (id) fetchCourse();
  }, [id]);

  const uploadThumbnail = async (file: File) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase.storage
      .from("course-assets")
      .upload(`thumbnails/${user.id}/${file.name}`, file, { upsert: true });

    if (error) {
      console.error("Error uploading thumbnail:", error);
      return null;
    }

    return data.path;
  };

  const handleUpdateCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!course) return;

    setIsLoading(true);
    let thumbnail_url = existingThumbnail;

    if (thumbnail) {
      const uploadedThumbnail = await uploadThumbnail(thumbnail);
      if (uploadedThumbnail) {
        thumbnail_url = uploadedThumbnail;
      }
    }

    const { error } = await supabase
      .from("courses")
      .update({ title, description, price, thumbnail_url })
      .eq("id", course.id);

    setIsLoading(false);

    if (error) {
      console.error("Error updating course:", error);
      toast.error("Error updating course.");
    } else {
      toast.success("Course updated successfully!", {
        autoClose: 1000,
      });
      router.push("/instructor/dashboard");
    }
  };

  if (!course)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Edit Course
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateCourse} className="space-y-6">
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
                onChange={(e) =>
                  setPrice(
                    e.target.value ? Number.parseFloat(e.target.value) : ""
                  )
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Current Thumbnail</Label>
              {existingThumbnail && (
                <div className="mt-2">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/course-assets/${existingThumbnail}`}
                    alt="Course Thumbnail"
                    width={128}
                    height={80}
                    className="object-cover rounded"
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="thumbnail">Update Thumbnail</Label>
              <Input
                id="thumbnail"
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Course...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Update Course
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
