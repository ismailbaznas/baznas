// src/app/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "BAZNAS Kabupaten Boven Digoel — Badan Amil Zakat Nasional";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
          backgroundColor: "#004229",
          padding: "60px 80px",
          position: "relative",
          fontFamily: "sans-serif",
          color: "#ffffff",
          overflow: "hidden",
        }}
      >
        {/* Background Decorative Accents */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            right: "-150px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(212,175,55,0.25) 0%, rgba(0,66,41,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "30%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(7,92,59,0.5) 0%, rgba(0,66,41,0) 70%)",
          }}
        />

        {/* Top Header: Institutional Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "#D4AF37",
              color: "#002112",
              padding: "8px 20px",
              borderRadius: "9999px",
              fontSize: "15px",
              fontWeight: 800,
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Lembaga Pemerintah Nonstruktural
          </div>
          <div
            style={{
              color: "#ffe088",
              fontSize: "15px",
              fontWeight: 600,
              letterSpacing: "1px",
            }}
          >
            Kabupaten Boven Digoel • Papua Selatan
          </div>
        </div>

        {/* Main Content Area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            maxWidth: "950px",
          }}
        >
          <div
            style={{
              fontSize: "56px",
              fontWeight: 900,
              lineHeight: 1.15,
              color: "#ffffff",
              letterSpacing: "-0.5px",
            }}
          >
            BAZNAS Kabupaten Boven Digoel
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 400,
              color: "#e2e8f0",
              lineHeight: 1.4,
            }}
          >
            Portal Resmi Pengelolaan Zakat, Infak, dan Sedekah. Amanah, Transparan, dan Profesional untuk Kemandirian Umat.
          </div>
        </div>

        {/* Bottom Footer Area */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            borderTop: "1px solid rgba(255, 255, 255, 0.2)",
            paddingTop: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "30px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "16px",
                color: "#ffe088",
                fontWeight: 600,
              }}
            >
              • Diaudit Syariah
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "16px",
                color: "#ffe088",
                fontWeight: 600,
              }}
            >
              • Akuntabel & Terbuka
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "16px",
                color: "#ffe088",
                fontWeight: 600,
              }}
            >
              • 5 Pilar Penyaluran
            </div>
          </div>

          <div
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "0.5px",
            }}
          >
            baznas.go.id
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
