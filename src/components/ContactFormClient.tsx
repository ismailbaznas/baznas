// src/components/ContactFormClient.tsx

"use client";

import { useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Mail, MessageSquare, Send, User, Phone, CheckCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const MESSAGE_TYPES = [
    { value: "umum", label: "Pesan Umum" },
    { value: "konsultasi", label: "Konsultasi Zakat" },
    { value: "pengaduan", label: "Pengaduan" },
];

export default function ContactFormClient() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        type: MESSAGE_TYPES[0].value,
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Terjadi kesalahan saat mengirim pesan.");
            }

            setResult({ type: 'success', message: data.message || "Pesan Anda berhasil terkirim dan akan segera kami proses." });
            setForm({ name: "", email: "", phone: "", subject: "", message: "", type: MESSAGE_TYPES[0].value });
        } catch (err: any) {
            setResult({ type: 'error', message: err.message });
        }
        
        setLoading(false);
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-surface rounded-xl shadow-lg border border-surface-variant">
            <h2 className="text-headline-md font-space-grotesk text-primary mb-6 text-center">
                Hubungi Kami
            </h2>

            {result && (
                <div className={cn("p-4 rounded-lg mb-4 flex items-center space-x-3", 
                    result.type === 'success' ? "bg-status-success/10 border-status-success text-status-success" : "bg-status-danger/10 border-status-danger text-status-danger"
                )}>
                    {result.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    <p className="font-medium">{result.message}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-body-md font-medium mb-1">Nama Lengkap *</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                            <Input id="name" name="name" value={form.name} onChange={handleChange} required className="pl-10" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-body-md font-medium mb-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                            <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} className="pl-10" />
                        </div>
                    </div>
                </div>

                {/* Phone and Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="phone" className="block text-body-md font-medium mb-1">Nomor Telepon</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                            <Input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} className="pl-10" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="type" className="block text-body-md font-medium mb-1">Jenis Pesan *</label>
                        <select
                            id="type"
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            required
                            className="flex h-10 w-full rounded-lg border border-surface-variant bg-background px-3 py-2 text-body-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
                        >
                            {MESSAGE_TYPES.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Subject */}
                <div>
                    <label htmlFor="subject" className="block text-body-md font-medium mb-1">Subjek *</label>
                    <div className="relative">
                        <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                        <Input id="subject" name="subject" value={form.subject} onChange={handleChange} required className="pl-10" />
                    </div>
                </div>

                {/* Message */}
                <div>
                    <label htmlFor="message" className="block text-body-md font-medium mb-1">Pesan *</label>
                    <textarea
                        id="message"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className={cn(
                            "flex min-h-[80px] w-full rounded-lg border border-surface-variant bg-background px-3 py-2 text-body-md ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        )}
                    />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                    <Button type="submit" disabled={loading} className="w-full justify-center space-x-2">
                        <Send className="w-5 h-5" />
                        <span>{loading ? "Mengirim Pesan..." : "Kirim Pesan"}</span>
                    </Button>
                </div>
            </form>
        </div>
    );
}
