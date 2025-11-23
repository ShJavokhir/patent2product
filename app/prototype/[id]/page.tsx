'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Patent } from '@/lib/types';
import { MOCK_PATENTS } from '@/lib/constants';
import { ArrowLeft, Sparkles, Loader2, CheckCircle2, Cpu, Zap, AlertCircle } from 'lucide-react';
import GlassCard from '@/components/GlassCard';

enum GenerationStatus {
  IDLE = 'idle',
  PREPARING = 'preparing',
  GENERATING = 'generating',
  UPLOADING = 'uploading',
  COMPLETE = 'complete',
  ERROR = 'error',
}

interface GenerationStep {
  status: GenerationStatus;
  label: string;
  description: string;
}

export default function PrototypePage() {
  const params = useParams();
  const router = useRouter();
  const patentId = params.id as string;

  const [patent, setPatent] = useState<Patent | null>(null);
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState(0);

  const steps: GenerationStep[] = [
    {
      status: GenerationStatus.PREPARING,
      label: 'Analyzing Patent',
      description: 'Extracting key features and specifications',
    },
    {
      status: GenerationStatus.GENERATING,
      label: 'Generating Prototype',
      description: 'Creating visual representation using AI',
    },
    {
      status: GenerationStatus.UPLOADING,
      label: 'Finalizing',
      description: 'Processing and storing your prototype',
    },
  ];

  useEffect(() => {
    // Find patent by ID
    const foundPatent = MOCK_PATENTS.find(p => p.id === patentId);
    if (foundPatent) {
      setPatent(foundPatent);
    }
  }, [patentId]);

  const buildPrompt = (patent: Patent): string => {
    return `A high-quality, professional product prototype visualization of: ${patent.productIdea}.
${patent.summary}.
The design should be modern, sleek, and commercial-ready. Show the product in a clean, well-lit studio environment with professional lighting.
Product photography style, high detail, 8K resolution, photorealistic rendering.`;
  };

  const generatePrototype = async () => {
    if (!patent) return;

    try {
      setError('');

      // Step 1: Preparing
      setStatus(GenerationStatus.PREPARING);
      setProgress(10);
      await new Promise(resolve => setTimeout(resolve, 1500));

      const prompt = buildPrompt(patent);
      setProgress(25);

      // Step 2: Generating
      setStatus(GenerationStatus.GENERATING);
      setProgress(35);

      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          guidance_scale: 3.5,
          num_inference_steps: 40,
          image_size: 'landscape_16_9',
        }),
      });

      setProgress(70);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate prototype');
      }

      // Step 3: Uploading
      setStatus(GenerationStatus.UPLOADING);
      setProgress(85);

      const data = await response.json();
      await new Promise(resolve => setTimeout(resolve, 1000));

      setProgress(100);
      setImageUrl(data.url);
      setStatus(GenerationStatus.COMPLETE);

    } catch (err) {
      console.error('Generation error:', err);
      setStatus(GenerationStatus.ERROR);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.status === status);
  };

  const isStepComplete = (stepStatus: GenerationStatus) => {
    const currentIndex = getCurrentStepIndex();
    const stepIndex = steps.findIndex(s => s.status === stepStatus);
    return currentIndex > stepIndex || status === GenerationStatus.COMPLETE;
  };

  const isStepActive = (stepStatus: GenerationStatus) => {
    return status === stepStatus;
  };

  if (!patent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Patent Not Found</h2>
          <p className="text-slate-600 mb-6">The patent you're looking for doesn't exist.</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-6 mb-12 animate-fade-in">
        <button
          onClick={() => router.back()}
          className="group w-12 h-12 flex items-center justify-center rounded-full bg-white/50 border border-slate-200 hover:bg-white hover:border-slate-300 transition-all active:scale-90 shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-slate-900" />
        </button>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
            Prototype Generation
          </h2>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight">
            {patent.title}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Patent Info */}
        <div className="space-y-6">
          <GlassCard className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Patent Details</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Patent Number
                </label>
                <p className="text-slate-900 font-mono mt-1">{patent.patentNumber}</p>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Summary
                </label>
                <p className="text-slate-700 leading-relaxed mt-1">{patent.summary}</p>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Product Concept
                </label>
                <p className="text-lg font-semibold text-slate-900 mt-1">{patent.productIdea}</p>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Commercial Viability
                </label>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex-grow bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500"
                      style={{ width: `${patent.viabilityScore}%` }}
                    />
                  </div>
                  <span className="text-lg font-bold text-slate-900">{patent.viabilityScore}%</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {patent.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs font-medium text-slate-600 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column - Generation Area */}
        <div className="space-y-6">
          {status === GenerationStatus.IDLE && (
            <GlassCard className="p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Ready to Prototype</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Generate a high-quality visual prototype of this patent using advanced AI technology.
              </p>
              <button
                onClick={generatePrototype}
                className="group/btn inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:bg-slate-800 transition-all active:scale-[0.98]"
              >
                <Zap className="w-5 h-5" />
                <span>Generate Prototype</span>
              </button>
            </GlassCard>
          )}

          {(status !== GenerationStatus.IDLE && status !== GenerationStatus.COMPLETE && status !== GenerationStatus.ERROR) && (
            <GlassCard className="p-8">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-slate-900">Generating...</h3>
                  <span className="text-2xl font-bold text-emerald-600">{progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div
                    key={step.status}
                    className={`flex items-start gap-4 p-4 rounded-xl transition-all ${
                      isStepActive(step.status)
                        ? 'bg-emerald-50 border-2 border-emerald-200'
                        : isStepComplete(step.status)
                        ? 'bg-slate-50 border border-slate-200'
                        : 'bg-white border border-slate-200 opacity-50'
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {isStepComplete(step.status) ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      ) : isStepActive(step.status) ? (
                        <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-slate-300" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-slate-900 mb-1">{step.label}</h4>
                      <p className="text-sm text-slate-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {status === GenerationStatus.COMPLETE && imageUrl && (
            <GlassCard className="p-8 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-xl font-bold text-slate-900">Prototype Complete</h3>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border-2 border-slate-200 shadow-xl mb-6">
                <img
                  src={imageUrl}
                  alt={`Prototype of ${patent.productIdea}`}
                  className="w-full h-auto"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={generatePrototype}
                  className="flex-1 py-3 px-4 bg-slate-100 text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-all"
                >
                  Regenerate
                </button>
                <a
                  href={imageUrl}
                  download
                  className="flex-1 py-3 px-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all text-center"
                >
                  Download
                </a>
              </div>
            </GlassCard>
          )}

          {status === GenerationStatus.ERROR && (
            <GlassCard className="p-8 bg-red-50 border-2 border-red-200">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-red-900 mb-2">Generation Failed</h3>
                  <p className="text-red-700 mb-6">{error}</p>
                  <button
                    onClick={generatePrototype}
                    className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
