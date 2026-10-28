import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  X,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Zap,
  Shield,
  Activity,
  Award,
  ChevronRight,
  Flame,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Info,
} from 'lucide-react';
import { proceduralAudio } from '../audio/ProceduralAudio';

interface PhageGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type GameState = 'title' | 'playing' | 'paused' | 'victory' | 'gameover';
type MissionStage = 'docking' | 'injection' | 'assembly' | 'lysis';

export const PhageGameModal: React.FC<PhageGameModalProps> = ({ isOpen, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<GameState>('title');
  const [missionStage, setMissionStage] = useState<MissionStage>('docking');
  const [phageIntegrity, setPhageIntegrity] = useState<number>(100);
  const [score, setScore] = useState<number>(0);
  const [virionsProduced, setVirionsProduced] = useState<number>(0);
  const [dockingDistance, setDockingDistance] = useState<number>(100);
  const [isMuted, setIsMuted] = useState<boolean>(proceduralAudio.getIsMuted());
  const [injectionFill, setInjectionFill] = useState<number>(0);

  // Keyboard controls tracking
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  // Three.js internal references
  const gameEngine = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    animFrameId: number | null;
    playerPhage: THREE.Group | null;
    hostBacterium: THREE.Group | null;
    enzymes: THREE.Mesh[];
    particles: THREE.Points | null;
    virionMeshes: THREE.Mesh[];
    playerPos: { x: number; y: number; z: number };
    playerVel: { x: number; y: number; z: number };
    receptorTarget: THREE.Vector3;
    isDocked: boolean;
  }>({
    scene: null,
    camera: null,
    renderer: null,
    animFrameId: null,
    playerPhage: null,
    hostBacterium: null,
    enzymes: [],
    particles: null,
    virionMeshes: [],
    playerPos: { x: 0, y: 1.5, z: 6 },
    playerVel: { x: 0, y: 0, z: 0 },
    receptorTarget: new THREE.Vector3(0, 0, 0),
    isDocked: false,
  });

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    proceduralAudio.setMuted(nextMuted);
  };

  // Keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = true;
      if (e.code === 'KeyM') {
        toggleMute();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isMuted]);

  // Main 3D Game Setup
  useEffect(() => {
    if (!isOpen) return;
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#030712');
    scene.fog = new THREE.FogExp2('#030712', 0.04);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 3, 10);
    camera.lookAt(0, 0, 0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight('#1E293B', 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight('#38BDF8', 2.0);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const redDangerLight = new THREE.PointLight('#EF4444', 1.5, 15);
    redDangerLight.position.set(-6, 2, 2);
    scene.add(redDangerLight);

    // 5. Background Cytoplasm / Microscopic Particles
    const partCount = 400;
    const partGeo = new THREE.BufferGeometry();
    const partPos = new Float32Array(partCount * 3);
    for (let i = 0; i < partCount * 3; i += 3) {
      partPos[i] = (Math.random() - 0.5) * 35;
      partPos[i + 1] = (Math.random() - 0.5) * 25;
      partPos[i + 2] = (Math.random() - 0.5) * 35;
    }
    partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
    const partMat = new THREE.PointsMaterial({
      color: '#38BDF8',
      size: 0.12,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);

    // 6. Host Bacterial Cell (Large pill / capsule bacterium)
    const hostBacterium = new THREE.Group();
    hostBacterium.position.set(0, -1.8, 0);
    scene.add(hostBacterium);

    // Bacterial body (curved capsule)
    const bacGeo = new THREE.CapsuleGeometry(2.5, 6, 16, 32);
    bacGeo.rotateZ(Math.PI / 2);
    const bacMat = new THREE.MeshStandardMaterial({
      color: '#064E3B',
      roughness: 0.6,
      metalness: 0.1,
    });
    const bacMesh = new THREE.Mesh(bacGeo, bacMat);
    hostBacterium.add(bacMesh);

    // Outer membrane peptidoglycan glow
    const glowGeo = new THREE.CapsuleGeometry(2.58, 6.1, 8, 16);
    glowGeo.rotateZ(Math.PI / 2);
    const glowMat = new THREE.MeshBasicMaterial({
      color: '#10B981',
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    hostBacterium.add(glowMesh);

    // Target Receptor Zone (Pink Beacon)
    const receptorGeo = new THREE.RingGeometry(0.3, 0.8, 32);
    const receptorMat = new THREE.MeshBasicMaterial({
      color: '#F43F5E',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const receptorMesh = new THREE.Mesh(receptorGeo, receptorMat);
    receptorMesh.rotation.x = -Math.PI / 2;
    receptorMesh.position.set(0, 2.52, 0);
    hostBacterium.add(receptorMesh);

    // 7. Player Bacteriophage Model
    const playerPhage = new THREE.Group();
    playerPhage.position.set(0, 2.5, 5);
    scene.add(playerPhage);

    // Player Capsid
    const pCapsidGeo = new THREE.IcosahedronGeometry(0.55, 0);
    pCapsidGeo.scale(1, 1.3, 1);
    const pCapsidMat = new THREE.MeshStandardMaterial({
      color: '#2563EB',
      metalness: 0.4,
      roughness: 0.25,
      flatShading: true,
    });
    const pCapsid = new THREE.Mesh(pCapsidGeo, pCapsidMat);
    pCapsid.position.y = 1.0;
    playerPhage.add(pCapsid);

    // Player Sheath
    const pSheathGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.9, 12);
    const pSheathMat = new THREE.MeshStandardMaterial({ color: '#38BDF8', metalness: 0.5 });
    const pSheath = new THREE.Mesh(pSheathGeo, pSheathMat);
    pSheath.position.y = 0.25;
    playerPhage.add(pSheath);

    // Player Baseplate
    const pBaseGeo = new THREE.CylinderGeometry(0.24, 0.22, 0.1, 6);
    const pBaseMat = new THREE.MeshStandardMaterial({ color: '#10B981' });
    const pBase = new THREE.Mesh(pBaseGeo, pBaseMat);
    pBase.position.y = -0.22;
    playerPhage.add(pBase);

    // Player 6 Tail Fibers
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const legGeo = new THREE.CylinderGeometry(0.02, 0.015, 0.6, 6);
      const legMat = new THREE.MeshStandardMaterial({ color: '#818CF8' });
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(Math.cos(angle) * 0.28, -0.45, Math.sin(angle) * 0.28);
      leg.rotation.z = Math.cos(angle) * 0.4;
      leg.rotation.x = Math.sin(angle) * 0.4;
      playerPhage.add(leg);
    }

    // 8. Host Defense Restriction Endonucleases (Spiked yellow hazard orbs)
    const enzymes: THREE.Mesh[] = [];
    const enzymeCount = 4;
    for (let i = 0; i < enzymeCount; i++) {
      const eGeo = new THREE.DodecahedronGeometry(0.35, 1);
      const eMat = new THREE.MeshStandardMaterial({
        color: '#EAB308',
        emissive: '#CA8A04',
        emissiveIntensity: 0.6,
        roughness: 0.3,
      });
      const eMesh = new THREE.Mesh(eGeo, eMat);
      eMesh.position.set(
        (Math.random() - 0.5) * 8,
        Math.random() * 2 + 1,
        (Math.random() - 0.5) * 6
      );
      scene.add(eMesh);
      enzymes.push(eMesh);
    }

    // Save internal refs
    gameEngine.current.scene = scene;
    gameEngine.current.camera = camera;
    gameEngine.current.renderer = renderer;
    gameEngine.current.playerPhage = playerPhage;
    gameEngine.current.hostBacterium = hostBacterium;
    gameEngine.current.enzymes = enzymes;
    gameEngine.current.particles = particles;
    gameEngine.current.receptorTarget = new THREE.Vector3(0, 0.72, 0);

    // Resize handling
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Main 60fps Game Loop
    let lastTime = performance.now();
    let enzymeAngle = 0;

    const gameLoop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Only update physics and gameplay if playing
      if (gameState === 'playing' && playerPhage) {
        const speed = 4.2;
        let moveX = 0;
        let moveY = 0;
        let moveZ = 0;

        if (keysPressed.current['KeyW'] || keysPressed.current['ArrowUp']) moveZ -= 1;
        if (keysPressed.current['KeyS'] || keysPressed.current['ArrowDown']) moveZ += 1;
        if (keysPressed.current['KeyA'] || keysPressed.current['ArrowLeft']) moveX -= 1;
        if (keysPressed.current['KeyD'] || keysPressed.current['ArrowRight']) moveX += 1;
        if (keysPressed.current['KeyQ'] || keysPressed.current['PageUp']) moveY += 1;
        if (keysPressed.current['KeyE'] || keysPressed.current['PageDown']) moveY -= 1;

        if (moveX !== 0 || moveY !== 0 || moveZ !== 0) {
          playerPhage.position.x += moveX * speed * dt;
          playerPhage.position.y += moveY * speed * dt;
          playerPhage.position.z += moveZ * speed * dt;

          // Phage banking roll tilt
          playerPhage.rotation.z = -moveX * 0.25;
          playerPhage.rotation.x = moveZ * 0.2;

          // Sound thrust
          if (Math.random() < 0.1) {
            proceduralAudio.playThrust();
          }
        } else {
          // Idle floating bob
          playerPhage.rotation.z *= 0.92;
          playerPhage.rotation.x *= 0.92;
          playerPhage.position.y += Math.sin(time * 0.003) * 0.002;
        }

        // Clamp boundaries
        playerPhage.position.x = Math.max(-6, Math.min(6, playerPhage.position.x));
        playerPhage.position.y = Math.max(-0.5, Math.min(5, playerPhage.position.y));
        playerPhage.position.z = Math.max(-2, Math.min(8, playerPhage.position.z));

        // Calculate distance to receptor
        const dist = playerPhage.position.distanceTo(gameEngine.current.receptorTarget);
        setDockingDistance(Math.round(dist * 10));

        // Stage 1: Docking verification
        if (missionStage === 'docking' && dist < 1.1) {
          // Can dock! If space pressed or user clicks dock
          if (keysPressed.current['Space']) {
            gameEngine.current.isDocked = true;
            setMissionStage('injection');
            proceduralAudio.playDock();
            setScore((s) => s + 250);
          }
        }

        // Host Defense Endonucleases Patrolling
        enzymeAngle += dt * 0.9;
        enzymes.forEach((enz, idx) => {
          const r = 3.5 + idx * 0.8;
          const a = enzymeAngle + (idx * Math.PI) / 2;
          enz.position.x = Math.cos(a) * r;
          enz.position.z = Math.sin(a) * r;
          enz.position.y = 1.2 + Math.sin(time * 0.002 + idx) * 0.8;
          enz.rotation.x += dt * 2;
          enz.rotation.y += dt * 3;

          // Check collision with player
          const dEnz = playerPhage.position.distanceTo(enz.position);
          if (dEnz < 0.8) {
            proceduralAudio.playWarning();
            setPhageIntegrity((prev) => {
              const next = Math.max(0, prev - 12 * dt);
              if (next <= 0) {
                setGameState('gameover');
              }
              return next;
            });
          }
        });

        // Floating cytoplasm background particles drift
        if (particles) {
          particles.rotation.y += dt * 0.04;
        }

        // Camera smoothly follows player
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, playerPhage.position.x * 0.4, 0.05);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, playerPhage.position.y * 0.3 + 3, 0.05);
        camera.lookAt(playerPhage.position.x * 0.6, playerPhage.position.y * 0.6, playerPhage.position.z * 0.4);
      }

      renderer.render(scene, camera);
      gameEngine.current.animFrameId = requestAnimationFrame(gameLoop);
    };

    gameEngine.current.animFrameId = requestAnimationFrame(gameLoop);

    return () => {
      if (gameEngine.current.animFrameId) {
        cancelAnimationFrame(gameEngine.current.animFrameId);
      }
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isOpen, gameState, missionStage]);

  // Handle Genome Injection Taps
  const handleInjectStep = () => {
    if (missionStage !== 'injection') return;
    proceduralAudio.playInject();
    setInjectionFill((prev) => {
      const next = prev + 25;
      if (next >= 100) {
        setMissionStage('assembly');
        setScore((s) => s + 500);
      }
      return Math.min(100, next);
    });
  };

  // Handle Virion Assembly
  const handleAssemblyStep = () => {
    if (missionStage !== 'assembly') return;
    proceduralAudio.playDock();
    setVirionsProduced((prev) => {
      const next = prev + 25;
      if (next >= 100) {
        setMissionStage('lysis');
        setScore((s) => s + 750);
      }
      return Math.min(100, next);
    });
  };

  // Handle Lysis Explosion
  const handleTriggerLysis = () => {
    if (missionStage !== 'lysis') return;
    proceduralAudio.playLysis();

    // Spawn explosion virions in 3D scene
    const scene = gameEngine.current.scene;
    if (scene) {
      for (let i = 0; i < 30; i++) {
        const vGeo = new THREE.IcosahedronGeometry(0.18, 0);
        const vMat = new THREE.MeshStandardMaterial({
          color: '#38BDF8',
          emissive: '#0284C7',
          emissiveIntensity: 0.8,
        });
        const vMesh = new THREE.Mesh(vGeo, vMat);
        vMesh.position.set(
          (Math.random() - 0.5) * 2,
          Math.random() * 2,
          (Math.random() - 0.5) * 2
        );
        scene.add(vMesh);
      }
    }

    setTimeout(() => {
      proceduralAudio.playVictory();
      setGameState('victory');
      setScore((s) => s + 1000);
    }, 1200);
  };

  const handleStartGame = () => {
    setGameState('playing');
    setMissionStage('docking');
    setPhageIntegrity(100);
    setScore(0);
    setVirionsProduced(0);
    setInjectionFill(0);

    if (gameEngine.current.playerPhage) {
      gameEngine.current.playerPhage.position.set(0, 2.5, 5);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[92vh] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
        {/* Top Game Bar HUD (<=15% Viewport footprint) */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 z-20 text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-heading font-black text-sm tracking-wide text-slate-100 flex items-center gap-2">
                MISI REPLIKASI LITIK 3D: TAKLUKKAN E. COLI
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  BIO-GAME SMA
                </span>
              </h2>
            </div>
          </div>

          {/* Quick HUD Metrics */}
          {gameState === 'playing' && (
            <div className="hidden sm:flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      phageIntegrity > 50 ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'
                    }`}
                    style={{ width: `${phageIntegrity}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-bold text-slate-300">
                  {Math.round(phageIntegrity)}%
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-slate-400 font-medium">Skor:</span>
                <span className="font-mono font-black text-amber-300 text-sm">{score}</span>
              </div>
            </div>
          )}

          {/* Window Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMute}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title={isMuted ? 'Nyalakan Audio' : 'Matikan Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600/80 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Tutup Game"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3D Viewport Playfield (>=85% Unobstructed) */}
        <div className="relative flex-1 w-full bg-slate-950 overflow-hidden">
          <div ref={containerRef} className="w-full h-full" />

          {/* Title Screen Overlay */}
          {gameState === 'title' && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-6 z-30">
              <div className="max-w-md w-full bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl text-center text-white">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                  <Flame className="w-7 h-7 text-amber-300" />
                </div>
                <h3 className="font-heading font-black text-xl text-slate-100 tracking-tight mb-2">
                  MISI INVASI LITIK T4
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Kendalikan partikel bakteriofag, temukan reseptor membran sel <i>E. coli</i>, suntikkan dsDNA, perbanyak virion, dan pecahkan dinding sel bakteri melalui lisis biologis!
                </p>

                {/* Controls Legend */}
                <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 text-left mb-5 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="font-semibold text-slate-400">Kemudikan Fag:</span>
                    <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-cyan-300">
                      W, A, S, D / Tombol Panah
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="font-semibold text-slate-400">Kunci Docking:</span>
                    <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-pink-300">
                      Spasi (di Zona Reseptor)
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="font-semibold text-slate-400">Hindari:</span>
                    <span className="text-amber-400 font-medium">
                      Enzim Restriksi Kuning Berputar!
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleStartGame}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-heading font-bold text-sm tracking-wide shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Mulai Misi Replikasi
                </button>
              </div>
            </div>
          )}

          {/* Playing Interactive HUD Steps */}
          {gameState === 'playing' && (
            <>
              {/* Mission Objectives Floating Pill */}
              <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/80 shadow-lg text-white pointer-events-none">
                <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-cyan-400" />
                  Tahap: {missionStage.toUpperCase()}
                </div>
                <div className="font-heading font-bold text-xs text-slate-200 mt-0.5">
                  {missionStage === 'docking' && '1. Arahkan Fag mendekati Cincin Reseptor Merah Muda'}
                  {missionStage === 'injection' && '2. Kontraksi Selubung: Suntikkan dsDNA ke Sitoplasma'}
                  {missionStage === 'assembly' && '3. Replikasi Genom & Perakitan Kapsid Baru'}
                  {missionStage === 'lysis' && '4. Aktifkan Lisozim: Hancurkan Dinding Peptidoglikan!'}
                </div>
              </div>

              {/* Stage-Specific Action Floating Prompt (Bottom Center) */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
                {missionStage === 'docking' && (
                  <div className="bg-slate-900/92 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-700 text-center shadow-xl">
                    <p className="text-xs text-slate-300 mb-1.5">
                      Jarak ke Reseptor: <span className="font-mono font-bold text-pink-400">{dockingDistance} nm</span>
                    </p>
                    {dockingDistance < 15 ? (
                      <button
                        type="button"
                        onClick={() => {
                          setMissionStage('injection');
                          proceduralAudio.playDock();
                          setScore((s) => s + 250);
                        }}
                        className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shadow-lg shadow-pink-600/40 animate-bounce cursor-pointer"
                      >
                        KUNCI DOCKING SEKARANG [SPASI]
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400">
                        Dekati cincin merah muda di permukaan sel bakteri
                      </span>
                    )}
                  </div>
                )}

                {missionStage === 'injection' && (
                  <div className="bg-slate-900/92 backdrop-blur-md p-4 rounded-xl border border-cyan-500/50 text-center shadow-xl max-w-sm">
                    <div className="text-xs text-cyan-300 font-bold mb-2">
                      Injeksi Materi Genetik ({injectionFill}%)
                    </div>
                    <div className="w-48 bg-slate-800 rounded-full h-2.5 overflow-hidden mb-3 mx-auto">
                      <div
                        className="bg-cyan-500 h-full transition-all duration-150"
                        style={{ width: `${injectionFill}%` }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleInjectStep}
                      className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-heading font-extrabold text-xs shadow-lg shadow-cyan-500/30 active:scale-95 transition-transform cursor-pointer"
                    >
                      POMPA DNA VIRUS →
                    </button>
                  </div>
                )}

                {missionStage === 'assembly' && (
                  <div className="bg-slate-900/92 backdrop-blur-md p-4 rounded-xl border border-blue-500/50 text-center shadow-xl max-w-sm">
                    <div className="text-xs text-blue-300 font-bold mb-2">
                      Perakitan Virion Baru ({virionsProduced}/100)
                    </div>
                    <div className="w-48 bg-slate-800 rounded-full h-2.5 overflow-hidden mb-3 mx-auto">
                      <div
                        className="bg-blue-500 h-full transition-all duration-150"
                        style={{ width: `${virionsProduced}%` }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAssemblyStep}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-heading font-extrabold text-xs shadow-lg shadow-blue-600/30 active:scale-95 transition-transform cursor-pointer"
                    >
                      SINTESIS PROTEIN KAPSID (+25)
                    </button>
                  </div>
                )}

                {missionStage === 'lysis' && (
                  <div className="bg-slate-900/92 backdrop-blur-md p-4 rounded-xl border border-amber-500/50 text-center shadow-xl max-w-sm">
                    <div className="text-xs text-amber-300 font-bold mb-2 flex items-center justify-center gap-1">
                      <Flame className="w-4 h-4 text-amber-400" />
                      Kapasitas Maksimal Tercapai!
                    </div>
                    <button
                      type="button"
                      onClick={handleTriggerLysis}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-heading font-black text-sm tracking-wide shadow-xl shadow-red-600/40 animate-pulse cursor-pointer"
                    >
                      LEDAKKAN SEL INANG (LISIS!)
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile On-Screen Directional Touch Pad */}
              <div className="sm:hidden absolute bottom-4 left-4 z-20 grid grid-cols-3 gap-1 w-28 bg-slate-900/80 p-1.5 rounded-xl border border-slate-700/60 backdrop-blur-md">
                <div />
                <button
                  type="button"
                  onMouseDown={() => (keysPressed.current['KeyW'] = true)}
                  onMouseUp={() => (keysPressed.current['KeyW'] = false)}
                  onTouchStart={() => (keysPressed.current['KeyW'] = true)}
                  onTouchEnd={() => (keysPressed.current['KeyW'] = false)}
                  className="p-2 rounded bg-slate-800 text-slate-200 active:bg-blue-600 flex items-center justify-center"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <div />
                <button
                  type="button"
                  onMouseDown={() => (keysPressed.current['KeyA'] = true)}
                  onMouseUp={() => (keysPressed.current['KeyA'] = false)}
                  onTouchStart={() => (keysPressed.current['KeyA'] = true)}
                  onTouchEnd={() => (keysPressed.current['KeyA'] = false)}
                  className="p-2 rounded bg-slate-800 text-slate-200 active:bg-blue-600 flex items-center justify-center"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onMouseDown={() => (keysPressed.current['KeyS'] = true)}
                  onMouseUp={() => (keysPressed.current['KeyS'] = false)}
                  onTouchStart={() => (keysPressed.current['KeyS'] = true)}
                  onTouchEnd={() => (keysPressed.current['KeyS'] = false)}
                  className="p-2 rounded bg-slate-800 text-slate-200 active:bg-blue-600 flex items-center justify-center"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onMouseDown={() => (keysPressed.current['KeyD'] = true)}
                  onMouseUp={() => (keysPressed.current['KeyD'] = false)}
                  onTouchStart={() => (keysPressed.current['KeyD'] = true)}
                  onTouchEnd={() => (keysPressed.current['KeyD'] = false)}
                  className="p-2 rounded bg-slate-800 text-slate-200 active:bg-blue-600 flex items-center justify-center"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {/* Victory Modal */}
          {gameState === 'victory' && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 z-30">
              <div className="max-w-md w-full bg-slate-900 border border-emerald-500/50 rounded-2xl p-6 shadow-2xl text-center text-white">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600/30 border border-emerald-500 flex items-center justify-center mx-auto mb-4 text-emerald-400">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-black text-xl text-emerald-300 tracking-tight mb-1">
                  MISI SELESAI: LISIS TERCAPAI!
                </h3>
                <p className="text-xs text-slate-300 mb-4">
                  Selamat! Sel inang <i>E. coli</i> berhasil dilisiskan. Sebanyak 100 virion bakteriofag T4 baru kini bebas menginfeksi bakteri lain di sekitarnya.
                </p>

                <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 mb-5 text-left text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-300">
                    <span>Skor Total:</span>
                    <span className="font-mono font-bold text-amber-300">{score} PTS</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Integritas Fag Akhir:</span>
                    <span className="font-mono text-emerald-400">{Math.round(phageIntegrity)}%</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Siklus yang Dijalankan:</span>
                    <span className="font-semibold text-blue-300">Litik Lengkap (5 Tahap)</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleStartGame}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Main Lagi
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs cursor-pointer"
                  >
                    Tutup Game
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Game Over Modal */}
          {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 z-30">
              <div className="max-w-md w-full bg-slate-900 border border-red-500/50 rounded-2xl p-6 shadow-2xl text-center text-white">
                <div className="w-14 h-14 rounded-2xl bg-red-600/30 border border-red-500 flex items-center justify-center mx-auto mb-4 text-red-400">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-black text-xl text-red-300 tracking-tight mb-1">
                  GAGAL INFESTASI: FAG DINETRALISASI
                </h3>
                <p className="text-xs text-slate-300 mb-4">
                  Bakteriofag terkena enzim restriksi endonuklease bakteri inang terlalu sering sehingga genom virus terdegradasi sebelum sempat memprogram ulang sel bakteri.
                </p>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleStartGame}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Ulangi Misi
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs cursor-pointer"
                  >
                    Kembali
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
