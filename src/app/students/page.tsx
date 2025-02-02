'use client';

import { useState } from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import StudentList from '@/components/student/StudentList';
import AddStudentForm from '@/components/student/AddStudentForm';
import { Plus } from 'lucide-react';

export default function StudentsPage() {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Students</h1>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Student
        </button>
      </div>
      <StudentList />
      
      {showAddForm && (
        <AddStudentForm 
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            // Force a refresh of the student list
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}