import LessonScheduler from '@/components/lesson/LessonScheduler';
import { Plus } from 'lucide-react';

export default function LessonsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Lessons</h1>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Schedule Lesson
        </button>
      </div>
      <LessonScheduler />
    </div>
  );
}