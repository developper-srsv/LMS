import { supabase } from "../../../src/lib/supabase";

export default async function DashboardPage() {
  const { data, error } = await supabase.rpc("get_dashboard_metrics"); // Call the SQL function.

  if (error) {
    console.error(error);
    return <p>Failed to load metrics.</p>;
  }

  const { total_users, total_instructors, total_courses, total_enrollments, total_revenue } = data || {};

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-xl">{total_users || 0}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Instructors</h2>
          <p className="text-xl">{total_instructors || 0}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Courses</h2>
          <p className="text-xl">{total_courses || 0}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Enrollments</h2>
          <p className="text-xl">{total_enrollments || 0}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Revenue</h2>
          <p className="text-xl">${total_revenue || 0}</p>
        </div>
      </div>
    </div>
  );
}
