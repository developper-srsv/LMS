'use client';

import { useState } from 'react';
import { supabase } from '../../../src/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role: user
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignUp = async () => {
    setError('');
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Assign role to user in Supabase
      // const { error: roleError } = await supabase
      //   .from('users')
      //   .update({ role })
      //   .eq('id', data.user?.id);

      // if (roleError) throw roleError;

      alert('Sign up successful! Please check your email for verification.');
      router.push('/auth/login'); // Redirect to login
      const {error:err}=await supabase.from('users').insert({
        email:email,
        name:name,
        role:role
      })
      if(err) {
        console.log("sign up insert error",err)
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
      {error && <p className="text-red-500">{error}</p>} 
      <div className="w-full max-w-sm space-y-4">
      <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        >
          <option value="user">User</option>
          <option value="instructor">Instructor</option>
          <option value="admin">Admin</option>
        </select>
        <button
          onClick={handleSignUp}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
