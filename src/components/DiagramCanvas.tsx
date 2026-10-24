import React, { useRef, useState } from 'react';
import { UML_COMPONENTS, UML_INTERFACES } from '../data/labData';
import { UMLComponent, UMLInterface, SimulationStep } from '../types/architecture';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Layers, Cpu, Database, Monitor, ShieldCheck, Zap } from 'lucide-react';

interface DiagramCanvasProps {
  selectedComponent: UMLComponent | null;
  selectedInterface: UMLInterface | null;
  onSelectComponent: (comp: UMLComponent | null) => void;
  onSelectInterface: (iface: UMLInterface | null) => void;
  simulationStep: SimulationStep;
  theme: 'blueprint' | 'academic' | 'dark';
}

export const DiagramCanvas: React.FC<DiagramCanvasProps> = ({
  selectedComponent,
  selectedInterface,
  onSelectComponent,
  onSelectInterface,
  simulationStep,
  theme
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [showProtocols, setShowProtocols] = useState<boolean>(true);
  const [showLayers, setShowLayers] = useState<boolean>(true);
  const svgRef = useRef<SVGSVGElement>(null);

  // Theme styling definitions
  const themeStyles = {
    blueprint: {
      bg: '#0f172a', // slate-900
      grid: '#1e293b',
      text: '#f8fafc',
      mutedText: '#94a3b8',
      layerStroke: '#334155',
      layerFillPres: 'rgba(30, 58, 138, 0.15)',
      layerFillBiz: 'rgba(16, 185, 129, 0.08)',
      layerFillData: 'rgba(217, 119, 6, 0.08)',
      compStroke: '#3b82f6',
      compFill: '#1e293b',
      compSelectedStroke: '#60a5fa',
      compSelectedFill: '#1e3a8a',
      connectorStroke: '#64748b',
      activeConnector: '#38bdf8',
      ballFill: '#38bdf8',
      socketStroke: '#38bdf8'
    },
    academic: {
      bg: '#fafaf9', // warm stone
      grid: '#e7e5e4',
      text: '#1c1917',
      mutedText: '#57534e',
      layerStroke: '#cbd5e1',
      layerFillPres: '#f0f9ff',
      layerFillBiz: '#f0fdf4',
      layerFillData: '#fefce8',
      compStroke: '#b45309',
      compFill: '#fef3c7', // classic handout yellow/ivory
      compSelectedStroke: '#d97706',
      compSelectedFill: '#fde68a',
      connectorStroke: '#475569',
      activeConnector: '#2563eb',
      ballFill: '#2563eb',
      socketStroke: '#2563eb'
    },
    dark: {
      bg: '#18181b', // zinc-900
      grid: '#27272a',
      text: '#fafafa',
      mutedText: '#a1a1aa',
      layerStroke: '#3f3f46',
      layerFillPres: 'rgba(59, 130, 246, 0.08)',
      layerFillBiz: 'rgba(16, 185, 129, 0.08)',
      layerFillData: 'rgba(234, 179, 8, 0.08)',
      compStroke: '#71717a',
      compFill: '#27272a',
      compSelectedStroke: '#a855f7',
      compSelectedFill: '#3b0764',
      connectorStroke: '#71717a',
      activeConnector: '#a855f7',
      ballFill: '#c084fc',
      socketStroke: '#c084fc'
    }
  }[theme];

  // Determine active elements during live simulation
  const isStepActiveComp = (compId: string): boolean => {
    switch (simulationStep) {
      case 'fetch_menu':
        return compId === 'touchscreen_ui' || compId === 'order_manager' || compId === 'database';
      case 'select_item':
        return compId === 'touchscreen_ui' || compId === 'order_manager';
      case 'process_payment':
      case 'payment_approved':
        return compId === 'order_manager' || compId === 'payment_service';
      case 'record_order':
        return compId === 'order_manager' || compId === 'database';
      case 'print_receipt':
      case 'order_complete':
        return compId === 'order_manager' || compId === 'receipt_printer';
      default:
        return false;
    }
  };

  const isStepActiveInterface = (ifaceId: string): boolean => {
    switch (simulationStep) {
      case 'fetch_menu':
        return ifaceId === 'if_menu_catalog' || ifaceId === 'if_order_placement';
      case 'select_item':
        return ifaceId === 'if_order_placement';
      case 'process_payment':
      case 'payment_approved':
        return ifaceId === 'if_payment_processing';
      case 'record_order':
        return ifaceId === 'if_data_store';
      case 'print_receipt':
      case 'order_complete':
        return ifaceId === 'if_receipt_print';
      default:
        return false;
    }
  };

  return (
    <div className="relative w-full h-[640px] rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl flex flex-col">
      {/* Top Diagram Controls & Legend */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-900/90 backdrop-blur border-b border-slate-700 text-xs text-slate-300 z-10 gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            UML 2.0 Component Model
          </span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-mono hidden sm:inline">
            5 Components • 4+ Interfaces • Layered Architecture
          </span>
        </div>

        {/* View toggles */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowLayers(!showLayers)}
            className={`px-2.5 py-1 rounded flex items-center gap-1 border transition ${
              showLayers ? 'bg-slate-800 text-slate-200 border-slate-600' : 'bg-transparent text-slate-400 border-transparent hover:bg-slate-800'
            }`}
            title="Toggle Architectural Layer Boundaries"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden md:inline">Layers</span>
          </button>

          <button
            onClick={() => setShowProtocols(!showProtocols)}
            className={`px-2.5 py-1 rounded flex items-center gap-1 border transition ${
              showProtocols ? 'bg-slate-800 text-slate-200 border-slate-600' : 'bg-transparent text-slate-400 border-transparent hover:bg-slate-800'
            }`}
            title="Toggle Protocol & Method Labels"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Protocols</span>
          </button>

          <div className="h-4 w-px bg-slate-700 mx-1"></div>

          {/* Zoom controls */}
          <button
            onClick={() => setZoom(prev => Math.min(prev + 0.15, 1.8))}
            className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(prev => Math.max(prev - 0.15, 0.6))}
            className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="flex-1 w-full h-full overflow-auto cursor-grab active:cursor-grabbing bg-slate-950 flex items-center justify-center p-2">
        <svg
          ref={svgRef}
          id="uml-coffee-kiosk-svg"
          viewBox="0 0 1100 680"
          className="w-full h-full max-w-full max-h-full transition-transform duration-200 ease-out select-none"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke={themeStyles.grid} strokeWidth="0.8" />
            </pattern>

            {/* Glowing filter for active live data flow */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Arrow marker for dependency and assembly */}
            <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill={themeStyles.connectorStroke} />
            </marker>
            <marker id="active-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill={themeStyles.activeConnector} />
            </marker>
          </defs>

          {/* Background Grid */}
          <rect width="1100" height="680" fill={themeStyles.bg} />
          <rect width="1100" height="680" fill="url(#grid-pattern)" />

          {/* 1. LAYER BOUNDARIES (Horizontal architectural tiers) */}
          {showLayers && (
            <g className="layers-group">
              {/* Presentation Layer */}
              <rect
                x="50"
                y="30"
                width="1000"
                height="175"
                rx="8"
                fill={themeStyles.layerFillPres}
                stroke={themeStyles.layerStroke}
                strokeWidth="1.5"
                strokeDasharray="6,4"
              />
              <text x="70" y="55" fill={theme === 'academic' ? '#0369a1' : '#60a5fa'} fontSize="13" fontWeight="bold" fontFamily="system-ui">
                PRESENTATION LAYER (User Touch Interface & Interaction)
              </text>

              {/* Business Layer */}
              <rect
                x="50"
                y="235"
                width="1000"
                height="225"
                rx="8"
                fill={themeStyles.layerFillBiz}
                stroke={themeStyles.layerStroke}
                strokeWidth="1.5"
                strokeDasharray="6,4"
              />
              <text x="70" y="260" fill={theme === 'academic' ? '#047857' : '#34d399'} fontSize="13" fontWeight="bold" fontFamily="system-ui">
                BUSINESS LOGIC LAYER (Orchestration, Payment Security & Hardware Spooling)
              </text>

              {/* Data Layer */}
              <rect
                x="50"
                y="485"
                width="1000"
                height="165"
                rx="8"
                fill={themeStyles.layerFillData}
                stroke={themeStyles.layerStroke}
                strokeWidth="1.5"
                strokeDasharray="6,4"
              />
              <text x="70" y="510" fill={theme === 'academic' ? '#b45309' : '#fbbf24'} fontSize="13" fontWeight="bold" fontFamily="system-ui">
                DATA / PERSISTENCE LAYER (Local SQLite Catalog & Sales Audit Log)
              </text>
            </g>
          )}

          {/* 2. INTERFACE CONNECTORS (BALL AND SOCKET UML NOTATION) */}
          <g className="interfaces-group">
            {/* Interface 1: TouchscreenUI <-> OrderManager (IOrderPlacement) */}
            {/* Vertical connector between (550, 190) and (550, 280) */}
            <g
              className="cursor-pointer group"
              onClick={() => onSelectInterface(UML_INTERFACES.find(i => i.id === 'if_order_placement') || null)}
            >
              {/* Connector line */}
              <line
                x1="550"
                y1="190"
                x2="550"
                y2="280"
                stroke={isStepActiveInterface('if_order_placement') ? themeStyles.activeConnector : themeStyles.connectorStroke}
                strokeWidth={isStepActiveInterface('if_order_placement') ? "3" : "2"}
                strokeDasharray={isStepActiveInterface('if_order_placement') ? "4,4" : "none"}
              />

              {/* Provided Ball (from Order Manager towards UI) */}
              <circle
                cx="550"
                cy="235"
                r="7"
                fill={isStepActiveInterface('if_order_placement') ? '#38bdf8' : (theme === 'academic' ? '#fef3c7' : '#1e293b')}
                stroke={isStepActiveInterface('if_order_placement') ? '#38bdf8' : themeStyles.activeConnector}
                strokeWidth="2.5"
              />

              {/* Required Socket (semicircle facing ball from Touchscreen UI) */}
              <path
                d="M 539 232 A 11 11 0 0 0 561 232"
                fill="none"
                stroke={isStepActiveInterface('if_order_placement') ? '#38bdf8' : themeStyles.activeConnector}
                strokeWidth="2.5"
              />

              {/* Label badge */}
              <rect x="565" y="222" width="135" height="24" rx="4" fill={theme === 'blueprint' ? '#1e293b' : '#ffffff'} stroke="#3b82f6" strokeWidth="1" />
              <text x="572" y="238" fill={theme === 'academic' ? '#1d4ed8' : '#93c5fd'} fontSize="11" fontWeight="bold" fontFamily="monospace">
                IOrderPlacement
              </text>
              {showProtocols && (
                <text x="565" y="258" fill={themeStyles.mutedText} fontSize="9" fontFamily="sans-serif">
                  [In-Process IPC Method]
                </text>
              )}
            </g>

            {/* Interface 2: OrderManager <-> PaymentService (IPaymentProcessing) */}
            {/* Horizontal connector between (420, 345) and (350, 345) */}
            <g
              className="cursor-pointer group"
              onClick={() => onSelectInterface(UML_INTERFACES.find(i => i.id === 'if_payment_processing') || null)}
            >
              <line
                x1="350"
                y1="345"
                x2="420"
                y2="345"
                stroke={isStepActiveInterface('if_payment_processing') ? '#f59e0b' : themeStyles.connectorStroke}
                strokeWidth={isStepActiveInterface('if_payment_processing') ? "3" : "2"}
                strokeDasharray={isStepActiveInterface('if_payment_processing') ? "4,4" : "none"}
              />

              {/* Ball (Provided by Payment Service) */}
              <circle
                cx="380"
                cy="345"
                r="7"
                fill={isStepActiveInterface('if_payment_processing') ? '#f59e0b' : (theme === 'academic' ? '#fef3c7' : '#1e293b')}
                stroke={isStepActiveInterface('if_payment_processing') ? '#f59e0b' : '#d97706'}
                strokeWidth="2.5"
              />

              {/* Socket (Required by Order Manager) */}
              <path
                d="M 382 334 A 11 11 0 0 1 382 356"
                fill="none"
                stroke={isStepActiveInterface('if_payment_processing') ? '#f59e0b' : '#d97706'}
                strokeWidth="2.5"
              />

              {/* Label badge */}
              <rect x="305" y="365" width="145" height="22" rx="4" fill={theme === 'blueprint' ? '#1e293b' : '#ffffff'} stroke="#d97706" strokeWidth="1" />
              <text x="312" y="380" fill={theme === 'academic' ? '#b45309' : '#fcd34d'} fontSize="11" fontWeight="bold" fontFamily="monospace">
                IPaymentProcessing
              </text>
              {showProtocols && (
                <text x="310" y="400" fill={themeStyles.mutedText} fontSize="9" fontFamily="sans-serif">
                  [EMV Hardware RPC]
                </text>
              )}
            </g>

            {/* Interface 3: OrderManager <-> ReceiptPrinter (IReceiptPrint) */}
            {/* Horizontal connector between (680, 345) and (750, 345) */}
            <g
              className="cursor-pointer group"
              onClick={() => onSelectInterface(UML_INTERFACES.find(i => i.id === 'if_receipt_print') || null)}
            >
              <line
                x1="680"
                y1="345"
                x2="750"
                y2="345"
                stroke={isStepActiveInterface('if_receipt_print') ? '#a855f7' : themeStyles.connectorStroke}
                strokeWidth={isStepActiveInterface('if_receipt_print') ? "3" : "2"}
                strokeDasharray={isStepActiveInterface('if_receipt_print') ? "4,4" : "none"}
              />

              {/* Ball (Provided by Receipt Printer) */}
              <circle
                cx="715"
                cy="345"
                r="7"
                fill={isStepActiveInterface('if_receipt_print') ? '#c084fc' : (theme === 'academic' ? '#fef3c7' : '#1e293b')}
                stroke={isStepActiveInterface('if_receipt_print') ? '#c084fc' : '#9333ea'}
                strokeWidth="2.5"
              />

              {/* Socket (Required by Order Manager) */}
              <path
                d="M 713 334 A 11 11 0 0 0 713 356"
                fill="none"
                stroke={isStepActiveInterface('if_receipt_print') ? '#c084fc' : '#9333ea'}
                strokeWidth="2.5"
              />

              {/* Label badge */}
              <rect x="670" y="365" width="115" height="22" rx="4" fill={theme === 'blueprint' ? '#1e293b' : '#ffffff'} stroke="#9333ea" strokeWidth="1" />
              <text x="678" y="380" fill={theme === 'academic' ? '#6b21a8' : '#e9d5ff'} fontSize="11" fontWeight="bold" fontFamily="monospace">
                IReceiptPrint
              </text>
              {showProtocols && (
                <text x="668" y="400" fill={themeStyles.mutedText} fontSize="9" fontFamily="sans-serif">
                  [ESC/POS Thermal Bridge]
                </text>
              )}
            </g>

            {/* Interface 4 & 5: OrderManager <-> Database (IMenuCatalog & IDataStore) */}
            {/* Vertical connector between (550, 410) and (550, 510) */}
            <g
              className="cursor-pointer group"
              onClick={() => onSelectInterface(UML_INTERFACES.find(i => i.id === 'if_menu_catalog') || null)}
            >
              <line
                x1="550"
                y1="410"
                x2="550"
                y2="510"
                stroke={(isStepActiveInterface('if_menu_catalog') || isStepActiveInterface('if_data_store')) ? '#10b981' : themeStyles.connectorStroke}
                strokeWidth={(isStepActiveInterface('if_menu_catalog') || isStepActiveInterface('if_data_store')) ? "3" : "2"}
                strokeDasharray={(isStepActiveInterface('if_menu_catalog') || isStepActiveInterface('if_data_store')) ? "4,4" : "none"}
              />

              {/* Ball (Provided by Database) */}
              <circle
                cx="550"
                cy="460"
                r="7"
                fill={(isStepActiveInterface('if_menu_catalog') || isStepActiveInterface('if_data_store')) ? '#34d399' : (theme === 'academic' ? '#fef3c7' : '#1e293b')}
                stroke={(isStepActiveInterface('if_menu_catalog') || isStepActiveInterface('if_data_store')) ? '#34d399' : '#059669'}
                strokeWidth="2.5"
              />

              {/* Socket (Required by Order Manager) */}
              <path
                d="M 539 462 A 11 11 0 0 1 561 462"
                fill="none"
                stroke={(isStepActiveInterface('if_menu_catalog') || isStepActiveInterface('if_data_store')) ? '#34d399' : '#059669'}
                strokeWidth="2.5"
              />

              {/* Label badge */}
              <rect x="565" y="445" width="180" height="24" rx="4" fill={theme === 'blueprint' ? '#1e293b' : '#ffffff'} stroke="#059669" strokeWidth="1" />
              <text x="572" y="461" fill={theme === 'academic' ? '#065f46' : '#a7f3d0'} fontSize="11" fontWeight="bold" fontFamily="monospace">
                IMenuCatalog &amp; IDataStore
              </text>
              {showProtocols && (
                <text x="565" y="482" fill={themeStyles.mutedText} fontSize="9" fontFamily="sans-serif">
                  [In-Memory Cache / SQLite ACID]
                </text>
              )}
            </g>

            {/* Direct query line from Presentation UI to Database for fast menu caching (optional dashed usage dependency) */}
            <path
              d="M 680 130 C 880 130 920 450 680 540"
              fill="none"
              stroke={themeStyles.connectorStroke}
              strokeWidth="1.2"
              strokeDasharray="5,5"
              markerEnd="url(#arrow)"
            />
            <rect x="830" y="320" width="125" height="20" rx="3" fill={theme === 'blueprint' ? '#0f172a' : '#f8fafc'} stroke="#64748b" strokeWidth="0.8" />
            <text x="838" y="334" fill={themeStyles.mutedText} fontSize="9" fontFamily="monospace">
              &lt;&lt;use&gt;&gt; IMenuCatalog
            </text>
          </g>

          {/* 3. HARDWARE PERIPHERAL BOUNDARY CALLOUTS (Page 5 constraints) */}
          <g className="hardware-badges">
            {/* Touchscreen hardware connector */}
            <rect x="420" y="52" width="14" height="8" rx="1" fill="#3b82f6" />
            <text x="300" y="48" fill="#38bdf8" fontSize="9" fontFamily="monospace">
              [Capacitive Touchscreen]
            </text>

            {/* EMV card reader hardware */}
            <rect x="100" y="272" width="14" height="8" rx="1" fill="#f59e0b" />
            <text x="75" y="260" fill="#fbbf24" fontSize="9" fontFamily="monospace">
              [EMV Chip / Contactless POS]
            </text>

            {/* Thermal Printer hardware */}
            <rect x="986" y="336" width="14" height="8" rx="1" fill="#a855f7" />
            <text x="870" y="260" fill="#c084fc" fontSize="9" fontFamily="monospace">
              [Thermal ESC/POS Hardware]
            </text>
          </g>

          {/* 4. THE 5 CORE UML COMPONENTS */}
          <g className="components-group">
            {UML_COMPONENTS.map(comp => {
              const isSelected = selectedComponent?.id === comp.id;
              const isActive = isStepActiveComp(comp.id);

              return (
                <g
                  key={comp.id}
                  className="cursor-pointer transition-all duration-300"
                  onClick={() => onSelectComponent(comp)}
                >
                  {/* Active step glow outline */}
                  {isActive && (
                    <rect
                      x={comp.x - 4}
                      y={comp.y - 4}
                      width={comp.width + 8}
                      height={comp.height + 8}
                      rx="6"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="3"
                      filter="url(#glow)"
                      className="animate-pulse"
                    />
                  )}

                  {/* Main Component Rectangle */}
                  <rect
                    x={comp.x}
                    y={comp.y}
                    width={comp.width}
                    height={comp.height}
                    rx="4"
                    fill={isSelected ? themeStyles.compSelectedFill : themeStyles.compFill}
                    stroke={isSelected ? themeStyles.compSelectedStroke : themeStyles.compStroke}
                    strokeWidth={isSelected ? "2.5" : "1.8"}
                    className="drop-shadow-sm"
                  />

                  {/* Standard UML Component Icon in Top-Right Corner */}
                  {/* Classic icon: small rectangle with two tiny tabs extending outward on the left */}
                  <g transform={`translate(${comp.x + comp.width - 32}, ${comp.y + 10})`}>
                    <rect
                      x="4"
                      y="0"
                      width="20"
                      height="24"
                      fill={theme === 'academic' ? '#fff' : '#0f172a'}
                      stroke={themeStyles.compStroke}
                      strokeWidth="1.2"
                      rx="1"
                    />
                    {/* Tab 1 */}
                    <rect
                      x="0"
                      y="4"
                      width="8"
                      height="5"
                      fill={theme === 'academic' ? '#fef3c7' : '#334155'}
                      stroke={themeStyles.compStroke}
                      strokeWidth="1.2"
                    />
                    {/* Tab 2 */}
                    <rect
                      x="0"
                      y="14"
                      width="8"
                      height="5"
                      fill={theme === 'academic' ? '#fef3c7' : '#334155'}
                      stroke={themeStyles.compStroke}
                      strokeWidth="1.2"
                    />
                  </g>

                  {/* Ports (UML Boundary Ports) */}
                  <rect x={comp.x - 4} y={comp.y + comp.height / 2 - 4} width="8" height="8" fill="#64748b" stroke="#fff" strokeWidth="1" />
                  <rect x={comp.x + comp.width - 4} y={comp.y + comp.height / 2 - 4} width="8" height="8" fill="#64748b" stroke="#fff" strokeWidth="1" />
                  <rect x={comp.x + comp.width / 2 - 4} y={comp.y - 4} width="8" height="8" fill="#64748b" stroke="#fff" strokeWidth="1" />
                  <rect x={comp.x + comp.width / 2 - 4} y={comp.y + comp.height - 4} width="8" height="8" fill="#64748b" stroke="#fff" strokeWidth="1" />

                  {/* Component Header Stereotype */}
                  <text
                    x={comp.x + comp.width / 2}
                    y={comp.y + 24}
                    textAnchor="middle"
                    fill={themeStyles.mutedText}
                    fontSize="11"
                    fontFamily="monospace"
                  >
                    {comp.stereotype}
                  </text>

                  {/* Component Name */}
                  <text
                    x={comp.x + comp.width / 2}
                    y={comp.y + 44}
                    textAnchor="middle"
                    fill={themeStyles.text}
                    fontSize="13"
                    fontWeight="bold"
                    fontFamily="system-ui, -apple-system, sans-serif"
                  >
                    {comp.name}
                  </text>

                  {/* Role / Summary Line */}
                  <line
                    x1={comp.x + 12}
                    y1={comp.y + 55}
                    x2={comp.x + comp.width - 12}
                    y2={comp.y + 55}
                    stroke={themeStyles.layerStroke}
                    strokeWidth="0.8"
                  />

                  {/* Primary responsibility bullet snippet */}
                  <text
                    x={comp.x + 14}
                    y={comp.y + 73}
                    fill={themeStyles.mutedText}
                    fontSize="9.5"
                    fontFamily="system-ui"
                  >
                    {comp.responsibilities[0].length > 40
                      ? comp.responsibilities[0].substring(0, 38) + '...'
                      : comp.responsibilities[0]}
                  </text>
                  <text
                    x={comp.x + 14}
                    y={comp.y + 88}
                    fill={themeStyles.mutedText}
                    fontSize="9.5"
                    fontFamily="system-ui"
                  >
                    {comp.responsibilities[1].length > 40
                      ? comp.responsibilities[1].substring(0, 38) + '...'
                      : comp.responsibilities[1]}
                  </text>

                  {/* Bottom Interfaces Pill Badge */}
                  <g transform={`translate(${comp.x + 14}, ${comp.y + comp.height - 22})`}>
                    <rect
                      x="0"
                      y="0"
                      width={comp.width - 28}
                      height="16"
                      rx="3"
                      fill={theme === 'blueprint' ? '#0f172a' : '#f1f5f9'}
                      stroke={themeStyles.layerStroke}
                      strokeWidth="0.6"
                    />
                    <text
                      x="6"
                      y="11"
                      fill={themeStyles.mutedText}
                      fontSize="8.5"
                      fontFamily="monospace"
                    >
                      P: {comp.providedInterfaces.join(', ') || 'none'}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>

          {/* 5. UML LEGEND */}
          <g transform="translate(60, 600)">
            <rect x="0" y="0" width="360" height="36" rx="4" fill={theme === 'blueprint' ? '#1e293b' : '#ffffff'} stroke={themeStyles.layerStroke} strokeWidth="1" />
            
            {/* Ball notation legend */}
            <circle cx="20" cy="18" r="5" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
            <text x="32" y="22" fill={themeStyles.text} fontSize="9.5" fontFamily="system-ui">
              Ball: Provided Interface
            </text>

            {/* Socket notation legend */}
            <path d="M 160 11 A 7 7 0 0 1 160 25" fill="none" stroke="#38bdf8" strokeWidth="2" />
            <text x="175" y="22" fill={themeStyles.text} fontSize="9.5" fontFamily="system-ui">
              Socket: Required Interface
            </text>

            {/* Port legend */}
            <rect x="300" y="14" width="8" height="8" fill="#64748b" stroke="#fff" strokeWidth="1" />
            <text x="314" y="22" fill={themeStyles.text} fontSize="9.5" fontFamily="system-ui">
              Port
            </text>
          </g>
        </svg>
      </div>

      {/* Bottom Status bar */}
      <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Standard Compliant: UML 2.0 Superstructure Specification
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">
            Click any component or connector line to inspect its contract
          </span>
        </div>
        <div className="text-slate-500 font-mono hidden sm:inline">
          Scale: {Math.round(zoom * 100)}%
        </div>
      </div>
    </div>
  );
};
