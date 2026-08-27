// src/app/transparansi/page.tsx

import { createServerSupabase } from "@/lib/supabase";
import { AlertTriangle, FileText } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

type DocumentItem = {
    id: string;
    title: string;
    description: string | null;
    document_url: string;
    type: string;
    year: number | null;
    created_at: string;
};

const DOCUMENT_TYPES_MAP: Record<string, string> = {
    laporan_penghimpunan: "Laporan Penghimpunan",
    laporan_penyaluran: "Laporan Penyaluran",
    laporan_tahunan: "Laporan Tahunan",
    dokumen_publik: "Dokumen Publik Lain",
};

export default async function TransparansiPage() {
    const supabase = createServerSupabase();

    const { data: documents, error } = await supabase
        .from("documents")
        .select(`id, title, description, document_url, type, year, created_at`)
        .eq("is_public", true)
        .order("year", { ascending: false })
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        return (
            <div className="container mx-auto py-12 px-4 space-y-4 text-center">
                <AlertTriangle className="w-12 h-12 text-status-danger mx-auto mb-4" />
                <h1 className="text-headline-lg font-space-grotesk text-status-danger">Gagal Memuat Dokumen</h1>
                <p className="text-body-lg text-on-surface">Terjadi kesalahan saat mengambil data transparansi.</p>
            </div>
        );
    }

    const typedDocuments = (documents || []) as DocumentItem[];

    // Group documents by type and then by year
    const groupedDocuments = typedDocuments.reduce((acc, doc) => {
        const typeLabel = DOCUMENT_TYPES_MAP[doc.type] || "Lain-lain";
        if (!acc[typeLabel]) {
            acc[typeLabel] = {};
        }
        const year = doc.year || 'Lain-lain';
        if (!acc[typeLabel][year]) {
            acc[typeLabel][year] = [];
        }
        acc[typeLabel][year].push(doc);
        return acc;
    }, {} as Record<string, Record<string, DocumentItem[]>>);
    
    const sortedTypes = Object.keys(groupedDocuments).sort();


    return (
        <div className="container mx-auto py-12 px-4 space-y-8">
            <h1 className="text-headline-lg font-space-grotesk text-primary">Transparansi & Akuntabilitas</h1>
            <p className="text-body-lg text-on-surface">Laporan keuangan, penghimpunan, penyaluran, dan dokumen publik lainnya.</p>

            {sortedTypes.length === 0 ? (
                <p className="text-center text-on-surface-variant py-12">Belum ada dokumen publik yang tersedia saat ini.</p>
            ) : (
                <div className="space-y-12">
                    {sortedTypes.map(typeLabel => (
                        <div key={typeLabel} className="space-y-6">
                            <h2 className="text-title-xl font-semibold border-b border-surface-variant pb-2">{typeLabel}</h2>
                            
                            {Object.entries(groupedDocuments[typeLabel]).sort((a, b) => b[0].localeCompare(a[0])).map(([year, docs]) => (
                                <div key={year} className="space-y-4">
                                    <h3 className="text-title-lg font-medium text-secondary">{year}</h3>
                                    <ul className="list-disc pl-5 space-y-3">
                                        {docs.map(doc => (
                                            <li key={doc.id}>
                                                <Link 
                                                    href={doc.document_url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="group flex items-center space-x-3 text-on-surface hover:text-primary transition-colors"
                                                >
                                                    <FileText className="w-5 h-5 flex-shrink-0 text-on-surface-variant group-hover:text-primary" />
                                                    <div className='flex flex-col text-left'>
                                                        <span className='font-medium'>{doc.title}</span>
                                                        {doc.description && <span className='text-sm text-on-surface-variant group-hover:text-on-surface'>{doc.description}</span>}
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
