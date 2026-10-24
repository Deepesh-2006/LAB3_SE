import React, { useState } from 'react';
import { WRITTEN_JUSTIFICATION_DOC } from '../data/labData';
import { FileText, Download, Printer, Copy, Check, ShieldCheck, Zap, Layers, Sparkles } from 'lucide-react';

export const JustificationDocument: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);
  const doc = WRITTEN_JUSTIFICATION_DOC;

  const handleCopyMarkdown = () => {
    const markdown = `# ${doc.title}
**Course:** ${doc.course}
**Assigned Scenario:** ${doc.scenario}

---

### Architecture Selection
> **"${doc.mandatorySelectionStatement}"**

### Architectural Choice
**Selected Pattern:** ${doc.architecturalChoice}

---

### Two Scenario-Related Reasons for Selection
1. **${doc.twoReasons[0].title}**
   ${doc.twoReasons[0].description}

2. **${doc.twoReasons[1].title}**
   ${doc.twoReasons[1].description}

---

### Security Advantage
**${doc.securityAdvantage.title}**
${doc.securityAdvantage.description}

---

### Performance Benefit
**${doc.performanceBenefit.title}**
${doc.performanceBenefit.description}

---

### Identified Components & Interface Catalog (Deliverable Mapping)
| Component Name | Architectural Layer | Provided Interfaces (Ball ●) | Required Interfaces (Socket ◗) |
|---|---|---|---|
${doc.componentsSummary.map(c => `| ${c.name} | ${c.layer} | ${c.provided} | ${c.required} |`).join('\n')}
`;

    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadWordDoc = () => {
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <title>${doc.title}</title>
        <style>
          body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.35; color: #111; margin: 1in; }
          h1 { font-size: 18pt; color: #1e3a8a; margin-bottom: 4pt; }
          h2 { font-size: 13pt; color: #1e3a8a; border-bottom: 1.5pt solid #2563eb; padding-bottom: 2pt; margin-top: 14pt; }
          h3 { font-size: 11.5pt; color: #0f172a; margin-top: 8pt; margin-bottom: 2pt; }
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

    const blob = new Blob(['\ufeff', htmlContent], {
      type: 'application/msword'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Lab3_Architecture_Justification_Document.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Action Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div>
          <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider block">
            Deliverable 2 / Written Justification (Max 1 Page)
          </span>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            Formal Architectural Justification Document
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyMarkdown}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied to Clipboard!' : 'Copy Markdown'}
          </button>

          <button
            onClick={handleDownloadWordDoc}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow"
          >
            <Download className="w-3.5 h-3.5" />
            Download Word Doc (.doc)
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / PDF
          </button>
        </div>
      </div>

      {/* The Printable 1-Page Document View */}
      <div className="bg-white text-slate-900 rounded-2xl p-8 sm:p-10 shadow-2xl border border-slate-200 max-w-4xl mx-auto font-sans print:shadow-none print:border-none print:p-0">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-mono font-bold text-blue-800 tracking-wider uppercase block">
                Lab 3 Deliverable Submission
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {doc.title}
              </h1>
            </div>
            <div className="text-right text-xs text-slate-600 font-mono">
              <div>Scenario: {doc.scenario}</div>
              <div>Standard: UML 2.0 / IEEE 1471</div>
            </div>
          </div>
        </div>

        {/* Mandatory Header Required by Lab 3 Handout (Page 7) */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg mb-6">
          <span className="text-xs font-mono font-bold text-blue-900 uppercase block mb-1">
            Required Statement (Handout Page 7):
          </span>
          <p className="text-base font-bold text-blue-950 font-serif italic">
            &ldquo;{doc.mandatorySelectionStatement}&rdquo;
          </p>
        </div>

        {/* Section 1: Architectural Choice */}
        <section className="mb-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            1. Architectural Choice
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            We selected <strong>{doc.architecturalChoice}</strong>. The application is logically structured into three distinct tiers: a <strong>Presentation Layer</strong> (Touchscreen UI Component), a <strong>Business Logic Layer</strong> (Order Manager Component, Payment Service Component, and Receipt Printer Component), and a <strong>Data Layer</strong> (Database Component). This style establishes clear separation of concerns, decouples physical hardware drivers from UI rendering, and ensures autonomous edge execution for standalone kiosks.
          </p>
        </section>

        {/* Section 2: Two Scenario-Related Reasons */}
        <section className="mb-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            2. Two Scenario-Related Reasons
          </h2>
          <div className="space-y-3">
            {doc.twoReasons.map((reason, idx) => (
              <div key={idx} className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <h3 className="text-xs font-bold text-slate-900 mb-1">
                  {reason.title}
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed text-justify">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Security Advantage */}
        <section className="mb-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            3. Security Advantage
          </h2>
          <div className="bg-purple-50/50 p-3.5 rounded-lg border border-purple-200">
            <h3 className="text-xs font-bold text-purple-950 mb-1">
              {doc.securityAdvantage.title}
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed text-justify">
              {doc.securityAdvantage.description}
            </p>
          </div>
        </section>

        {/* Section 4: Performance Benefit */}
        <section className="mb-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600" />
            4. Performance Benefit
          </h2>
          <div className="bg-amber-50/50 p-3.5 rounded-lg border border-amber-200">
            <h3 className="text-xs font-bold text-amber-950 mb-1">
              {doc.performanceBenefit.title}
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed text-justify">
              {doc.performanceBenefit.description}
            </p>
          </div>
        </section>

        {/* Section 5: Component & Interface Specification Table */}
        <section>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">
            5. Component &amp; Interface Specification (5 Components, 4+ Interfaces)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2 border-r border-slate-200">Component Name</th>
                  <th className="p-2 border-r border-slate-200">Layer</th>
                  <th className="p-2 border-r border-slate-200">Provided (Ball ●)</th>
                  <th className="p-2 border-r border-slate-200">Required (Socket ◗)</th>
                  <th className="p-2">Role in Scenario</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {doc.componentsSummary.map((comp, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="p-2 font-bold text-slate-900 border-r border-slate-200">
                      {comp.name}
                    </td>
                    <td className="p-2 font-mono text-[11px] text-slate-600 border-r border-slate-200">
                      {comp.layer}
                    </td>
                    <td className="p-2 font-mono text-[11px] text-blue-700 border-r border-slate-200">
                      {comp.provided}
                    </td>
                    <td className="p-2 font-mono text-[11px] text-emerald-700 border-r border-slate-200">
                      {comp.required}
                    </td>
                    <td className="p-2 text-[11px] text-slate-600">
                      {comp.role}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-500 font-mono">
          <span>Lab 3 Component Modelling &amp; Architectural Pattern Selection</span>
          <span>Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
};
