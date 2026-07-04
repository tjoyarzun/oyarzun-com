"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Photo {
  id: number;
  url: string;
  width: number;
  height: number;
  caption: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [lightbox, setLightbox] = useState<Photo | null>(null);

  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Photo Gallery
      </h2>

      {/* Masonry grid */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-3">
        {photos.map((photo) => (
          <motion.div
            key={photo.id}
            whileHover={{ opacity: 0.9, scale: 1.01 }}
            className="mb-3 rounded-lg overflow-hidden cursor-pointer break-inside-avoid"
            onClick={() => setLightbox(photo)}
          >
            <img
              src={photo.url}
              alt={photo.caption}
              className="w-full h-auto block"
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative flex flex-col items-center max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setLightbox(null)}
                className="absolute -top-10 right-0 text-white/80 hover:text-white transition-colors p-1"
                aria-label="Close lightbox"
              >
                <X size={28} />
              </button>

              <img
                src={lightbox.url}
                alt={lightbox.caption}
                className="max-h-[80vh] max-w-full rounded-xl object-contain shadow-2xl"
              />

              {lightbox.caption && (
                <p className="mt-3 text-white/80 text-sm text-center">
                  {lightbox.caption}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
