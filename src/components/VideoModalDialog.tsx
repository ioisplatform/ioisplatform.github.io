import React from 'react';
import { X, Tv } from 'lucide-react';
import { VideoClassesAndLabsHub } from './VideoClassesAndLabsHub';

interface VideoModalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  planId?: string;
}

export const VideoModalDialog: React.FC<VideoModalDialogProps> = ({
  isOpen,
  onClose,
  planId = 'plan-01'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-[#f8fafc] rounded-3xl shadow-2xl border-2 border-slate-300 overflow-hidden my-auto max-h-[94vh] flex flex-col font-sans">
        
        {/* Content Body */}
        <div className="p-3 sm:p-6 overflow-y-auto flex-1">
          <VideoClassesAndLabsHub
            initialTab="ncert"
            onClose={onClose}
          />
        </div>

      </div>
    </div>
  );
};
