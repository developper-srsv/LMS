"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../../src/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MoreVertical, Search, CheckCircle, XCircle, Edit, Trash } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Course = {
  id: string
  title: string
  description: string
  price: number
  instructor_id: string
  status: string
  created_at: string
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    fetchCourses()
  }, [])

  async function fetchCourses() {
    try {
      const { data, error } = await supabase.from("courses").select("*").order("created_at", { ascending: false })

      if (error) throw error

      setCourses(data || [])
      setLoading(false)
    } catch (error) {
      console.error("Error fetching courses:", error)
      setLoading(false)
    }
  }

  async function updateCourseStatus(courseId: string, status: string) {
    try {
      const { error } = await supabase.from("courses").update({ status }).eq("id", courseId)

      if (error) throw error

      fetchCourses()
    } catch (error) {
      console.error("Error updating course status:", error)
    }
  }

  async function updateCourse(courseId: string, updates: Partial<Course>) {
    try {
      const { error } = await supabase.from("courses").update(updates).eq("id", courseId)

      if (error) throw error

      fetchCourses()
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Error updating course:", error)
    }
  }

  async function deleteCourse(courseId: string) {
    try {
      const { error } = await supabase.from("courses").delete().eq("id", courseId)

      if (error) throw error

      fetchCourses()
    } catch (error) {
      console.error("Error deleting course:", error)
    }
  }

  const filteredCourses = courses.filter((course) => course.title.toLowerCase().includes(searchTerm.toLowerCase()))

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Courses</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>${course.price}</TableCell>
                  <TableCell className="capitalize">{course.status}</TableCell>
                  <TableCell>{new Date(course.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedCourse(course)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateCourseStatus(course.id, "approved")}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateCourseStatus(course.id, "rejected")}>
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteCourse(course.id)} className="text-red-600">
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog isOpen={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Course</DialogTitle>
      <DialogDescription>Modify the course details below.</DialogDescription>
    </DialogHeader>
    {selectedCourse && (
      <div className="space-y-4">
        <label className="text-sm font-medium">Title</label>
        <Input
          value={selectedCourse.title}
          onChange={(e) =>
            setSelectedCourse({ ...selectedCourse, title: e.target.value })
          }
        />
      </div>
    )}
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
        Cancel
      </Button>
      <Button
        onClick={() => {
          if (selectedCourse) {
            updateCourse(selectedCourse.id, {
              title: selectedCourse.title,
            });
          }
        }}
      >
        Save changes
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

    </div>
  )
}

