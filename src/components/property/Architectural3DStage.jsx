import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Box,
  Compass,
  Layers,
  Moon,
  RotateCcw,
  Sparkles,
  Sun,
  Sunrise,
  Sunset,
} from 'lucide-react';
import { formatArea } from '../../utils/formatters';
import { usePropertyStore } from '../../store/usePropertyStore';
import { trackInteraction } from '../../utils/analytics';

const CAMERA_PRESETS = [
  { id: 'aerial', label: 'Aerial 3/4', theta: 0.72, phi: 1.05, radius: 13.5 },
  { id: 'facade', label: 'Facade Elevation', theta: 0.12, phi: 1.38, radius: 12.2 },
  { id: 'terrace', label: 'Pool & Loggia', theta: -0.68, phi: 1.32, radius: 10.8 },
  { id: 'plan', label: 'Plan View', theta: 0.01, phi: 0.28, radius: 15.0 },
];

const SOLAR_PRESETS = [
  { label: 'Sunrise', hour: 6.75, icon: Sunrise },
  { label: 'Solar Noon', hour: 12.5, icon: Sun },
  { label: 'Golden Hour', hour: 18.25, icon: Sunset },
  { label: 'Night Glow', hour: 21.0, icon: Moon },
];

function formatHourLabel(decimalHour) {
  const hrs = Math.floor(decimalHour);
  const mins = Math.round((decimalHour - hrs) * 60);
  const hh = String(hrs).padStart(2, '0');
  const mm = String(mins === 60 ? 0 : mins).padStart(2, '0');
  if (decimalHour < 8.5) return `${hh}:${mm} · Morning Light`;
  if (decimalHour < 16.5) return `${hh}:${mm} · Zenith Daylight`;
  if (decimalHour < 19.5) return `${hh}:${mm} · Golden Hour`;
  return `${hh}:${mm} · Night Illumination`;
}

export function Architectural3DStage({ property }) {
  const areaUnit = usePropertyStore((state) => state.areaUnit);
  const spatial = property?.spatial3D || {};
  const levels = spatial.levels || [];
  const archetype = spatial.archetype || 'waterfront-villa';

  const mountRef = useRef(null);
  const sceneStateRef = useRef({
    exploded: false,
    solarHour: 17.5,
    selectedLevelIdx: -1,
    targetSpherical: { theta: 0.72, phi: 1.05, radius: 13.5 },
    currentSpherical: { theta: 0.72, phi: 1.05, radius: 13.5 },
    autoRotate: true,
  });

  const [exploded, setExploded] = useState(false);
  const [solarHour, setSolarHour] = useState(17.5);
  const [selectedLevelIdx, setSelectedLevelIdx] = useState(-1);
  const [activePreset, setActivePreset] = useState('aerial');
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    sceneStateRef.current.exploded = exploded;
  }, [exploded]);

  useEffect(() => {
    sceneStateRef.current.solarHour = solarHour;
  }, [solarHour]);

  useEffect(() => {
    sceneStateRef.current.selectedLevelIdx = selectedLevelIdx;
  }, [selectedLevelIdx]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglSupported(false);
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x161715);
    scene.fog = new THREE.FogExp2(0x161715, 0.022);

    const camera = new THREE.PerspectiveCamera(
      38,
      container.clientWidth / Math.max(1, container.clientHeight),
      0.1,
      120
    );

    // Materials — Limestone maquette, dark bronze mullions, architectural glass, champagne brass
    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0xf2ece1,
      roughness: 0.55,
      metalness: 0.05,
    });
    const warmStoneMat = new THREE.MeshStandardMaterial({
      color: 0xe3dacb,
      roughness: 0.62,
      metalness: 0.06,
    });
    const darkBronzeMat = new THREE.MeshStandardMaterial({
      color: 0x222320,
      roughness: 0.35,
      metalness: 0.65,
    });
    const goldBrassMat = new THREE.MeshStandardMaterial({
      color: 0xb69a69,
      roughness: 0.28,
      metalness: 0.78,
    });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x8fb3c4,
      roughness: 0.12,
      metalness: 0.35,
      transparent: true,
      opacity: 0.68,
      emissive: new THREE.Color(0xffb86b),
      emissiveIntensity: 0.25,
    });
    const poolMat = new THREE.MeshStandardMaterial({
      color: 0x266578,
      roughness: 0.1,
      metalness: 0.25,
      emissive: new THREE.Color(0x1e8ca8),
      emissiveIntensity: 0.3,
    });

    // Plinth & Compass Ring
    const plinthGroup = new THREE.Group();
    const basePlinth = new THREE.Mesh(
      new THREE.BoxGeometry(10.8, 0.35, 8.6),
      darkBronzeMat
    );
    basePlinth.position.y = -0.18;
    basePlinth.receiveShadow = true;
    plinthGroup.add(basePlinth);

    const compassRing = new THREE.Mesh(
      new THREE.RingGeometry(5.6, 5.66, 64),
      new THREE.MeshBasicMaterial({
        color: 0xb69a69,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.45,
      })
    );
    compassRing.rotation.x = -Math.PI / 2;
    compassRing.position.y = 0.01;
    plinthGroup.add(compassRing);
    scene.add(plinthGroup);

    // 4 Explodable Architectural Level Groups (L0, L1, L2, L3)
    const levelGroups = [0, 1, 2, 3].map((idx) => {
      const g = new THREE.Group();
      g.userData = { levelIdx: idx, baseY: 0 };
      scene.add(g);
      return g;
    });

    const addBox = (group, w, h, d, x, y, z, mat) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      return mesh;
    };

    // Build typology-specific 3D massing across L0..L3
    if (archetype === 'sky-penthouse') {
      // L0: Tower Podium Core
      addBox(levelGroups[0], 4.6, 0.7, 4.2, 0, 0.35, 0, warmStoneMat);
      // L1: Full-Floor Reception & Wraparound Terrace
      addBox(levelGroups[1], 5.4, 0.14, 4.8, 0, 0.77, 0, stoneMat);
      addBox(levelGroups[1], 4.2, 1.0, 3.8, 0, 1.34, 0, glassMat);
      addBox(levelGroups[1], 4.4, 0.08, 4.0, 0, 1.88, 0, goldBrassMat);
      // L2: Setback Primary Suite Floor
      addBox(levelGroups[2], 3.6, 0.95, 3.2, -0.2, 2.4, -0.2, glassMat);
      addBox(levelGroups[2], 3.8, 0.12, 3.4, -0.2, 2.92, -0.2, stoneMat);
      // L3: Crown Observatory & Sky Plunge Pool
      addBox(levelGroups[3], 2.4, 0.8, 2.2, -0.4, 3.38, -0.3, glassMat);
      addBox(levelGroups[3], 2.8, 0.1, 2.6, -0.3, 3.82, -0.2, goldBrassMat);
      addBox(levelGroups[3], 1.5, 0.12, 1.1, 0.85, 3.02, 0.65, poolMat);
    } else if (archetype === 'georgian-townhouse') {
      // L0: Lower Ground Garden Vault & Pool
      addBox(levelGroups[0], 4.2, 0.55, 5.4, 0, 0.28, 0, warmStoneMat);
      addBox(levelGroups[0], 2.8, 0.1, 2.0, 0, 0.58, 1.5, poolMat);
      // L1: Belgravia Stucco Piano Nobile & Rear Glass Orangery
      addBox(levelGroups[1], 3.8, 1.15, 3.6, 0, 1.12, -0.6, stoneMat);
      addBox(levelGroups[1], 3.4, 0.9, 2.1, 0, 1.0, 1.4, glassMat);
      addBox(levelGroups[1], 1.4, 0.95, 0.45, 0, 1.02, -2.55, stoneMat);
      // L2: Principal Bedroom Floors
      addBox(levelGroups[2], 3.8, 1.1, 3.6, 0, 2.25, -0.6, stoneMat);
      addBox(levelGroups[2], 3.5, 0.85, 0.15, 0, 2.25, -2.42, glassMat);
      addBox(levelGroups[2], 3.9, 0.1, 3.7, 0, 2.82, -0.6, goldBrassMat);
      // L3: Mansard Roof & Terrace
      addBox(levelGroups[3], 3.4, 0.68, 3.1, 0, 3.22, -0.6, darkBronzeMat);
      addBox(levelGroups[3], 2.4, 0.45, 2.0, 0, 3.2, -0.6, glassMat);
    } else {
      // Default Flagship: Cantilevered Waterfront / Hillside Villa
      // L0: Subterranean Plinth, Jetty & Infinity Lap Pool
      addBox(levelGroups[0], 7.8, 0.48, 5.8, -0.3, 0.24, -0.2, warmStoneMat);
      addBox(levelGroups[0], 4.6, 0.14, 1.9, 1.1, 0.5, 1.95, poolMat);
      addBox(levelGroups[0], 1.2, 0.08, 2.2, -2.4, 0.12, 2.8, goldBrassMat);

      // L1: Double-Height Vitrocsa Glass Salon & Travertine Wing
      addBox(levelGroups[1], 5.6, 0.14, 4.2, -0.6, 0.56, -0.4, stoneMat);
      addBox(levelGroups[1], 4.4, 1.05, 3.4, -0.4, 1.14, -0.3, glassMat);
      addBox(levelGroups[1], 2.1, 1.1, 3.8, -2.6, 1.16, -0.4, stoneMat);
      addBox(levelGroups[1], 6.4, 0.14, 4.6, -0.4, 1.72, -0.2, stoneMat);
      addBox(levelGroups[1], 6.45, 0.05, 4.65, -0.4, 1.8, -0.2, goldBrassMat);

      // L2: Cantilevered Upper Suite Volume
      addBox(levelGroups[2], 4.8, 0.92, 3.2, 0.25, 2.26, -0.35, glassMat);
      addBox(levelGroups[2], 1.8, 0.95, 3.3, -2.1, 2.28, -0.35, stoneMat);
      addBox(levelGroups[2], 5.6, 0.14, 3.7, -0.1, 2.78, -0.3, stoneMat);

      // L3: Sky Loggia & Architectural Pergola Louvres
      addBox(levelGroups[3], 2.8, 0.68, 2.2, -0.4, 3.18, -0.45, glassMat);
      addBox(levelGroups[3], 3.6, 0.1, 2.8, -0.2, 3.56, -0.4, goldBrassMat);
    }

    // Lighting — Ambient Hemisphere + Dynamic Solar Directional Light + Warm Interior PointLight
    const hemiLight = new THREE.HemisphereLight(0xf7f5f0, 0x222320, 0.85);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfff1d6, 2.1);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 35;
    const d = 8.5;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    scene.add(sunLight);

    // Visible Sun Orb along solar arc
    const sunOrb = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0xffcf87 })
    );
    scene.add(sunOrb);

    // Solar Arc Trajectory Guide Line
    const arcPoints = [];
    for (let h = 6; h <= 20; h += 0.5) {
      const t = (h - 6) / 14;
      const angle = t * Math.PI;
      arcPoints.push(
        new THREE.Vector3(
          Math.cos(angle) * 8.2,
          Math.max(0.4, Math.sin(angle) * 6.8),
          3.4 * Math.sin(angle * 0.8)
        )
      );
    }
    const solarArcLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(arcPoints),
      new THREE.LineBasicMaterial({
        color: 0xb69a69,
        transparent: true,
        opacity: 0.32,
      })
    );
    scene.add(solarArcLine);

    const interiorWarmLight = new THREE.PointLight(0xffa94d, 0.6, 9);
    interiorWarmLight.position.set(0, 1.6, 0);
    scene.add(interiorWarmLight);

    // Pointer / Touch Drag Orbit
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    const domEl = renderer.domElement;

    const onPointerDown = (e) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
      sceneStateRef.current.autoRotate = false;
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      prevX = e.clientX;
      prevY = e.clientY;
      const target = sceneStateRef.current.targetSpherical;
      target.theta -= dx * 0.0075;
      target.phi = Math.min(1.48, Math.max(0.24, target.phi - dy * 0.0065));
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    domEl.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth;
      const h = Math.max(1, container.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // Animation loop (paused automatically when scrolled out of viewport)
    let isVisible = true;
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    visibilityObserver.observe(container);

    let rafId;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const st = sceneStateRef.current;
      if (st.autoRotate) {
        st.targetSpherical.theta += 0.0018;
      }

      // Smooth spherical camera damping
      st.currentSpherical.theta +=
        (st.targetSpherical.theta - st.currentSpherical.theta) * 0.08;
      st.currentSpherical.phi +=
        (st.targetSpherical.phi - st.currentSpherical.phi) * 0.08;
      st.currentSpherical.radius +=
        (st.targetSpherical.radius - st.currentSpherical.radius) * 0.08;

      const { theta, phi, radius } = st.currentSpherical;
      camera.position.set(
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.cos(theta)
      );
      camera.lookAt(0, 1.35, 0);

      // Exploded level vertical separation & selection highlight
      levelGroups.forEach((grp, idx) => {
        const targetY = st.exploded ? idx * 0.82 : 0;
        grp.position.y += (targetY - grp.position.y) * 0.1;
        const isSelected = st.selectedLevelIdx === idx;
        grp.scale.setScalar(isSelected ? 1.035 : 1.0);
      });

      // Solar position & atmosphere calculation from solarHour (6..22)
      const hr = st.solarHour;
      const clampedDay = Math.min(20, Math.max(6, hr));
      const t = (clampedDay - 6) / 14;
      const sunAngle = t * Math.PI;
      const sunX = Math.cos(sunAngle) * 8.2;
      const sunY = Math.max(0.35, Math.sin(sunAngle) * 6.8);
      const sunZ = 3.4 * Math.sin(sunAngle * 0.8);

      sunLight.position.set(sunX, sunY, sunZ);
      sunOrb.position.set(sunX, sunY, sunZ);

      const isNight = hr >= 19.6 || hr < 6.2;
      const isGolden = (hr >= 16.8 && hr < 19.6) || (hr >= 6.2 && hr < 7.8);

      if (isNight) {
        sunLight.intensity = 0.22;
        sunLight.color.setHex(0x6b88b8);
        hemiLight.intensity = 0.35;
        interiorWarmLight.intensity = 2.4;
        glassMat.emissiveIntensity = 0.85;
        poolMat.emissiveIntensity = 0.9;
        scene.background.setHex(0x0f1110);
      } else if (isGolden) {
        sunLight.intensity = 1.85;
        sunLight.color.setHex(0xffb266);
        hemiLight.intensity = 0.68;
        interiorWarmLight.intensity = 1.35;
        glassMat.emissiveIntensity = 0.5;
        poolMat.emissiveIntensity = 0.55;
        scene.background.setHex(0x181715);
      } else {
        sunLight.intensity = 2.25;
        sunLight.color.setHex(0xfff6e5);
        hemiLight.intensity = 0.95;
        interiorWarmLight.intensity = 0.35;
        glassMat.emissiveIntensity = 0.15;
        poolMat.emissiveIntensity = 0.25;
        scene.background.setHex(0x1b1c19);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      domEl.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      renderer.dispose();
    };
  }, [archetype]);

  const applyCameraPreset = (preset) => {
    setActivePreset(preset.id);
    sceneStateRef.current.autoRotate = false;
    sceneStateRef.current.targetSpherical = {
      theta: preset.theta,
      phi: preset.phi,
      radius: preset.radius,
    };
  };

  const handleToggleExploded = () => {
    setExploded((prev) => {
      const next = !prev;
      trackInteraction('model_3d_exploded_toggled', {
        reference: property?.reference || 'unknown',
        exploded: next,
      });
      return next;
    });
  };

  const handleSolarChange = (newHour) => {
    setSolarHour(newHour);
    trackInteraction('sun_path_scrubbed', {
      reference: property?.reference || 'unknown',
      hour: Math.round(newHour),
    });
  };

  const selectedLevel =
    selectedLevelIdx >= 0 ? levels[selectedLevelIdx] : null;

  return (
    <div className="border border-[#E8E1D5] bg-[#171816] text-[#F7F5F0]">
      {/* Top Bar: Archetype & Camera Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F7F5F0]/12 bg-[#1D1E1B] px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <Box className="h-4 w-4 text-[#B69A69]" strokeWidth={1.6} />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B69A69]">
              Interactive 3D Spatial Maquette
            </p>
            <p className="text-xs text-[#E8E1D5]/85">
              {spatial.archetypeLabel || 'Architectural Massing & Solar Study'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {CAMERA_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyCameraPreset(preset)}
              className={`px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                activePreset === preset.id
                  ? 'bg-[#B69A69] text-[#171816]'
                  : 'border border-[#F7F5F0]/15 bg-[#171816] text-[#E8E1D5]/80 hover:border-[#B69A69]'
              }`}
            >
              {preset.label}
            </button>
          ))}

          <button
            type="button"
            onClick={handleToggleExploded}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors ${
              exploded
                ? 'bg-[#F7F5F0] text-[#171816]'
                : 'border border-[#B69A69]/60 bg-[#222320] text-[#B69A69] hover:bg-[#B69A69] hover:text-[#171816]'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>{exploded ? 'Collapse Floors' : 'Explode Floors'}</span>
          </button>
        </div>
      </div>

      {/* Main 3D WebGL Canvas + Floating HUD */}
      <div className="relative h-[380px] w-full overflow-hidden sm:h-[460px]">
        {webglSupported ? (
          <div
            ref={mountRef}
            className="h-full w-full cursor-grab touch-none active:cursor-grabbing"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-8 text-center">
            <p className="font-serif text-xl text-[#E8E1D5]">
              Interactive 3D Maquette — {spatial.archetypeLabel}
            </p>
          </div>
        )}

        {/* Top Left Orientation Badge */}
        <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 border border-[#F7F5F0]/15 bg-[#171816]/85 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-[#E8E1D5] backdrop-blur-xs">
          <Compass className="h-3.5 w-3.5 text-[#B69A69]" />
          <span>{spatial.orientation || 'South-West Sunset Axis'}</span>
        </div>

        {/* Right Floating Level Inspector Stack */}
        <div className="absolute right-3 top-3 z-10 flex flex-col gap-1.5 sm:right-4 sm:top-4">
          {[...levels].reverse().map((lvl, revIdx) => {
            const actualIdx = levels.length - 1 - revIdx;
            const isSelected = selectedLevelIdx === actualIdx;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => {
                  setSelectedLevelIdx(isSelected ? -1 : actualIdx);
                  if (!exploded) setExploded(true);
                }}
                className={`flex items-center justify-between gap-2.5 border px-3 py-1.5 text-left text-[10px] font-semibold uppercase tracking-[0.16em] backdrop-blur-xs transition-all ${
                  isSelected
                    ? 'border-[#B69A69] bg-[#B69A69] text-[#171816]'
                    : 'border-[#F7F5F0]/20 bg-[#171816]/85 text-[#F7F5F0] hover:border-[#B69A69]'
                }`}
              >
                <span>{lvl.code}</span>
                <span className="hidden sm:inline truncate max-w-[130px]">
                  {lvl.name.split('&')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Level Callout Card */}
        {selectedLevel && (
          <div className="absolute bottom-3 left-3 right-3 z-10 border border-[#B69A69]/50 bg-[#171816]/92 p-3.5 backdrop-blur-md sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B69A69]">
                {selectedLevel.code} · Ceiling {selectedLevel.ceiling}
              </span>
              <span className="text-xs font-semibold tabular-nums text-[#F7F5F0]">
                {formatArea(selectedLevel.sqm, areaUnit)}
              </span>
            </div>
            <p className="mt-1 font-serif text-lg text-[#F7F5F0]">
              {selectedLevel.name}
            </p>
            <p className="mt-0.5 text-xs text-[#E8E1D5]/80">
              {selectedLevel.highlight}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Solar-Path & Time-of-Day Scrubber */}
      <div className="border-t border-[#F7F5F0]/12 bg-[#1D1E1B] px-4 py-3.5 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[#B69A69]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B69A69]">
              Solar Path & Daylight Study:
            </span>
            <span className="text-xs font-medium tabular-nums text-[#F7F5F0]">
              {formatHourLabel(solarHour)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {SOLAR_PRESETS.map((preset) => {
              const Icon = preset.icon;
              const isNear = Math.abs(solarHour - preset.hour) < 0.9;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleSolarChange(preset.hour)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] transition-colors ${
                    isNear
                      ? 'bg-[#B69A69] text-[#171816]'
                      : 'border border-[#F7F5F0]/15 bg-[#171816] text-[#E8E1D5]/75 hover:border-[#B69A69]'
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  <span>{preset.label}</span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => {
                setExploded(false);
                setSelectedLevelIdx(-1);
                applyCameraPreset(CAMERA_PRESETS[0]);
                sceneStateRef.current.autoRotate = true;
              }}
              aria-label="Reset 3D view"
              className="inline-flex items-center gap-1 border border-[#F7F5F0]/15 bg-[#171816] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#E8E1D5]/75 hover:border-[#B69A69]"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <span className="text-[10px] tabular-nums text-[#E8E1D5]/60">06:00</span>
          <input
            type="range"
            aria-label="Scrub solar hour from sunrise to night"
            min={6}
            max={22}
            step={0.25}
            value={solarHour}
            onChange={(e) => handleSolarChange(Number(e.target.value))}
            className="h-1.5 flex-1 cursor-pointer accent-[#B69A69]"
          />
          <span className="text-[10px] tabular-nums text-[#E8E1D5]/60">22:00</span>
        </div>
      </div>
    </div>
  );
}

