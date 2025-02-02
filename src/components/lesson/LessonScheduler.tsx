'use client';

import React, { useState } from 'react';
import { Calendar, Clock, User, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Lesson } from '@/types';

// Sample data - will be replaced with actual data from backend
const sampleLessons: Lesson[] = [
  {
    id: '1',
    studentId: '1',
    date: '2025-02-01',
    time: '09:00',
    duration: 60,
    focus: 'Dressage training',
    notes: 'Working on flying changes'
  },
  // Add more sample lessons as needed
];

export default function LessonScheduler() {
  const [currentDate, setCurrentDate] = useState(new Date());

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

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold">Schedule</h2>
          </div>
          <div className="flex items-center gap-4">
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
        <div className="space-y-4">
          {sampleLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-3 w-32">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="font-medium">{lesson.time}</span>
              </div>
              <div className="flex-1">
                <div className="font-medium">Student Name</div>
                <div className="text-sm text-gray-500">{lesson.focus}</div>
              </div>
              <div className="text-right text-gray-600">
                {lesson.duration} min
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}