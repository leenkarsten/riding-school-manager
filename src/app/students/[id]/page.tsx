'use client';

import { useEffect, useState } from 'react';
import { Student } from '@/types';
import { User, Calendar, Trophy, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { getStudentById } from '@/lib/services/studentService';

interface PageProps {
  params: { id: string }
}

export default function Page({ params }: PageProps) {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStudent() {
      try {
        const data = await getStudentById(params.id);
        setStudent(data);
      } catch (e) {
        setError('Failed to load student');
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadStudent();
  }, [params.id]);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error || !student) {
    return <div className="text-red-500 p-4">{error || 'Student not found'}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Link 
          href="/students" 
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold">Student Profile</h1>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Basic info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="w-8 h-8 text-blue-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{student.name}</h2>
                <p className="text-gray-500">Since {new Date(student.startDate).toLocaleDateString('nl-NL')}</p>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-gray-600">{student.email}</p>
              <p className="text-gray-600">{student.phone}</p>
              <p className="font-medium">Level: {student.level}</p>
            </div>
          </div>

          {/* Horse Information */}
          {student.horse && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Horse Information</h3>
              <div className="space-y-2">
                <p className="font-medium">{student.horse.name}</p>
                <p className="text-gray-600">Breed: {student.horse.breed}</p>
                <p className="text-gray-600">Age: {student.horse.age} years</p>
                <p className="text-gray-600">Level: {student.horse.level}</p>
                <p className="text-gray-600">Discipline: {student.horse.discipline}</p>
              </div>
            </div>
          )}
        </div>

        {/* Middle column - Training Goals */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Training Goals</h3>
            <div className="space-y-3">
              {student.trainingGoals?.map((goal) => (
                <div 
                  key={goal}
                  className="p-3 bg-gray-50 rounded-lg"
                >
                  {goal}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column - Competition Results */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Competition Results</h3>
            <div className="space-y-4">
              {student.competitions?.map((competition) => (
                <div 
                  key={competition.id}
                  className="border rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{competition.location}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(competition.date).toLocaleDateString('nl-NL')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-500">{competition.placement}</p>
                      <p className="text-sm">{competition.result}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Level: {competition.level}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}