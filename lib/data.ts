// lib/data.ts

import { createClientSupabaseClient } from './supabase-client'; // Use client for public read access (assuming RLS is public)
import { notFound } from 'next/navigation';

// Type definitions for public tables
// NOTE: These should ideally be generated via Supabase CLI, but for MVP, we define them manually
interface Program {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  category_id: string | null;
  created_at: string;
}

interface NewsItem {
  id: string;
  slug: string;
  title: string;
  content: string;
  category_id: string | null;
  published_at: string;
  thumbnail_url: string | null;
  // Join category name for display purposes
  category_name: string | null; 
}

const supabase = createClientSupabaseClient(); // Public, read-only client

// --- Program Fetching ---

export async function fetchAllProgramSlugs() {
  const { data, error } = await supabase
    .from('programs')
    .select('slug')
    .eq('is_active', true);
    
  if (error) {
    console.error('Error fetching program slugs:', error);
    return [];
  }
  
  // Need to map to match the expected format for generateStaticParams: [{ slug: '...' }]
  return data.map(item => ({ slug: item.slug }));
}

export async function fetchProgramBySlug(slug: string): Promise<Program> {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    notFound();
  }

  return data as Program;
}

// --- News Fetching ---

export async function fetchAllNewsSlugs() {
  const { data, error } = await supabase
    .from('news')
    .select('slug')
    .eq('is_published', true);
    
  if (error) {
    console.error('Error fetching news slugs:', error);
    return [];
  }
  
  return data.map(item => ({ slug: item.slug }));
}

export async function fetchNewsBySlug(slug: string): Promise<NewsItem> {
  // We need to join with categories to get the category name
  const { data, error } = await supabase
    .from('news')
    .select('*, categories(name)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error || !data) {
    notFound();
  }
  
  // Format the data to match the interface
  const newsItem: NewsItem = {
    ...data,
    category_name: (data.categories as { name: string | null })?.name ?? 'Umum',
  };

  return newsItem;
}

// NOTE: Since the project is fresh, all fetching will currently result in notFound()
// until seed data or CMS creation is implemented.
