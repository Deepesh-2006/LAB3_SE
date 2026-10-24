import React from 'react';
import { ARCHITECTURE_COMPARISON } from '../data/labData';
import { CheckCircle2, XCircle, AlertTriangle, Layers, Network, Server, HelpCircle } from 'lucide-react';

export const ArchitectureComparison: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider block mb-1">
          Lab 3 • Step 2: Architectural Style Analysis
        </span>
        <h2 className="text-xl font-bold text-white mb-2">
          Evaluating Architectural Styles for the Coffee Kiosk
        </h2>
        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          The lab handout requires analyzing three prominent architectural styles (<strong>Layered</strong>, <strong>Microservices</strong>, and <strong>Client-Server</strong>) to justify why one is uniquely suited for a physical on-premise café ordering kiosk with touch input, receipt printing, and local menu pricing.
        </p>
      </div>

      {/* Comparison Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {ARCHITECTURE_COMPARISON.map((arch, idx) => {
          const isSelected = arch.style.includes('Selected');
          return (
            <div
              key={idx}
              className={`rounded-2xl p-5 border flex flex-col justify-between transition-all shadow-xl ${
                isSelected
                  ? 'bg-slate-900 border-blue-500 ring-2 ring-blue-500/30'
                  : 'bg-slate-900/70 border-slate-800 opacity-90 hover:opacity-100'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {idx === 0 ? (
                      <Layers className="w-5 h-5 text-blue-400" />
                    ) : idx === 1 ? (
                      <Network className="w-5 h-5 text-purple-400" />
                    ) : (
                      <Server className="w-5 h-5 text-amber-400" />
                    )}
                    <h3 className="font-bold text-sm text-white">
                      {arch.style.replace(' (Selected)', '')}
                    </h3>
                  </div>
                  {isSelected && (
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                      SELECTED STYLE
                    </span>
                  )}
                </div>

                {/* Suitability badge */}
                <div className="mb-4">
                  <span className="text-[11px] text-slate-400 block mb-1">Suitability for Standalone Kiosk:</span>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border inline-block ${
                    isSelected
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                      : arch.suitability.includes('Low')
                      ? 'bg-red-500/10 text-red-300 border-red-500/20'
                      : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                  }`}>
                    {arch.suitability}
                  </span>
                </div>

                {/* Pros */}
                <div className="mb-4">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Strengths (Pros)
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {arch.pros.map((pro, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 text-xs mt-0.5">•</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div className="mb-4">
                  <span className="text-xs font-bold text-red-400 flex items-center gap-1 mb-2">
                    <XCircle className="w-3.5 h-3.5" /> Limitations (Cons)
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-400">
                    {arch.cons.map((con, cIdx) => (
                      <li key={cIdx} className="flex items-start gap-1.5">
                        <span className="text-red-400 text-xs mt-0.5">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Verdict */}
              <div className="pt-3 border-t border-slate-800 text-xs">
                <span className="font-bold text-slate-300 block mb-1">Evaluation Summary:</span>
                <p className="text-[11.5px] text-slate-400 leading-relaxed italic">
                  {arch.verdict}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep-Dive Tradeoff Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl overflow-x-auto">
        <h3 className="text-sm font-bold text-white mb-4">
          Architectural Attributes Comparison Matrix
        </h3>
        <table className="w-full text-left text-xs text-slate-300 border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
              <th className="py-2.5 px-3">Quality Attribute</th>
              <th className="py-2.5 px-3 text-blue-400 font-bold">Layered Architecture (Kiosk)</th>
              <th className="py-2.5 px-3">Microservices Architecture</th>
              <th className="py-2.5 px-3">Client-Server Architecture</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-xs">
            <tr>
              <td className="py-3 px-3 font-semibold text-white">Touchscreen Latency</td>
              <td className="py-3 px-3 text-emerald-400 font-mono">Ultra-Low (&lt;10ms, in-process IPC)</td>
              <td className="py-3 px-3 text-red-400">High (HTTP REST / gRPC overhead)</td>
              <td className="py-3 px-3 text-amber-400">Medium (Network round-trip dependent)</td>
            </tr>
            <tr>
              <td className="py-3 px-3 font-semibold text-white">Hardware Coupling</td>
              <td className="py-3 px-3 text-emerald-400">Isolated inside Business Layer Drivers</td>
              <td className="py-3 px-3 text-red-400">Complex device serialization per pod</td>
              <td className="py-3 px-3 text-amber-400">Requires dedicated client daemon</td>
            </tr>
            <tr>
              <td className="py-3 px-3 font-semibold text-white">Offline Resilience</td>
              <td className="py-3 px-3 text-emerald-400">100% Autonomous (Never drops sales)</td>
              <td className="py-3 px-3 text-red-400">Fragile (Cluster communication drops)</td>
              <td className="py-3 px-3 text-red-400">Zero (Fails if café Wi-Fi disconnects)</td>
            </tr>
            <tr>
              <td className="py-3 px-3 font-semibold text-white">Deployment Simplicity</td>
              <td className="py-3 px-3 text-emerald-400">Single compiled executable / bundle</td>
              <td className="py-3 px-3 text-red-400">Requires orchestration, mesh, containers</td>
              <td className="py-3 px-3 text-amber-400">Server + client dual maintenance</td>
            </tr>
            <tr>
              <td className="py-3 px-3 font-semibold text-white">Security Perimeter</td>
              <td className="py-3 px-3 text-emerald-400">PCI-DSS card isolation via hardware bridge</td>
              <td className="py-3 px-3 text-amber-400">Large API surface area to audit</td>
              <td className="py-3 px-3 text-amber-400">Over-the-wire encryption mandatory</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
