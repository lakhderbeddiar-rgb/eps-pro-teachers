import React, { useState, useRef } from 'react';
import { Plus, Trash2, Printer, RotateCcw, Download, Move } from 'lucide-react';
import { TacticalElement } from '../types';

type SportCourtType = 'handball' | 'basketball' | 'football' | 'volleyball' | 'athletics';

export const TacticalBoard: React.FC = () => {
  const [courtType, setCourtType] = useState<SportCourtType>('handball');
  const [elements, setElements] = useState<TacticalElement[]>([
    { id: '1', type: 'player_team_a', x: 25, y: 50, label: '1' },
    { id: '2', type: 'player_team_a', x: 40, y: 30, label: '2' },
    { id: '3', type: 'player_team_a', x: 40, y: 70, label: '3' },
    { id: '4', type: 'player_team_b', x: 60, y: 40, label: 'A' },
    { id: '5', type: 'player_team_b', x: 60, y: 60, label: 'B' },
    { id: '6', type: 'ball', x: 28, y: 50 },
    { id: '7', type: 'cone', x: 50, y: 25 },
    { id: '8', type: 'cone', x: 50, y: 75 },
  ]);

  const [activeDraggingId, setActiveDraggingId] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  // Dragging logic
  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    setActiveDraggingId(id);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!activeDraggingId || !boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const x = Math.max(2, Math.min(98, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(2, Math.min(98, ((e.clientY - rect.top) / rect.height) * 100));

    setElements((prev) =>
      prev.map((el) => (el.id === activeDraggingId ? { ...el, x, y } : el))
    );
  };

  const handlePointerUp = () => {
    setActiveDraggingId(null);
  };

  const handleAddElement = (type: TacticalElement['type']) => {
    const nextNum = elements.filter((e) => e.type === type).length + 1;
    const newEl: TacticalElement = {
      id: `el-${Date.now()}`,
      type,
      x: 50 + (Math.random() * 10 - 5),
      y: 50 + (Math.random() * 10 - 5),
      label: type === 'player_team_a' ? `${nextNum}` : type === 'player_team_b' ? `${String.fromCharCode(64 + nextNum)}` : undefined,
    };
    setElements([...elements, newEl]);
  };

  const handleClearElements = () => {
    if (confirm('هل ترغب في تفريغ عناصر الملعب بالكامل؟')) {
      setElements([]);
    }
  };

  const handleResetCourt = () => {
    setElements([
      { id: '1', type: 'player_team_a', x: 25, y: 50, label: '1' },
      { id: '2', type: 'player_team_a', x: 40, y: 30, label: '2' },
      { id: '3', type: 'player_team_a', x: 40, y: 70, label: '3' },
      { id: '4', type: 'player_team_b', x: 60, y: 40, label: 'A' },
      { id: '5', type: 'player_team_b', x: 60, y: 60, label: 'B' },
      { id: '6', type: 'ball', x: 28, y: 50 },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Screen Toolbar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              السبورة التكتيكية التفاعلية (Tactical Field Board)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              رسم الخطط التكتيكية، توجيه اللاعبين، ووضع الأدوات (أقماع، حواجز، كرات) بالسحب والإفلات.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleResetCourt}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة ضبط التشكيل</span>
            </button>

            <button
              onClick={handleClearElements}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200"
            >
              <Trash2 className="w-4 h-4" />
              <span>تفريغ الملعب</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة المخطط التكتيكي</span>
            </button>
          </div>
        </div>

        {/* Court Type Switcher & Add Tools */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            {(
              [
                { id: 'handball', label: 'كرة اليد' },
                { id: 'basketball', label: 'كرة السلة' },
                { id: 'football', label: 'كرة القدم' },
                { id: 'volleyball', label: 'الكرة الطائرة' },
                { id: 'athletics', label: 'المضمار والساحة' },
              ] as const
            ).map((c) => (
              <button
                key={c.id}
                onClick={() => setCourtType(c.id)}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  courtType === c.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Add Elements palette */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="font-bold text-slate-500">إضافة عنصر:</span>
            <button
              onClick={() => handleAddElement('player_team_a')}
              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-md font-bold transition-colors"
            >
              + لاعب أحمر (أ)
            </button>
            <button
              onClick={() => handleAddElement('player_team_b')}
              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-md font-bold transition-colors"
            >
              + مدافع أزرق (ب)
            </button>
            <button
              onClick={() => handleAddElement('ball')}
              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-md font-bold transition-colors"
            >
              + كرة ⚽
            </button>
            <button
              onClick={() => handleAddElement('cone')}
              className="px-2.5 py-1 bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 rounded-md font-bold transition-colors"
            >
              + قمع تدريب 🔺
            </button>
          </div>
        </div>
      </div>

      {/* The Interactive Court SVG Canvas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-4 flex flex-col items-center">
        <div
          ref={boardRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative w-full aspect-16/10 max-w-4xl bg-emerald-800 rounded-xl overflow-hidden shadow-inner select-none cursor-crosshair touch-none border-4 border-slate-800"
        >
          {/* Vector Court Markings */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer border line */}
            <rect x="2%" y="2%" width="96%" height="96%" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" />

            {/* Center line */}
            <line x1="50%" y1="2%" x2="50%" y2="98%" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeDasharray={courtType === 'athletics' ? '4 4' : 'none'} />

            {/* Center circle */}
            {courtType !== 'volleyball' && (
              <circle cx="50%" cy="50%" r="14%" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
            )}

            {/* Handball specific (6m and 9m arcs) */}
            {courtType === 'handball' && (
              <>
                {/* Left 6m area */}
                <path d="M 2% 25% Q 20% 50% 2% 75%" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" />
                {/* Left 9m dashed arc */}
                <path d="M 2% 16% Q 28% 50% 2% 84%" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeDasharray="6 6" />

                {/* Right 6m area */}
                <path d="M 98% 25% Q 80% 50% 98% 75%" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" />
                {/* Right 9m dashed arc */}
                <path d="M 98% 16% Q 72% 50% 98% 84%" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeDasharray="6 6" />
              </>
            )}

            {/* Basketball specific keys */}
            {courtType === 'basketball' && (
              <>
                <rect x="2%" y="35%" width="18%" height="30%" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
                <path d="M 2% 15% Q 30% 50% 2% 85%" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
                <rect x="80%" y="35%" width="18%" height="30%" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
                <path d="M 98% 15% Q 70% 50% 98% 85%" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
              </>
            )}

            {/* Football penalty boxes */}
            {courtType === 'football' && (
              <>
                <rect x="2%" y="25%" width="16%" height="50%" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
                <rect x="82%" y="25%" width="16%" height="50%" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
              </>
            )}

            {/* Athletics Track lanes */}
            {courtType === 'athletics' && (
              <>
                <rect x="6%" y="6%" width="88%" height="88%" rx="20%" ry="20%" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                <rect x="10%" y="10%" width="80%" height="80%" rx="18%" ry="18%" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                <rect x="14%" y="14%" width="72%" height="72%" rx="16%" ry="16%" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
              </>
            )}
          </svg>

          {/* Interactive Draggable Elements */}
          {elements.map((el) => {
            const isSelected = activeDraggingId === el.id;

            return (
              <div
                key={el.id}
                onPointerDown={(e) => handlePointerDown(el.id, e)}
                style={{
                  left: `${el.x}%`,
                  top: `${el.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute cursor-grab active:cursor-grabbing transition-transform ${
                  isSelected ? 'scale-125 z-30' : 'z-20 hover:scale-110'
                }`}
              >
                {el.type === 'player_team_a' && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-md">
                    {el.label || 'A'}
                  </div>
                )}

                {el.type === 'player_team_b' && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-md">
                    {el.label || 'B'}
                  </div>
                )}

                {el.type === 'ball' && (
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-400 text-slate-900 font-bold text-[10px] flex items-center justify-center border-2 border-slate-900 shadow-md">
                    ⚽
                  </div>
                )}

                {el.type === 'cone' && (
                  <div className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 flex items-center justify-center font-bold text-sm filter drop-shadow-md">
                    ▲
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-xs text-slate-500 mt-3 text-center no-print">
          💡 يمكنك سحب أي لاعب أو كرة أو قمع وتحريكه في أي مكان على أرضية الملعب لتوضيح الوضعيات التكتيكية للتلاميذ.
        </p>
      </div>
    </div>
  );
};
