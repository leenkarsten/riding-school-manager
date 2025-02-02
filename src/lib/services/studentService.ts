import supabase from '../supabase';
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
      training_goals (
        id,
        description,
        created_at,
        completed
      )
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
  // Update student basic info
  const { data: studentData, error: studentError } = await supabase
    .from('students')
    .update({
      ...(student.name && { name: student.name }),
      ...(student.email && { email: student.email }),
      ...(student.phone && { phone: student.phone }),
      ...(student.level && { level: student.level }),
      ...(student.training_goals && { training_goals: student.training_goals })
    })
    .eq('id', id)
    .select()
    .single();

  if (studentError) throw studentError;

  // Update horse information if provided
  if (student.horse) {
    const { error: horseError } = await supabase
      .from('horses')
      .update({
        name: student.horse.name,
        breed: student.horse.breed,
        age: student.horse.age,
        level: student.horse.level,
        discipline: student.horse.discipline
      })
      .eq('student_id', id);

    if (horseError) throw horseError;
  }

  return studentData;
}

export async function deleteStudent(id: string) {
  // Delete horse first (assuming ON DELETE CASCADE is not set)
  const { error: horseError } = await supabase
    .from('horses')
    .delete()
    .eq('student_id', id);

  if (horseError) throw horseError;

  // Then delete student
  const { error: studentError } = await supabase
    .from('students')
    .delete()
    .eq('id', id);

  if (studentError) throw studentError;
}

export async function addTrainingGoal(studentId: string, description: string) {
  const { data, error } = await supabase
    .from('training_goals')
    .insert([
      {
        student_id: studentId,
        description,
        completed: false
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTrainingGoal(goalId: string, completed: boolean) {
  const { error } = await supabase
    .from('training_goals')
    .update({ completed })
    .eq('id', goalId);

  if (error) throw error;
}

export async function deleteTrainingGoal(goalId: string) {
  const { error } = await supabase
    .from('training_goals')
    .delete()
    .eq('id', goalId);

  if (error) throw error;
}