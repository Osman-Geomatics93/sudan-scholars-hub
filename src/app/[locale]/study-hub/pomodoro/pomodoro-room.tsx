'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import {
  Play, Pause, RotateCcw, SkipForward,
  Volume2, VolumeX, CloudRain, BookOpen, Coffee,
  Settings, ArrowLeft, Users, Timer, Flame, CheckCircle2, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

type Phase = 'work' | 'break' | 'longBreak';

interface PomodoroSettings {
  workMin: number;
  breakMin: number;
  longBreakMin: number;
  sessionsBeforeLong: number;
}

interface SoundNodes {
  source: AudioBufferSourceNode | null;
  gain: GainNode;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  workMin: 25,
  breakMin: 5,
  longBreakMin: 15,
  sessionsBeforeLong: 4,
};

const SETTINGS_KEY = 'studyhub_pomodoro_settings';
const STATS_KEY = 'studyhub_pomodoro_stats';

// ─── Ambient Sound Helpers (Web Audio API - no files needed) ────────────────

function createWhiteNoiseBuffer(ctx: AudioContext, duration = 2): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * duration;
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function createBrownNoiseBuffer(ctx: AudioContext, duration = 2): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * duration;
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    data[i] = (last + 0.02 * white) / 1.02;
    last = data[i];
    data[i] *= 3.5;
  }
  return buffer;
}

function createPinkNoiseBuffer(ctx: AudioContext, duration = 2): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * duration;
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    data[i] *= 0.11;
    b6 = white * 0.115926;
  }
  return buffer;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function PomodoroRoom({ locale }: { locale: string }) {
  const t = useTranslations('pomodoroRoom');
  const { theme } = useTheme();
  const isRTL = locale === 'ar';

  // Timer state
  const [phase, setPhase] = useState<Phase>('work');
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SETTINGS.workMin * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [completedToday, setCompletedToday] = useState(0);
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(0);

  // Settings
  const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);
  const [tempSettings, setTempSettings] = useState<PomodoroSettings>(DEFAULT_SETTINGS);

  // Audio
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [soundStates, setSoundStates] = useState({
    rain: { isPlaying: false, volume: 0.5 },
    library: { isPlaying: false, volume: 0.3 },
    cafe: { isPlaying: false, volume: 0.4 },
  });
  const soundNodesRef = useRef<Record<string, SoundNodes | null>>({
    rain: null, library: null, cafe: null,
  });

  // Live counter
  const [liveCount, setLiveCount] = useState(42);

  // Refs for timer
  const targetTimeRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Load settings & stats from localStorage ──────────────────────────────

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as PomodoroSettings;
        setSettings(parsed);
        setTempSettings(parsed);
        setTimeLeft(parsed.workMin * 60);
      }
    } catch {}

    try {
      const saved = localStorage.getItem(STATS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const today = new Date().toDateString();
        if (parsed.date === today) {
          setCompletedToday(parsed.sessions || 0);
          setTotalFocusMinutes(parsed.focusMin || 0);
          setSessionCount(parsed.sessionCount || 0);
        }
      }
    } catch {}
  }, []);

  const saveStats = useCallback((sessions: number, focusMin: number, sessCount: number) => {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify({
        date: new Date().toDateString(),
        sessions,
        focusMin,
        sessionCount: sessCount,
      }));
    } catch {}
  }, []);

  // ─── Beep sound ────────────────────────────────────────────────────────────

  const playBeep = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      osc.type = 'sine';
      gain.gain.value = 0.3;
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.stop(ctx.currentTime + 0.5);
      setTimeout(() => ctx.close(), 600);
    } catch {}
  }, []);

  // ─── Phase completion ──────────────────────────────────────────────────────

  const onPhaseComplete = useCallback(() => {
    playBeep();
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (phase === 'work') {
      const newCompleted = completedToday + 1;
      const newFocus = totalFocusMinutes + settings.workMin;
      const newSessCount = sessionCount + 1;
      setCompletedToday(newCompleted);
      setTotalFocusMinutes(newFocus);
      setSessionCount(newSessCount);
      saveStats(newCompleted, newFocus, newSessCount);

      if (newSessCount % settings.sessionsBeforeLong === 0) {
        setPhase('longBreak');
        setTimeLeft(settings.longBreakMin * 60);
      } else {
        setPhase('break');
        setTimeLeft(settings.breakMin * 60);
      }
    } else {
      setPhase('work');
      setTimeLeft(settings.workMin * 60);
    }
  }, [phase, completedToday, totalFocusMinutes, sessionCount, settings, playBeep, saveStats]);

  // ─── Timer controls ────────────────────────────────────────────────────────

  const startTimer = useCallback(() => {
    setIsRunning(true);
    targetTimeRef.current = Date.now() + timeLeft * 1000;
  }, [timeLeft]);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const dur = phase === 'work'
      ? settings.workMin
      : phase === 'break'
        ? settings.breakMin
        : settings.longBreakMin;
    setTimeLeft(dur * 60);
  }, [phase, settings]);

  const skipPhase = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    onPhaseComplete();
  }, [onPhaseComplete]);

  const switchPhase = useCallback((newPhase: Phase) => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setPhase(newPhase);
    const dur = newPhase === 'work'
      ? settings.workMin
      : newPhase === 'break'
        ? settings.breakMin
        : settings.longBreakMin;
    setTimeLeft(dur * 60);
  }, [settings]);

  // ─── Timer tick ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        const remaining = Math.round((targetTimeRef.current - Date.now()) / 1000);
        if (remaining <= 0) {
          setTimeLeft(0);
          onPhaseComplete();
        } else {
          setTimeLeft(remaining);
        }
      }, 200);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, onPhaseComplete]);

  // ─── Tab title update ──────────────────────────────────────────────────────

  useEffect(() => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    const phaseStr = phase === 'work' ? t('work') : phase === 'break' ? t('break') : t('longBreak');

    if (isRunning) {
      document.title = `${timeStr} - ${phaseStr}`;
    } else {
      document.title = t('pageTitle');
    }

    return () => { document.title = t('pageTitle'); };
  }, [timeLeft, isRunning, phase, t]);

  // ─── Live counter simulation ───────────────────────────────────────────────

  useEffect(() => {
    const getBaseCount = () => {
      const hour = new Date().getHours();
      if (hour >= 8 && hour <= 11) return 55 + Math.floor((hour - 8) * 5);
      if (hour >= 12 && hour <= 14) return 50;
      if (hour >= 15 && hour <= 17) return 40;
      if (hour >= 18 && hour <= 22) return 55 + Math.floor((hour - 18) * 4);
      if (hour >= 23 || hour <= 2) return 30;
      return 25;
    };

    setLiveCount(getBaseCount() + Math.floor(Math.random() * 10) - 5);

    const id = setInterval(() => {
      const base = getBaseCount();
      const fluctuation = Math.floor(Math.random() * 11) - 5;
      setLiveCount(Math.max(12, base + fluctuation));
    }, 5000 + Math.random() * 5000);

    return () => clearInterval(id);
  }, []);

  // ─── Ambient Sounds ────────────────────────────────────────────────────────

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const startSound = useCallback((name: 'rain' | 'library' | 'cafe', volume: number) => {
    // Stop any existing instance first
    const existing = soundNodesRef.current[name];
    if (existing) {
      try { existing.source?.stop(); } catch {}
      soundNodesRef.current[name] = null;
    }

    const ctx = getAudioCtx();
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0, ctx.currentTime);

    let buffer: AudioBuffer;
    let filterNode: BiquadFilterNode | null = null;

    if (name === 'rain') {
      buffer = createWhiteNoiseBuffer(ctx, 4);
      filterNode = ctx.createBiquadFilter();
      filterNode.type = 'bandpass';
      filterNode.frequency.value = 800;
      filterNode.Q.value = 0.3;
    } else if (name === 'library') {
      buffer = createBrownNoiseBuffer(ctx, 4);
      filterNode = ctx.createBiquadFilter();
      filterNode.type = 'lowpass';
      filterNode.frequency.value = 400;
    } else {
      buffer = createPinkNoiseBuffer(ctx, 4);
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    if (filterNode) {
      source.connect(filterNode);
      filterNode.connect(gain);
    } else {
      source.connect(gain);
    }

    source.start(0);
    gain.gain.linearRampToValueAtTime(Math.max(0.001, volume), ctx.currentTime + 0.5);

    soundNodesRef.current[name] = { source, gain };
  }, [getAudioCtx]);

  const stopSound = useCallback((name: 'rain' | 'library' | 'cafe') => {
    const nodes = soundNodesRef.current[name];
    if (nodes) {
      const ctx = audioCtxRef.current;
      if (ctx) {
        try {
          nodes.gain.gain.setValueAtTime(nodes.gain.gain.value, ctx.currentTime);
          nodes.gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        } catch {}
      }
      setTimeout(() => {
        try { nodes.source?.stop(); } catch {}
      }, 400);
      soundNodesRef.current[name] = null;
    }
  }, []);

  const toggleSound = useCallback((name: 'rain' | 'library' | 'cafe') => {
    setSoundStates(prev => {
      const wasPlaying = prev[name].isPlaying;
      const vol = prev[name].volume;
      // Schedule the audio operation after state update
      setTimeout(() => {
        if (!wasPlaying) {
          startSound(name, vol);
        } else {
          stopSound(name);
        }
      }, 0);
      return { ...prev, [name]: { ...prev[name], isPlaying: !wasPlaying } };
    });
  }, [startSound, stopSound]);

  const setVolume = useCallback((name: 'rain' | 'library' | 'cafe', vol: number) => {
    setSoundStates(prev => ({
      ...prev,
      [name]: { ...prev[name], volume: vol },
    }));
    const nodes = soundNodesRef.current[name];
    if (nodes && audioCtxRef.current) {
      nodes.gain.gain.setValueAtTime(nodes.gain.gain.value, audioCtxRef.current.currentTime);
      nodes.gain.gain.linearRampToValueAtTime(Math.max(0.001, vol), audioCtxRef.current.currentTime + 0.1);
    }
  }, []);

  // Cleanup sounds on unmount
  useEffect(() => {
    const nodesRef = soundNodesRef.current;
    const ctxRef = audioCtxRef;
    return () => {
      ['rain', 'library', 'cafe'].forEach(name => {
        const nodes = nodesRef[name];
        if (nodes) {
          try { nodes.source?.stop(); } catch {}
        }
      });
      try { ctxRef.current?.close(); } catch {}
    };
  }, []);

  // ─── Settings ──────────────────────────────────────────────────────────────

  const saveSettings = useCallback(() => {
    setSettings(tempSettings);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(tempSettings));
    } catch {}
    // Reset timer to new duration if not running
    if (!isRunning) {
      const dur = phase === 'work'
        ? tempSettings.workMin
        : phase === 'break'
          ? tempSettings.breakMin
          : tempSettings.longBreakMin;
      setTimeLeft(dur * 60);
    }
    setShowSettings(false);
  }, [tempSettings, isRunning, phase]);

  // ─── Computed values ───────────────────────────────────────────────────────

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeDisplay = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const totalPhaseSeconds = phase === 'work'
    ? settings.workMin * 60
    : phase === 'break'
      ? settings.breakMin * 60
      : settings.longBreakMin * 60;
  const progress = 1 - timeLeft / totalPhaseSeconds;
  const currentSet = Math.floor(sessionCount % settings.sessionsBeforeLong);

  const phaseColor = phase === 'work'
    ? { ring: '#f97316', bg: 'from-orange-500/10', text: 'text-orange-500', dot: 'bg-orange-500' }
    : phase === 'break'
      ? { ring: '#22c55e', bg: 'from-green-500/10', text: 'text-green-500', dot: 'bg-green-500' }
      : { ring: '#3b82f6', bg: 'from-blue-500/10', text: 'text-blue-500', dot: 'bg-blue-500' };

  // SVG circular progress
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className={cn(
        'min-h-screen w-full transition-all duration-1000',
        'bg-gradient-to-b to-gray-50 dark:to-gray-950',
        phaseColor.bg,
        isRTL && 'font-cairo'
      )}
    >
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => window.close()}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors text-sm"
          >
            <ArrowLeft className={cn('w-4 h-4', isRTL && 'rotate-180')} />
            {t('backToStudyHub')}
          </button>
          <button
            onClick={() => { setTempSettings(settings); setShowSettings(true); }}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors text-sm"
          >
            <Settings className="w-4 h-4" />
            {t('settings')}
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {t('subtitle')}
          </p>
        </div>

        {/* Live Counter Pill */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {t('liveCounter', { count: liveCount })}
            </span>
          </div>
        </div>

        {/* Phase Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {(['work', 'break', 'longBreak'] as Phase[]).map((p) => (
            <button
              key={p}
              onClick={() => switchPhase(p)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                phase === p
                  ? cn('text-white shadow-md', p === 'work' ? 'bg-orange-500' : p === 'break' ? 'bg-green-500' : 'bg-blue-500')
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              {p === 'work' ? t('work') : p === 'break' ? t('break') : t('longBreak')}
            </button>
          ))}
        </div>

        {/* Timer Ring */}
        <div className="flex justify-center mb-6">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 280 280">
              {/* Background circle */}
              <circle
                cx="140" cy="140" r={radius}
                fill="none"
                stroke="currentColor"
                className="text-gray-200 dark:text-gray-800"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="140" cy="140" r={radius}
                fill="none"
                stroke={phaseColor.ring}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300"
              />
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl sm:text-6xl font-mono font-bold text-gray-900 dark:text-white tabular-nums">
                {timeDisplay}
              </span>
              <span className={cn('text-sm font-medium mt-1 uppercase tracking-wider', phaseColor.text)}>
                {phase === 'work' ? t('phaseWork') : phase === 'break' ? t('phaseBreak') : t('phaseLongBreak')}
              </span>
            </div>
          </div>
        </div>

        {/* Session Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {Array.from({ length: settings.sessionsBeforeLong }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-3 h-3 rounded-full transition-all',
                i < currentSet ? phaseColor.dot : 'bg-gray-300 dark:bg-gray-700'
              )}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-3 mb-10">
          <button
            onClick={isRunning ? pauseTimer : startTimer}
            className={cn(
              'flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white shadow-lg transition-all hover:scale-105 active:scale-95',
              phase === 'work' ? 'bg-orange-500 hover:bg-orange-600'
                : phase === 'break' ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-blue-500 hover:bg-blue-600'
            )}
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isRunning ? t('pause') : t('start')}
          </button>
          <button
            onClick={resetTimer}
            className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            {t('reset')}
          </button>
          <button
            onClick={skipPhase}
            className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            <SkipForward className="w-4 h-4" />
            {t('skip')}
          </button>
        </div>

        {/* Ambient Sounds */}
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-2xl p-5 mb-8">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            {t('ambientSounds')}
          </h3>
          <div className="space-y-3">
            {([
              { key: 'rain' as const, icon: CloudRain, label: t('rain') },
              { key: 'library' as const, icon: BookOpen, label: t('library') },
              { key: 'cafe' as const, icon: Coffee, label: t('cafe') },
            ]).map(({ key, icon: Icon, label }) => (
              <div key={key} className="flex items-center gap-3">
                <button
                  onClick={() => toggleSound(key)}
                  className={cn(
                    'flex items-center gap-2 min-w-[100px] px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                    soundStates[key].isPlaying
                      ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={soundStates[key].volume}
                  onChange={(e) => setVolume(key, parseFloat(e.target.value))}
                  className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-orange-500"
                />
                {soundStates[key].isPlaying ? (
                  <Volume2 className="w-4 h-4 text-gray-400 shrink-0" />
                ) : (
                  <VolumeX className="w-4 h-4 text-gray-400 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-gray-500 dark:text-gray-400 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-medium">{t('sessionsCompleted')}</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{completedToday}</span>
          </div>
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-gray-500 dark:text-gray-400 mb-1">
              <Timer className="w-4 h-4" />
              <span className="text-xs font-medium">{t('totalFocus')}</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalFocusMinutes} <span className="text-sm font-normal text-gray-500">{t('min')}</span>
            </span>
          </div>
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-center col-span-2 sm:col-span-1">
            <div className="flex items-center justify-center gap-1.5 text-gray-500 dark:text-gray-400 mb-1">
              <Flame className="w-4 h-4" />
              <span className="text-xs font-medium">{t('currentStreak')}</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentSet}/{settings.sessionsBeforeLong}
            </span>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div
            dir={isRTL ? 'rtl' : 'ltr'}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                {t('settings')}
              </h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {([
                { key: 'workMin' as const, label: t('workDuration') },
                { key: 'breakMin' as const, label: t('breakDuration') },
                { key: 'longBreakMin' as const, label: t('longBreakDuration') },
                { key: 'sessionsBeforeLong' as const, label: t('sessionsBeforeLong') },
              ]).map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {label}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={key === 'sessionsBeforeLong' ? 10 : 120}
                    value={tempSettings[key]}
                    onChange={(e) =>
                      setTempSettings(prev => ({
                        ...prev,
                        [key]: Math.max(1, parseInt(e.target.value) || 1),
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={saveSettings}
              className="w-full mt-6 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors"
            >
              {t('saveSettings')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
