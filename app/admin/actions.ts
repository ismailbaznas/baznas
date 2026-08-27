'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

// Simple Slugify function for utility
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// --- NEWS CRUD ---

interface NewsFormData {
    title: string;
    content: string;
    isPublished: boolean;
    categoryId?: string; 
}

export async function createOrUpdateNews(formData: NewsFormData, newsId?: string) {
    if (!formData.title || !formData.content) {
        return { success: false, message: 'Judul dan konten berita wajib diisi.' };
    }
    
    const slug = slugify(formData.title);

    const newsData = {
        title: formData.title,
        content: formData.content,
        slug: slug,
        is_published: formData.isPublished,
        category_id: formData.categoryId || null,
    };

    let result;

    if (newsId) {
        result = await supabaseAdmin
            .from('news')
            .update(newsData)
            .eq('id', newsId)
            .select();
    } else {
        result = await supabaseAdmin
            .from('news')
            .insert(newsData)
            .select();
    }

    if (result.error) {
        console.error('Supabase Error:', result.error);
        return { success: false, message: `Gagal menyimpan berita: ${result.error.message}` };
    }
    
    revalidatePath('/kabar');
    revalidatePath(`/kabar/${slug}`);
    revalidatePath('/admin');

    return { success: true, message: 'Berita berhasil disimpan!', data: result.data[0] };
}

export async function deleteNews(newsId: string) {
    const { error } = await supabaseAdmin
        .from('news')
        .delete()
        .eq('id', newsId);

    if (error) {
        return { success: false, message: `Gagal menghapus berita: ${error.message}` };
    }
    
    revalidatePath('/kabar');
    revalidatePath('/admin');
    
    return { success: true, message: 'Berita berhasil dihapus.' };
}


// --- PROGRAM CRUD ---

interface ProgramFormData {
    title: string;
    description: string;
    isActive: boolean;
    imageUrl?: string; 
    categoryId?: string; 
}

export async function createOrUpdateProgram(formData: ProgramFormData, programId?: string) {
    if (!formData.title || !formData.description) {
        return { success: false, message: 'Judul dan deskripsi program wajib diisi.' };
    }
    
    const slug = slugify(formData.title);

    const programData = {
        title: formData.title,
        description: formData.description,
        slug: slug,
        is_active: formData.isActive,
        image_url: formData.imageUrl || null,
        category_id: formData.categoryId || null,
    };

    let result;

    if (programId) {
        result = await supabaseAdmin
            .from('programs')
            .update(programData)
            .eq('id', programId)
            .select();
    } else {
        result = await supabaseAdmin
            .from('programs')
            .insert(programData)
            .select();
    }

    if (result.error) {
        console.error('Supabase Error:', result.error);
        return { success: false, message: `Gagal menyimpan program: ${result.error.message}` };
    }
    
    revalidatePath('/program');
    revalidatePath(`/program/${slug}`);
    revalidatePath('/admin');

    return { success: true, message: 'Program berhasil disimpan!', data: result.data[0] };
}

export async function deleteProgram(programId: string) {
    const { error } = await supabaseAdmin
        .from('programs')
        .delete()
        .eq('id', programId);

    if (error) {
        return { success: false, message: `Gagal menghapus program: ${error.message}` };
    }
    
    revalidatePath('/program');
    revalidatePath('/admin');
    
    return { success: true, message: 'Program berhasil dihapus.' };
}

// --- DOCUMENT CRUD ---

interface DocumentFormData {
    title: string;
    description: string;
    documentUrl: string;
    type: string; // 'laporan_penghimpunan', 'laporan_penyaluran', 'laporan_tahunan', 'dokumen_publik'
    year: number;
    isPublic: boolean;
}

export async function createOrUpdateDocument(formData: DocumentFormData, documentId?: string) {
    if (!formData.title || !formData.documentUrl || !formData.type || !formData.year) {
        return { success: false, message: 'Judul, URL Dokumen, Tipe, dan Tahun wajib diisi.' };
    }
    
    // Type validation against a predefined list (for safety)
    const validTypes = ['laporan_penghimpunan', 'laporan_penyaluran', 'laporan_tahunan', 'dokumen_publik'];
    if (!validTypes.includes(formData.type)) {
        return { success: false, message: 'Tipe dokumen tidak valid.' };
    }

    const documentData = {
        title: formData.title,
        description: formData.description,
        document_url: formData.documentUrl,
        type: formData.type,
        year: formData.year,
        is_public: formData.isPublic,
    };

    let result;

    if (documentId) {
        // UPDATE operation
        result = await supabaseAdmin
            .from('documents')
            .update(documentData)
            .eq('id', documentId)
            .select();
    } else {
        // CREATE operation
        result = await supabaseAdmin
            .from('documents')
            .insert(documentData)
            .select();
    }

    if (result.error) {
        console.error('Supabase Error:', result.error);
        return { success: false, message: `Gagal menyimpan dokumen: ${result.error.message}` };
    }
    
    revalidatePath('/transparansi');
    revalidatePath('/admin');

    return { success: true, message: 'Dokumen berhasil disimpan!', data: result.data[0] };
}

export async function deleteDocument(documentId: string) {
    const { error } = await supabaseAdmin
        .from('documents')
        .delete()
        .eq('id', documentId);

    if (error) {
        return { success: false, message: `Gagal menghapus dokumen: ${error.message}` };
    }
    
    revalidatePath('/transparansi');
    revalidatePath('/admin');
    
    return { success: true, message: 'Dokumen berhasil dihapus.' };
}
