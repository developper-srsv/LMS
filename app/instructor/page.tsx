


'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase';

// Define TypeScript interfaces
interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  instructor_id: string;
  thumbnail_url?: string;
  video_url?: string;
}

interface NewCourse {
  title: string;
  description: string;
  price: number;
  thumbnail: File | null;
  video: File | null;
}

export default function InstructorCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourse, setNewCourse] = useState<NewCourse>({
    title: '',
    description: '',
    price: 0,
    thumbnail: null,
    video: null,
  });

  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

  // Fetch courses of the instructor
  const fetchCourses = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('instructor_id', user.id);

      if (error) {
        console.error('Error fetching courses:', error);
      } else {
        setCourses(data || []);
      }
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Upload files to Supabase Storage
  const uploadFiles = async (): Promise<{ thumbnail_url?: string; video_url?: string } | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const fileUrls: { thumbnail_url?: string; video_url?: string } = {};

    // Upload thumbnail
    if (newCourse.thumbnail) {
      const { data, error } = await supabase.storage
        .from('course-assets')
        .upload(`thumbnails/${user.id}/${newCourse.thumbnail.name}`, newCourse.thumbnail);

      if (error) {
        console.error('Error uploading thumbnail:', error);
        return null;
      }
      fileUrls.thumbnail_url = data?.path;
    }

    // Upload video
    if (newCourse.video) {
      const { data, error } = await supabase.storage
        .from('course-assets')
        .upload(`videos/${user.id}/${newCourse.video.name}`, newCourse.video);

      if (error) {
        console.error('Error uploading video:', error);
        return null;
      }
      fileUrls.video_url = data?.path;
    }

    return fileUrls;
  };

  // Handle adding a new course
  const handleAddCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const fileUrls = await uploadFiles();
    if (!fileUrls) return;

    const { error } = await supabase.from('courses').insert({
      title: newCourse.title,
      description: newCourse.description,
      price: newCourse.price,
      instructor_id: user.id,
      ...fileUrls,
    });

    if (error) {
      console.error('Error adding course:', error);
      alert('Error adding course.');
    } else {
      alert('Course added successfully!');
      setNewCourse({ title: '', description: '', price: 0, thumbnail: null, video: null });
      fetchCourses();
    }
  };

  // Open Edit Modal
  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setIsEditModalOpen(true);
  };

  // Handle updating a course
  const handleEditCourse = async () => {
    if (!editingCourse) return;

    const { error } = await supabase
      .from('courses')
      .update({
        title: editingCourse.title,
        description: editingCourse.description,
        price: editingCourse.price,
      })
      .eq('id', editingCourse.id);

    if (error) {
      console.error('Error updating course:', error);
      alert('Error updating course.');
    } else {
      alert('Course updated successfully!');
      setIsEditModalOpen(false);
      fetchCourses(); // Refresh the course list
    }
  };

  // Open Delete Confirmation Modal
  const openDeleteModal = (courseId: string) => {
    setCourseToDelete(courseId);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete Course
  const confirmDeleteCourse = async () => {
    if (!courseToDelete) return;

    const { error } = await supabase.from('courses').delete().eq('id', courseToDelete);

    if (error) {
      console.error('Error deleting course:', error);
      alert('Error deleting course.');
    } else {
      alert('Course deleted successfully!');
      setIsDeleteModalOpen(false);
      fetchCourses(); // Refresh the course list
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Courses</h1>

      {/* Add Course Form */}
      <form onSubmit={handleAddCourse} className="mb-6">
        <input
          type="text"
          className="w-full p-2 border rounded mb-2"
          placeholder="Title"
          value={newCourse.title}
          onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
          required
        />
        <textarea
          className="w-full p-2 border rounded mb-2"
          placeholder="Description"
          value={newCourse.description}
          onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
          required
        />
        <input
          type="number"
          className="w-full p-2 border rounded mb-2"
          placeholder="Price"
          value={newCourse.price}
          onChange={(e) => setNewCourse({ ...newCourse, price: parseFloat(e.target.value) })}
          required
        />
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Course Thumbnail</label>
          <input
            type="file"
            className="w-full p-2 border rounded"
            accept="image/*"
            onChange={(e) => setNewCourse({ ...newCourse, thumbnail: e.target.files?.[0] ?? null })}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Course Video</label>
          <input
            type="file"
            className="w-full p-2 border rounded"
            accept="video/*"
            onChange={(e) => setNewCourse({ ...newCourse, video: e.target.files?.[0] ?? null })}
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Add Course</button>
      </form>

      {/* Course List */}
      <h2 className="text-xl font-bold mb-4">Your Courses</h2>
      <ul>
        {courses.map((course) => (
          <li key={course.id} className="mb-4">
            <h3 className="text-lg font-semibold">{course.title}</h3>
            <p>{course.description}</p>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => openEditModal(course)}
            >
              Edit
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded ml-2"
              onClick={() => openDeleteModal(course.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Edit Modal */}
      {isEditModalOpen && editingCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Course</h2>
            <input
              type="text"
              className="w-full p-2 border rounded mb-2"
              placeholder="Title"
              value={editingCourse.title}
              onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
            />
            <textarea
              className="w-full p-2 border rounded mb-2"
              placeholder="Description"
              value={editingCourse.description}
              onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
            />
            <input
              type="number"
              className="w-full p-2 border rounded mb-2"
              placeholder="Price"
              value={editingCourse.price}
              onChange={(e) => setEditingCourse({ ...editingCourse, price: parseFloat(e.target.value) })}
            />
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={handleEditCourse}
            >
              Save Changes
            </button>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded ml-2"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this course?</p>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded"
              onClick={confirmDeleteCourse}
            >
              Delete
            </button>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded ml-2"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
