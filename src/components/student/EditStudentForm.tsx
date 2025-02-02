'use client';

import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { updateStudent } from '@/lib/services/studentService';
import type { Student } from '@/types';

interface EditStudentFormProps {
  student: Student;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function EditStudentForm({ student, onClose, onSuccess }: EditStudentFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: student.name,
    email: student.email,
    phone: student.phone,
    level: student.level,
    horse: {
      name: student.horse?.name ?? '',
      breed: student.horse?.breed ?? '',
      age: student.horse?.age?.toString() ?? '',
      level: student.horse?.level ?? '',
      discipline: student.horse?.discipline ?? ''
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateStudent(student.id, {
        ...formData,
        horse: {
          ...formData.horse,
          age: parseInt(formData.horse.age)
        }
      });
      
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Error updating student:', err);
      setError('Failed to update student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('horse.')) {
      const horseField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        horse: {
          ...prev.horse,
          [horseField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Edit Student</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student Information */}
          <div className="space-y-4">
            <h3 className="font-medium">Student Information</h3>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="">Select Level</option>
              <option value="B">B</option>
              <option value="L1">L1</option>
              <option value="L2">L2</option>
              <option value="M1">M1</option>
              <option value="M2">M2</option>
              <option value="Z1">Z1</option>
              <option value="Z2">Z2</option>
            </select>
          </div>

          {/* Horse Information */}
          <div className="space-y-4">
            <h3 className="font-medium">Horse Information</h3>
            <input
              type="text"
              name="horse.name"
              placeholder="Horse Name"
              value={formData.horse.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
            <input
              type="text"
              name="horse.breed"
              placeholder="Breed"
              value={formData.horse.breed}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
            <input
              type="number"
              name="horse.age"
              placeholder="Age"
              value={formData.horse.age}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
            <input
              type="text"
              name="horse.discipline"
              placeholder="Discipline"
              value={formData.horse.discipline}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
            <select
              name="horse.level"
              value={formData.horse.level}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="">Select Horse's Level</option>
              <option value="B">B</option>
              <option value="L1">L1</option>
              <option value="L2">L2</option>
              <option value="M1">M1</option>
              <option value="M2">M2</option>
              <option value="Z1">Z1</option>
              <option value="Z2">Z2</option>
            </select>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 flex items-center gap-2"
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 