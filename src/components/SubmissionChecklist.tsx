import React, { useState } from 'react';
import { CheckCircle2, Circle, AlertCircle, Github, Folder, FileCheck, ArrowRight, ExternalLink } from 'lucide-react';

interface RubricItem {
  id: string;
  category: string;
  requirement: string;
  handoutReference: string;
  verifiedInApp: boolean;
  notes: string;
}

const RUBRIC_ITEMS: RubricItem[] = [
  {
    id: 'req_5_comp',
    category: 'Diagram Deliverable',
    requirement: 'At least 5 components modeled with proper notation',
    handoutReference: 'Page 5: Deliverables - "Your diagram must include atleast 5 components"',
    verifiedInApp: true,
    notes: 'Modeled: 1. Order Manager, 2. Payment Service, 3. Touchscreen UI, 4. Receipt Printer, 5. Database Component.'
  },
  {
    id: 'req_4_iface',
    category: 'Diagram Deliverable',
    requirement: 'At least 4 interfaces between components',
    handoutReference: 'Page 6: "Show atleast 4 interfaces between components"',
    verifiedInApp: true,
    notes: 'Modeled: 1. IOrderPlacement, 2. IPaymentProcessing, 3. IReceiptPrint, 4. IMenuCatalog, 5. IDataStore.'
  },
  {
    id: 'req_ball_socket',
    category: 'Notation Compliance',
    requirement: 'Proper UML Ball (Provided) and Socket (Required) notation',
    handoutReference: 'Page 2 & 6: "Provided Interface (Ball) & Required Interface (Socket notation)"',
    verifiedInApp: true,
    notes: 'Standard UML 2.0 assembly connectors with solid service lines and boundary ports.'
  },
  {
    id: 'req_stereotype',
    category: 'Notation Compliance',
    requirement: '<<component>> stereotype & UML component icon',
    handoutReference: 'Page 2: "Represented as rectangle with <<component>> stereotype & upper-right icon"',
    verifiedInApp: true,
    notes: 'Rectangles branded with <<component>> and dual-tab component icon.'
  },
  {
    id: 'req_mandatory_quote',
    category: 'Written Justification',
    requirement: 'Mandatory Selection Phrase verbatim in document',
    handoutReference: 'Page 7: Architecture Selection: "We chose [Architecture] for the <Assigned> System."',
    verifiedInApp: true,
    notes: 'Verbatim: "We chose Layered Architecture for the Self-Service Coffee Kiosk System."'
  },
  {
    id: 'req_two_reasons',
    category: 'Written Justification',
    requirement: 'Two specific scenario-related reasons for chosen architecture',
    handoutReference: 'Page 7: "Two Reasons: Provide two specific, scenario-related reasons"',
    verifiedInApp: true,
    notes: 'Reason 1: Hardware abstraction for touch/printer/card reader. Reason 2: Offline high-throughput café queues.'
  },
  {
    id: 'req_security',
    category: 'Written Justification',
    requirement: 'Concrete Security Advantage explained',
    handoutReference: 'Page 7: "Security Advantage: Explain one way your architecture addresses security concerns"',
    verifiedInApp: true,
    notes: 'PCI-DSS hardware sandboxing isolating card reader and presentation tier from plaintext data.'
  },
  {
    id: 'req_performance',
    category: 'Written Justification',
    requirement: 'Concrete Performance Benefit explained',
    handoutReference: 'Page 7: "Performance Benefit: Describe one performance advantage"',
    verifiedInApp: true,
    notes: 'In-memory menu catalog cache (<1ms response) and asynchronous thermal print job spooling.'
  },
  {
    id: 'req_export_ready',
    category: 'Submission Format',
    requirement: 'Export diagram as PNG/PDF & document as Word/PDF',
    handoutReference: 'Page 8: "Export as PNG or PDF, Save justification document as PDF/Word"',
    verifiedInApp: true,
    notes: 'One-click PNG, SVG, Draw.io XML, Word (.doc), and printable PDF downloads available.'
  }
];

export const SubmissionChecklist: React.FC = () => {
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>(
    RUBRIC_ITEMS.reduce((acc, item) => ({ ...acc, [item.id]: true }), {})
  );

  const toggleItem = (id: string) => {
    setCompletedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(completedItems).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / RUBRIC_ITEMS.length) * 100);

  return (
    <div className="space-y-6">
      {/* Progress Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">
              Deliverable Verification &amp; Grading Rubric
            </span>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              Lab 3 Submission Readiness Scorecard
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {completedCount} / {RUBRIC_ITEMS.length}
              </div>
              <div className="text-[11px] text-slate-400">Criteria Satisfied</div>
            </div>
            <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 font-mono text-sm">
              {progressPercent}%
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Rubric Criteria Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-white mb-2">
          Handout Requirements Compliance Matrix
        </h3>
        <div className="space-y-2.5">
          {RUBRIC_ITEMS.map(item => {
            const isDone = completedItems[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                  isDone
                    ? 'bg-slate-950/70 border-emerald-500/30 hover:border-emerald-500/50'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button className="mt-0.5 text-emerald-400">
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-600" />
                    )}
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {item.category}
                      </span>
                      <h4 className="text-xs font-bold text-white">
                        {item.requirement}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 italic">
                      {item.handoutReference}
                    </p>
                    <p className="text-xs text-emerald-300/90 mt-1 font-mono">
                      ✓ {item.notes}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* GitHub Repo Submission Guide (Handout Page 8) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <Github className="w-5 h-5 text-white" />
          <h3 className="text-sm font-bold text-white">
            GitHub Repository Submission Structure (Handout Page 8)
          </h3>
        </div>
        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          The handout specifies submitting your files through your course GitHub repository under the designated directory structure (e.g. <code>Lab3</code> under <code>SELABS</code>).
        </p>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-1.5">
          <div className="flex items-center gap-2 text-blue-400 font-bold">
            <Folder className="w-4 h-4" />
            <span>SELABS/</span>
          </div>
          <div className="flex items-center gap-2 pl-4 text-emerald-400 font-bold">
            <Folder className="w-4 h-4" />
            <span>Lab3/</span>
          </div>
          <div className="flex items-center gap-2 pl-8 text-slate-300">
            <span className="text-slate-500">├──</span>
            <span className="text-amber-300">Lab3_CoffeeKiosk_ComponentDiagram.png</span>
            <span className="text-slate-500 text-[11px]">(Deliverable 1: PNG export)</span>
          </div>
          <div className="flex items-center gap-2 pl-8 text-slate-300">
            <span className="text-slate-500">├──</span>
            <span className="text-blue-300">Lab3_CoffeeKiosk_ComponentDiagram.drawio</span>
            <span className="text-slate-500 text-[11px]">(Draw.io source file)</span>
          </div>
          <div className="flex items-center gap-2 pl-8 text-slate-300">
            <span className="text-slate-500">└──</span>
            <span className="text-purple-300">Lab3_Architecture_Justification_Document.doc</span>
            <span className="text-slate-500 text-[11px]">(Deliverable 2: Word/PDF)</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-950/40 border border-blue-500/20 rounded-xl text-xs text-blue-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <span>
            Tip: You can download all 3 files directly from the toolbar above and commit them into your repository using: <code className="bg-slate-900 px-1.5 py-0.5 rounded text-white font-mono">git add SELABS/Lab3/ && git commit -m &quot;Complete Lab 3 UML Component Modeling &amp; Justification&quot; && git push</code>
          </span>
        </div>
      </div>
    </div>
  );
};
