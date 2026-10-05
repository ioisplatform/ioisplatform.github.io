import React from 'react';
import { X, FileCheck2 } from 'lucide-react';
import { StudentHomeworkSystem } from './StudentHomeworkSystem';

interface HomeworkModalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  planId?: string;
}

export const HomeworkModalDialog: React.FC<HomeworkModalDialogProps> = ({
  isOpen,
  onClose,
  planId = 'plan-01'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-2 border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col font-sans">
        
        {/* Top Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-emerald-700 flex items-center justify-center shadow font-black">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-200 block">
                Daily Homework & Verification
              </span>
              <h3 className="text-base sm:text-lg font-black leading-tight">
                दैनिक गृहकार्य चेकिंग
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50">
          <StudentHomeworkSystem
            planId={planId}
            planNumber={1}
            planName="Bal Vikas Access"
          />
        </div>

      </div>
    </div>
  );
};
