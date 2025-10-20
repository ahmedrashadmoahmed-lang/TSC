import React from 'react';
import Modal from '../shared/Modal';
import { Icon } from '../shared/Icon';

interface AiSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: string;
  isLoading: boolean;
}

const AiSummaryModal: React.FC<AiSummaryModalProps> = ({ isOpen, onClose, summary, isLoading }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ملخص وتحليل الذكاء الاصطناعي">
      <div className="min-h-[200px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Icon name="ai" className="w-12 h-12 text-indigo-500 animate-pulse" />
            <p className="mt-4 text-slate-600">...جاري تحليل الفواتير المتأخرة</p>
          </div>
        ) : (
          <div className="text-slate-700 whitespace-pre-wrap leading-relaxed">
            {summary}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AiSummaryModal;