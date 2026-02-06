'use client';
import React from 'react';
import { InfiniteSlider } from '@/components/ui/infinite-slider';

const items = [
  { id: 1, label: 'Item 1', color: 'from-indigo-500 to-purple-500' },
  { id: 2, label: 'Item 2', color: 'from-rose-500 to-orange-400' },
  { id: 3, label: 'Item 3', color: 'from-emerald-400 to-teal-500' },
  { id: 4, label: 'Item 4', color: 'from-sky-400 to-blue-600' },
  { id: 5, label: 'Item 5', color: 'from-yellow-400 to-amber-500' },
];

export default function DemoUsage() {
  return (
    <div className="space-y-10 p-8">
      <section>
        <h3 className="mb-4 text-lg font-semibold">Horizontal — default</h3>
        <InfiniteSlider speed={12} gap={12} className="bg-gray-50 p-4 rounded-lg">
          {items.map((it) => (
            <div
              key={it.id}
              className={`min-w-[200px] h-36 flex items-center justify-center text-white font-bold rounded-lg shadow-md bg-gradient-to-br ${it.color}`}
            >
              {it.label}
            </div>
          ))}
        </InfiniteSlider>
      </section>

      <section>
        <h3 className="mb-4 text-lg font-semibold">Hover to speed up (speedOnHover)</h3>
        <InfiniteSlider speed={20} speedOnHover={6} gap={12} className="bg-gray-50 p-4 rounded-lg">
          {items.map((it) => (
            <div
              key={it.id}
              className={`min-w-[220px] h-32 flex items-center justify-center text-white font-semibold rounded-lg shadow-md bg-gradient-to-br ${it.color}`}
            >
              {it.label}
            </div>
          ))}
        </InfiniteSlider>
      </section>

      <section>
        <h3 className="mb-4 text-lg font-semibold">Vertical — reverse</h3>
        {/* Constrain height so vertical slider shows scrolling effect */}
        <div className="h-[300px] bg-gray-50 p-4 rounded-lg">
          <InfiniteSlider direction="vertical" speed={8} gap={12} reverse className="h-full">
            {items.map((it) => (
              <div
                key={it.id}
                style={{ minHeight: 80 }}
                className={`w-56 flex items-center justify-center text-white font-medium rounded-lg shadow-md bg-gradient-to-br ${it.color}`}
              >
                {it.label}
              </div>
            ))}
          </InfiniteSlider>
        </div>
      </section>
    </div>
  );
}