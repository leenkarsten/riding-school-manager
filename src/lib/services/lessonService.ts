import supabase from '../supabase';
import type { Lesson } from '@/types';

export async function getLessons(startDate?: Date, endDate?: Date) {
  let query = supabase
    .from('lessons')
    .select(`
      *,
      student:student_id (
        id,
        name,
        level
      )
    `);

  if (startDate && endDate) {
    query = query
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0]);
  }

  const { data, error } = await query.order('date', { ascending: true }).order('time');
  if (error) throw error;
  return data;
}

export async function createLesson(lesson: Omit<Lesson, 'id'>) {
  const { data, error } = await supabase
    .from('lessons')
    .insert([{
      student_id: lesson.student_id,
      date: lesson.date,
      time: lesson.time,
      duration: lesson.duration,
      focus: lesson.focus,
      notes: lesson.notes
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateLesson(id: string, lesson: Partial<Lesson>) {
  const { data, error } = await supabase
    .from('lessons')
    .update({
      ...(lesson.date && { date: lesson.date }),
      ...(lesson.time && { time: lesson.time }),
      ...(lesson.duration && { duration: lesson.duration }),
      ...(lesson.focus && { focus: lesson.focus }),
      ...(lesson.notes && { notes: lesson.notes })
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteLesson(id: string) {
  const { error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', id);

  if (error) throw error;
} 