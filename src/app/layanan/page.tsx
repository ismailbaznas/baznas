// src/app/layanan/page.tsx

import LayananClient from "@/components/LayananClient";

export const revalidate = 60;

export default function LayananPage() {
    return <LayananClient />;
}