import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Film,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { trackInteraction } from '../../utils/analytics';

function formatTimecode(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  const mins = String(Math.floor(s / 60)).padStart(2, '0');
  const secs = String(s % 60).padStart(2, '0');
  return `${mins}:${secs}`;
}

export function ArchitecturalVideoPlayer({
  property,
  compact = false,
  autoPlay = true,
  onCloseCompact,
}) {
  const tour = property?.videoTour;
  const chapters = tour?.chapters || [];
  const totalDuration = tour?.durationSeconds || 64;

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const lastTickRef = useRef(null);
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);

  // Determine current chapter & intra-chapter progress (0..1)
  const activeChapterIndex = Math.min(
    chapters.length - 1,
    Math.max(
      0,
      chapters.findIndex(
        (ch) => currentTime >= ch.startTime && currentTime < ch.endTime
      )
    )
  );
  const activeChapter = chapters[activeChapterIndex] || chapters[0];
  const chapterDuration = activeChapter
    ? Math.max(1, activeChapter.endTime - activeChapter.startTime)
    : 16;
  const chapterProgress = activeChapter
    ? Math.min(1, Math.max(0, (currentTime - activeChapter.startTime) / chapterDuration))
    : 0;

  // Smoothly interpolate camera dolly & pan for the active chapter
  const cam = activeChapter?.camera || {
    fromScale: 1.02,
    toScale: 1.12,
    fromX: 0,
    toX: -1.5,
    fromY: 0,
    toY: -1,
  };
  const scale = cam.fromScale + (cam.toScale - cam.fromScale) * chapterProgress;
  const translateX = cam.fromX + (cam.toX - cam.fromX) * chapterProgress;
  const translateY = cam.fromY + (cam.toY - cam.fromY) * chapterProgress;
  const isTwilightScene = activeChapterIndex === chapters.length - 1;

  // Animation loop for 60fps choreographed architectural film
  useEffect(() => {
    if (!isPlaying) {
      lastTickRef.current = null;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return undefined;
    }

    const step = (now) => {
      if (lastTickRef.current !== null) {
        const deltaSec = ((now - lastTickRef.current) / 1000) * playbackRate;
        setCurrentTime((prev) => {
          const next = prev + deltaSec;
          return next >= totalDuration ? 0 : next;
        });
      }
      lastTickRef.current = now;
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, playbackRate, totalDuration]);

  // Optional procedural Web Audio warm architectural room pad when unmuted
  const stopAudio = useCallback(() => {
    try {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
        gainNodeRef.current = null;
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleAudio = () => {
    if (!isMuted) {
      setIsMuted(true);
      stopAudio();
      return;
    }

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.035, ctx.currentTime + 1.2);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(420, ctx.currentTime);

      // Warm Fmaj9 architectural ambient drone chord
      [174.61, 220.0, 261.63, 329.63].forEach((freq) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.connect(filter);
        osc.start();
      });

      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      audioCtxRef.current = ctx;
      gainNodeRef.current = masterGain;
      setIsMuted(false);
    } catch {
      setIsMuted(true);
    }
  };

  useEffect(() => () => stopAudio(), [stopAudio]);

  const handleTogglePlay = (e) => {
    e?.stopPropagation();
    setIsPlaying((prev) => {
      const next = !prev;
      if (next) {
        trackInteraction('video_tour_played', {
          reference: property?.reference || 'unknown',
          mode: compact ? 'card_preview' : 'dossier_cinema',
        });
      }
      return next;
    });
  };

  const handleSelectChapter = (chapter) => {
    setCurrentTime(chapter.startTime + 0.05);
    setIsPlaying(true);
    trackInteraction('video_chapter_selected', {
      reference: property?.reference || 'unknown',
      chapter: chapter.title,
    });
  };

  const handleToggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // ignore if fullscreen blocked
    }
  };

  if (!activeChapter) return null;

  // Compact inline card preview mode
  if (compact) {
    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative h-full w-full overflow-hidden bg-[#171816] text-[#F7F5F0] select-none"
      >
        <img
          src={activeChapter.image}
          alt={activeChapter.title}
          style={{
            transform: `scale(${scale.toFixed(4)}) translate(${translateX.toFixed(2)}%, ${translateY.toFixed(2)}%)`,
          }}
          className={`h-full w-full object-cover will-change-transform ${
            isTwilightScene ? 'brightness-90 contrast-110 saturate-115' : ''
          }`}
        />

        {/* Warm architectural light-sweep overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: isTwilightScene
              ? 'radial-gradient(circle at 65% 35%, rgba(182,154,105,0.28), rgba(23,24,22,0.58) 75%)'
              : 'linear-gradient(180deg, rgba(23,24,22,0.35) 0%, rgba(23,24,22,0.1) 45%, rgba(23,24,22,0.78) 100%)',
          }}
        />

        {/* Top Bar */}
        <div className="absolute inset-x-3 top-3 z-20 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 bg-[#171816]/90 px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.2em] text-[#B69A69] backdrop-blur-xs">
            <Film className="h-3 w-3" />
            <span>{activeChapter.title}</span>
          </span>

          {onCloseCompact && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onCloseCompact();
              }}
              aria-label="Close inline film preview"
              className="flex h-7 w-7 items-center justify-center bg-[#171816]/90 text-[#F7F5F0] transition-colors hover:bg-[#B69A69] hover:text-[#171816]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Bottom Mini Scrubber */}
        <div className="absolute inset-x-3 bottom-3 z-20 flex items-center gap-2.5 bg-[#171816]/85 px-3 py-1.5 backdrop-blur-xs">
          <button
            type="button"
            onClick={handleTogglePlay}
            aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
            className="text-[#B69A69] hover:text-[#F7F5F0]"
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>

          <div className="relative h-1 flex-1 overflow-hidden bg-[#F7F5F0]/20">
            <div
              className="h-full bg-[#B69A69]"
              style={{ width: `${(currentTime / totalDuration) * 100}%` }}
            />
          </div>

          <span className="text-[10px] tabular-nums text-[#E8E1D5]">
            {formatTimecode(currentTime)} / {tour.durationLabel}
          </span>
        </div>
      </div>
    );
  }

  // Full Dossier Cinema Mode
  return (
    <div
      ref={containerRef}
      className="border border-[#E8E1D5] bg-[#171816] text-[#F7F5F0] shadow-xl"
    >
      {/* Main 16:9 Cinema Stage */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#111210] lg:h-[520px] lg:aspect-auto">
        <img
          key={activeChapter.id}
          src={activeChapter.image}
          alt={activeChapter.title}
          style={{
            transform: `scale(${scale.toFixed(4)}) translate(${translateX.toFixed(2)}%, ${translateY.toFixed(2)}%)`,
          }}
          className={`h-full w-full object-cover will-change-transform ${
            isTwilightScene ? 'brightness-90 contrast-112 saturate-120' : ''
          }`}
        />

        {/* Golden-hour & vignette cinema grading */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: isTwilightScene
              ? 'radial-gradient(circle at 70% 30%, rgba(182,154,105,0.28), rgba(17,18,16,0.68) 78%)'
              : 'linear-gradient(180deg, rgba(23,24,22,0.48) 0%, rgba(23,24,22,0.08) 42%, rgba(23,24,22,0.86) 100%)',
          }}
        />

        {/* Top Left Cinema Header */}
        <div className="absolute left-4 top-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 sm:left-6 sm:right-6 sm:top-6">
          <div className="inline-flex items-center gap-2.5 border border-[#B69A69]/40 bg-[#171816]/85 px-3.5 py-1.5 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[#B69A69]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B69A69]">
              Architectural Monograph Film · {property.reference}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPlaybackRate((r) => (r === 1 ? 0.75 : 1))}
              className="border border-[#F7F5F0]/20 bg-[#171816]/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E8E1D5] transition-colors hover:border-[#B69A69] hover:text-[#B69A69]"
            >
              {playbackRate === 1 ? '1.0x Normal' : '0.75x Slow-Mo'}
            </button>

            <button
              type="button"
              onClick={toggleAudio}
              aria-label={isMuted ? 'Enable ambient soundscape' : 'Mute ambient soundscape'}
              className="inline-flex items-center gap-1.5 border border-[#F7F5F0]/20 bg-[#171816]/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E8E1D5] transition-colors hover:border-[#B69A69] hover:text-[#B69A69]"
            >
              {isMuted ? (
                <>
                  <VolumeX className="h-3.5 w-3.5 text-[#B69A69]" />
                  <span className="hidden sm:inline">Ambient Off</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-3.5 w-3.5 text-[#B69A69]" />
                  <span className="hidden sm:inline">Ambient On</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleToggleFullscreen}
              aria-label="Toggle fullscreen cinema"
              className="flex h-8 w-8 items-center justify-center border border-[#F7F5F0]/20 bg-[#171816]/85 text-[#F7F5F0] transition-colors hover:border-[#B69A69] hover:text-[#B69A69]"
            >
              {isFullscreen ? (
                <Minimize2 className="h-3.5 w-3.5" />
              ) : (
                <Maximize2 className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Lower Third Narrative Overlay */}
        <div className="absolute inset-x-4 bottom-4 z-20 sm:inset-x-6 sm:bottom-6">
          <div className="mb-4 max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#B69A69]">
              {activeChapter.title}
            </p>
            <p className="mt-1 font-serif text-xl text-[#F7F5F0] sm:text-2xl">
              {activeChapter.caption}
            </p>
          </div>

          {/* Scrubbable Timeline Bar */}
          <div className="flex items-center gap-3.5 border border-[#F7F5F0]/15 bg-[#171816]/90 px-4 py-3 backdrop-blur-md">
            <button
              type="button"
              onClick={handleTogglePlay}
              aria-label={isPlaying ? 'Pause architectural film' : 'Play architectural film'}
              className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#B69A69] text-[#171816] transition-colors hover:bg-[#CBB389]"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" strokeWidth={2} />
              ) : (
                <Play className="h-4 w-4 translate-x-0.5" strokeWidth={2} />
              )}
            </button>

            <input
              type="range"
              aria-label="Scrub architectural film timeline"
              min={0}
              max={totalDuration}
              step={0.2}
              value={currentTime}
              onChange={(e) => setCurrentTime(Number(e.target.value))}
              className="h-1.5 flex-1 cursor-pointer accent-[#B69A69]"
            />

            <span className="shrink-0 text-xs font-medium tabular-nums text-[#E8E1D5]">
              {formatTimecode(currentTime)} / {tour.durationLabel}
            </span>
          </div>
        </div>
      </div>

      {/* 4-Chapter Selector Strip */}
      <div className="grid grid-cols-2 gap-px bg-[#2A2B27] sm:grid-cols-4">
        {chapters.map((chapter, idx) => {
          const isCurrent = idx === activeChapterIndex;
          return (
            <button
              key={chapter.id}
              type="button"
              onClick={() => handleSelectChapter(chapter)}
              className={`group flex flex-col justify-between p-3.5 text-left transition-colors sm:p-4 ${
                isCurrent
                  ? 'bg-[#222320] text-[#F7F5F0]'
                  : 'bg-[#171816] text-[#E8E1D5]/70 hover:bg-[#1D1E1B] hover:text-[#F7F5F0]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B69A69]">
                  Scene 0{idx + 1}
                </span>
                <span className="text-[10px] tabular-nums text-[#E8E1D5]/60">
                  {chapter.timeLabel}
                </span>
              </div>
              <p className="mt-1.5 line-clamp-1 font-serif text-sm text-[#F7F5F0] sm:text-base">
                {chapter.title.replace(/^0\d\s·\s/, '')}
              </p>
              <div className="mt-2.5 h-0.5 w-full overflow-hidden bg-[#F7F5F0]/10">
                <div
                  className="h-full bg-[#B69A69] transition-all duration-150"
                  style={{
                    width: isCurrent
                      ? `${Math.round(chapterProgress * 100)}%`
                      : idx < activeChapterIndex
                        ? '100%'
                        : '0%',
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

