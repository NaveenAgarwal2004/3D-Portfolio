'use client';

import { Suspense, useState, useEffect } from 'react';
import { Spinner } from '@/components/ui/Spinner';

// Use regular imports with client component wrapper instead of dynamic imports
// This avoids React context issues with R3F
function Test3DContent() {
  const [mounted, setMounted] = useState(false);
  const [R3FComponents, setR3FComponents] = useState<{
    Canvas: React.ComponentType<any>;
    Scene: React.ComponentType<any>;
    TestCube: React.ComponentType;
    PerformanceOverlay: React.ComponentType;
  } | null>(null);

  useEffect(() => {
    // Import R3F components only on client-side after mount
    Promise.all([
      import('@/components/canvas/Canvas'),
      import('@/components/canvas/Scene'),
      import('@/components/canvas/TestCube'),
      import('@/components/canvas/PerformanceOverlay'),
    ]).then(([canvasMod, sceneMod, testCubeMod, perfMod]) => {
      setR3FComponents({
        Canvas: canvasMod.Canvas,
        Scene: sceneMod.Scene,
        TestCube: testCubeMod.TestCube,
        PerformanceOverlay: perfMod.PerformanceOverlay,
      });
      setMounted(true);
    });
  }, []);

  if (!mounted || !R3FComponents) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-obsidian">
        <Spinner size="lg" />
        <span className="ml-3 text-white">Loading 3D Engine...</span>
      </div>
    );
  }

  const { Canvas, Scene, TestCube, PerformanceOverlay } = R3FComponents;

  return (
    <Canvas className="w-full h-full">
      <Scene>
        <TestCube />
        <PerformanceOverlay />
      </Scene>
    </Canvas>
  );
}

export default function Test3DPage() {
  return (
    <main className="min-h-screen bg-obsidian">
      <div className="fixed inset-0">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center bg-obsidian">
            <Spinner size="lg" />
          </div>
        }>
          <Test3DContent />
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
