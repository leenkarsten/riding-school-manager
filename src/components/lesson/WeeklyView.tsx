'use client';

import { useState } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { nl } from 'date-fns/locale';
import { Clock } from 'lucide-react';
import type { Lesson } from '@/types';

interface WeeklyViewProps {
  lessons: Lesson[];
  currentDate: Date;
  onDeleteLesson: (id: string) => void;
}

export default function WeeklyView({ lessons, currentDate, onDeleteLesson }: WeeklyViewProps) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="grid grid-cols-7 gap-4 mb-4">
          {weekDays.map((day) => (
            <div 
              key={day.toString()} 
              className="text-center font-medium"
            >
              <div className="text-sm text-gray-500">
                {format(day, 'EEEE', { locale: nl })}
              </div>
              <div>{format(day, 'd MMM')}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day) => {
            const dayLessons = lessons.filter(
              lesson => lesson.date === format(day, 'yyyy-MM-dd')
            );

            return (
              <div 
                key={day.toString()}
                className="min-h-[200px] bg-gray-50 rounded-lg p-3"
              >
                {dayLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="bg-white rounded-lg p-3 mb-2 shadow-sm"
                  >
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Clock className="w-4 h-4" />
                      {lesson.time}
                    </div>
                    <div className="font-medium">
                      {lesson.studentId}
                    </div>
                    <div className="text-sm text-gray-500">
                      {lesson.focus}
                    </div>
                    <button
                      onClick={() => onDeleteLesson(lesson.id)}
                      className="text-xs text-red-500 hover:text-red-700 mt-2"
                    >
                      Cancel Lesson
                    </button>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 