import { getAllMedia, getSiteSettings } from "@/lib/portfolio";
import { HeroPicker } from "./hero-picker";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [media, settings] = await Promise.all([
    getAllMedia(),
    getSiteSettings(),
  ]);

  const images = media.filter((m) => m.type === "image");

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-display tracking-[0.2em] text-sm mb-2">
          HOME HERO
        </h2>
        <p className="text-sm opacity-70 max-w-2xl">
          The featured image at the top of the home page. Pick any photo from
          your portfolio, then drag the focal point so the most important part
          stays in frame on every screen size.
        </p>
      </section>

      <HeroPicker
        images={images}
        initial={{
          heroMediaId: settings.heroMediaId,
          focalX: settings.focalX,
          focalY: settings.focalY,
          overlay: settings.overlay,
        }}
      />
    </div>
  );
}
