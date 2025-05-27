'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function CourseMaterials({ courseId }: { courseId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [fileList, setFileList] = useState<string[]>([]);

  const handleFileUpload = async () => {
    if (!file) return;

    const { error } = await supabase.storage
      .from('course-materials')
      .upload(`${courseId}/${file.name}`, file);

    if (error) {
      console.error('Error uploading file:', error.message);
    } else {
      alert('File uploaded successfully!');
      setFileList([...fileList, file.name]);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Upload Course Materials</h2>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded mt-2"
        onClick={handleFileUpload}
      >
        Upload
      </button>
      <h3 className="mt-4 font-bold">Uploaded Files:</h3>
      <ul>
        {fileList.map((fileName, index) => (
          <li key={index}>{fileName}</li>
        ))}
      </ul>
    </div>
  );
}
