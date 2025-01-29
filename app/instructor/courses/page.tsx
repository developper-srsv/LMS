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
    syllabus: null,
    q_and_a: null,
  });
  const router = useRouter();

  // Fetch courses of the instructor
  useEffect(() => {
    const fetchCourses = async () => {
      const { data: { user } } = await supabase.auth.getUser();

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

  // Handle adding a new course
  const handleAddCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Upload files to Supabase Storage and get the URLs
      const uploadFiles = async () => {
        const fileUrls = {};

        // Upload thumbnail
        if (newCourse.thumbnail) {
          const { data, error } = await supabase.storage
            .from('course-assets')
            .upload(`thumbnails/${user.id}/${newCourse.thumbnail.name}`, newCourse.thumbnail);

          if (error) {
            console.error('Error uploading thumbnail:', error);
            return;
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
            return;
          }
          fileUrls['video_url'] = data?.path;
        }

        // Upload syllabus
        // if (newCourse.syllabus) {
        //   const { data, error } = await supabase.storage
        //     .from('course-assets')
        //     .upload(`syllabus/${user.id}/${newCourse.syllabus.name}`, newCourse.syllabus);

        //   if (error) {
        //     console.error('Error uploading syllabus:', error);
        //     return;
        //   }
        //   fileUrls['syllabus_url'] = data?.path;
        // }

        // Upload Q&A
        // if (newCourse.q_and_a) {
        //   const { data, error } = await supabase.storage
        //     .from('course-assets')
        //     .upload(`q_and_a/${user.id}/${newCourse.q_and_a.name}`, newCourse.q_and_a);

        //   if (error) {
        //     console.error('Error uploading Q&A:', error);
        //     return;
        //   }
        //   fileUrls['q_and_a_url'] = data?.path;
        // }

        return fileUrls;
      };

      const fileUrls = await uploadFiles();
      if (!fileUrls) return;

      const { error } = await supabase.from('courses').insert({
        ...newCourse,
        instructor_id: user.id,
        ...fileUrls, // Add the uploaded file URLs to the course
      });

      if (error) {
        console.error('Error adding course:', error);
      } else {
        alert('Course added successfully!');
        setNewCourse({
          title: '',
          description: '',
          price: 0,
          thumbnail: null,
          video: null,
          syllabus: null,
          q_and_a: null,
        });
        // Reload courses after adding a new course
        fetchCourses();
      }
    }
  };

  // Handle deleting a course
  const handleDeleteCourse = async (courseId: string) => {
    const { error } = await supabase.from('courses').delete().eq('id', courseId);

    if (error) {
      console.error('Error deleting course:', error);
    } else {
      alert('Course deleted successfully!');
      // Reload courses after deleting
      setCourses(courses.filter(course => course.id !== courseId));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Courses</h1>

      <form onSubmit={handleAddCourse} className="mb-6">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={newCourse.title}
            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            className="w-full p-2 border rounded"
            value={newCourse.description}
            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Price</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={newCourse.price}
            onChange={(e) => setNewCourse({ ...newCourse, price: parseFloat(e.target.value) })}
            required
          />
        </div>

        {/* File Upload Inputs */}
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

        {/* <div className="mb-4">
          <label className="block text-gray-700 mb-2">Syllabus</label>
          <input
            type="file"
            className="w-full p-2 border rounded"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setNewCourse({ ...newCourse, syllabus: e.target.files?.[0] })}
          />
        </div> */}

        {/* <div className="mb-4">
          <label className="block text-gray-700 mb-2">Q&A Guide</label>
          <input
            type="file"
            className="w-full p-2 border rounded"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setNewCourse({ ...newCourse, q_and_a: e.target.files?.[0] })}
          />
        </div> */}

        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Add Course
        </button>
      </form>

      <h2 className="text-xl font-bold mb-4">Your Courses</h2>
      <ul>
        {courses.map((course) => (
          <li key={course.id} className="mb-4">
            <h3 className="text-lg font-semibold">{course.title}</h3>
            <p>{course.description}</p>
            <div className="flex gap-2">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => handleDeleteCourse(course.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
