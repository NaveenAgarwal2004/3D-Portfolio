'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Spinner } from '@/components/ui/Spinner';

// Dynamic import with SSR disabled to prevent React Three Fiber SSR issues
const Canvas = dynamic(() => import('@/components/canvas/Canvas').then(mod => ({ default: mod.Canvas })), { 
  ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-obsidian">
              <Spinner size="lg" />
                    <span className="ml-3 text-white">Loading 3D Engine...</span>
                    </div>
                  )
          });
                          
          const Scene = dynamic(() => import('@/components/canvas/Scene').then(mod => ({ default: mod.Scene })), { ssr: false });
          const TestCube = dynamic(() => import('@/components/canvas/TestCube').then(mod => ({ default: mod.TestCube })), { ssr: false });
          const PerformanceOverlay = dynamic(() => import('@/components/canvas/PerformanceOverlay').then(mod => ({ default: mod.PerformanceOverlay })), { ssr: false });
                          
           export default function Test3DPage() {
           return (
             <main className="min-h-screen bg-obsidian">
                <div className="fixed inset-0">
                  <Suspense fallback={
                      <div className="w-full h-full flex items-center justify-center bg-obsidian">
                      <Spinner size="lg" />
                      </div>
                   }>
                 <Canvas className="w-full h-full">
<Scene>
<TestCube />
<PerformanceOverlay />
</Scene>
</Canvas>
</Suspense>
</div>
                                                                                                                                                                                  
<div className="relative z-10 min-h-[300vh] pointer-events-none">
<div className="h-screen flex items-center justify-center">
<div className="text-center space-y-4 pointer-events-auto">
<h1 className="text-6xl font-heading font-bold text-white">
Scroll to Test Camera
</h1>
<p className="text-xl text-neutralGray">
The cube should move as you scroll
</p>
<p className="text-sm text-neutralGray mt-4">
Dev Mode: FPS counter in bottom-left
</p>
</div>
</div>
</div>
</main>
);
}
                                                                                                                                                                                                                                                                                                                