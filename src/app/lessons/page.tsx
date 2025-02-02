'use client';

import { useState } from 'react';
import LessonScheduler from '@/components/lesson/LessonScheduler';
import AddLessonForm from '@/components/lesson/AddLessonForm';
import { Plus } from 'lucide-react';

export default function LessonsPage() {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Lessons</h1>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Schedule Lesson
        </button>
      </div>
      <LessonScheduler />
      
      {showAddForm && (
        <AddLessonForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
          }}
        />
      )}
    </div>
  );
}