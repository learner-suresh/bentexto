import React from 'react';
import { X, Globe, Keyboard, Sparkles } from 'lucide-react';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMMON_EXAMPLES = [
  { eng: 'bristi', ben: 'বৃষ্টি', meaning: 'Rain' },
  { eng: 'jol', ben: 'জল', meaning: 'Water' },
  { eng: 'akash', ben: 'আকাশ', meaning: 'Sky' },
  { eng: 'surjo', ben: 'সূর্য', meaning: 'Sun' },
  { eng: 'manush', ben: 'মানুষ', meaning: 'Human' },
  { eng: 'bhalobasha', ben: 'ভালোবাসা', meaning: 'Love' },
  { eng: 'desh', ben: 'দেশ', meaning: 'Country' },
  { eng: 'nodi', ben: 'নদী', meaning: 'River' },
  { eng: 'pakhi', ben: 'পাখি', meaning: 'Bird' },
  { eng: 'boi', ben: 'বই', meaning: 'Book' },
];

export const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-fade-in">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-[#15213B] border border-[#253556] p-6 text-white shadow-2xl animate-scale-up max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition p-1"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-lg bg-[#0095FF]/20 text-[#0095FF]">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">ভাষা ও টাইপিং পদ্ধতি (Language & Typing)</h3>
            <p className="text-xs text-gray-400">Bentexto-তে ফোনেটিক ও বাংলা টাইপিং</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          {/* Phonetic Highlight */}
          <div className="rounded-xl bg-[#1D2A47] border border-[#2B3E68] p-4">
            <div className="flex items-center gap-2 font-bold text-sm text-[#38BDF8] mb-1.5">
              <Keyboard className="h-4 w-4" />
              <span>সহজ ইংরেজি অক্ষরে লিখুন</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              আপনার আলাদা বাংলা কীবোর্ড থাকার প্রয়োজন নেই! আপনি স্বাভাবিকভাবে যেভাবে মোবাইলে চ্যাট করেন, সেভাবে ইংরেজি বর্ণে লিখলেই তা তাৎক্ষণিকভাবে বাংলায় রূপান্তরিত হবে।
            </p>
          </div>

          {/* Quick Examples Table */}
          <div>
            <h4 className="font-bold text-gray-300 mb-2 flex items-center gap-1.5 text-xs">
              <Sparkles className="h-3.5 w-3.5 text-[#F59E0B]" />
              <span>কিছু সাধারণ উদাহরণ:</span>
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {COMMON_EXAMPLES.map((item) => (
                <div
                  key={item.eng}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#1D2A47] border border-[#293A60]"
                >
                  <div>
                    <span className="font-mono text-[#38BDF8] font-bold">{item.eng}</span>
                    <span className="text-[10px] text-gray-400 block">{item.meaning}</span>
                  </div>
                  <span className="font-['Noto_Serif_Bengali'] font-bold text-base text-white">
                    {item.ben}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Bengali keyboard note */}
          <div className="rounded-lg bg-[#111B30] border border-[#233357] p-3 text-gray-400">
            <p>
              💡 আপনি চাইলে যেকোনো বাংলা কীবোর্ড (অভ্র, গুগল জিবোর্ড, রিদমিক) দিয়েও সরাসরি কপি-পেস্ট বা ইনপুট করতে পারেন।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
