import React, { useState } from 'react';
import { useKhata } from '../../context/KhataContext';
import { X, CheckSquare, Square, ChevronDown, ChevronUp, RotateCcw, CheckCircle2 } from 'lucide-react';

export const MasterChecklistModal: React.FC = () => {
  const {
    checklist,
    toggleChecklistItem,
    resetChecklistTicks,
    checklistCompletedCount,
    checklistTotalCount,
    closeModal,
  } = useKhata();

  // Track expanded state of sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    checklist.forEach((sec) => {
      init[sec.code] = true;
    });
    return init;
  });

  const toggleSection = (code: string) => {
    setExpandedSections((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  const expandAll = () => {
    const next: Record<string, boolean> = {};
    checklist.forEach((sec) => (next[sec.code] = true));
    setExpandedSections(next);
  };

  const collapseAll = () => {
    const next: Record<string, boolean> = {};
    checklist.forEach((sec) => (next[sec.code] = false));
    setExpandedSections(next);
  };

  const completionPercent = Math.round((checklistCompletedCount / checklistTotalCount) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-[#0e8354] text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-200" />
              <h2 className="text-xl font-bold">Master Feature Checklist</h2>
            </div>
            <p className="text-xs text-emerald-100 mt-0.5">
              Full specification implementation status ({checklistCompletedCount}/{checklistTotalCount} completed)
            </p>
          </div>
          <button
            onClick={closeModal}
            className="p-1 rounded-full text-emerald-100 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress bar & Global Controls */}
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span>Overall Readiness: {completionPercent}%</span>
            <span>
              {checklistCompletedCount} of {checklistTotalCount} features verified
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mb-3">
            <div
              className="bg-[#0e8354] h-full transition-all duration-300"
              style={{ width: `${completionPercent}%` }}
            ></div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={expandAll}
                className="text-[#0e8354] hover:underline font-semibold"
              >
                Expand all
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={collapseAll}
                className="text-slate-600 hover:underline font-medium"
              >
                Collapse all
              </button>
            </div>

            <button
              onClick={resetChecklistTicks}
              className="text-rose-600 hover:text-rose-800 text-xs flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset ticks
            </button>
          </div>
        </div>

        {/* Checklist sections */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-slate-50/50">
          {checklist.map((section) => {
            const isExpanded = !!expandedSections[section.code];
            const sectionCompleted = section.items.filter((i) => i.completed).length;
            const sectionTotal = section.items.length;

            return (
              <div
                key={section.code}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs"
              >
                <div
                  onClick={() => toggleSection(section.code)}
                  className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors select-none"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-800">{section.title}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                      {sectionCompleted} of {sectionTotal} completed
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-100 divide-y divide-slate-100">
                    {section.items.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => toggleChecklistItem(section.code, item.id)}
                        className="px-4 py-2.5 flex items-start gap-3 hover:bg-emerald-50/40 cursor-pointer transition-colors"
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          {item.completed ? (
                            <CheckSquare className="w-5 h-5 text-[#0e8354]" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm font-semibold ${
                                item.completed ? 'text-slate-900' : 'text-slate-700'
                              }`}
                            >
                              {item.title}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              #{item.id}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-slate-200 text-center">
          <button
            onClick={closeModal}
            className="w-full sm:w-auto px-6 py-2 bg-[#0e8354] hover:bg-emerald-700 text-white font-bold rounded-lg text-sm shadow-xs transition-colors"
          >
            Close Checklist
          </button>
        </div>
      </div>
    </div>
  );
};
