import React from 'react';
import { AppItem } from '../data/apps';
import { Terminal, Play, Save, FileSpreadsheet, Check, Activity, Layers, Sliders, Cpu } from 'lucide-react';

interface ScreenshotMockupProps {
  app: AppItem;
}

export const ScreenshotMockup: React.FC<ScreenshotMockupProps> = ({ app }) => {
  return (
    <div className="w-full bg-white border-2 border-black shadow-hard overflow-hidden">
      {/* OS Window Titlebar */}
      <div className="bg-gray-100 border-b-2 border-black px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <span className="w-3 h-3 rounded-full border border-black bg-white inline-block"></span>
            <span className="w-3 h-3 rounded-full border border-black bg-white inline-block"></span>
            <span className="w-3 h-3 rounded-full border border-black bg-black inline-block"></span>
          </div>
          <span className="text-xs font-mono font-bold text-black ml-3">
            SIEC // {app.name} — [Project_Calc_Sheet_01.siec]
          </span>
        </div>
        <div className="text-[11px] font-mono text-gray-500 uppercase tracking-widest hidden sm:inline">
          ENGINE: VERIFIED ({app.version})
        </div>
      </div>

      {/* Menu / Ribbon Bar */}
      <div className="bg-white border-b border-black px-4 py-1.5 flex items-center justify-between text-xs font-mono">
        <div className="flex space-x-4 text-gray-700">
          <span className="font-bold text-black underline">File</span>
          <span className="hover:text-black cursor-pointer">Edit</span>
          <span className="hover:text-black cursor-pointer">Geometry</span>
          <span className="hover:text-black cursor-pointer">Solver</span>
          <span className="hover:text-black cursor-pointer">Design Code</span>
          <span className="hover:text-black cursor-pointer">Export</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 border border-black bg-black text-white text-[10px] uppercase font-bold">
            SOLVER READY
          </span>
        </div>
      </div>

      {/* Main Workspace Mockup */}
      <div className="p-6 bg-gray-50 min-h-[340px] flex flex-col justify-between">
        <div className="grid grid-cols-12 gap-6">
          {/* Left: Input Parameters Panel */}
          <div className="col-span-12 md:col-span-5 bg-white border border-black p-4 space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-black border-b border-black pb-1.5 flex items-center justify-between">
              <span>Input Parameters</span>
              <Sliders className="w-3.5 h-3.5" />
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div>
                <label className="text-[11px] text-gray-500 block">Design Code Reference</label>
                <div className="font-bold text-black border-b border-gray-200 py-0.5">
                  {app.standards[0] || 'Standard International'}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-gray-500 block">Safety Factor (γ)</label>
                  <div className="font-bold text-black border-b border-gray-200 py-0.5">1.50 (ASD)</div>
                </div>
                <div>
                  <label className="text-[11px] text-gray-500 block">Unit System</label>
                  <div className="font-bold text-black border-b border-gray-200 py-0.5">SI Metric (kN, m)</div>
                </div>
              </div>
              <div>
                <label className="text-[11px] text-gray-500 block">Boundary Conditions</label>
                <div className="font-bold text-black border-b border-gray-200 py-0.5">Fixed Base / Monolithic</div>
              </div>
              <div>
                <label className="text-[11px] text-gray-500 block">Iteration Limit</label>
                <div className="font-bold text-black border-b border-gray-200 py-0.5">10,000 Cycles (Δ ≤ 0.001)</div>
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="button" 
                className="w-full py-1.5 bg-black text-white text-xs font-mono font-bold uppercase flex items-center justify-center space-x-1.5 hover:bg-gray-800"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Execute Solver</span>
              </button>
            </div>
          </div>

          {/* Right: Calculation Output & Diagram Viewport */}
          <div className="col-span-12 md:col-span-7 bg-white border border-black p-4 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-black border-b border-black pb-1.5 flex items-center justify-between mb-3">
                <span>Analytical Result Summary</span>
                <span className="text-[10px] font-mono text-gray-400">PASSED: 100% UTILIZATION OK</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-2.5 bg-gray-50 border border-gray-200">
                  <div className="text-[10px] font-mono uppercase text-gray-500">Governing Ratio</div>
                  <div className="text-lg font-mono font-black text-black">0.742 &lt; 1.0</div>
                  <div className="text-[10px] text-gray-500 font-mono">Margin: +25.8% Safe</div>
                </div>
                <div className="p-2.5 bg-gray-50 border border-gray-200">
                  <div className="text-[10px] font-mono uppercase text-gray-500">Convergence Time</div>
                  <div className="text-lg font-mono font-black text-black">0.014 s</div>
                  <div className="text-[10px] text-gray-500 font-mono">12 Iterations</div>
                </div>
              </div>

              {/* Vector blueprint lines representation */}
              <div className="h-28 border border-dashed border-gray-300 bg-grid-pattern p-2 flex items-center justify-center text-center">
                <div className="space-y-1">
                  <div className="text-xs font-mono font-bold text-black">
                    [ Interactive Vector Cross-Section Viewport ]
                  </div>
                  <div className="text-[11px] font-mono text-gray-500">
                    Real-time stress contours & deformation envelope
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-xs font-mono">
              <span className="text-gray-500">Ready to export formal calculation submittal</span>
              <div className="flex space-x-2">
                <span className="px-2 py-0.5 border border-black text-black font-bold uppercase text-[10px]">PDF/A</span>
                <span className="px-2 py-0.5 border border-black text-black font-bold uppercase text-[10px]">XLSX</span>
                <span className="px-2 py-0.5 border border-black text-black font-bold uppercase text-[10px]">DXF</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-black text-white px-4 py-1.5 flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center space-x-3">
          <span className="inline-block w-2 h-2 rounded-full bg-white"></span>
          <span>SIEC DESKTOP RUNTIME (OFFLINE LOCAL SOLVER)</span>
        </div>
        <div>PRECISION: IEEE-754 DOUBLE FLOAT (64-BIT)</div>
      </div>
    </div>
  );
};
