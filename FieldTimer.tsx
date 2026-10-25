import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag, Volume2, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { fieldAudio } from '../utils/audioWhistle';

interface LapRecord {
  id: string;
  lapNumber: number;
  timeMs: number;
  formattedTime: string;
  label?: string;
}

export const FieldTimer: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'stopwatch' | 'interval'>('stopwatch');

  // --- Stopwatch States ---
  const [swTime, setSwTime] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const [laps, setLaps] = useState<LapRecord[]>([]);
  const swIntervalRef = useRef<any>(null);

  useEffect(() => {
    if (swRunning) {
      const startTime = Date.now() - swTime;
      swIntervalRef.current = setInterval(() => {
        setSwTime(Date.now() - startTime);
      }, 30);
    } else {
      if (swIntervalRef.current) clearInterval(swIntervalRef.current);
    }
    return () => {
      if (swIntervalRef.current) clearInterval(swIntervalRef.current);
    };
  }, [swRunning]);

  const formatStopwatch = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(
      centiseconds
    ).padStart(2, '0')}`;
  };

  const handleStartStopwatch = () => {
    if (!swRunning) {
      fieldAudio.playWhistle(0.4);
    }
    setSwRunning(!swRunning);
  };

  const handleResetStopwatch = () => {
    setSwRunning(false);
    setSwTime(0);
    setLaps([]);
  };

  const handleRecordLap = () => {
    if (!swRunning && swTime === 0) return;
    const newLap: LapRecord = {
      id: `lap-${Date.now()}`,
      lapNumber: laps.length + 1,
      timeMs: swTime,
      formattedTime: formatStopwatch(swTime),
      label: `تلميذ ${laps.length + 1}`,
    };
    setLaps([newLap, ...laps]);
  };

  const handleUpdateLapLabel = (id: string, text: string) => {
    setLaps(laps.map((l) => (l.id === id ? { ...l, label: text } : l)));
  };

  // --- Interval Timer States ---
  const [workSeconds, setWorkSeconds] = useState(30);
  const [restSeconds, setRestSeconds] = useState(15);
  const [totalRounds, setTotalRounds] = useState(6);

  const [currentRound, setCurrentRound] = useState(1);
  const [intervalPhase, setIntervalPhase] = useState<'work' | 'rest' | 'prep' | 'done'>('prep');
  const [timeLeft, setTimeLeft] = useState(5); // 5s prep
  const [intervalRunning, setIntervalRunning] = useState(false);
  const intervalTimerRef = useRef<any>(null);

  useEffect(() => {
    if (intervalRunning) {
      intervalTimerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 4 && prev > 1) {
            fieldAudio.playCountdownBeep(false);
          } else if (prev === 1) {
            fieldAudio.playCountdownBeep(true);
          }

          if (prev <= 1) {
            // Transition phase
            if (intervalPhase === 'prep') {
              fieldAudio.playWhistle(0.5);
              setIntervalPhase('work');
              return workSeconds;
            } else if (intervalPhase === 'work') {
              fieldAudio.playDoubleWhistle();
              if (currentRound >= totalRounds) {
                fieldAudio.playLongWhistle();
                setIntervalPhase('done');
                setIntervalRunning(false);
                return 0;
              } else {
                setIntervalPhase('rest');
                return restSeconds;
              }
            } else if (intervalPhase === 'rest') {
              fieldAudio.playWhistle(0.5);
              setCurrentRound((r) => r + 1);
              setIntervalPhase('work');
              return workSeconds;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);
    }

    return () => {
      if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);
    };
  }, [intervalRunning, intervalPhase, currentRound, totalRounds, workSeconds, restSeconds]);

  const handleStartInterval = () => {
    if (!intervalRunning) {
      if (intervalPhase === 'done') {
        setCurrentRound(1);
        setIntervalPhase('prep');
        setTimeLeft(5);
      }
    }
    setIntervalRunning(!intervalRunning);
  };

  const handleResetInterval = () => {
    setIntervalRunning(false);
    setCurrentRound(1);
    setIntervalPhase('prep');
    setTimeLeft(5);
  };

  return (
    <div className="space-y-6">
      {/* Screen Toolbar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              الميقاتي الميداني وصفارة التحكيم (Field Stopwatch & Interval Timer)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              توقيت سباقات الجري المتعددة، مؤقت التدريب المتواتر (Tabata / Circuit)، وصفارات الميدان الحية.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setActiveMode('stopwatch')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                activeMode === 'stopwatch'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ميقاتي السباقات والمسارات
            </button>
            <button
              onClick={() => setActiveMode('interval')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                activeMode === 'interval'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              مؤقت التدريب الدائري (Circuit/HIIT)
            </button>
          </div>
        </div>

        {/* Live Whistle Soundboard Strip */}
        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100 flex-wrap">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Volume2 className="w-4 h-4 text-emerald-600" />
            <span>لوحة الصفارات الميدانية:</span>
          </span>
          <button
            onClick={() => fieldAudio.playWhistle(0.45)}
            className="px-3 py-1 text-xs font-bold text-emerald-800 bg-white hover:bg-emerald-50 border border-slate-200 rounded-md transition-colors"
          >
            صافرة انطلاق (عادية)
          </button>
          <button
            onClick={() => fieldAudio.playDoubleWhistle()}
            className="px-3 py-1 text-xs font-bold text-amber-800 bg-white hover:bg-amber-50 border border-slate-200 rounded-md transition-colors"
          >
            صافرة مزدوجة (توقف / خطأ)
          </button>
          <button
            onClick={() => fieldAudio.playLongWhistle()}
            className="px-3 py-1 text-xs font-bold text-rose-800 bg-white hover:bg-rose-50 border border-slate-200 rounded-md transition-colors"
          >
            صافرة طويلة (نهاية الحصة)
          </button>
        </div>
      </div>

      {activeMode === 'stopwatch' ? (
        /* Stopwatch Mode */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Big Digital Display & Controls */}
          <div className="lg:col-span-2 bg-slate-900 text-white rounded-2xl p-8 flex flex-col items-center justify-center space-y-8 shadow-md">
            <div className="text-center space-y-1">
              <span className="text-xs font-semibold text-slate-400 tracking-wider">
                الميقاتي الرقمي الميداني
              </span>
              <div className="text-5xl sm:text-7xl font-black font-mono tabular-nums tracking-wider text-emerald-400">
                {formatStopwatch(swTime)}
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap justify-center">
              <button
                onClick={handleStartStopwatch}
                className={`px-8 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95 ${
                  swRunning
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/50'
                }`}
              >
                {swRunning ? (
                  <>
                    <Pause className="w-5 h-5" />
                    <span>إيقاف مؤقت</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>انطلاق (مع صفارة)</span>
                  </>
                )}
              </button>

              <button
                onClick={handleRecordLap}
                disabled={!swRunning && swTime === 0}
                className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95 border border-slate-700"
              >
                <Flag className="w-5 h-5 text-emerald-400" />
                <span>تسجيل دورة / تلميذ</span>
              </button>

              <button
                onClick={handleResetStopwatch}
                className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all active:scale-95 border border-slate-700"
              >
                <RotateCcw className="w-4 h-4" />
                <span>تصفير</span>
              </button>
            </div>
          </div>

          {/* Laps List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">
                أوقات المسارات والتلاميذ ({laps.length})
              </h3>
              {laps.length > 0 && (
                <button
                  onClick={() => setLaps([])}
                  className="text-xs text-rose-600 hover:underline font-semibold"
                >
                  مسح السجل
                </button>
              )}
            </div>

            {laps.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                انقر على &quot;تسجيل دورة / تلميذ&quot; أثناء الجري لتسجيل الأزمنة.
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {laps.map((lap) => (
                  <div
                    key={lap.id}
                    className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] tabular-nums shrink-0">
                        {lap.lapNumber}
                      </span>
                      <input
                        type="text"
                        value={lap.label || ''}
                        onChange={(e) => handleUpdateLapLabel(lap.id, e.target.value)}
                        className="px-2 py-1 bg-white border border-slate-200 rounded-md font-semibold text-slate-900 text-xs w-28"
                      />
                    </div>
                    <span className="font-mono font-bold tabular-nums text-slate-900 text-sm">
                      {lap.formattedTime}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Interval / Tabata Circuit Mode */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Big Interval Display */}
          <div
            className={`lg:col-span-2 rounded-2xl p-8 flex flex-col items-center justify-center space-y-6 shadow-md transition-colors ${
              intervalPhase === 'work'
                ? 'bg-emerald-900 text-white'
                : intervalPhase === 'rest'
                ? 'bg-blue-900 text-white'
                : intervalPhase === 'done'
                ? 'bg-purple-900 text-white'
                : 'bg-slate-900 text-white'
            }`}
          >
            <div className="text-center space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/20">
                {intervalPhase === 'prep' && 'استعد للانطلاق (تهيئة)'}
                {intervalPhase === 'work' && '⚡ وقت العمل والمجهود (WORK)'}
                {intervalPhase === 'rest' && '💤 وقت الراحة والاسترجاع (REST)'}
                {intervalPhase === 'done' && '🎉 اكتمل التدريب بنجاح!'}
              </span>

              <div className="text-6xl sm:text-8xl font-black font-mono tabular-nums tracking-tight">
                {timeLeft} <span className="text-3xl font-sans">ثانية</span>
              </div>

              <div className="text-sm font-semibold text-slate-200">
                الجولة: <strong className="text-white text-lg">{currentRound}</strong> من أصل {totalRounds}
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap justify-center">
              <button
                onClick={handleStartInterval}
                className={`px-8 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95 ${
                  intervalRunning
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-white hover:bg-slate-100 text-slate-900 shadow-md'
                }`}
              >
                {intervalRunning ? (
                  <>
                    <Pause className="w-5 h-5" />
                    <span>إيقاف مؤقت</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>بدء الدورة</span>
                  </>
                )}
              </button>

              <button
                onClick={handleResetInterval}
                className="px-6 py-3.5 bg-black/30 hover:bg-black/50 text-white rounded-xl font-semibold text-sm flex items-center gap-2 transition-all active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة ضبط</span>
              </button>
            </div>
          </div>

          {/* Interval Configuration Deck */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
              إعدادات فترات العمل والراحة (Interval Settings)
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  مدة الجهد والعمل (Work): {workSeconds} ثانية
                </label>
                <input
                  type="range"
                  min="10"
                  max="120"
                  step="5"
                  value={workSeconds}
                  onChange={(e) => setWorkSeconds(Number(e.target.value))}
                  disabled={intervalRunning}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  مدة الراحة (Rest): {restSeconds} ثانية
                </label>
                <input
                  type="range"
                  min="5"
                  max="90"
                  step="5"
                  value={restSeconds}
                  onChange={(e) => setRestSeconds(Number(e.target.value))}
                  disabled={intervalRunning}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  عدد الجولات والمحطات: {totalRounds} جولات
                </label>
                <input
                  type="range"
                  min="2"
                  max="20"
                  step="1"
                  value={totalRounds}
                  onChange={(e) => setTotalRounds(Number(e.target.value))}
                  disabled={intervalRunning}
                  className="w-full accent-purple-600"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-lg text-slate-600 text-xs border border-slate-100">
                <span className="font-semibold block mb-1">الزمن الإجمالي المقدر:</span>
                <strong className="text-slate-900 font-bold tabular-nums">
                  {Math.round(((workSeconds + restSeconds) * totalRounds) / 60)} دقيقة
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
