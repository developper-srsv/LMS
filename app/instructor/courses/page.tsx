// 'use client';

// import { useState, useEffect } from 'react';
// import { supabase } from '../../../src/lib/supabase';
// import { useRouter } from 'next/navigation';

// export default function InstructorCourses() {
//   const [courses, setCourses] = useState<any[]>([]);
//   const [newCourse, setNewCourse] = useState({
//     title: '',
//     description: '',
//     thumbnail_url: '',
//     price: 0,
//   });
//   const router = useRouter();
//   // Fetch courses of the instructor
//   useEffect(() => {
//     const fetchCourses = async () => {
//       const { data: { user } } = await supabase.auth.getUser();

//       if (user) {
//         const { data } = await supabase
//           .from('courses')
//           .select('*')
//           .eq('instructor_id', user.id);

//         setCourses(data || []);
//       } else {
//         router.push('/auth/login');
//       }
//     };

//     fetchCourses();
//   }, [router]);

//   // Handle adding a new course
//   const handleAddCourse = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const { data: { user } } = await supabase.auth.getUser();

//     if (user) {
//       const { error } = await supabase.from('courses').insert({
//         ...newCourse,
//         instructor_id: user.id,
//       });

//       if (error) {
//         console.error('Error adding course:', error);
//       } else {
//         alert('Course added successfully!');
//         setNewCourse({ title: '', description: '', thumbnail_url: '', price: 0 });
//         // Reload courses after adding a new course
//         // fetchCourses()
//       }
//     }
//   };

//   // Handle deleting a course
//   const handleDeleteCourse = async (courseId: string) => {
//     const { error } = await supabase.from('courses').delete().eq('id', courseId);

//     if (error) {
//       console.error('Error deleting course:', error);
//     } else {
//       alert('Course deleted successfully!');
//       // Reload courses after deleting
//       setCourses(courses.filter(course => course.id !== courseId));
//     }
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">My Courses</h1>

//       <form onSubmit={handleAddCourse} className="mb-6">
//         <div className="mb-4">
//           <label className="block text-gray-700 mb-2">Title</label>
//           <input
//             type="text"
//             className="w-full p-2 border rounded"
//             value={newCourse.title}
//             onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 mb-2">Description</label>
//           <textarea
//             className="w-full p-2 border rounded"
//             value={newCourse.description}
//             onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 mb-2">Thumbnail URL</label>
//           <input
//             type="text"
//             className="w-full p-2 border rounded"
//             value={newCourse.thumbnail_url}
//             onChange={(e) => setNewCourse({ ...newCourse, thumbnail_url: e.target.value })}
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 mb-2">Price</label>
//           <input
//             type="number"
//             className="w-full p-2 border rounded"
//             value={newCourse.price}
//             onChange={(e) => setNewCourse({ ...newCourse, price: parseFloat(e.target.value) })}
//             required
//           />
//         </div>
//         <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
//           Add Course
//         </button>
//       </form>

//       <h2 className="text-xl font-bold mb-4">Your Courses</h2>
//       <ul>
//         {courses.map((course) => (
//           <li key={course.id} className="mb-4">
//             <h3 className="text-lg font-semibold">{course.title}</h3>
//             <p>{course.description}</p>
//             <div className="flex gap-2">
//               <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => handleDeleteCourse(course.id)}>
//                 Delete
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../src/lib/supabase';
import { useRouter } from 'next/navigation';

export default function InstructorCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    price: 0,
    thumbnail: null,
    video: null,
  });
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const router = useRouter();

  // Fetch courses of the instructor
  useEffect(() => {
    const fetchCourses = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log(user)
      if (user) {
        const { data } = await supabase
          .from('courses')
          .select('*')
          .eq('instructor_id', user.id);

        setCourses(data || []);
      } else {
        router.push('/auth/login');
      }
    };

    fetchCourses();
  }, [router]);
console.log(courses)
  // Upload files to Supabase Storage
  const uploadFiles = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const fileUrls: any = {};

    // Upload thumbnail
    if (newCourse.thumbnail) {
      const { data, error } = await supabase.storage
        .from('course-assets')
        .upload(`thumbnails/${user.id}/${newCourse.thumbnail.name}`, newCourse.thumbnail);

      if (error) {
        console.error('Error uploading thumbnail:', error);
        return null;
      }
      fileUrls['thumbnail_url'] = data?.path;
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
      fileUrls['video_url'] = data?.path;
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
  const openEditModal = (course: any) => {
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
      fetchCourses();
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
      setCourses(courses.filter(course => course.id !== courseToDelete));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Courses</h1>

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
            onChange={(e) => setNewCourse({ ...newCourse, thumbnail: e.target.files?.[0] })}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Course Video</label>
          <input
            type="file"
            className="w-full p-2 border rounded"
            accept="video/*"
            onChange={(e) => setNewCourse({ ...newCourse, video: e.target.files?.[0] })}
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Add Course</button>
      </form>

      <h2 className="text-xl font-bold mb-4">Your Courses</h2>
      <ul>
        {courses.map((course) => (
          <li key={course.id} className="mb-4">
            <h3 className="text-lg font-semibold">{course.title}</h3>
            <p>{course.description}</p>
            <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => openEditModal(course)}>Edit</button>
            <button className="bg-red-500 text-white px-4 py-2 rounded ml-2" onClick={() => openDeleteModal(course.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Edit Course</h2>
            <input type="text" className="w-full p-2 border rounded mb-2" value={editingCourse.title} onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })} />
            <textarea className="w-full p-2 border rounded mb-2" value={editingCourse.description} onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })} />
            <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2" onClick={handleEditCourse}>Save</button>
            <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Are you sure?</h2>
            <button className="bg-red-500 text-white px-4 py-2 rounded mr-2" onClick={confirmDeleteCourse}>Yes, Delete</button>
            <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

