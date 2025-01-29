import { supabase } from "../../../src/lib/supabase";

export default async function UsersPage() {
  const { data: users, error } = await supabase.from("users").select("*");

  if (error) {
    console.error(error);
    return <p>Failed to load users.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Role</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.role}</td>
              <td className="p-2">
                {/* Add buttons for actions */}
                <button className="px-2 py-1 bg-blue-500 text-white rounded mr-2">
                  Edit
                </button>
                <button className="px-2 py-1 bg-red-500 text-white rounded">
                  Deactivate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
