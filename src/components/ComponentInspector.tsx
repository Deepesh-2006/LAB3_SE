import React from 'react';
import { UMLComponent, UMLInterface } from '../types/architecture';
import { Layers, Shield, Zap, Cpu, Server, X, Check, Code, ArrowRight } from 'lucide-react';

interface ComponentInspectorProps {
  component: UMLComponent | null;
  selectedInterface: UMLInterface | null;
  onClose: () => void;
  onSelectComponent: (comp: UMLComponent) => void;
  allComponents: UMLComponent[];
}

export const ComponentInspector: React.FC<ComponentInspectorProps> = ({
  component,
  selectedInterface,
  onClose,
  onSelectComponent,
  allComponents
}) => {
  if (!component && !selectedInterface) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 flex flex-col items-center justify-center h-full min-h-[300px]">
        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 mb-3">
          <Layers className="w-6 h-6" />
        </div>
        <h4 className="text-white font-semibold text-sm mb-1">Architecture Inspector</h4>
        <p className="text-xs text-slate-400 max-w-sm">
          Click any component box or interface ball/socket connector on the UML diagram to inspect its technical specification, contracts, and security boundaries.
        </p>
      </div>
    );
  }

  // If an interface is selected
  if (selectedInterface) {
    const sourceComp = allComponents.find(c => c.id === selectedInterface.sourceComponentId);
    const targetComp = allComponents.find(c => c.id === selectedInterface.targetComponentId);

    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col h-full animate-in fade-in duration-200">
        <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                UML Interface Specification
              </span>
              <span className="text-xs text-slate-400 font-mono">Ball-and-Socket</span>
            </div>
            <h3 className="text-base font-bold text-white mt-1 font-mono">
              {selectedInterface.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs overflow-y-auto pr-1">
          {/* Connection direction */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase tracking-wider block mb-2 font-bold">
              Connector Assembly Direction
            </span>
            <div className="flex items-center justify-between text-xs font-semibold">
              <div className="text-blue-400">
                <span className="block text-[10px] text-slate-500">Provided by (Ball ●)</span>
                {sourceComp?.name || selectedInterface.sourceComponentId}
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <div className="text-emerald-400 text-right">
                <span className="block text-[10px] text-slate-500">Required by (Socket ◗)</span>
                {targetComp?.name || selectedInterface.targetComponentId}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <span className="text-slate-400 text-[10px] uppercase tracking-wider block mb-1 font-bold">
              Interface Role & Description
            </span>
            <p className="text-slate-300 leading-relaxed">
              {selectedInterface.description}
            </p>
          </div>

          {/* Protocol */}
          <div>
            <span className="text-slate-400 text-[10px] uppercase tracking-wider block mb-1 font-bold">
              Communication Protocol
            </span>
            <div className="inline-block px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono text-[11px]">
              {selectedInterface.protocol}
            </div>
          </div>

          {/* Methods */}
          <div>
            <span className="text-slate-400 text-[10px] uppercase tracking-wider block mb-1.5 font-bold">
              Contract Methods / Signatures
            </span>
            <div className="space-y-1.5 font-mono text-[11px] bg-slate-950 p-3 rounded-xl border border-slate-800">
              {selectedInterface.methods.map((method, idx) => (
                <div key={idx} className="text-blue-300 flex items-center gap-1.5">
                  <span className="text-emerald-400">+</span>
                  <span>{method}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payload Example */}
          {selectedInterface.dataPayloadExample && (
            <div>
              <span className="text-slate-400 text-[10px] uppercase tracking-wider block mb-1 font-bold">
                Sample Data Packet
              </span>
              <pre className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono text-[10.5px] text-slate-300 overflow-x-auto">
                {selectedInterface.dataPayloadExample}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Component is selected
  const layerColors = {
    presentation: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    business: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    data: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
  }[component!.layer];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col h-full animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${layerColors}`}>
              {component!.layer} layer
            </span>
            <span className="text-xs text-slate-400 font-mono">{component!.stereotype}</span>
          </div>
          <h3 className="text-base font-bold text-white mt-1">
            {component!.name}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4 text-xs overflow-y-auto pr-1">
        {/* Description */}
        <div>
          <span className="text-slate-400 text-[10px] uppercase tracking-wider block mb-1 font-bold">
            Description
          </span>
          <p className="text-slate-300 leading-relaxed">
            {component!.description}
          </p>
        </div>

        {/* Responsibilities */}
        <div>
          <span className="text-slate-400 text-[10px] uppercase tracking-wider block mb-1.5 font-bold">
            Key Responsibilities (Lab 3 Spec)
          </span>
          <ul className="space-y-1.5">
            {component!.responsibilities.map((resp, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
                <span>{resp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Interfaces Matrix */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-blue-400 font-bold text-[10px] uppercase block mb-1">
              ● Provided Interfaces
            </span>
            {component!.providedInterfaces.length > 0 ? (
              component!.providedInterfaces.map((iface, i) => (
                <div key={i} className="font-mono text-[11px] text-slate-200">
                  {iface}
                </div>
              ))
            ) : (
              <span className="text-slate-500 italic text-[11px]">None</span>
            )}
          </div>

          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-emerald-400 font-bold text-[10px] uppercase block mb-1">
              ◗ Required Interfaces
            </span>
            {component!.requiredInterfaces.length > 0 ? (
              component!.requiredInterfaces.map((iface, i) => (
                <div key={i} className="font-mono text-[11px] text-slate-200">
                  {iface}
                </div>
              ))
            ) : (
              <span className="text-slate-500 italic text-[11px]">None</span>
            )}
          </div>
        </div>

        {/* Hardware Interaction if applicable */}
        {component!.hardwareInteraction && (
          <div className="bg-purple-950/30 border border-purple-500/20 p-2.5 rounded-xl">
            <div className="flex items-center gap-1.5 text-purple-400 font-bold text-[10px] uppercase mb-1">
              <Cpu className="w-3.5 h-3.5" />
              Hardware Peripheral Constraint
            </div>
            <p className="text-purple-200 text-[11px]">
              {component!.hardwareInteraction}
            </p>
          </div>
        )}

        {/* Security Advantage */}
        <div className="bg-emerald-950/30 border border-emerald-500/20 p-2.5 rounded-xl">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[10px] uppercase mb-1">
            <Shield className="w-3.5 h-3.5" />
            Security Isolation Rationale
          </div>
          <p className="text-emerald-200 text-[11px] leading-relaxed">
            {component!.securityNote}
          </p>
        </div>

        {/* Performance Benefit */}
        <div className="bg-amber-950/30 border border-amber-500/20 p-2.5 rounded-xl">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[10px] uppercase mb-1">
            <Zap className="w-3.5 h-3.5" />
            Performance Advantage
          </div>
          <p className="text-amber-200 text-[11px] leading-relaxed">
            {component!.performanceNote}
          </p>
        </div>
      </div>
    </div>
  );
};
