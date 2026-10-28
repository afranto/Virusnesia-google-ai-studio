import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  RotateCcw,
  Eye,
  Play,
  Pause,
  Maximize2,
  Info,
  Sparkles,
  Layers,
  Activity,
  CheckCircle,
} from 'lucide-react';

export interface PhagePartInfo {
  id: string;
  name: string;
  scientificTerm: string;
  geneProduct: string;
  dimensions: string;
  functionSummary: string;
  biologicalDetail: string;
  examTip: string;
}

const PHAGE_PARTS_INFO: Record<string, PhagePartInfo> = {
  capsid: {
    id: 'capsid',
    name: 'Kapsid Ikosahedral (Kepala)',
    scientificTerm: 'Icosahedral Capsid Head (Prolate)',
    geneProduct: 'gp23* (mayor, 960 kopi), gp24* (pentamer apeks)',
    dimensions: 'Panjang ~120 nm, Lebar ~86 nm',
    functionSummary: 'Cangkang protein berbentuk ikosahedral memanjang yang melindungi genom asam nukleat virus dari degradasi enzim nuklease lingkungan.',
    biologicalDetail: 'Tersusun atas kisi simetri T=13 (laevo) dengan perpanjangan prolate Q=21. Mampu menahan tekanan osmotik internal hingga ~50 atmosfer akibat padatnya gulungan genom dsDNA.',
    examTip: 'Kapsid TIDAK ikut masuk ke dalam sel bakteri saat penetrasi; kapsid kosong tetap berada di luar sel (dikenal sebagai "ghost phage").',
  },
  dna: {
    id: 'dna',
    name: 'Materi Genetik (dsDNA)',
    scientificTerm: 'Linear Double-Stranded DNA (dsDNA)',
    geneProduct: 'Genom 168.903 pasang basa (~289 gen)',
    dimensions: 'Panjang terbentang ~55 µm (terkemas ketat)',
    functionSummary: 'Membawa seluruh kode genetik untuk memprogram ulang ribosom dan enzim inang agar memproduksi salinan komponen virus.',
    biologicalDetail: 'Mengandung basa unik 5-hidroksimetilsitosin (5-hmC) terglikosilasi yang menggantikan sitosin, melindungi DNA virus dari enzim restriksi endonuklease bakteri inang.',
    examTip: 'Bakteriofag T4 tergolong virus DNA ganda (dsDNA), berbeda dengan virus RNA seperti Tobacco Mosaic Virus atau Influenza.',
  },
  collar: {
    id: 'collar',
    name: 'Leher & Kerah (Collar & Whiskers)',
    scientificTerm: 'Collar and Neck Ring',
    geneProduct: 'gp13, gp14, wac (fibritin)',
    dimensions: 'Diameter ~14 nm',
    functionSummary: 'Menghubungkan kapsid dengan selubung ekor serta menjadi sensor lingkungan untuk mengatur retraksi serabut ekor.',
    biologicalDetail: 'Protein wac (whiskers) bertindak sebagai sensor sensorik yang dapat melipat serabut ekor saat kondisi lingkungan tidak menguntungkan untuk infeksi.',
    examTip: 'Leher memfasilitasi docking yang stabil antara kepala bertekanan tinggi dengan tabung ekor injektor.',
  },
  sheath: {
    id: 'sheath',
    name: 'Selubung Ekor Kontraktil (Tail Sheath)',
    scientificTerm: 'Contractile Tail Sheath',
    geneProduct: 'gp18 (24 cincin heksamerik, 144 subunit)',
    dimensions: 'Panjang terentang ~100 nm -> berkontraksi menjadi ~37 nm',
    functionSummary: 'Mesin nanomolekuler kontraktil yang memendek dan membesar untuk menusukkan jarum ekor menembus dinding sel bakteri.',
    biologicalDetail: 'Saat serabut ekor mengikat reseptor, lempeng dasar berubah konformasi dari heksagonal menjadi bintang. Hal ini memicu gelombang konformasi yang memendekkan selubung ekor hingga 60%.',
    examTip: 'Kontraksi selubung ekor mirip dengan gerakan jarum suntik mikro mekanis tanpa memerlukan energi ATP eksternal (menggunakan energi potensial tersimpan).',
  },
  baseplate: {
    id: 'baseplate',
    name: 'Lempeng Dasar & Pasak (Baseplate & Spikes)',
    scientificTerm: 'Baseplate Complex and Central Spike',
    geneProduct: 'gp5, gp27 (pusat jarum) + gp6, gp7, gp8, gp9, gp10, gp11',
    dimensions: 'Lebar ~45 nm, 6 pasak tajam di bawah',
    functionSummary: 'Pusat komando mekanis infeksi yang menstabilkan fiksasi dan melubangi peptidoglikan dinding sel bakteri.',
    biologicalDetail: 'Protein gp5 memiliki domain lisozim bawaan yang secara enzimatis mencerna lapisan peptidoglikan peptidoglikan murein bakteri Escherichia coli.',
    examTip: 'Lempeng dasar adalah pemicu langsung yang melepaskan gerbang DNA virus agar dapat meluncur ke sitoplasma bakteri.',
  },
  fibers: {
    id: 'fibers',
    name: 'Serabut Ekor (Tail Fibers)',
    scientificTerm: 'Long Tail Fibers (LTF)',
    geneProduct: 'gp34, gp35, gp36, gp37',
    dimensions: 'Panjang masing-masing ~140 nm dengan sendi lutut',
    functionSummary: 'Antena pencari yang secara spesifik mengenali dan menempel pada reseptor LPS dan protein porin OmpC pada membran terluar bakteri.',
    biologicalDetail: 'Terdiri atas 6 serabut bersendi yang fleksibel. Ujung gp37 berikatan reversibel pada awalnya, kemudian menginduksi penempelan ireversibel seluruh 6 serabut.',
    examTip: 'Serabut ekor inilah yang bertanggung jawab atas TAHAP ADSORPSI. Jika serabut ekor rusak, fag tidak dapat menginfeksi bakteri.',
  },
  host: {
    id: 'host',
    name: 'Membran & Dinding Sel Bakteri (Host Cell Wall)',
    scientificTerm: 'Bacterial Outer Membrane & Peptidoglycan',
    geneProduct: 'Lipopolisakarida (LPS) & Porin OmpC',
    dimensions: 'Tebal selubung sel ~30 nm',
    functionSummary: 'Permukaan sasaran infeksi tempat reseptor spesifik diakui oleh serabut ekor bakteriofag.',
    biologicalDetail: 'Bakteri gram negatif seperti E. coli memiliki membran luar bilayer asimetris, ruang periplasma dengan peptidoglikan, dan membran plasma dalam.',
    examTip: 'Spesifisitas inang (host range) virus ditentukan oleh kecocokan antara serabut ekor virus dengan reseptor permukaan membran bakteri.',
  },
};

export const Phage3DScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedPart, setSelectedPart] = useState<PhagePartInfo>(PHAGE_PARTS_INFO.capsid);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [isXRay, setIsXRay] = useState<boolean>(false);
  const [isInjecting, setIsInjecting] = useState<boolean>(false);
  const [injectionProgress, setInjectionProgress] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // References to keep Three.js animated parts
  const sceneState = useRef<{
    renderer: THREE.WebGLRenderer | null;
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    phageGroup: THREE.Group | null;
    sheathMesh: THREE.Mesh | null;
    innerTubeMesh: THREE.Mesh | null;
    dnaMesh: THREE.Mesh | null;
    capsidMesh: THREE.Mesh | null;
    capsidWire: THREE.LineSegments | null;
    partMeshes: Map<string, THREE.Object3D>;
    animFrameId: number | null;
    isDragging: boolean;
    prevMousePos: { x: number; y: number };
    injectionT: number; // 0 to 1
  }>({
    renderer: null,
    scene: null,
    camera: null,
    phageGroup: null,
    sheathMesh: null,
    innerTubeMesh: null,
    dnaMesh: null,
    capsidMesh: null,
    capsidWire: null,
    partMeshes: new Map(),
    animFrameId: null,
    isDragging: false,
    prevMousePos: { x: 0, y: 0 },
    injectionT: 0,
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0A1128'); // Deep scientific midnight blue
    scene.fog = new THREE.FogExp2('#0A1128', 0.035);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.5, 11);
    camera.lookAt(0, 1.2, 0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Lights
    const hemiLight = new THREE.HemisphereLight('#E0F2FE', '#0F172A', 0.7);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight('#FFFFFF', 1.4);
    dirLight.position.set(7, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    const blueRimLight = new THREE.DirectionalLight('#38BDF8', 1.0);
    blueRimLight.position.set(-8, -2, -6);
    scene.add(blueRimLight);

    const coreLight = new THREE.PointLight('#00F0FF', 0.8, 8);
    coreLight.position.set(0, 3.8, 0);
    scene.add(coreLight);

    // 5. Build Procedural Bacteriophage Model
    const phageGroup = new THREE.Group();
    phageGroup.position.set(0, 0, 0);
    scene.add(phageGroup);

    const partMeshes = new Map<string, THREE.Object3D>();

    // A. Capsid: Prolate Icosahedron
    const capsidGeo = new THREE.IcosahedronGeometry(1.4, 0);
    capsidGeo.scale(1.0, 1.35, 1.0); // Elongated prolate head of T4
    const capsidMat = new THREE.MeshStandardMaterial({
      color: '#2563EB',
      metalness: 0.25,
      roughness: 0.35,
      flatShading: true,
      transparent: true,
      opacity: 0.92,
    });
    const capsidMesh = new THREE.Mesh(capsidGeo, capsidMat);
    capsidMesh.position.set(0, 3.8, 0);
    capsidMesh.castShadow = true;
    capsidMesh.receiveShadow = true;
    capsidMesh.userData = { partId: 'capsid' };
    phageGroup.add(capsidMesh);
    partMeshes.set('capsid', capsidMesh);

    // Capsid Wireframe overlay
    const wireGeo = new THREE.WireframeGeometry(capsidGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: '#60A5FA',
      transparent: true,
      opacity: 0.45,
    });
    const capsidWire = new THREE.LineSegments(wireGeo, wireMat);
    capsidWire.position.copy(capsidMesh.position);
    phageGroup.add(capsidWire);

    // B. Internal Viral DNA (Helical Knot inside head)
    const curvePoints: THREE.Vector3[] = [];
    const coils = 9;
    const pointsCount = 180;
    for (let i = 0; i <= pointsCount; i++) {
      const t = i / pointsCount;
      const angle = t * Math.PI * 2 * coils;
      const radius = 0.75 * Math.sin(t * Math.PI) * (0.8 + 0.2 * Math.cos(angle * 0.3));
      const y = (t - 0.5) * 2.2;
      curvePoints.push(new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius));
    }
    const dnaCurve = new THREE.CatmullRomCurve3(curvePoints);
    const dnaGeo = new THREE.TubeGeometry(dnaCurve, 100, 0.055, 6, false);
    const dnaMat = new THREE.MeshStandardMaterial({
      color: '#00F0FF',
      emissive: '#0284C7',
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.1,
    });
    const dnaMesh = new THREE.Mesh(dnaGeo, dnaMat);
    dnaMesh.position.set(0, 3.8, 0);
    dnaMesh.userData = { partId: 'dna' };
    phageGroup.add(dnaMesh);
    partMeshes.set('dna', dnaMesh);

    // C. Collar & Neck Ring
    const collarGeo = new THREE.TorusGeometry(0.38, 0.09, 12, 24);
    const collarMat = new THREE.MeshStandardMaterial({
      color: '#F59E0B',
      metalness: 0.4,
      roughness: 0.3,
    });
    const collarMesh = new THREE.Mesh(collarGeo, collarMat);
    collarMesh.rotation.x = Math.PI / 2;
    collarMesh.position.set(0, 2.3, 0);
    collarMesh.userData = { partId: 'collar' };
    phageGroup.add(collarMesh);
    partMeshes.set('collar', collarMesh);

    // D. Rigid Inner Tail Tube (Revealed during contraction)
    const innerTubeGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.8, 16);
    const innerTubeMat = new THREE.MeshStandardMaterial({
      color: '#E2E8F0',
      metalness: 0.8,
      roughness: 0.2,
    });
    const innerTubeMesh = new THREE.Mesh(innerTubeGeo, innerTubeMat);
    innerTubeMesh.position.set(0, 0.9, 0);
    innerTubeMesh.userData = { partId: 'sheath' };
    phageGroup.add(innerTubeMesh);

    // E. Contractile Helical Tail Sheath (Segmented cylinder)
    const sheathGeo = new THREE.CylinderGeometry(0.32, 0.32, 2.5, 18, 12);
    const sheathMat = new THREE.MeshStandardMaterial({
      color: '#3B82F6',
      metalness: 0.35,
      roughness: 0.4,
      flatShading: true,
    });
    const sheathMesh = new THREE.Mesh(sheathGeo, sheathMat);
    sheathMesh.position.set(0, 1.05, 0);
    sheathMesh.castShadow = true;
    sheathMesh.userData = { partId: 'sheath' };
    phageGroup.add(sheathMesh);
    partMeshes.set('sheath', sheathMesh);

    // F. Hexagonal Baseplate with Spikes
    const baseplateGeo = new THREE.CylinderGeometry(0.65, 0.55, 0.22, 6);
    const baseplateMat = new THREE.MeshStandardMaterial({
      color: '#10B981',
      metalness: 0.5,
      roughness: 0.3,
    });
    const baseplateMesh = new THREE.Mesh(baseplateGeo, baseplateMat);
    baseplateMesh.position.set(0, -0.25, 0);
    baseplateMesh.userData = { partId: 'baseplate' };
    phageGroup.add(baseplateMesh);
    partMeshes.set('baseplate', baseplateMesh);

    // 6 Baseplate Pins / Spikes
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const spikeGeo = new THREE.ConeGeometry(0.06, 0.25, 6);
      const spikeMat = new THREE.MeshStandardMaterial({ color: '#059669', metalness: 0.6 });
      const spike = new THREE.Mesh(spikeGeo, spikeMat);
      spike.rotation.x = Math.PI;
      spike.position.set(Math.cos(angle) * 0.45, -0.38, Math.sin(angle) * 0.45);
      baseplateMesh.add(spike);
    }

    // G. 6 Articulated Long Tail Fibers
    const fiberGroup = new THREE.Group();
    fiberGroup.userData = { partId: 'fibers' };
    phageGroup.add(fiberGroup);
    partMeshes.set('fibers', fiberGroup);

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const singleFiber = new THREE.Group();
      singleFiber.rotation.y = angle;

      // Proximal segment (upper leg, slopes outward/downward)
      const upperGeo = new THREE.CylinderGeometry(0.045, 0.04, 1.3, 8);
      const fiberMat = new THREE.MeshStandardMaterial({
        color: '#6366F1',
        metalness: 0.3,
        roughness: 0.4,
      });
      const upperMesh = new THREE.Mesh(upperGeo, fiberMat);
      upperMesh.position.set(0.48, -0.6, 0);
      upperMesh.rotation.z = -0.75;
      singleFiber.add(upperMesh);

      // Knee joint
      const kneeGeo = new THREE.SphereGeometry(0.07, 8, 8);
      const kneeMesh = new THREE.Mesh(kneeGeo, fiberMat);
      kneeMesh.position.set(0.95, -0.95, 0);
      singleFiber.add(kneeMesh);

      // Distal segment (lower leg, descends toward membrane)
      const lowerGeo = new THREE.CylinderGeometry(0.038, 0.025, 1.4, 8);
      const lowerMesh = new THREE.Mesh(lowerGeo, fiberMat);
      lowerMesh.position.set(1.4, -1.45, 0);
      lowerMesh.rotation.z = -0.4;
      singleFiber.add(lowerMesh);

      // Fiber Foot Pin
      const footGeo = new THREE.SphereGeometry(0.05, 8, 8);
      const footMat = new THREE.MeshStandardMaterial({ color: '#A855F7', emissive: '#6B21A8', emissiveIntensity: 0.4 });
      const footMesh = new THREE.Mesh(footGeo, footMat);
      footMesh.position.set(1.68, -2.0, 0);
      singleFiber.add(footMesh);

      fiberGroup.add(singleFiber);
    }

    // H. Bacterial Host Cell Wall & Membrane Surface
    const hostGroup = new THREE.Group();
    hostGroup.position.set(0, -2.1, 0);
    hostGroup.userData = { partId: 'host' };
    scene.add(hostGroup);
    partMeshes.set('host', hostGroup);

    // Curved membrane patch
    const membraneGeo = new THREE.CylinderGeometry(4.8, 5.2, 1.4, 48);
    const membraneMat = new THREE.MeshStandardMaterial({
      color: '#065F46',
      roughness: 0.65,
      metalness: 0.15,
      flatShading: false,
    });
    const membraneMesh = new THREE.Mesh(membraneGeo, membraneMat);
    membraneMesh.position.set(0, -0.7, 0);
    membraneMesh.receiveShadow = true;
    hostGroup.add(membraneMesh);

    // Membrane Receptor Nodes (OmpC & LPS spots)
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const receptorGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.15, 12);
      const receptorMat = new THREE.MeshStandardMaterial({
        color: '#EC4899',
        emissive: '#BE185D',
        emissiveIntensity: 0.5,
      });
      const receptorMesh = new THREE.Mesh(receptorGeo, receptorMat);
      receptorMesh.position.set(Math.cos(angle) * 1.68, 0.08, Math.sin(angle) * 1.68);
      hostGroup.add(receptorMesh);
    }

    // Periplasmic Peptidoglycan Layer
    const peptidoGeo = new THREE.RingGeometry(0.2, 3.5, 32);
    const peptidoMat = new THREE.MeshBasicMaterial({
      color: '#10B981',
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const peptidoMesh = new THREE.Mesh(peptidoGeo, peptidoMat);
    peptidoMesh.rotation.x = -Math.PI / 2;
    peptidoMesh.position.set(0, -0.3, 0);
    hostGroup.add(peptidoMesh);

    // Save references to scene state
    sceneState.current.renderer = renderer;
    sceneState.current.scene = scene;
    sceneState.current.camera = camera;
    sceneState.current.phageGroup = phageGroup;
    sceneState.current.sheathMesh = sheathMesh;
    sceneState.current.innerTubeMesh = innerTubeMesh;
    sceneState.current.dnaMesh = dnaMesh;
    sceneState.current.capsidMesh = capsidMesh;
    sceneState.current.capsidWire = capsidWire;
    sceneState.current.partMeshes = partMeshes;

    // Raycasting for interactive click selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent) => {
      sceneState.current.isDragging = true;
      sceneState.current.prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: MouseEvent) => {
      if (!sceneState.current.isDragging || !phageGroup) return;
      const dx = e.clientX - sceneState.current.prevMousePos.x;
      const dy = e.clientY - sceneState.current.prevMousePos.y;

      phageGroup.rotation.y += dx * 0.008;
      phageGroup.rotation.x = Math.max(-0.6, Math.min(0.6, phageGroup.rotation.x + dy * 0.006));

      sceneState.current.prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: MouseEvent) => {
      const isDrag = Math.abs(e.clientX - sceneState.current.prevMousePos.x) > 4 ||
                     Math.abs(e.clientY - sceneState.current.prevMousePos.y) > 4;
      sceneState.current.isDragging = false;

      if (!isDrag && container) {
        // Raycast click
        const rect = container.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
          let curr: THREE.Object3D | null = intersects[0].object;
          while (curr && !curr.userData?.partId && curr !== scene) {
            curr = curr.parent;
          }
          if (curr && curr.userData?.partId) {
            const partId = curr.userData.partId;
            if (PHAGE_PARTS_INFO[partId]) {
              setSelectedPart(PHAGE_PARTS_INFO[partId]);
            }
          }
        }
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    let lastTime = performance.now();
    const animate = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (sceneState.current.phageGroup && isAutoRotate && !sceneState.current.isDragging) {
        sceneState.current.phageGroup.rotation.y += dt * 0.35;
      }

      // Injection animation handling
      if (isInjecting) {
        sceneState.current.injectionT = Math.min(1, sceneState.current.injectionT + dt * 0.4);
        setInjectionProgress(Math.round(sceneState.current.injectionT * 100));

        const t = sceneState.current.injectionT;
        // Sheath contracts
        if (sheathMesh) {
          const scaleY = 1 - t * 0.55;
          sheathMesh.scale.set(1 + t * 0.3, scaleY, 1 + t * 0.3);
          sheathMesh.position.y = 1.05 - t * 0.65;
        }
        // Phage head lowers slightly as sheath compresses
        if (capsidMesh && capsidWire && dnaMesh) {
          capsidMesh.position.y = 3.8 - t * 0.85;
          capsidWire.position.y = 3.8 - t * 0.85;
          // DNA unwinds / moves down through tube into host
          dnaMesh.position.y = 3.8 - t * 3.5;
          dnaMesh.scale.set(1 - t * 0.6, 1 + t * 0.5, 1 - t * 0.6);
        }

        if (sceneState.current.injectionT >= 1) {
          setIsInjecting(false);
        }
      }

      renderer.render(scene, camera);
      sceneState.current.animFrameId = requestAnimationFrame(animate);
    };

    sceneState.current.animFrameId = requestAnimationFrame(animate);

    return () => {
      if (sceneState.current.animFrameId) {
        cancelAnimationFrame(sceneState.current.animFrameId);
      }
      dom.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(dom)) {
        container.removeChild(dom);
      }
    };
  }, [isAutoRotate, isInjecting]);

  // Handle X-Ray toggle
  useEffect(() => {
    const { capsidMesh, capsidWire, dnaMesh } = sceneState.current;
    if (capsidMesh && capsidWire && dnaMesh) {
      if (isXRay) {
        (capsidMesh.material as THREE.MeshStandardMaterial).opacity = 0.25;
        (capsidMesh.material as THREE.MeshStandardMaterial).transparent = true;
        (capsidWire.material as THREE.LineBasicMaterial).opacity = 0.95;
        (dnaMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.8;
      } else {
        (capsidMesh.material as THREE.MeshStandardMaterial).opacity = 0.92;
        (capsidWire.material as THREE.LineBasicMaterial).opacity = 0.45;
        (dnaMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.8;
      }
    }
  }, [isXRay]);

  // Reset View and Animation
  const handleReset = () => {
    sceneState.current.injectionT = 0;
    setInjectionProgress(0);
    setIsInjecting(false);

    const { phageGroup, sheathMesh, capsidMesh, capsidWire, dnaMesh } = sceneState.current;
    if (phageGroup) {
      phageGroup.rotation.set(0, 0, 0);
    }
    if (sheathMesh) {
      sheathMesh.scale.set(1, 1, 1);
      sheathMesh.position.set(0, 1.05, 0);
    }
    if (capsidMesh && capsidWire && dnaMesh) {
      capsidMesh.position.set(0, 3.8, 0);
      capsidWire.position.set(0, 3.8, 0);
      dnaMesh.position.set(0, 3.8, 0);
      dnaMesh.scale.set(1, 1, 1);
    }
  };

  const handleTriggerInjection = () => {
    if (sceneState.current.injectionT >= 1) {
      handleReset();
    }
    setIsInjecting(true);
  };

  return (
    <div className={`relative flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full'}`}>
      {/* Top Header / Viewport HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 z-10 text-white">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm tracking-tight flex items-center gap-2">
              Laboratorium 3D: Anatomi & Nanomekanika Bakteriofag T4
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                PBR Three.js
              </span>
            </h3>
            <p className="text-xs text-slate-400 hidden sm:block">
              Klik bagian tubuh bakteriofag untuk menganalisis struktur molekuler & fungsinya
            </p>
          </div>
        </div>

        {/* Viewport Control Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              isAutoRotate ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Putar Model Otomatis"
          >
            {isAutoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Rotasi</span>
          </button>

          <button
            type="button"
            onClick={() => setIsXRay(!isXRay)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              isXRay ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Mode X-Ray Tembus Pandang Genom DNA"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">X-Ray Genom</span>
          </button>

          <button
            type="button"
            onClick={handleTriggerInjection}
            disabled={isInjecting}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isInjecting
                ? 'bg-emerald-600 text-white animate-pulse'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
            title="Simulasikan Kontraksi Selubung Ekor & Injeksi DNA ke Bakteri"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{isInjecting ? `Menyuntik ${injectionProgress}%` : 'Simulasi Injeksi 3D'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            title="Reset Posisi Kamera & Animasi"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            title="Layar Penuh"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Area */}
      <div className="relative w-full h-[460px] sm:h-[540px] bg-slate-950">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Floating Quick Part Selector Pills */}
        <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5 pointer-events-auto">
          {Object.values(PHAGE_PARTS_INFO).map((part) => {
            const isSelected = selectedPart.id === part.id;
            return (
              <button
                key={part.id}
                type="button"
                onClick={() => setSelectedPart(part)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all backdrop-blur-md cursor-pointer border ${
                  isSelected
                    ? 'bg-blue-600/90 text-white border-blue-400 shadow-md shadow-blue-500/25 ring-2 ring-blue-400/40'
                    : 'bg-slate-900/70 text-slate-300 border-slate-700 hover:bg-slate-800/90 hover:text-white'
                }`}
              >
                {part.name.split(' (')[0]}
              </button>
            );
          })}
        </div>

        {/* HUD Overlay: Inspection Panel Card */}
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md bg-slate-900/92 backdrop-blur-md p-4 rounded-xl border border-slate-700/80 shadow-2xl text-white">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                {selectedPart.scientificTerm}
              </div>
              <h4 className="font-heading font-bold text-sm sm:text-base text-slate-100">
                {selectedPart.name}
              </h4>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {selectedPart.dimensions}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
            {selectedPart.functionSummary}
          </p>

          <div className="space-y-1.5 pt-2 border-t border-slate-800 text-[11px]">
            <div className="flex items-baseline gap-1.5 text-slate-300">
              <span className="font-semibold text-slate-400 shrink-0">Produk Gen:</span>
              <span className="font-mono text-cyan-300">{selectedPart.geneProduct}</span>
            </div>
            <div className="flex items-baseline gap-1.5 text-slate-300">
              <span className="font-semibold text-emerald-400 shrink-0 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Poin Ujian:
              </span>
              <span className="text-slate-200">{selectedPart.examTip}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
