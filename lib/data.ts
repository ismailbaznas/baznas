// lib/data.ts

import { createClientSupabaseClient } from './supabase-client';
import { notFound } from 'next/navigation';

// Type definitions for public tables
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
  category_name: string | null; 
}

const supabase = createClientSupabaseClient();

// --- PROGRAM FETCHING (Detail & Slugs for SSG) ---

export async function fetchAllProgramSlugs() {
  const { data, error } = await supabase
    .from('programs')
    .select('slug')
    .eq('is_active', true);
    
  if (error) {
    console.error('Error fetching program slugs:', error);
    return [];
  }
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

// --- NEWS FETCHING (Detail & Slugs for SSG) ---

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
  const { data, error } = await supabase
    .from('news')
    .select('*, categories(name)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error || !data) {
    notFound();
  }
  
  const newsItem: NewsItem = {
    ...data,
    category_name: (data.categories as { name: string | null })?.name ?? 'Umum',
  };
  return newsItem;
}


// --- PUBLIC LISTING FETCHING (List Pages) ---

export async function fetchNewsList() {
  const { data, error } = await supabase
    .from('news')
    .select('id, title, slug, published_at, thumbnail_url, content, categories(name)')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching news list:', error);
    return [];
  }

  return data.map((item: any) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    date: item.published_at,
    excerpt: item.content.replace(/<[^>]*>?/gm, "").substring(0, 150) + '...',
    thumbnailUrl: item.thumbnail_url,
    category: item.categories?.name ?? 'Umum',
  }));
}

export async function fetchProgramList() {
  const { data, error } = await supabase
    .from('programs')
    .select('id, title, slug, description, image_url, categories(name)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching program list:', error);
    return [];
  }

  return data.map((item: any) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    description: item.description,
    imageUrl: item.image_url,
    category: item.categories?.name ?? 'Umum',
  }));
}
