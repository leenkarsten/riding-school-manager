'use client';

import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';
import { Calendar, Trophy, Clock } from 'lucide-react';
import { Lesson, LessonRequest, CompetitionEntry } from '@/types';
import LessonRequestModal from '@/components/lesson/LessonRequestModal';

export default function StudentDashboard() {
  const [upcomingLessons, setUpcomingLessons] = useState<Lesson[]>([]);
  const [lessonRequests, setLessonRequests] = useState<LessonRequest[]>([]);
  const [competitions, setCompetitions] = useState<CompetitionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLessonRequestModal, setShowLessonRequestModal] = useState(false);
  const [studentId, setStudentId] = useState<string | null>(null);

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Get student ID
      const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!student) return;

      setStudentId(student.id);

      // Get upcoming lessons
      const { data: lessons } = await supabase
        .from('lessons')
        .select('*, student:students(id, name, level)')
        .eq('student_id', student.id)
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true })
        .limit(5);

      // Get pending lesson requests
      const { data: requests } = await supabase
        .from('lesson_requests')
        .select('*')
        .eq('student_id', student.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      // Get upcoming competitions
      const { data: comps } = await supabase
        .from('competition_entries')
        .select('*')
        .eq('student_id', student.id)
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true });

      setUpcomingLessons(lessons || []);
      setLessonRequests(requests || []);
      setCompetitions(comps || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleLessonRequestSuccess = () => {
    // Reload lesson requests after successful submission
    loadDashboardData();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Upcoming Lessons */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold">Upcoming Lessons</h2>
          </div>
          {upcomingLessons.length > 0 ? (
            <div className="space-y-3">
              {upcomingLessons.map((lesson) => (
                <div key={lesson.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium">
                    {new Date(lesson.date).toLocaleDateString('nl-NL')}
                  </div>
                  <div className="text-sm text-gray-600">
                    {lesson.time} ({lesson.duration} min)
                  </div>
                  {lesson.focus && (
                    <div className="text-sm text-gray-500 mt-1">
                      Focus: {lesson.focus}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No upcoming lessons</p>
          )}
        </div>

        {/* Lesson Requests */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold">Pending Requests</h2>
          </div>
          {lessonRequests.length > 0 ? (
            <div className="space-y-3">
              {lessonRequests.map((request) => (
                <div key={request.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium">
                    {new Date(request.preferred_date).toLocaleDateString('nl-NL')}
                  </div>
                  <div className="text-sm text-gray-600">
                    {request.preferred_time}
                  </div>
                  {request.notes && (
                    <div className="text-sm text-gray-500 mt-1">
                      Note: {request.notes}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    Status: {request.status}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No pending requests</p>
          )}
        </div>

        {/* Competitions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold">Upcoming Competitions</h2>
          </div>
          {competitions.length > 0 ? (
            <div className="space-y-3">
              {competitions.map((competition) => (
                <div key={competition.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium">{competition.competition_name}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(competition.date).toLocaleDateString('nl-NL')}
                  </div>
                  <div className="text-sm text-gray-600">
                    {competition.location}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Level: {competition.level}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No upcoming competitions</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={() => setShowLessonRequestModal(true)}
          disabled={!studentId}
        >
          Request Lesson
        </button>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={() => {/* TODO: Open competition registration modal */}}
        >
          Register Competition
        </button>
      </div>

      {/* Lesson Request Modal */}
      {showLessonRequestModal && studentId && (
        <LessonRequestModal
          studentId={studentId}
          onClose={() => setShowLessonRequestModal(false)}
          onSuccess={handleLessonRequestSuccess}
        />
      )}
    </div>
  );
}