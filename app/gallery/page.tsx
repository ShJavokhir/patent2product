'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WarpBackground } from "@/components/ui/warp-background";
import { Card } from "@/components/ui/card";
import GlassCard from '@/components/GlassCard';
import { useFutureMode } from '@/lib/FutureModeContext';
import { cn } from '@/lib/utils';
import { ArrowLeft, Image as ImageIcon, Loader2, AlertCircle, X, Download, Calendar, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface GalleryImage {
  s3Url: string;
  timestamp: number;
  patentId?: string;
  title?: string;
  abstract?: string;
}

export default function GalleryPage() {
  const router = useRouter();
  const { isFutureMode } = useFutureMode();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/gallery');

      if (!response.ok) {
        throw new Error('Failed to load gallery');
      }

      const data = await response.json();
      setImages(data.images || []);
    } catch (err) {
      console.error('Gallery load error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (images.length === 0) return;

      if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length]);

  return (
    <WarpBackground
      className="min-h-screen w-full p-0 border-none rounded-none"
      gridColor={isFutureMode ? "rgba(0, 243, 255, 0.2)" : undefined}
      beamColor={isFutureMode ? "linear-gradient(to bottom, rgba(0, 243, 255, 0.8), transparent)" : undefined}
    >
      <div className="relative z-10 min-h-screen pt-20 pb-8 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <button
            onClick={() => router.push('/')}
            className={cn(
              "group w-10 h-10 flex items-center justify-center rounded-full border transition-all active:scale-90 shadow-sm",
              isFutureMode
                ? "bg-slate-900/50 border-cyan-500/40 hover:bg-slate-900/80 hover:border-cyan-500"
                : "bg-white/50 border-slate-200 hover:bg-white hover:border-slate-300"
            )}
          >
            <ArrowLeft className={cn(
              "w-4 h-4 transition-colors",
              isFutureMode ? "text-cyan-400 group-hover:text-cyan-300" : "text-slate-400 group-hover:text-slate-900"
            )} />
          </button>
          <div>
            <h2 className={cn(
              "text-xs font-bold uppercase tracking-widest mb-0.5",
              isFutureMode ? "text-cyan-400" : "text-slate-500"
            )}>
              Generated Prototypes
            </h2>
            <h1 className={cn(
              "text-2xl md:text-3xl font-display font-bold tracking-tight",
              isFutureMode ? "text-white drop-shadow-[0_0_10px_rgba(0,243,255,0.3)]" : "text-slate-900"
            )}>
              Image Gallery
            </h1>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <Card className={cn(
            "p-12 text-center backdrop-blur-sm shadow-xl transition-colors duration-300",
            isFutureMode
              ? "bg-slate-900/20 border-cyan-500/40 shadow-[0_0_50px_rgba(0,243,255,0.1)]"
              : "bg-white/90 border-slate-200/50"
          )}>
            <Loader2 className={cn(
              "w-12 h-12 animate-spin mx-auto mb-4",
              isFutureMode ? "text-cyan-400" : "text-emerald-600"
            )} />
            <p className={cn(
              "text-lg font-medium",
              isFutureMode ? "text-cyan-100" : "text-slate-600"
            )}>
              Loading gallery...
            </p>
          </Card>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className={cn(
            "p-8 text-center backdrop-blur-sm shadow-xl border-2",
            "bg-red-50 border-red-200"
          )}>
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-900 mb-2">Failed to Load Gallery</h3>
            <p className="text-red-700 mb-6">{error}</p>
            <button
              onClick={loadGallery}
              className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all active:scale-95"
            >
              Try Again
            </button>
          </Card>
        )}

        {/* Empty State */}
        {!loading && !error && images.length === 0 && (
          <Card className={cn(
            "p-12 text-center backdrop-blur-sm shadow-xl transition-colors duration-300",
            isFutureMode
              ? "bg-slate-900/20 border-cyan-500/40 shadow-[0_0_50px_rgba(0,243,255,0.1)]"
              : "bg-white/90 border-slate-200/50"
          )}>
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4",
              isFutureMode
                ? "bg-cyan-500/20 border border-cyan-500/40"
                : "bg-emerald-100"
            )}>
              <ImageIcon className={cn(
                "w-8 h-8",
                isFutureMode ? "text-cyan-400" : "text-emerald-600"
              )} />
            </div>
            <h3 className={cn(
              "text-xl font-bold mb-2",
              isFutureMode ? "text-white" : "text-slate-900"
            )}>
              No Images Yet
            </h3>
            <p className={cn(
              "mb-6 max-w-md mx-auto",
              isFutureMode ? "text-cyan-100/70" : "text-slate-600"
            )}>
              Generate your first prototype to see it appear here. All generated images are automatically saved to the gallery.
            </p>
            <button
              onClick={() => router.push('/')}
              className={cn(
                "px-6 py-3 font-bold rounded-xl transition-all active:scale-95 shadow-lg",
                isFutureMode
                  ? "bg-cyan-600 hover:bg-cyan-700 text-white shadow-[0_0_20px_rgba(0,243,255,0.3)]"
                  : "bg-slate-900 hover:bg-slate-800 text-white"
              )}
            >
              Start Generating
            </button>
          </Card>
        )}

        {/* Carousel */}
        {!loading && !error && images.length > 0 && (
          <div className="space-y-6 animate-fade-in">
            {/* Counter */}
            <div className="flex items-center justify-between">
              <div className={cn(
                "text-sm font-medium",
                isFutureMode ? "text-cyan-100/80" : "text-slate-600"
              )}>
                Image {currentIndex + 1} of {images.length}
              </div>
              <div className={cn(
                "text-xs font-mono px-3 py-1.5 rounded-full border",
                isFutureMode
                  ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
                  : "border-slate-200 bg-slate-100 text-slate-600"
              )}>
                Use ← → keys to navigate
              </div>
            </div>

            {/* Main Carousel */}
            <div className="relative">
              <GlassCard className="overflow-hidden">
                {/* Main Image */}
                <div className="relative aspect-[16/9] bg-slate-100">
                  <img
                    src={images[currentIndex].s3Url}
                    alt={images[currentIndex].title || `Generated image ${currentIndex + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Image Info Overlay */}
                <div className="p-6 space-y-4">
                  {images[currentIndex].title && (
                    <div>
                      <label className={cn(
                        "text-xs font-bold uppercase tracking-wider block mb-1",
                        isFutureMode ? "text-cyan-400/80" : "text-slate-500"
                      )}>
                        Patent Title
                      </label>
                      <h3 className={cn(
                        "text-xl font-bold",
                        isFutureMode ? "text-white" : "text-slate-900"
                      )}>
                        {images[currentIndex].title}
                      </h3>
                    </div>
                  )}

                  {images[currentIndex].abstract && (
                    <div>
                      <label className={cn(
                        "text-xs font-bold uppercase tracking-wider block mb-1",
                        isFutureMode ? "text-cyan-400/80" : "text-slate-500"
                      )}>
                        Abstract
                      </label>
                      <p className={cn(
                        "text-sm leading-relaxed line-clamp-3",
                        isFutureMode ? "text-cyan-100/80" : "text-slate-700"
                      )}>
                        {images[currentIndex].abstract}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/20">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "flex items-center gap-2 text-xs",
                        isFutureMode ? "text-cyan-200/60" : "text-slate-500"
                      )}>
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(images[currentIndex].timestamp)}</span>
                      </div>

                      {images[currentIndex].patentId && (
                        <div className={cn(
                          "text-xs font-mono px-2 py-1 rounded",
                          isFutureMode ? "bg-cyan-500/20 text-cyan-400" : "bg-emerald-100 text-emerald-600"
                        )}>
                          {images[currentIndex].patentId}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedImage(images[currentIndex])}
                        className={cn(
                          "inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all active:scale-95",
                          isFutureMode
                            ? "bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 border border-cyan-500/30"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                        )}
                      >
                        <ImageIcon className="w-4 h-4" />
                        View Full
                      </button>
                      <a
                        href={images[currentIndex].s3Url}
                        download
                        className={cn(
                          "inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all active:scale-95",
                          isFutureMode
                            ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white"
                        )}
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Navigation Buttons */}
              <button
                onClick={prevImage}
                className={cn(
                  "absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-xl backdrop-blur-sm",
                  isFutureMode
                    ? "bg-slate-900/80 hover:bg-slate-900 border border-cyan-500/40 text-cyan-400 hover:shadow-[0_0_20px_rgba(0,243,255,0.3)]"
                    : "bg-white/90 hover:bg-white border border-slate-200 text-slate-900"
                )}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextImage}
                className={cn(
                  "absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-xl backdrop-blur-sm",
                  isFutureMode
                    ? "bg-slate-900/80 hover:bg-slate-900 border border-cyan-500/40 text-cyan-400 hover:shadow-[0_0_20px_rgba(0,243,255,0.3)]"
                    : "bg-white/90 hover:bg-white border border-slate-200 text-slate-900"
                )}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Thumbnail Strip */}
            <div className="relative px-12">
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                {images.map((image, idx) => (
                  <button
                    key={`${image.s3Url}-${idx}`}
                    onClick={() => setCurrentIndex(idx)}
                    className={cn(
                      "relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all",
                      idx === currentIndex
                        ? isFutureMode
                          ? "border-cyan-500 shadow-[0_0_15px_rgba(0,243,255,0.3)] scale-110"
                          : "border-emerald-500 shadow-lg scale-110"
                        : isFutureMode
                          ? "border-cyan-500/20 hover:border-cyan-500/50"
                          : "border-slate-200 hover:border-slate-300",
                      "cursor-pointer hover:scale-105"
                    )}
                  >
                    <img
                      src={image.s3Url}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {idx === currentIndex && (
                      <div className={cn(
                        "absolute inset-0 border-2",
                        isFutureMode ? "border-cyan-400" : "border-emerald-500"
                      )} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className={cn(
              "rounded-xl p-6 shadow-2xl",
              isFutureMode ? "bg-slate-900/90 border border-cyan-500/40" : "bg-white"
            )}>
              {/* Image */}
              <div className="relative w-full h-[60vh] rounded-lg overflow-hidden bg-slate-100 mb-4">
                <img
                  src={selectedImage.s3Url}
                  alt={selectedImage.title || 'Generated image'}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Details */}
              <div className="space-y-3">
                {selectedImage.title && (
                  <div>
                    <label className={cn(
                      "text-xs font-bold uppercase tracking-wider block mb-1",
                      isFutureMode ? "text-cyan-400/80" : "text-slate-500"
                    )}>
                      Patent Title
                    </label>
                    <h3 className={cn(
                      "text-lg font-bold",
                      isFutureMode ? "text-white" : "text-slate-900"
                    )}>
                      {selectedImage.title}
                    </h3>
                  </div>
                )}

                {selectedImage.abstract && (
                  <div>
                    <label className={cn(
                      "text-xs font-bold uppercase tracking-wider block mb-1",
                      isFutureMode ? "text-cyan-400/80" : "text-slate-500"
                    )}>
                      Abstract
                    </label>
                    <p className={cn(
                      "text-sm leading-relaxed",
                      isFutureMode ? "text-cyan-100/80" : "text-slate-700"
                    )}>
                      {selectedImage.abstract}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/20">
                  <div className={cn(
                    "flex items-center gap-2 text-xs",
                    isFutureMode ? "text-cyan-200/60" : "text-slate-500"
                  )}>
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(selectedImage.timestamp)}</span>
                  </div>

                  <a
                    href={selectedImage.s3Url}
                    download
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all active:scale-95",
                      isFutureMode
                        ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white"
                    )}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </WarpBackground>
  );
}
