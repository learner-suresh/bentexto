import React from 'react';
import { X, Calendar, CheckCircle, ChevronRight, Play } from 'lucide-react';
import { getPastDaysList, toBengaliDigits, WeekDayInfo } from '../utils/dateAndStreak';

interface PreviousGamesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGame: (dayNumber: number, dateKey: string) => void;
  currentDayNumber: number;
}

export const PreviousGamesModal: React.FC<PreviousGamesModalProps> = ({
  isOpen,
  onClose,
  onSelectGame,
  currentDayNumber,
}) => {
  if (!isOpen) return null;

  const pastDays: WeekDayInfo[] = getPastDaysList(21); // Last 3 weeks

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-fade-in">
      <div
        className="relative w-full max-w-md max-h-[85vh] flex flex-col rounded-2xl bg-[#15213B] border border-[#253556] text-white shadow-2xl overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#253556]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#0095FF]/20 text-[#0095FF]">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">পূর্ববর্তী খেলাসমূহ (Previous Games)</h3>
              <p className="text-xs text-gray-400">যে কোনো অতীত দিনের শব্দ সমাধান করুন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition p-1"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable list */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {pastDays.map((day) => {
            const isSelectedToday = day.dayNumber === currentDayNumber;

            return (
              <div
                key={day.dateKey}
                onClick={() => {
                  onSelectGame(day.dayNumber, day.dateKey);
                  onClose();
                }}
                className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer ${
                  isSelectedToday
                    ? 'bg-[#0095FF]/15 border-[#0095FF]/50 hover:bg-[#0095FF]/25'
                    : 'bg-[#1D2A47] border-[#293A60] hover:border-[#0095FF]/60 hover:bg-[#233357]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center font-bold text-xs ${
                      day.isSolved
                        ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40'
                        : isSelectedToday
                        ? 'bg-[#0095FF] text-white'
                        : 'bg-[#26375E] text-gray-300'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-semibold">{day.dayName}</span>
                    <span className="text-sm font-bold">{day.dayOfMonth}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">
                        খেলা #{toBengaliDigits(day.dayNumber)}
                      </span>
                      {day.isToday && (
                        <span className="rounded bg-[#0095FF]/30 px-1.5 py-0.2 text-[10px] font-bold text-[#38BDF8]">
                          আজ (Today)
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 font-mono">
                      {day.formattedDate}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {day.isSolved ? (
                    <span className="flex items-center gap-1 text-xs text-[#10B981] font-semibold bg-[#10B981]/15 px-2 py-1 rounded-md">
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>সমাধান</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#0095FF] hover:bg-[#0082E6] text-xs font-bold text-white shadow-xs transition"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      <span>খেলুন</span>
                    </button>
                  )}
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#111B30] border-t border-[#253556] text-center text-xs text-gray-400">
          প্রতিটি দিনের জন্য আলাদা শব্দ সংরক্ষিত থাকে।
        </div>
      </div>
    </div>
  );
};
