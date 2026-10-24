import React, { useState } from 'react';
import { UML_COMPONENTS, UML_INTERFACES, WRITTEN_JUSTIFICATION_DOC } from './data/labData';
import { UMLComponent, UMLInterface, SimulationStep } from './types/architecture';
import { DiagramCanvas } from './components/DiagramCanvas';
import { KioskSimulator } from './components/KioskSimulator';
import { ComponentInspector } from './components/ComponentInspector';
import { JustificationDocument } from './components/JustificationDocument';
import { ArchitectureComparison } from './components/ArchitectureComparison';
import { SubmissionChecklist } from './components/SubmissionChecklist';
import { exportSVGAsPNG, exportSVGDirect, exportDrawIO } from './utils/exportUtils';
import { 
  Coffee, 
  Layers, 
  FileText, 
  CheckSquare, 
  Download, 
  BookOpen, 
  Palette, 
  ExternalLink,
  ChevronDown,
  Sparkles,
  Info,
  ShieldCheck,
  FileCode2,
  Printer
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'diagram' | 'justification' | 'comparison' | 'rubric'>('diagram');
  const [selectedComponent, setSelectedComponent] = useState<UMLComponent | null>(UML_COMPONENTS[1]); // default Order Manager
  const [selectedInterface, setSelectedInterface] = useState<UMLInterface | null>(null);
  const [simulationStep, setSimulationStep] = useState<SimulationStep>('idle');
  const [theme, setTheme] = useState<'blueprint' | 'academic' | 'dark'>('blueprint');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);
  const [showHandoutModal, setShowHandoutModal] = useState<boolean>(false);

  const handleSelectComponent = (comp: UMLComponent | null) => {
    setSelectedComponent(comp);
    setSelectedInterface(null);
  };

  const handleSelectInterface = (iface: UMLInterface | null) => {
    setSelectedInterface(iface);
    setSelectedComponent(null);
  };

  const handleDownloadPNG = async () => {
    setIsExporting(true);
    await exportSVGAsPNG('uml-coffee-kiosk-svg', 'Lab3_CoffeeKiosk_ComponentDiagram.png');
    setIsExporting(false);
    setShowExportMenu(false);
  };

  const handleDownloadSVG = () => {
    exportSVGDirect('uml-coffee-kiosk-svg', 'Lab3_CoffeeKiosk_ComponentDiagram.svg');
    setShowExportMenu(false);
  };

  const handleDownloadDrawIO = () => {
    exportDrawIO('Lab3_CoffeeKiosk_ComponentDiagram.drawio');
    setShowExportMenu(false);
  };

  const handleDownloadWordDoc = () => {
    const doc = WRITTEN_JUSTIFICATION_DOC;
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <title>${doc.title}</title>
        <style>
          body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.35; color: #111; margin: 1in; }
          h1 { font-size: 18pt; color: #1e3a8a; margin-bottom: 4pt; }
          h2 { font-size: 13pt; color: #1e3a8a; border-bottom: 1.5pt solid #2563eb; padding-bottom: 2pt; margin-top: 14pt; }
          h3 { font-size: 11pt; color: #0f172a; margin-top: 8pt; margin-bottom: 2pt; }
          p { margin-top: 2pt; margin-bottom: 6pt; text-align: justify; }
          .quote-box { background-color: #eff6ff; border-left: 4pt solid #2563eb; padding: 8pt 12pt; font-weight: bold; font-size: 11.5pt; color: #1e3a8a; margin: 10pt 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 8pt; font-size: 9.5pt; }
          th { background-color: #1e3a8a; color: white; border: 1pt solid #cbd5e1; padding: 5pt; text-align: left; }
          td { border: 1pt solid #cbd5e1; padding: 4pt 6pt; }
          tr:nth-child(even) { background-color: #f8fafc; }
        </style>
      </head>
      <body>
        <h1>${doc.title}</h1>
        <p><strong>Course:</strong> ${doc.course} | <strong>Scenario:</strong> ${doc.scenario} | <strong>Deliverable:</strong> Lab 3 Justification</p>
        <hr/>
        <div class="quote-box">
          Architecture Selection: &ldquo;${doc.mandatorySelectionStatement}&rdquo;
        </div>
        <h2>1. Architectural Choice</h2>
        <p><strong>Selected Architecture:</strong> ${doc.architecturalChoice}</p>
        <h2>2. Two Scenario-Related Reasons for Selection</h2>
        <h3>Reason 1: ${doc.twoReasons[0].title}</h3>
        <p>${doc.twoReasons[0].description}</p>
        <h3>Reason 2: ${doc.twoReasons[1].title}</h3>
        <p>${doc.twoReasons[1].description}</p>
        <h2>3. Security Advantage</h2>
        <p><strong>${doc.securityAdvantage.title}:</strong> ${doc.securityAdvantage.description}</p>
        <h2>4. Performance Benefit</h2>
        <p><strong>${doc.performanceBenefit.title}:</strong> ${doc.performanceBenefit.description}</p>
        <h2>5. Identified Components &amp; Interface Specification</h2>
        <table>
          <thead>
            <tr>
              <th>Component Name</th>
              <th>Layer</th>
              <th>Provided Interfaces (Ball)</th>
              <th>Required Interfaces (Socket)</th>
              <th>Key Responsibility</th>
            </tr>
          </thead>
          <tbody>
            ${doc.componentsSummary.map(c => `
              <tr>
                <td><strong>${c.name}</strong></td>
                <td>${c.layer}</td>
                <td>${c.provided}</td>
                <td>${c.required}</td>
                <td>${c.role}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Lab3_Architecture_Justification_Document.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo and Lab Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 p-0.5 shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Coffee className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
                  LAB 3
                </span>
                <h1 className="text-sm font-extrabold text-white tracking-tight">
                  Component Modelling &amp; Architectural Pattern Studio
                </h1>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Assigned Scenario: <span className="text-amber-300 font-medium">Self-Service Coffee Kiosk System</span> (Café Touchscreen, Card Reader, Thermal Printer)
              </p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            {/* Handout PDF button */}
            <button
              onClick={() => setShowHandoutModal(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 hidden md:flex"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>Lab Handout</span>
            </button>

            {/* Theme switcher */}
            <div className="flex bg-slate-800 p-0.5 rounded-xl border border-slate-700 text-xs hidden lg:flex">
              <button
                onClick={() => setTheme('blueprint')}
                className={`px-2.5 py-1 rounded-lg transition ${theme === 'blueprint' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                title="Blueprint Theme (Modern Blue)"
              >
                Blueprint
              </button>
              <button
                onClick={() => setTheme('academic')}
                className={`px-2.5 py-1 rounded-lg transition ${theme === 'academic' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                title="Academic Theme (Handout Ivory)"
              >
                Academic
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-2.5 py-1 rounded-lg transition ${theme === 'dark' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                title="Dark Theme"
              >
                Dark
              </button>
            </div>

            {/* Quick Export Deliverables Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Deliverables</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 text-xs space-y-1 animate-in fade-in slide-in-from-top-2">
                  <div className="px-2 py-1 text-[10px] font-mono text-slate-400 uppercase font-bold">
                    Deliverable 1: Component Diagram
                  </div>
                  <button
                    onClick={handleDownloadPNG}
                    disabled={isExporting}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center justify-between transition"
                  >
                    <span className="font-semibold">Download Diagram (PNG)</span>
                    <span className="font-mono text-[10px] bg-slate-800 text-blue-400 px-1.5 py-0.5 rounded">.png</span>
                  </button>
                  <button
                    onClick={handleDownloadSVG}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center justify-between transition"
                  >
                    <span className="font-semibold">Download Vector (SVG)</span>
                    <span className="font-mono text-[10px] bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded">.svg</span>
                  </button>
                  <button
                    onClick={handleDownloadDrawIO}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center justify-between transition"
                  >
                    <span className="font-semibold">Export to Draw.io (XML)</span>
                    <span className="font-mono text-[10px] bg-slate-800 text-purple-400 px-1.5 py-0.5 rounded">.drawio</span>
                  </button>

                  <div className="h-px bg-slate-800 my-1"></div>

                  <div className="px-2 py-1 text-[10px] font-mono text-slate-400 uppercase font-bold">
                    Deliverable 2: Written Document
                  </div>
                  <button
                    onClick={handleDownloadWordDoc}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center justify-between transition"
                  >
                    <span className="font-semibold">Download Word Document</span>
                    <span className="font-mono text-[10px] bg-slate-800 text-amber-400 px-1.5 py-0.5 rounded">.doc</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('justification');
                      setShowExportMenu(false);
                      setTimeout(() => window.print(), 300);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center justify-between transition"
                  >
                    <span className="font-semibold">Print to PDF</span>
                    <span className="font-mono text-[10px] bg-slate-800 text-rose-400 px-1.5 py-0.5 rounded">PDF</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 overflow-x-auto border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('diagram')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'diagram'
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Interactive UML Diagram &amp; Kiosk Simulator</span>
            <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px]">Deliverable 1</span>
          </button>

          <button
            onClick={() => setActiveTab('justification')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'justification'
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Written Justification Document</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">Deliverable 2</span>
          </button>

          <button
            onClick={() => setActiveTab('comparison')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'comparison'
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            <span>Architectural Style Analysis</span>
            <span className="text-slate-500 text-[10px] hidden sm:inline">Step 2</span>
          </button>

          <button
            onClick={() => setActiveTab('rubric')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'rubric'
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Rubric &amp; GitHub Submission</span>
            <span className="text-slate-500 text-[10px] hidden sm:inline">Step 6</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'diagram' && (
          <div className="space-y-6">
            {/* Context callout & Quick Download Hub */}
            <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-500/30 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <span>Lab 3 Deliverables Hub: Self-Service Coffee Kiosk</span>
                      <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                        100% READY FOR SUBMISSION
                      </span>
                    </h2>
                    <p className="text-xs text-slate-300">
                      Standard UML 2.0 Component Model (5 Components • 4+ Ball-and-Socket Interfaces • 3-Tier Layered Architecture)
                    </p>
                  </div>
                </div>

                {/* Direct 1-Click Download Buttons for the Main Files */}
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href="/downloads/Lab3_CoffeeKiosk_ComponentDiagram.png"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDownloadPNG();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-900/30 cursor-pointer"
                    title="Download Component Diagram (PNG)"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Diagram (PNG)</span>
                  </a>

                  <a
                    href="/downloads/Lab3_Architecture_Justification_Document.doc"
                    download="Lab3_Architecture_Justification_Document.doc"
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-blue-900/30"
                    title="Download 1-Page Written Justification (Word .doc)"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Download Word Document (.doc)</span>
                  </a>

                  <a
                    href="/downloads/Lab3_CoffeeKiosk_ComponentDiagram.drawio"
                    download="Lab3_CoffeeKiosk_ComponentDiagram.drawio"
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition flex items-center gap-1.5"
                    title="Download Draw.io XML Project File"
                  >
                    <FileCode2 className="w-4 h-4 text-purple-400" />
                    <span>Draw.io (.drawio)</span>
                  </a>
                </div>
              </div>

              {/* Quick instructions strip */}
              <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800 gap-2">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <strong>Deliverable 1:</strong> Component Diagram (PNG/Draw.io) &nbsp;•&nbsp; 
                  <strong>Deliverable 2:</strong> Written Justification Document (.doc/PDF)
                </span>
                <span className="text-slate-500 font-mono">
                  Target repo path: SELABS/Lab3/
                </span>
              </div>
            </div>

            {/* Diagram Canvas */}
            <DiagramCanvas
              selectedComponent={selectedComponent}
              selectedInterface={selectedInterface}
              onSelectComponent={handleSelectComponent}
              onSelectInterface={handleSelectInterface}
              simulationStep={simulationStep}
              theme={theme}
            />

            {/* Lower Grid: Simulator & Component Inspector */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Simulator (7 cols) */}
              <div className="lg:col-span-7">
                <KioskSimulator
                  simulationStep={simulationStep}
                  setSimulationStep={setSimulationStep}
                  onComponentFocus={(id) => {
                    const comp = UML_COMPONENTS.find(c => c.id === id);
                    if (comp) handleSelectComponent(comp);
                  }}
                />
              </div>

              {/* Inspector (5 cols) */}
              <div className="lg:col-span-5">
                <ComponentInspector
                  component={selectedComponent}
                  selectedInterface={selectedInterface}
                  onClose={() => {
                    setSelectedComponent(null);
                    setSelectedInterface(null);
                  }}
                  onSelectComponent={handleSelectComponent}
                  allComponents={UML_COMPONENTS}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'justification' && (
          <JustificationDocument />
        )}

        {activeTab === 'comparison' && (
          <ArchitectureComparison />
        )}

        {activeTab === 'rubric' && (
          <SubmissionChecklist />
        )}
      </main>

      {/* Handout Reference Modal */}
      {showHandoutModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white text-sm">
                  Lab 3 Student Handout Reference Guide
                </h3>
              </div>
              <button
                onClick={() => setShowHandoutModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono px-2 py-1 rounded bg-slate-800"
              >
                ✕ Close
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <h4 className="font-bold text-amber-300 text-xs mb-1">Assigned Scenario (Page 5)</h4>
                <p>
                  Designing the software architecture for a <strong>Self-Service Coffee Kiosk system</strong> in a busy café:
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-300">
                  <li>Customers can select from 3 coffee types (Espresso, Americano, Latte)</li>
                  <li>Customers can choose from 2 drink sizes (Small, Large)</li>
                  <li>Customers can pay via credit card only</li>
                  <li>System prints receipts with order details</li>
                  <li>Constraints: Touch screen interface, receipt printer hardware, menu and pricing storage</li>
                </ul>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <h4 className="font-bold text-blue-300 text-xs mb-1">Deliverables Required (Pages 5 &amp; 6)</h4>
                <ol className="list-decimal pl-5 space-y-1.5 text-slate-300">
                  <li>
                    <strong>Component Diagram (PNG or PDF):</strong>
                    <ul className="list-disc pl-4 mt-0.5 text-slate-400">
                      <li>Must include at least 5 components (Order Manager and Payment Service given; remaining 3 identified: Touchscreen UI, Receipt Printer, Database)</li>
                      <li>Must show at least 4 interfaces between components with proper UML ball and socket notation</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Written Justification (Word document / PDF, max 1 page):</strong>
                    <ul className="list-disc pl-4 mt-0.5 text-slate-400">
                      <li>Must start with: <em>&ldquo;We chose [Architecture] for the &lt;Assigned&gt; System.&rdquo;</em></li>
                      <li>Architectural Choice, Two Scenario-Related Reasons, Security Advantage, Performance Benefit</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Submission:</strong> Submit diagram and justification document through course GitHub repo (e.g. <code>SELABS/Lab3/</code>).
                  </li>
                </ol>
              </div>

              <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 rounded-xl text-emerald-300 text-[11px] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>All deliverables are 100% completed and exportable in this application suite.</span>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowHandoutModal(false)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
              >
                Understood, Return to Studio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Lab 3: Component Modelling &amp; Architectural Pattern Selection • Self-Service Coffee Kiosk System</span>
          <span className="font-mono text-[11px] text-slate-400">UML 2.0 Superstructure • IEEE 1471 Recommended Practice</span>
        </div>
      </footer>
    </div>
  );
}
