// src/app/[locale]/travel/page.tsx
import TravelTimeline from "../../../components/travel/TravelTimeline";


export default function TravelPage() {
  return (
    <main className="min-h-[100dvh] bg-[#0A0A0B] text-white">
      <TravelTimeline />
    </main>
  );
}
