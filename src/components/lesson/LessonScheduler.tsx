'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, ChevronLeft, ChevronRight, Loader2, Calendar as CalendarIcon, LayoutGrid } from 'lucide-react';
import type { Lesson } from '@/types';
import { getLessons, deleteLesson } from '@/lib/services/lessonService';
import AddLessonForm from './AddLessonForm';
import WeeklyView from './WeeklyView';

export default function LessonScheduler() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');

  useEffect(() => {
    loadLessons();
  }, [currentDate]);

  async function loadLessons() {
    try {
      setLoading(true);
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const data = await getLessons(startOfWeek, endOfWeek);
      setLessons(data);
    } catch (e) {
      console.error('Failed to load lessons:', e);
      setError('Failed to load lessons');
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteLesson = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this lesson?')) return;
    
    try {
      await deleteLesson(id);
      loadLessons();
    } catch (e) {
      console.error('Failed to delete lesson:', e);
      setError('Failed to delete lesson');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('nl-NL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const nextDay = () => {
    const next = new Date(currentDate);
    next.setDate(currentDate.getDate() + 1);
    setCurrentDate(next);
  };

  const previousDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(currentDate.getDate() - 1);
    setCurrentDate(prev);
  };

  const currentDayLessons = lessons.filter(lesson => 
    lesson.date === currentDate.toISOString().split('T')[0]
  );

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold">Schedule</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2 mr-4">
              <button
                onClick={() => setViewMode('daily')}
                className={`p-2 rounded-lg ${viewMode === 'daily' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <CalendarIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('weekly')}
                className={`p-2 rounded-lg ${viewMode === 'weekly' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={previousDay}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-medium">
              {formatDate(currentDate)}
            </span>
            <button
              onClick={nextDay}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : viewMode === 'weekly' ? (
          <WeeklyView 
            lessons={lessons} 
            currentDate={currentDate}
            onDeleteLesson={handleDeleteLesson}
          />
        ) : currentDayLessons.length === 0 ? (
          <div className="text-gray-500 text-center p-8">
            No lessons scheduled for this day
          </div>
        ) : (
          <div className="space-y-4">
            {currentDayLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="flex items-center p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3 w-32">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">{lesson.time}</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium">{lesson.student?.name || 'Unknown Student'}</div>
                  <div className="text-sm text-gray-500">{lesson.focus}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-gray-600">
                    {lesson.duration} min
                  </div>
                  <button
                    onClick={() => handleDeleteLesson(lesson.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddForm && (
        <AddLessonForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            loadLessons();
          }}
          selectedDate={currentDate}
        />
      )}
    </div>
  );
}