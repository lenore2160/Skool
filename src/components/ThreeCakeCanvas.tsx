import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, RotateCw, Eye, Scissors } from 'lucide-react';
import { Language } from '../types';
import { Fraction } from './Fraction';

interface ThreeCakeCanvasProps {
  sliceCount: number;
  highlightedIndex?: number | null;
  onSelectSlice?: (index: number) => void;
  separation: number; // 0 (together) to 1 (pulled apart)
  language: Language;
  autoRotate?: boolean;
  onToggleAutoRotate?: (spinning: boolean) => void;
  hideOverlays?: boolean;
}

export const ThreeCakeCanvas: React.FC<ThreeCakeCanvasProps> = ({
  sliceCount,
  highlightedIndex = null,
  onSelectSlice,
  separation,
  language,
  autoRotate: autoRotateProp,
  onToggleAutoRotate,
  hideOverlays = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [internalAutoRotate, setInternalAutoRotate] = useState<boolean>(true);
  const autoRotate = autoRotateProp !== undefined ? autoRotateProp : internalAutoRotate;
  const setAutoRotate = onToggleAutoRotate || setInternalAutoRotate;
  const autoRotateRef = useRef<boolean>(true);
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);

  // Keep autoRotateRef in sync with state/prop
  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  // Refs for animation loop and Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const entirePictureGroupRef = useRef<THREE.Group | null>(null);
  const cakeGroupRef = useRef<THREE.Group | null>(null);
  const sliceMeshesRef = useRef<THREE.Mesh[]>([]);
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const reqIdRef = useRef<number>(0);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera - angled and targeted to center the cake in the rotation space
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 320;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 4.4, 6.7);
    camera.lookAt(0, 0.55, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Warm Bakery Lighting - bright and inviting
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 1.05);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xfffaed, 1.5);
    mainLight.position.set(5, 8, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0xffedd5, 0.7);
    rimLight.position.set(-5, 4, -4);
    scene.add(rimLight);

    // Entire Picture Master Group (Rotates cake and cutting board together as one unit)
    const entirePictureGroup = new THREE.Group();
    entirePictureGroup.position.y = 0.32; // Moved up to center vertically in the canvas space
    entirePictureGroupRef.current = entirePictureGroup;
    scene.add(entirePictureGroup);

    // Wooden Cake Cutting Board & Stand
    const standGroup = new THREE.Group();
    const plateGeo = new THREE.CylinderGeometry(2.55, 2.65, 0.18, 48);
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x8a5542,
      roughness: 0.65,
      metalness: 0.08,
    });
    const plateMesh = new THREE.Mesh(plateGeo, woodMat);
    plateMesh.position.y = -0.1;
    plateMesh.receiveShadow = true;
    standGroup.add(plateMesh);

    const stemGeo = new THREE.CylinderGeometry(0.75, 0.95, 0.45, 24);
    const stemMesh = new THREE.Mesh(stemGeo, woodMat);
    stemMesh.position.y = -0.38;
    standGroup.add(stemMesh);

    const baseGeo = new THREE.CylinderGeometry(1.7, 1.9, 0.15, 32);
    const baseMesh = new THREE.Mesh(baseGeo, woodMat);
    baseMesh.position.y = -0.66;
    standGroup.add(baseMesh);

    // Cutting board is part of the rotating picture
    entirePictureGroup.add(standGroup);

    // Cake Group
    const cakeGroup = new THREE.Group();
    cakeGroupRef.current = cakeGroup;
    entirePictureGroup.add(cakeGroup);

    // Build the Cake slices dynamically
    rebuildCakeSlices(cakeGroup, sliceCount, separation);

    // Mouse drag controls for interactive orbit of entire picture
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !entirePictureGroupRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      entirePictureGroupRef.current.rotation.y += deltaX * 0.01;
      entirePictureGroupRef.current.rotation.x = Math.max(
        -0.22,
        Math.min(0.65, entirePictureGroupRef.current.rotation.x + deltaY * 0.008)
      );

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    // Touch controls
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !entirePictureGroupRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

      entirePictureGroupRef.current.rotation.y += deltaX * 0.01;
      entirePictureGroupRef.current.rotation.x = Math.max(
        -0.22,
        Math.min(0.65, entirePictureGroupRef.current.rotation.x + deltaY * 0.008)
      );

      previousMousePositionRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    // Animation Loop: Entire picture rotates together (cutting board + cake)
    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);

      if (autoRotateRef.current && entirePictureGroupRef.current && !isDraggingRef.current) {
        entirePictureGroupRef.current.rotation.y += 0.007;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = newW / newH;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(reqIdRef.current);
      resizeObserver.disconnect();
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Update slices when sliceCount or separation changes
  useEffect(() => {
    if (cakeGroupRef.current) {
      rebuildCakeSlices(cakeGroupRef.current, sliceCount, separation);
    }
  }, [sliceCount, separation]);

// Cached CanvasTexture representing artisanal chocolate sponge cake with caramel layers
let cachedCaramelTexture: THREE.CanvasTexture | null = null;

function getCaramelTexture(): THREE.CanvasTexture {
  if (cachedCaramelTexture) return cachedCaramelTexture;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    cachedCaramelTexture = new THREE.CanvasTexture(canvas);
    return cachedCaramelTexture;
  }

  // 1. Dark moist chocolate sponge cake background
  ctx.fillStyle = '#3a1f10';
  ctx.fillRect(0, 0, 512, 256);

  // 2. Realistic sponge crumb noise & texture
  const imgData = ctx.getImageData(0, 0, 512, 256);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 36;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise * 0.65));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise * 0.45));
  }
  ctx.putImageData(imgData, 0, 0);

  // 3. Fluffy porous crumb pockets / chocolate cake pores
  for (let c = 0; c < 380; c++) {
    const cx = Math.random() * 512;
    const cy = Math.random() * 256;
    const cr = 0.6 + Math.random() * 1.8;
    ctx.fillStyle = Math.random() > 0.4 ? '#221107' : '#522f1a';
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.fill();
  }

  // 4. Golden gooey caramel filling ribbons
  const drawCaramelLayer = (yCenter: number, thickness: number) => {
    // Moist caramel soak border
    ctx.fillStyle = '#78350f';
    ctx.fillRect(0, yCenter - thickness / 2 - 2, 512, thickness + 4);

    // Luscious golden caramel gradient
    const grad = ctx.createLinearGradient(0, yCenter - thickness / 2, 0, yCenter + thickness / 2);
    grad.addColorStop(0, '#92400e');    // deep caramel edge
    grad.addColorStop(0.2, '#d97706');  // rich golden caramel
    grad.addColorStop(0.5, '#fef08a');  // glossy caramel shimmer / sheen
    grad.addColorStop(0.8, '#f59e0b');  // warm amber caramel
    grad.addColorStop(1, '#78350f');    // deep caramel border
    ctx.fillStyle = grad;
    ctx.fillRect(0, yCenter - thickness / 2, 512, thickness);

    // Flowing caramel ripple line
    ctx.strokeStyle = '#fef9c3';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(0, yCenter);
    for (let x = 0; x < 512; x += 14) {
      ctx.lineTo(x, yCenter + Math.sin(x * 0.08) * 1.8);
    }
    ctx.stroke();
  };

  // Two horizontal caramel filling layers across the cake slice cross section
  drawCaramelLayer(86, 16);  // Upper caramel layer (~66% cake height)
  drawCaramelLayer(170, 16); // Lower caramel layer (~33% cake height)

  // Top chocolate ganache frosting line (y = 0 to 12)
  const topGrad = ctx.createLinearGradient(0, 0, 0, 12);
  topGrad.addColorStop(0, '#1c0c05');
  topGrad.addColorStop(1, '#381e0e');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, 512, 12);

  // Bottom cake crust (y = 244 to 256)
  ctx.fillStyle = '#180a03';
  ctx.fillRect(0, 246, 512, 10);

  // Outer cake rim edge at x = 502 to 512 (frosting coat border)
  const rimGrad = ctx.createLinearGradient(500, 0, 512, 0);
  rimGrad.addColorStop(0, 'rgba(28, 12, 5, 0)');
  rimGrad.addColorStop(1, '#1c0c05');
  ctx.fillStyle = rimGrad;
  ctx.fillRect(500, 0, 12, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  cachedCaramelTexture = texture;
  return cachedCaramelTexture;
}

// Generates the two rectangular interior cut faces of a cake slice wedge
// Complete with outward normals and UV mapping to display solid chocolate cake & caramel layers
const createCutFaceGeometry = (
  radius: number,
  height: number,
  thetaStart: number,
  thetaEnd: number
): THREE.BufferGeometry => {
  const geo = new THREE.BufferGeometry();

  const sinStart = Math.sin(thetaStart);
  const cosStart = Math.cos(thetaStart);
  const sinEnd = Math.sin(thetaEnd);
  const cosEnd = Math.cos(thetaEnd);

  // 8 vertices: 4 for Face 1 (at thetaStart), 4 for Face 2 (at thetaEnd)
  const positions = new Float32Array([
    // Face 1: Trailing edge of slice (Center to Rim at thetaStart)
    0, 0, 0, // 0: Center Bottom
    radius * sinStart, 0, radius * cosStart, // 1: Rim Bottom
    radius * sinStart, height, radius * cosStart, // 2: Rim Top
    0, height, 0, // 3: Center Top

    // Face 2: Leading edge of slice (Rim to Center at thetaEnd)
    radius * sinEnd, 0, radius * cosEnd, // 4: Rim Bottom
    0, 0, 0, // 5: Center Bottom
    0, height, 0, // 6: Center Top
    radius * sinEnd, height, radius * cosEnd, // 7: Rim Top
  ]);

  // UV mapping:
  // Center of cake is u=0, outer rim is u=1
  // Bottom of cake is v=0, top of cake is v=1
  const uvs = new Float32Array([
    // Face 1:
    0, 0, // 0: Center Bottom
    1, 0, // 1: Rim Bottom
    1, 1, // 2: Rim Top
    0, 1, // 3: Center Top

    // Face 2:
    1, 0, // 4: Rim Bottom
    0, 0, // 5: Center Bottom
    0, 1, // 6: Center Top
    1, 1, // 7: Rim Top
  ]);

  // Outward-facing triangles for both cut walls
  const indices = [
    // Face 1
    0, 1, 2,
    0, 2, 3,

    // Face 2
    4, 5, 6,
    4, 6, 7,
  ];

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();

  return geo;
};

  const rebuildCakeSlices = (group: THREE.Group, count: number, sep: number) => {
    // Clear previous slices and candles cleanly
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      child.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          node.geometry.dispose();
          if (Array.isArray(node.material)) {
            node.material.forEach((m) => m.dispose());
          } else {
            node.material.dispose();
          }
        }
      });
    }
    sliceMeshesRef.current = [];

    const radius = 1.85;
    const height = 0.95;
    const anglePerSlice = (Math.PI * 2) / count;
    // Radial separation distance: glides smoothly outward as slider increases
    const explodeDist = sep * 0.72;

    // Vibrant Frosting and Cake materials - 16 delicious, distinctive, brightly-glazed bakery colors!
    // Keeps the same color identities while giving them a cheerful, brighter luminescence
    const cakeColors = [
      0xfb7185, // 1: Bright Strawberry Pink (formerly 0xf472b6)
      0xfcd34d, // 2: Bright Golden Honey / Vanilla (formerly 0xfbbf24)
      0x60c5fa, // 3: Bright Sky Blueberry (formerly 0x38bdf8)
      0x5eead4, // 4: Bright Fresh Mint (formerly 0x34d399)
      0xc4b5fd, // 5: Bright Lavender Taro (formerly 0xa78bfa)
      0xfb8c8c, // 6: Bright Coral Berry (formerly 0xf87171)
      0xfda967, // 7: Bright Tangerine Peach (formerly 0xfb923c)
      0x6ee787, // 8: Bright Sweet Pistachio (formerly 0x4ade80)
      0xf0abfc, // 9: Bright Orchid Dragonfruit (formerly 0xe879f9)
      0xfde047, // 10: Bright Lemon Buttercream (formerly 0xfacc15)
      0x67e8f9, // 11: Bright Seafoam Glaze (formerly 0x2dd4bf)
      0x9ea9fd, // 12: Bright Royal Berry / Indigo (formerly 0x818cf8)
      0xfb647f, // 13: Bright Crimson Cherry (formerly 0xf43f5e)
      0xbef264, // 14: Bright Sweet Lime (formerly 0xa3e635)
      0x38bdf8, // 15: Bright Tropical Teal (formerly 0x06b6d4)
      0xfba45c, // 16: Bright Apricot Buttercream (formerly 0xf97316)
    ];

    for (let i = 0; i < count; i++) {
      const thetaStart = i * anglePerSlice;
      const thetaEnd = thetaStart + anglePerSlice;
      const midAngle = thetaStart + anglePerSlice / 2;

      // Slice group to allow radial translation
      const sliceGroup = new THREE.Group();

      // TRUE Radial Translation:
      // In Three.js CylinderGeometry, x = radius * sin(theta) and z = radius * cos(theta).
      // Using dirX = sin(midAngle) and dirZ = cos(midAngle) ensures every slice spreads
      // strictly outward along its own radius, forming a neat, symmetrical expanding circle!
      const dirX = Math.sin(midAngle);
      const dirZ = Math.cos(midAngle);
      const offsetX = dirX * explodeDist;
      const offsetZ = dirZ * explodeDist;
      sliceGroup.position.set(offsetX, 0, offsetZ);

      // Curved outer shell and caps for the slice
      const radialSegs = Math.max(6, Math.floor(72 / count));
      const sliceGeo = new THREE.CylinderGeometry(
        radius,
        radius,
        height,
        radialSegs,
        1,
        false,
        thetaStart,
        anglePerSlice
      );

      // Frosting color for this slice
      const colorIndex = i % cakeColors.length;
      const frostingColor = cakeColors[colorIndex];

      // Outer curved side frosting
      const sideMat = new THREE.MeshStandardMaterial({
        color: frostingColor,
        roughness: 0.35,
        metalness: 0.05,
      });

      // Top cap frosting
      const topMat = new THREE.MeshStandardMaterial({
        color: frostingColor,
        roughness: 0.3,
        metalness: 0.05,
      });

      // Bottom cap chocolate cake base
      const bottomMat = new THREE.MeshStandardMaterial({
        color: 0x241208, // dark chocolate sponge base
        roughness: 0.8,
        metalness: 0.02,
      });

      const sliceMesh = new THREE.Mesh(sliceGeo, [sideMat, topMat, bottomMat]);
      sliceMesh.position.y = height / 2;
      sliceMesh.castShadow = true;
      sliceMesh.receiveShadow = true;
      (sliceMesh as unknown as { sliceIndex: number }).sliceIndex = i;

      sliceGroup.add(sliceMesh);
      sliceMeshesRef.current.push(sliceMesh);

      // Solid Interior Cut Faces: Reveals authentic chocolate sponge cake with caramel layers!
      const cutGeo = createCutFaceGeometry(radius, height, thetaStart, thetaEnd);
      const cutMat = new THREE.MeshStandardMaterial({
        map: getCaramelTexture(),
        roughness: 0.52,
        metalness: 0.06,
        side: THREE.DoubleSide,
      });

      const cutMesh = new THREE.Mesh(cutGeo, cutMat);
      cutMesh.castShadow = true;
      cutMesh.receiveShadow = true;
      (cutMesh as unknown as { sliceIndex: number }).sliceIndex = i;

      sliceGroup.add(cutMesh);
      sliceMeshesRef.current.push(cutMesh);

      // Slices are clean, smooth frosted bakery cake wedges without candles or stick sprinkles
      group.add(sliceGroup);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[250px] sm:min-h-[280px] rounded-xl overflow-hidden select-none">
      {/* Three.js Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Controls and Indicator overlays (hidden if controlled outside) */}
      {!hideOverlays && (
        <>
          {/* Floating 3D Controls overlay: Two dedicated buttons for Spinning and Paused */}
          <div
            className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm p-1.5 rounded-2xl border-2 border-amber-400 shadow-md z-30 pointer-events-auto"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            {/* Button 1: Spinning */}
            <button
              type="button"
              id="canvas-spin-btn"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                isDraggingRef.current = false;
                autoRotateRef.current = true;
                setAutoRotate(true);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                autoRotate
                  ? 'bg-amber-600 text-white shadow-md border border-amber-500 scale-102 ring-2 ring-amber-300/70'
                  : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 hover:text-amber-950'
              }`}
              title={language === 'en' ? 'Keep 3D cake spinning' : 'Roteer 3D-koek'}
            >
              <RotateCw className="w-3.5 h-3.5 shrink-0" />
              <span>{language === 'en' ? 'Spinning' : 'Roteer'}</span>
            </button>

            {/* Button 2: Paused */}
            <button
              type="button"
              id="canvas-pause-btn"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                autoRotateRef.current = false;
                setAutoRotate(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                !autoRotate
                  ? 'bg-[#3b1e0f] text-amber-100 shadow-md border border-[#522a15] scale-102 ring-2 ring-amber-400/70'
                  : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 hover:text-amber-950'
              }`}
              title={language === 'en' ? 'Pause 3D cake rotation' : 'Stop 3D-koek'}
            >
              <span className="flex items-center gap-0.5">
                <span className="w-1 h-3 rounded-xs bg-current inline-block" />
                <span className="w-1 h-3 rounded-xs bg-current inline-block" />
              </span>
              <span>{language === 'en' ? 'Paused' : 'Stop'}</span>
            </button>
          </div>

          {/* 3D Fraction Visual Indicator Overlay */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm border border-amber-300 rounded-2xl px-3 py-1.5 shadow-sm flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-500 text-white flex items-center justify-center font-mono font-black text-xs shadow-xs p-1">
              <Fraction
                numerator={1}
                denominator={sliceCount}
                size="xs"
                className="text-white"
                lineClassName="border-white"
              />
            </div>
            <div>
              <div className="text-[10px] uppercase font-black tracking-wider text-amber-800">
                {language === 'en' ? 'Each Birthday Slice Size' : 'Grootte van Elke Stukkie'}
              </div>
              <div className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                <Fraction
                  numerator={1}
                  denominator={sliceCount}
                  size="xs"
                  className="text-amber-950"
                  lineClassName="border-amber-950"
                />
                <span>
                  {sliceCount === 2
                    ? `(${language === 'en' ? 'Huge Half!' : 'Reuse-helfte!'})`
                    : sliceCount === 4
                    ? `(${language === 'en' ? 'Generous Quarter' : 'Goeie Kwart'})`
                    : sliceCount === 8
                    ? `(${language === 'en' ? 'Standard Slice' : 'Gewone Stukkie'})`
                    : sliceCount === 12
                    ? `(${language === 'en' ? '12 Slices: each' : '12 Stukkies: elk'})`
                    : sliceCount === 16
                    ? `(${language === 'en' ? '16 Slices: each' : '16 Stukkies: elk'})`
                    : `(${language === 'en' ? 'of the cake' : 'van die koek'})`}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
