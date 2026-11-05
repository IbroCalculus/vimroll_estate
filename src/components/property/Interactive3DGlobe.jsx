import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import {
  ArrowUpRight,
  Compass,
  Globe2,
  Plane,
  RotateCcw,
  Sun,
} from 'lucide-react';
import { GLOBAL_AVIATION_ARCS, getCityIntelligence } from '../../data/spatialMedia';
import { formatPrice } from '../../utils/formatters';
import { usePropertyStore } from '../../store/usePropertyStore';
import { trackInteraction } from '../../utils/analytics';

function latLngToVector3(lat, lng, radius) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

/**
 * Interactive 3D WebGL Global Enclave Globe & Private-Aviation Corridor Explorer.
 * Renders a dark obsidian architectural globe with latitude/longitude graticules,
 * 6 glowing enclave beacons (Dubai, London, New York, Paris, Marbella, Lagos),
 * and elevated 3D great-circle private-jet flight arcs.
 */
export function Interactive3DGlobe({ locations = [] }) {
  const mountRef = useRef(null);
  const currency = usePropertyStore((state) => state.currency);

  const [selectedCity, setSelectedCity] = useState('Dubai');
  const [autoSpin, setAutoSpin] = useState(true);
  const [webglReady, setWebglReady] = useState(true);

  const targetRotationRef = useRef({ y: -0.65, x: 0.32 });
  const autoSpinRef = useRef(autoSpin);

  useEffect(() => {
    autoSpinRef.current = autoSpin;
  }, [autoSpin]);

  const activeLocation = useMemo(() => {
    return (
      locations.find((l) => l.city === selectedCity) ||
      locations[0] || {
        city: 'Dubai',
        country: 'United Arab Emirates',
        propertyCount: 3,
        startingPrice: 12900000,
        tagline: 'Architectural ambition along private Arabian Gulf fronds',
        intelligence: getCityIntelligence('Dubai'),
      }
    );
  }, [locations, selectedCity]);

  const activeCorridors = useMemo(() => {
    return GLOBAL_AVIATION_ARCS.filter(
      (arc) => arc.from === selectedCity || arc.to === selectedCity
    );
  }, [selectedCity]);

  const handleSelectCity = (city) => {
    setSelectedCity(city);
    setAutoSpin(false);
    const intel = getCityIntelligence(city);
    // Rotate globe so selected city faces viewer
    const targetY = -((intel.lng + 95) * Math.PI) / 180;
    const targetX = Math.max(-0.45, Math.min(0.55, (intel.lat * Math.PI) / 260));
    targetRotationRef.current = { y: targetY, x: targetX };
    trackInteraction('globe_enclave_selected', { city });
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglReady(false);
      return undefined;
    }

    const width = container.clientWidth || 720;
    const height = container.clientHeight || 480;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 7.6);

    // Lighting
    const ambient = new THREE.AmbientLight(0xf7f5f0, 0.9);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffe4b8, 1.8);
    keyLight.position.set(6, 5, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xb69a69, 1.1);
    rimLight.position.set(-6, -3, -4);
    scene.add(rimLight);

    // Root Globe Group
    const globeGroup = new THREE.Group();
    globeGroup.rotation.y = targetRotationRef.current.y;
    globeGroup.rotation.x = targetRotationRef.current.x;
    scene.add(globeGroup);

    const RADIUS = 2.25;

    // Core Obsidian Sphere
    const sphereGeo = new THREE.SphereGeometry(RADIUS, 64, 64);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x161715,
      roughness: 0.72,
      metalness: 0.22,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(sphereMesh);

    // Subtle Lat/Lng Wireframe Graticule Shell
    const graticuleGeo = new THREE.SphereGeometry(RADIUS + 0.008, 24, 16);
    const graticuleMat = new THREE.MeshBasicMaterial({
      color: 0xb69a69,
      wireframe: true,
      transparent: true,
      opacity: 0.13,
    });
    const graticuleMesh = new THREE.Mesh(graticuleGeo, graticuleMat);
    globeGroup.add(graticuleMesh);

    // Outer Champagne Atmospheric Halo Ring
    const haloRingGeo = new THREE.RingGeometry(RADIUS + 0.12, RADIUS + 0.145, 96);
    const haloRingMat = new THREE.MeshBasicMaterial({
      color: 0xb69a69,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
    });
    const haloRing = new THREE.Mesh(haloRingGeo, haloRingMat);
    scene.add(haloRing);

    // Enclave Coordinate Beacons
    const cities = ['Dubai', 'London', 'New York', 'Paris', 'Marbella', 'Lagos'];
    const beaconMeshes = [];

    cities.forEach((city) => {
      const intel = getCityIntelligence(city);
      const pos = latLngToVector3(intel.lat, intel.lng, RADIUS + 0.02);

      // Glowing Pin Sphere
      const pinGeo = new THREE.SphereGeometry(0.055, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: 0xb69a69 });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.copy(pos);
      globeGroup.add(pin);

      // Vertical Beacon Spire
      const normal = pos.clone().normalize();
      const spireEnd = pos.clone().add(normal.multiplyScalar(0.22));
      const spireGeo = new THREE.BufferGeometry().setFromPoints([pos, spireEnd]);
      const spireMat = new THREE.LineBasicMaterial({
        color: 0xf7f5f0,
        transparent: true,
        opacity: 0.85,
      });
      globeGroup.add(new THREE.Line(spireGeo, spireMat));

      beaconMeshes.push({ city, pin, spireEnd });
    });

    // Great-Circle Private Aviation Flight Arcs
    GLOBAL_AVIATION_ARCS.forEach((arc) => {
      const fromIntel = getCityIntelligence(arc.from);
      const toIntel = getCityIntelligence(arc.to);
      const startVec = latLngToVector3(fromIntel.lat, fromIntel.lng, RADIUS + 0.02);
      const endVec = latLngToVector3(toIntel.lat, toIntel.lng, RADIUS + 0.02);

      const midVec = startVec
        .clone()
        .add(endVec)
        .multiplyScalar(0.5)
        .normalize()
        .multiplyScalar(RADIUS + 0.58);

      const curve = new THREE.QuadraticBezierCurve3(startVec, midVec, endVec);
      const points = curve.getPoints(44);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineBasicMaterial({
        color: 0xb69a69,
        transparent: true,
        opacity: 0.48,
      });
      const arcLine = new THREE.Line(arcGeo, arcMat);
      globeGroup.add(arcLine);
    });

    // Pointer Drag Orbit
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
      setAutoSpin(false);
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      prevX = e.clientX;
      prevY = e.clientY;

      targetRotationRef.current.y += dx * 0.0065;
      targetRotationRef.current.x = Math.max(
        -0.65,
        Math.min(0.65, targetRotationRef.current.x + dy * 0.005)
      );
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 720;
      const h = container.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let rafId;
    const animate = () => {
      rafId = requestAnimationFrame(animate);

      if (autoSpinRef.current && !isDragging) {
        targetRotationRef.current.y += 0.0022;
      }

      globeGroup.rotation.y +=
        (targetRotationRef.current.y - globeGroup.rotation.y) * 0.08;
      globeGroup.rotation.x +=
        (targetRotationRef.current.x - globeGroup.rotation.x) * 0.08;

      renderer.render(scene, camera);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      domElem.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  const cityIntel =
    activeLocation.intelligence || getCityIntelligence(activeLocation.city);

  return (
    <div className="border border-[#F7F5F0]/15 bg-[#141513] text-[#F7F5F0] shadow-2xl">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F7F5F0]/12 bg-[#1B1C19] px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-2.5">
          <Globe2 className="h-4 w-4 text-[#B69A69]" strokeWidth={1.6} />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#B69A69]">
              3D Global Enclave & Private Aviation Network
            </p>
            <p className="text-xs text-[#E8E1D5]/75">
              Drag to orbit the 3D globe or select a capital to inspect flight corridors
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {['Dubai', 'London', 'New York', 'Paris', 'Marbella', 'Lagos'].map(
            (city) => {
              const isSelected = selectedCity === city;
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => handleSelectCity(city)}
                  className={`border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                    isSelected
                      ? 'border-[#B69A69] bg-[#B69A69] text-[#171816]'
                      : 'border-[#F7F5F0]/20 bg-[#141513] text-[#E8E1D5] hover:border-[#B69A69]/60'
                  }`}
                >
                  {city}
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Main 3D Globe Stage + Enclave Dossier Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left: 3D WebGL Globe Canvas */}
        <div className="relative h-[380px] w-full overflow-hidden border-b border-[#F7F5F0]/12 sm:h-[460px] lg:col-span-7 lg:border-r lg:border-b-0">
          {webglReady ? (
            <div
              ref={mountRef}
              className="h-full w-full cursor-grab active:cursor-grabbing"
              aria-label="Interactive 3D globe showing VIMROLL Estate global enclaves"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-8 text-center">
              <p className="text-sm text-[#E8E1D5]/80">
                Interactive 3D Globe active — select any destination pill above to inspect private aviation corridors.
              </p>
            </div>
          )}

          {/* Overlay Controls */}
          <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 border border-[#F7F5F0]/15 bg-[#171816]/85 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-[#E8E1D5]/85 backdrop-blur-xs">
              <Compass className="h-3.5 w-3.5 text-[#B69A69]" />
              <span>
                {cityIntel.lat.toFixed(2)}° N · {Math.abs(cityIntel.lng).toFixed(2)}°{' '}
                {cityIntel.lng >= 0 ? 'E' : 'W'}
              </span>
            </span>

            <button
              type="button"
              onClick={() => setAutoSpin((s) => !s)}
              className="pointer-events-auto inline-flex items-center gap-1.5 border border-[#F7F5F0]/20 bg-[#171816]/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#F7F5F0] backdrop-blur-xs transition-colors hover:border-[#B69A69] hover:text-[#B69A69]"
            >
              <RotateCcw className="h-3 w-3 text-[#B69A69]" />
              <span>{autoSpin ? 'Pause Orbit' : 'Resume Orbit'}</span>
            </button>
          </div>
        </div>

        {/* Right: Selected Enclave & Private Jet Corridors */}
        <div className="flex flex-col justify-between bg-[#181917] p-5 sm:p-7 lg:col-span-5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#B69A69]">
                {activeLocation.country}
              </span>
              <span className="border border-[#B69A69]/40 bg-[#B69A69]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#B69A69]">
                {activeLocation.propertyCount || 3} Curated Estates
              </span>
            </div>

            <h3 className="mt-2 font-serif text-3xl font-normal text-[#F7F5F0] sm:text-4xl">
              {activeLocation.city}
            </h3>
            <p className="mt-1 text-xs text-[#E8E1D5]/75">
              {activeLocation.tagline}
            </p>

            {/* Enclave Metadata Grid */}
            <div className="mt-5 grid grid-cols-2 gap-3 border-y border-[#F7F5F0]/12 py-4 text-xs">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#E8E1D5]/55">
                  Entry Guide Price
                </p>
                <p className="mt-1 font-serif text-xl text-[#B69A69] tabular-nums">
                  {activeLocation.startingPrice
                    ? formatPrice(activeLocation.startingPrice, currency, true)
                    : '$9.5M+'}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#E8E1D5]/55">
                  Local Climate & Zone
                </p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-[#F7F5F0]">
                  <Sun className="h-3.5 w-3.5 text-[#B69A69]" />
                  <span>
                    {cityIntel.climate} · {cityIntel.timezone}
                  </span>
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#E8E1D5]/55">
                  Designated Private Aviation Hub
                </p>
                <p className="mt-1 text-xs font-medium text-[#E8E1D5]">
                  {cityIntel.privateAirport}
                </p>
              </div>
            </div>

            {/* Direct Private Jet Flight Corridors */}
            <div className="mt-5">
              <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B69A69]">
                <Plane className="h-3.5 w-3.5" />
                <span>Direct Private Aviation Corridors</span>
              </p>

              <div className="mt-3 space-y-2">
                {activeCorridors.map((arc) => {
                  const partnerCity =
                    arc.from === selectedCity ? arc.to : arc.from;
                  return (
                    <div
                      key={`${arc.from}-${arc.to}`}
                      className="flex items-center justify-between border border-[#F7F5F0]/12 bg-[#141513] px-3.5 py-2.5 text-xs"
                    >
                      <div>
                        <span className="font-semibold text-[#F7F5F0]">
                          {selectedCity} ↔ {partnerCity}
                        </span>
                        <span className="ml-2 text-[11px] text-[#E8E1D5]/60">
                          {arc.aircraft}
                        </span>
                      </div>
                      <div className="text-right tabular-nums">
                        <span className="font-semibold text-[#B69A69]">
                          {arc.flightTime}
                        </span>
                        <span className="ml-2 text-[10px] text-[#E8E1D5]/50">
                          {arc.distanceNm}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4">
            <Link
              to={`/properties?location=${encodeURIComponent(activeLocation.city)}`}
              className="inline-flex w-full items-center justify-center gap-2 bg-[#B69A69] px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#171816] transition-colors hover:bg-[#c8ab77]"
            >
              <span>Explore {activeLocation.city} Portfolio</span>
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.6} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

