import { useMemo, useState } from 'react';
import { Compass, Layers, Maximize2, Sparkles, Sun } from 'lucide-react';
import { formatArea } from '../../utils/formatters';
import { usePropertyStore } from '../../store/usePropertyStore';
import { trackInteraction } from '../../utils/analytics';

/**
 * Interactive Vector Architectural Blueprint & Room Dimension Explorer.
 * Supports multi-level switching, clickable room zones, live sqm/sq ft unit conversion,
 * and room-specific architectural & solar-aspect specifications.
 */
export function FloorplanExplorer({ property }) {
  const areaUnit = usePropertyStore((state) => state.areaUnit);
  const floorplans = useMemo(() => property?.floorplans || [], [property]);

  const [activeLevelIndex, setActiveLevelIndex] = useState(0);
  const currentLevel = floorplans[activeLevelIndex] || floorplans[0];
  const rooms = useMemo(() => currentLevel?.rooms || [], [currentLevel]);

  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const activeRoom = useMemo(() => {
    if (!rooms.length) return null;
    return rooms.find((r) => r.id === selectedRoomId) || rooms[0];
  }, [rooms, selectedRoomId]);

  if (!currentLevel) return null;

  const handleSelectLevel = (idx) => {
    setActiveLevelIndex(idx);
    const nextFirstRoom = floorplans[idx]?.rooms?.[0]?.id || null;
    setSelectedRoomId(nextFirstRoom);
    trackInteraction('floorplan_level_switched', {
      reference: property?.reference,
      level: floorplans[idx]?.level,
    });
  };

  const handleSelectRoom = (room) => {
    setSelectedRoomId(room.id);
    trackInteraction('floorplan_room_inspected', {
      reference: property?.reference,
      level: currentLevel.level,
      room: room.name,
    });
  };

  return (
    <div className="border border-[#E8E1D5] bg-[#171816] text-[#F7F5F0]">
      {/* Top Level Selector Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F7F5F0]/12 bg-[#1D1E1B] px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-2.5">
          <Layers className="h-4 w-4 text-[#B69A69]" strokeWidth={1.6} />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#B69A69]">
              Interactive Architectural Blueprint
            </p>
            <p className="text-xs text-[#E8E1D5]/80">
              Select a floor plate and click any space to inspect dimensions & solar orientation
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {floorplans.map((lvl, idx) => {
            const isActive = idx === activeLevelIndex;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => handleSelectLevel(idx)}
                className={`border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                  isActive
                    ? 'border-[#B69A69] bg-[#B69A69] text-[#171816]'
                    : 'border-[#F7F5F0]/20 bg-[#171816]/60 text-[#E8E1D5] hover:border-[#B69A69]/60'
                }`}
              >
                {lvl.level}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Blueprint Canvas + Active Room Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left: Interactive SVG CAD Floorplate */}
        <div className="relative flex flex-col justify-between border-b border-[#F7F5F0]/12 p-4 sm:p-6 lg:col-span-8 lg:border-r lg:border-b-0">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div>
              <span className="font-serif text-lg text-[#F7F5F0]">
                {currentLevel.level} — {currentLevel.title}
              </span>
              <span className="ml-3 text-[11px] tabular-nums text-[#B69A69]">
                Floor Plate: {formatArea(currentLevel.totalSqm, areaUnit)}
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[#E8E1D5]/70">
              <Compass className="h-3.5 w-3.5 text-[#B69A69]" />
              <span>Scale 1:100 · CAD Schematic</span>
            </span>
          </div>

          <div className="relative overflow-hidden border border-[#F7F5F0]/12 bg-[#131412] p-2 sm:p-4">
            <svg
              viewBox="0 0 800 440"
              className="h-auto w-full select-none"
              role="img"
              aria-label={`Interactive architectural floorplan for ${currentLevel.level}`}
            >
              <defs>
                <pattern
                  id="vimroll-cad-grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="#F7F5F0"
                    strokeOpacity="0.05"
                    strokeWidth="1"
                  />
                </pattern>
                <pattern
                  id="vimroll-cad-subgrid"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 10 0 L 0 0 0 10"
                    fill="none"
                    stroke="#F7F5F0"
                    strokeOpacity="0.02"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>

              {/* Blueprint Grid Background */}
              <rect width="800" height="440" fill="url(#vimroll-cad-subgrid)" />
              <rect width="800" height="440" fill="url(#vimroll-cad-grid)" />

              {/* Outer Structural Perimeter Wall */}
              <rect
                x="52"
                y="32"
                width="686"
                height="366"
                fill="none"
                stroke="#E8E1D5"
                strokeOpacity="0.45"
                strokeWidth="3"
              />

              {/* Architectural Dimension Ticks */}
              <g stroke="#B69A69" strokeOpacity="0.55" strokeWidth="1">
                <line x1="60" y1="18" x2="730" y2="18" />
                <line x1="60" y1="13" x2="60" y2="23" />
                <line x1="730" y1="13" x2="730" y2="23" />
                <text
                  x="395"
                  y="14"
                  textAnchor="middle"
                  fill="#B69A69"
                  fontSize="9"
                  letterSpacing="2"
                >
                  STRUCTURAL SPAN · 28.4M
                </text>
              </g>

              {/* Interactive Room Polygons */}
              {rooms.map((room) => {
                const { x, y, w, h } = Array.isArray(room.rect)
                  ? {
                      x: room.rect[0],
                      y: room.rect[1],
                      w: room.rect[2],
                      h: room.rect[3],
                    }
                  : room.rect;
                const isSelected = activeRoom?.id === room.id;

                return (
                  <g
                    key={room.id}
                    onClick={() => handleSelectRoom(room)}
                    onMouseEnter={() => setSelectedRoomId(room.id)}
                    className="cursor-pointer transition-all"
                  >
                    <rect
                      x={x}
                      y={y}
                      width={w}
                      height={h}
                      fill={isSelected ? '#B69A69' : '#1E201D'}
                      fillOpacity={isSelected ? '0.24' : '0.78'}
                      stroke={isSelected ? '#B69A69' : '#E8E1D5'}
                      strokeOpacity={isSelected ? '1' : '0.35'}
                      strokeWidth={isSelected ? '2.4' : '1.2'}
                    />

                    {/* Subtle Architectural Doorway / Glazing Accents */}
                    <line
                      x1={x + 14}
                      y1={y}
                      x2={x + Math.min(70, w - 14)}
                      y2={y}
                      stroke="#B69A69"
                      strokeOpacity={isSelected ? '0.95' : '0.4'}
                      strokeWidth="3"
                    />

                    {/* Room Code Pill */}
                    <rect
                      x={x + 12}
                      y={y + 12}
                      width="32"
                      height="18"
                      fill={isSelected ? '#B69A69' : '#171816'}
                      stroke="#B69A69"
                      strokeOpacity="0.6"
                      strokeWidth="0.8"
                    />
                    <text
                      x={x + 28}
                      y={y + 24}
                      textAnchor="middle"
                      fill={isSelected ? '#171816' : '#B69A69'}
                      fontSize="9"
                      fontWeight="700"
                    >
                      {room.code}
                    </text>

                    {/* Room Title */}
                    <text
                      x={x + w / 2}
                      y={y + h / 2 - 4}
                      textAnchor="middle"
                      fill="#F7F5F0"
                      fontSize={w < 210 ? '11' : '13'}
                      fontFamily="Cormorant Garamond, Georgia, serif"
                      fontWeight="600"
                    >
                      {room.name}
                    </text>

                    {/* Room Area */}
                    <text
                      x={x + w / 2}
                      y={y + h / 2 + 14}
                      textAnchor="middle"
                      fill="#B69A69"
                      fontSize="10"
                      letterSpacing="1"
                    >
                      {formatArea(room.sqm, areaUnit)}
                    </text>

                    {/* Room Dimensions */}
                    <text
                      x={x + w / 2}
                      y={y + h / 2 + 29}
                      textAnchor="middle"
                      fill="#E8E1D5"
                      fillOpacity="0.6"
                      fontSize="9"
                    >
                      {room.dimensions}
                    </text>
                  </g>
                );
              })}

              {/* Compass Rose in Bottom-Right Corner */}
              <g transform="translate(765, 405)">
                <circle
                  cx="0"
                  cy="0"
                  r="18"
                  fill="#171816"
                  stroke="#B69A69"
                  strokeOpacity="0.6"
                  strokeWidth="1"
                />
                <polygon points="0,-13 4,4 0,0 -4,4" fill="#B69A69" />
                <text
                  x="0"
                  y="-21"
                  textAnchor="middle"
                  fill="#B69A69"
                  fontSize="8"
                  fontWeight="700"
                >
                  N
                </text>
              </g>
            </svg>
          </div>

          {/* Quick Room Selector Strip */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {rooms.map((room) => {
              const isSelected = activeRoom?.id === room.id;
              return (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => handleSelectRoom(room)}
                  className={`border px-2.5 py-1 text-[10px] font-medium transition-colors ${
                    isSelected
                      ? 'border-[#B69A69] bg-[#B69A69]/20 text-[#F7F5F0]'
                      : 'border-[#F7F5F0]/15 bg-[#1D1E1B] text-[#E8E1D5]/75 hover:border-[#B69A69]/50'
                  }`}
                >
                  <span className="mr-1.5 text-[#B69A69]">{room.code}</span>
                  <span>{room.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Room Dossier Inspector */}
        <div className="flex flex-col justify-between bg-[#1B1C19] p-5 sm:p-6 lg:col-span-4">
          {activeRoom ? (
            <div>
              <div className="flex items-center justify-between border-b border-[#F7F5F0]/12 pb-3">
                <span className="bg-[#B69A69]/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B69A69]">
                  Zone {activeRoom.code}
                </span>
                <span className="text-[11px] uppercase tracking-[0.18em] text-[#E8E1D5]/65">
                  {currentLevel.level}
                </span>
              </div>

              <h3 className="mt-4 font-serif text-2xl font-normal text-[#F7F5F0] sm:text-3xl">
                {activeRoom.name}
              </h3>

              <div className="mt-5 grid grid-cols-2 gap-3 border-y border-[#F7F5F0]/12 py-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#E8E1D5]/60">
                    Net Internal Area
                  </p>
                  <p className="mt-1 font-serif text-2xl text-[#B69A69] tabular-nums">
                    {formatArea(activeRoom.sqm, areaUnit)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#E8E1D5]/60">
                    Span Dimensions
                  </p>
                  <p className="mt-1 font-serif text-xl text-[#F7F5F0] tabular-nums">
                    {activeRoom.dimensions}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#E8E1D5]/60">
                    CeilingClearance
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#F7F5F0] tabular-nums">
                    {activeRoom.ceiling}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#E8E1D5]/60">
                    Solar Aspect
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-[#E8E1D5]">
                    <Sun className="h-3.5 w-3.5 text-[#B69A69]" />
                    <span>{activeRoom.aspect}</span>
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B69A69]">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Architectural Specification</span>
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#E8E1D5]/85">
                  {activeRoom.feature}
                </p>
              </div>
            </div>
          ) : null}

          <div className="mt-6 border-t border-[#F7F5F0]/12 pt-4 text-[11px] text-[#E8E1D5]/65">
            <div className="flex items-center justify-between">
              <span>Total Residence Area</span>
              <span className="font-semibold text-[#F7F5F0] tabular-nums">
                {formatArea(property.area, areaUnit)}
              </span>
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="inline-flex items-center gap-1">
                <Maximize2 className="h-3 w-3 text-[#B69A69]" />
                <span>Measurement Standard</span>
              </span>
              <span>RICS / IPMS-3 Residential</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

