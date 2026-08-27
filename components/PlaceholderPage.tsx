// components/PlaceholderPage.tsx
import { ReactNode } from "react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export default function PlaceholderPage({ title, description, children }: PlaceholderPageProps) {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[60vh]">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-extrabold text-baznas-green-dark mb-4">{title}</h1>
        <p className="text-xl text-baznas-neutral mb-8">{description}</p>
        <div className="border-t-2 border-baznas-gold pt-8 text-left">
          {children ? children : (
            <div className="bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300">
              <p className="font-semibold text-lg text-baznas-neutral">
                Status: Tahap Pengembangan (MVP)
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Halaman ini akan segera diimplementasikan dengan fitur penuh. Arsitektur data sudah disiapkan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
