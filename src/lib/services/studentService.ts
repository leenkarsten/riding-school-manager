import { supabase } from '../supabase';
import type { Student } from '@/types';

export async function getStudents() {
  const { data, error } = await supabase
    .from('students')
    .select(`
      *,
      horses (*)
    `);

  if (error) throw error;
  return data;
}

export async function getStudentById(id: string) {
  const { data, error } = await supabase
    .from('students')
    .select(`
      *,
      horses (*),
      competitions (*),
      training_goals (*)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createStudent(student: Omit<Student, 'id'>) {
  // First, create the student
  const { data: studentData, error: studentError } = await supabase
    .from('students')
    .insert([
      {
        name: student.name,
        email: student.email,
        phone: student.phone,
        start_date: student.startDate,
        level: student.level
      }
    ])
    .select()
    .single();

  if (studentError) throw studentError;

  // Then, create their horse
  const { error: horseError } = await supabase
    .from('horses')
    .insert([
      {
        student_id: studentData.id,
        name: student.horse.name,
        breed: student.horse.breed,
        age: student.horse.age,
        level: student.horse.level,
        discipline: student.horse.discipline
      }
    ]);

  if (horseError) throw horseError;

  return studentData;
}

export async function updateStudent(id: string, student: Partial<Student>) {
  const { data, error } = await supabase
    .from('students')
    .update({
      name: student.name,
      email: student.email,
      phone: student.phone,
      level: student.level
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteStudent(id: string) {
  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', id);

  if (error) throw error;
}