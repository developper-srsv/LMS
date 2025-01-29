import { supabase } from "../../../src/lib/supabase";

export default async function CoursesPage() {
  const { data: courses, error } = await supabase.from("courses").select("*");

  if (error) {
    console.error(error);
    return <p>Failed to load courses.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Course Management</h1>
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="p-2 text-left">Title</th>
            <th className="p-2 text-left">Instructor</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td className="p-2">{course.title}</td>
              <td className="p-2">{course.instructor_name}</td>
              <td className="p-2">{course.status}</td>
              <td className="p-2">
                <button className="px-2 py-1 bg-green-500 text-white rounded mr-2">
                  Approve
                </button>
                <button className="px-2 py-1 bg-red-500 text-white rounded">
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
