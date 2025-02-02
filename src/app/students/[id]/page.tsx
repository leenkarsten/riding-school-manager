'use client';

import { useEffect, useState } from 'react';
import { Student, TrainingGoal } from '@/types';
import { User, Calendar, Trophy, ChevronLeft, Edit2, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getStudentById, deleteStudent, updateStudent, addTrainingGoal, updateTrainingGoal, deleteTrainingGoal } from '@/lib/services/studentService';
import EditStudentForm from '@/components/student/EditStudentForm';

interface PageProps {
  params: { id: string }
}

export default function Page({ params }: PageProps) {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddGoalForm, setShowAddGoalForm] = useState(false);
  const [newGoal, setNewGoal] = useState('');

  useEffect(() => {
    loadStudent();
  }, [params.id]);

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

  const handleDelete = async () => {
    try {
      await deleteStudent(params.id);
      router.push('/students');
    } catch (e) {
      console.error('Failed to delete student:', e);
      setError('Failed to delete student');
    }
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    try {
      await addTrainingGoal(student.id, newGoal);
      setNewGoal('');
      setShowAddGoalForm(false);
      loadStudent();
    } catch (e) {
      console.error('Failed to add goal:', e);
      setError('Failed to add training goal');
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error || !student) {
    return <div className="text-red-500 p-4">{error || 'Student not found'}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/students" 
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-bold">Student Profile</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowEditForm(true)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
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
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Training Goals</h3>
              <button
                onClick={() => setShowAddGoalForm(true)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {student.training_goals?.map((goal) => (
                <div 
                  key={goal.id}
                  className="p-3 bg-gray-50 rounded-lg flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={goal.completed}
                      onChange={async (e) => {
                        try {
                          await updateTrainingGoal(goal.id, e.target.checked);
                          loadStudent();
                        } catch (err) {
                          console.error('Failed to update goal:', err);
                        }
                      }}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span className={goal.completed ? 'line-through text-gray-500' : ''}>
                      {goal.description}
                    </span>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        await deleteTrainingGoal(goal.id);
                        loadStudent();
                      } catch (err) {
                        console.error('Failed to delete goal:', err);
                      }
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
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

      {/* Edit Form Modal */}
      {showEditForm && (
        <EditStudentForm
          student={student}
          onClose={() => setShowEditForm(false)}
          onSuccess={() => {
            setShowEditForm(false);
            loadStudent();
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Delete Student</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this student? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddGoalForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Add Training Goal</h3>
            <form onSubmit={handleAddGoal}>
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                className="w-full p-2 border rounded-lg mb-4"
                placeholder="Enter training goal"
                required
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddGoalForm(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}