// src/components/ui/Pagination.tsx

"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

export function Pagination({ totalPages, currentPage, totalItems }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const pagesToShow = 5;
  const startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + pagesToShow - 1);

  // If we are at the end, adjust the start page to always show 5 pages if possible
  const finalStartPage = Math.max(1, endPage - pagesToShow + 1);

  const pageNumbers = Array.from({ length: endPage - finalStartPage + 1 }, (_, i) => finalStartPage + i);


  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-surface rounded-lg border border-surface-variant">
      <div className="text-sm text-on-surface-variant mb-4 sm:mb-0">
        Menampilkan total {totalItems} data. Halaman {currentPage} dari {totalPages}.
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Halaman sebelumnya"
          title="Halaman sebelumnya"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {pageNumbers.map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(page)}
            aria-label={`Halaman ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
            className={cn("w-10 min-w-[40px] font-bold", page === currentPage ? "bg-primary text-on-primary" : "bg-background")}
          >
            {page}
          </Button>
        ))}

        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Halaman berikutnya"
          title="Halaman berikutnya"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
