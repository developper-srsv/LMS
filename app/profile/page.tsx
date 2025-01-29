'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase'; // Adjust path as needed
import { useRouter } from 'next/navigation';

export default function MyProfile() {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          router.push('/auth/login');
          return;
        }

        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user details:', error);
          return;
        }

        setUserDetails(data);
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!userDetails) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">My Profile</h1>
        <p>No profile data found. Please contact support.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <p><strong>Name:</strong> {userDetails.name}</p>
        <p><strong>Email:</strong> {userDetails.email}</p>
        <p><strong>Role:</strong> {userDetails.role}</p>
        <p><strong>Joined On:</strong> {new Date(userDetails.created_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
