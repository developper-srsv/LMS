'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../src/lib/supabase';
import { useRouter } from 'next/navigation';

export default function ProfileManagement() {
  const [profile, setProfile] = useState({
    bio: '',
    qualifications: '',
    photo_url: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch the instructor's profile
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single();

        if (data) {
          setProfile({
            bio: data.bio || '',
            qualifications: data.qualifications || '',
            photo_url: data.photo_url || '',
          });
        } else {
          console.error('Error fetching profile:', error);
        }
      } else {
        router.push('/auth/login');
      }
    };

    fetchProfile();
  }, [router]);

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase.from('users').update({
        bio: profile.bio,
        qualifications: profile.qualifications,
        photo_url: profile.photo_url,
      }).eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
      } else {
        alert('Profile updated successfully!');
      }
    }

    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Profile</h1>

      <form onSubmit={handleProfileUpdate} className="mb-6">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Bio</label>
          <textarea
            className="w-full p-2 border rounded"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Qualifications</label>
          <textarea
            className="w-full p-2 border rounded"
            value={profile.qualifications}
            onChange={(e) => setProfile({ ...profile, qualifications: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Photo URL</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={profile.photo_url}
            onChange={(e) => setProfile({ ...profile, photo_url: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}
