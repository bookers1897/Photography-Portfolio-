"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { MediaItem } from "@/lib/portfolio";

export function FeaturedStrip({ items }: { items: MediaItem[] }) {
  if (!items.length) return null;
  return (
    <section
      aria-label="Selected work"
      className="border-t border-[color:var(--color-border)]"
    >
      <div className="overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory">
        <ul className="flex gap-4 md:gap-6 px-6 md:px-12 py-10 md:py-14 w-max">
          {items.map((item, i) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.6,
                delay: i * 0.05,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="snap-center shrink-0 w-[72vw] md:w-[38vw] lg:w-[28vw] relative aspect-[3/4] bg-[color:var(--color-surface)] overflow-hidden"
            >
              <Image
                src={item.src}
                alt={item.alt ?? item.name}
                fill
                sizes="(min-width: 1024px) 28vw, (min-width: 768px) 38vw, 72vw"
                quality={90}
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.03]"
              />
              <div className="absolute bottom-0 inset-x-0 p-4 text-white bg-gradient-to-t from-black/60 to-transparent">
                <p className="font-display tracking-[0.2em] text-xs">
                  {item.name.toUpperCase()}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
