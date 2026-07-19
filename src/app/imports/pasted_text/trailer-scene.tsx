Erstelle eine moderne Modelle-Seite mit interaktivem 3D-Trailer-Konfigurator. Die Seite soll genau folgende Struktur und Funktionalität haben:

📋 PROJEKT-ÜBERSICHT
Design: Minimal Cool mit Glass-Morphismus
Farbschema: #B7D3E9 (Hellblau), #2E3C45 (Dunkelgrau), #F5F7FA (Hellgrau), #1C1F2B (Fast Schwarz)
Features:

Modellübersicht mit 6 Verkaufsanhänger-Modellen
Interaktiver 3D-Konfigurator mit Three.js
Animierte Türen und Luken (anklickbar)
Farbauswahl und Ausstattungs-Konfigurator
Detail-Dialoge für jedes Modell
Motion-Animationen
Responsive Design
📁 DATEI 1: /styles/globals.css
Füge diese CSS-Klassen zu deiner globals.css hinzu:

.gradient-primary {
  background: linear-gradient(135deg, #B7D3E9 0%, #a1c4e0 100%);
}

.gradient-secondary {
  background: linear-gradient(135deg, #2E3C45 0%, #1C1F2B 100%);
}

.gradient-accent {
  background: linear-gradient(180deg, #F5F7FA 0%, #ffffff 100%);
}

.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 10px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #F5F7FA;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #B7D3E9;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a1c4e0;
}
📁 DATEI 2: /components/configurator/TrailerScene.tsx
Erstelle diese Datei mit folgendem kompletten Code:

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface TrailerSceneProps {
  hatchOpen: boolean;
  doorsOpen: boolean;
  color: string;
  equipment: string[];
  onToggleHatch: () => void;
  onToggleDoors: () => void;
}

export function TrailerScene({ hatchOpen, doorsOpen, color, equipment, onToggleHatch, onToggleDoors }: TrailerSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  
  // Keep references to scene objects to update them when props change
  const hatchRef = useRef<THREE.Group | null>(null);
  const leftDoorRef = useRef<THREE.Group | null>(null);
  const rightDoorRef = useRef<THREE.Group | null>(null);
  const bodyMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const equipmentGroupRef = useRef<THREE.Group | null>(null);
  
  // Track current animation state
  const stateRef = useRef({
    hatchOpen,
    doorsOpen,
    color,
    equipment,
    onToggleHatch,
    onToggleDoors
  });

  useEffect(() => {
    stateRef.current = { hatchOpen, doorsOpen, color, equipment, onToggleHatch, onToggleDoors };
  }, [hatchOpen, doorsOpen, color, equipment, onToggleHatch, onToggleDoors]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#e5e7eb');

    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 100);
    camera.position.set(5, 2, 6);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.minDistance = 4;
    controls.maxDistance = 12;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Ground collision
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 1.2, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.4);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 10, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.bias = -0.0001;
    scene.add(dirLight);

    // Ground plane
    const groundGeo = new THREE.PlaneGeometry(50, 50);
    const groundMat = new THREE.MeshStandardMaterial({ color: '#d1d5db', roughness: 1 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    scene.add(ground);

    // --- MATERIALS ---
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: stateRef.current.color,
      metalness: 0.1,
      roughness: 0.2,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
    });
    bodyMaterialRef.current = bodyMat;

    const frameMat = new THREE.MeshStandardMaterial({ color: '#888888', metalness: 0.8, roughness: 0.3 });
    const floorMat = new THREE.MeshStandardMaterial({ color: '#8b5a2b', roughness: 0.9 });
    const counterMat = new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.7 });

    // --- TRAILER MODEL GROUP ---
    const trailer = new THREE.Group();
    scene.add(trailer);

    // Helper to create meshes
    const createMesh = (geometry: THREE.BufferGeometry, material: THREE.Material, castShadow = true, receiveShadow = true) => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = castShadow;
      mesh.receiveShadow = receiveShadow;
      return mesh;
    };

    // Central Frame
    const frame = createMesh(new THREE.BoxGeometry(1.8, 0.1, 3.8), frameMat);
    frame.position.set(0, 0.3, 0);
    trailer.add(frame);

    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 32);
    const wheelMat = new THREE.MeshStandardMaterial({ color: '#222222', roughness: 0.9 });
    
    const wheelL = createMesh(wheelGeo, wheelMat);
    wheelL.position.set(1.0, 0.3, 0);
    wheelL.rotation.set(Math.PI/2, 0, Math.PI/2);
    trailer.add(wheelL);

    const wheelR = createMesh(wheelGeo, wheelMat);
    wheelR.position.set(-1.0, 0.3, 0);
    wheelR.rotation.set(Math.PI/2, 0, Math.PI/2);
    trailer.add(wheelR);

    // Tow bar
    const towBar = createMesh(new THREE.BoxGeometry(0.1, 0.1, 1), frameMat);
    towBar.position.set(0, 0.3, 2.3);
    trailer.add(towBar);

    // Floor
    const floor = createMesh(new THREE.BoxGeometry(1.9, 0.05, 3.9), floorMat);
    floor.position.set(0, 0.375, 0);
    trailer.add(floor);

    // Roof
    const roof = createMesh(new THREE.BoxGeometry(2.0, 0.05, 4.0), bodyMat);
    roof.position.set(0, 2.575, 0);
    trailer.add(roof);

    // Front Wall
    const frontWall = createMesh(new THREE.BoxGeometry(2.0, 2.15, 0.05), bodyMat);
    frontWall.position.set(0, 1.475, 1.975);
    trailer.add(frontWall);

    // Left Wall
    const leftWall = createMesh(new THREE.BoxGeometry(0.05, 2.15, 4.0), bodyMat);
    leftWall.position.set(-0.975, 1.475, 0);
    trailer.add(leftWall);

    // Right Wall (Serving side)
    const rightWallGroup = new THREE.Group();
    const rwBottom = createMesh(new THREE.BoxGeometry(0.05, 0.95, 4.0), bodyMat);
    rwBottom.position.set(0.975, 0.875, 0);
    rightWallGroup.add(rwBottom);
    
    const rwTop = createMesh(new THREE.BoxGeometry(0.05, 0.2, 4.0), bodyMat);
    rwTop.position.set(0.975, 2.45, 0);
    rightWallGroup.add(rwTop);

    const rwFrontPillar = createMesh(new THREE.BoxGeometry(0.05, 1.0, 0.5), bodyMat);
    rwFrontPillar.position.set(0.975, 1.85, 1.75);
    rightWallGroup.add(rwFrontPillar);

    const rwRearPillar = createMesh(new THREE.BoxGeometry(0.05, 1.0, 0.5), bodyMat);
    rwRearPillar.position.set(0.975, 1.85, -1.75);
    rightWallGroup.add(rwRearPillar);
    trailer.add(rightWallGroup);

    // Main Hatch (Interactive)
    const hatchGroup = new THREE.Group();
    hatchGroup.position.set(0.975, 2.35, 0);
    
    const hatchPanel = createMesh(new THREE.BoxGeometry(0.06, 1.0, 3.0), bodyMat);
    hatchPanel.position.set(0, -0.5, 0);
    // Mark for raycaster
    hatchPanel.userData = { isHatch: true };
    hatchGroup.add(hatchPanel);
    trailer.add(hatchGroup);
    hatchRef.current = hatchGroup;

    // Rear Wall Frame
    const rearWallGroup = new THREE.Group();
    rearWallGroup.position.set(0, 0, -1.975);
    
    const rwl = createMesh(new THREE.BoxGeometry(0.1, 2.1, 0.05), bodyMat);
    rwl.position.set(-0.95, 1.45, 0);
    rearWallGroup.add(rwl);
    
    const rwr = createMesh(new THREE.BoxGeometry(0.1, 2.1, 0.05), bodyMat);
    rwr.position.set(0.95, 1.45, 0);
    rearWallGroup.add(rwr);

    const rwt = createMesh(new THREE.BoxGeometry(1.8, 0.05, 0.05), bodyMat);
    rwt.position.set(0, 2.525, 0);
    rearWallGroup.add(rwt);
    trailer.add(rearWallGroup);

    // Interactive Rear Doors
    const leftDoorGroup = new THREE.Group();
    leftDoorGroup.position.set(-0.9, 1.45, -1.975);
    const leftDoorPanel = createMesh(new THREE.BoxGeometry(0.9, 2.1, 0.06), bodyMat);
    leftDoorPanel.position.set(0.45, 0, 0);
    leftDoorPanel.userData = { isDoor: true };
    leftDoorGroup.add(leftDoorPanel);
    trailer.add(leftDoorGroup);
    leftDoorRef.current = leftDoorGroup;

    const rightDoorGroup = new THREE.Group();
    rightDoorGroup.position.set(0.9, 1.45, -1.975);
    const rightDoorPanel = createMesh(new THREE.BoxGeometry(0.9, 2.1, 0.06), bodyMat);
    rightDoorPanel.position.set(-0.45, 0, 0);
    rightDoorPanel.userData = { isDoor: true };
    rightDoorGroup.add(rightDoorPanel);
    trailer.add(rightDoorGroup);
    rightDoorRef.current = rightDoorGroup;

    // Interior Counter
    const counterTop = createMesh(new THREE.BoxGeometry(0.6, 0.05, 3.0), counterMat);
    counterTop.position.set(0.65, 1.35, 0);
    trailer.add(counterTop);

    const counterFront = createMesh(new THREE.BoxGeometry(0.02, 0.95, 3.0), counterMat);
    counterFront.position.set(0.35, 0.875, 0);
    trailer.add(counterFront);

    // Equipment Container
    const equipmentContainer = new THREE.Group();
    trailer.add(equipmentContainer);
    equipmentGroupRef.current = equipmentContainer;

    // Build equipment function
    const rebuildEquipment = () => {
      while (equipmentContainer.children.length > 0) {
        equipmentContainer.remove(equipmentContainer.children[0]);
      }
      
      const eq = stateRef.current.equipment;

      if (eq.includes('coffee')) {
        const coffeeGroup = new THREE.Group();
        coffeeGroup.position.set(0.65, 1.375, 0.5);
        
        const machineGeo = new THREE.BoxGeometry(0.4, 0.3, 0.4);
        const machineMat = new THREE.MeshPhysicalMaterial({ color: '#dddddd', metalness: 0.9, roughness: 0.2 });
        const machine = createMesh(machineGeo, machineMat);
        machine.position.set(0, 0.15, 0);
        coffeeGroup.add(machine);

        const tapGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.05);
        const tapMat = new THREE.MeshStandardMaterial({ color: '#111111' });
        
        const tap1 = createMesh(tapGeo, tapMat);
        tap1.position.set(-0.1, 0.15, 0.22);
        tap1.rotation.set(Math.PI/2, 0, 0);
        coffeeGroup.add(tap1);

        const tap2 = createMesh(tapGeo, tapMat);
        tap2.position.set(0.1, 0.15, 0.22);
        tap2.rotation.set(Math.PI/2, 0, 0);
        coffeeGroup.add(tap2);
        
        equipmentContainer.add(coffeeGroup);
      }

      if (eq.includes('fridge')) {
        const fridgeGroup = new THREE.Group();
        fridgeGroup.position.set(-0.6, 1.3, 1.5);
        
        const fBody = createMesh(new THREE.BoxGeometry(0.6, 1.8, 0.6), new THREE.MeshStandardMaterial({ color: '#222222', metalness: 0.5, roughness: 0.5 }));
        fridgeGroup.add(fBody);

        const fGlass = new THREE.Mesh(
          new THREE.BoxGeometry(0.55, 1.7, 0.02),
          new THREE.MeshPhysicalMaterial({ color: '#aaaaaa', transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1 })
        );
        fGlass.position.set(0, 0, 0.31);
        fridgeGroup.add(fGlass);

        equipmentContainer.add(fridgeGroup);
      }

      if (eq.includes('sink')) {
        const sinkGroup = new THREE.Group();
        sinkGroup.position.set(0.65, 1.35, -1.0);

        const basin = createMesh(new THREE.BoxGeometry(0.4, 0.1, 0.4), new THREE.MeshStandardMaterial({ color: '#888888', metalness: 0.8, roughness: 0.2 }));
        basin.position.set(0, -0.05, 0);
        sinkGroup.add(basin);

        const faucetGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.2);
        const faucetMat = new THREE.MeshStandardMaterial({ color: '#cccccc', metalness: 1, roughness: 0.1 });
        
        const faucet1 = createMesh(faucetGeo, faucetMat);
        faucet1.position.set(0, 0.15, -0.15);
        sinkGroup.add(faucet1);

        const faucet2 = createMesh(faucetGeo, faucetMat);
        faucet2.position.set(0, 0.25, -0.05);
        faucet2.rotation.set(Math.PI/2, 0, 0);
        sinkGroup.add(faucet2);

        equipmentContainer.add(sinkGroup);
      }
    };

    rebuildEquipment();

    // Interaction logic
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let clickStartX = 0;
    let clickStartY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = false;
      clickStartX = e.clientX;
      clickStartY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (Math.abs(e.clientX - clickStartX) > 5 || Math.abs(e.clientY - clickStartY) > 5) {
        isDragging = true;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (isDragging) return;
      
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(trailer.children, true);

      if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object.userData.isHatch) {
          stateRef.current.onToggleHatch();
        } else if (object.userData.isDoor) {
          stateRef.current.onToggleDoors();
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let lastTime = performance.now();
    let currentEqRaw = JSON.stringify(stateRef.current.equipment);

    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      controls.update();

      // Smooth damp function
      const damp = (current: number, target: number, speed: number, dt: number) => {
        return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-speed * dt));
      };

      // Animate Hatch
      if (hatchRef.current) {
        const hatchTarget = stateRef.current.hatchOpen ? Math.PI / 1.9 : 0;
        hatchRef.current.rotation.z = damp(hatchRef.current.rotation.z, hatchTarget, 4, delta);
      }

      // Animate Doors
      if (leftDoorRef.current && rightDoorRef.current) {
        const leftTarget = stateRef.current.doorsOpen ? Math.PI / 1.5 : 0;
        const rightTarget = stateRef.current.doorsOpen ? -Math.PI / 1.5 : 0;
        
        leftDoorRef.current.rotation.y = damp(leftDoorRef.current.rotation.y, leftTarget, 4, delta);
        rightDoorRef.current.rotation.y = damp(rightDoorRef.current.rotation.y, rightTarget, 4, delta);
      }

      // Update color if changed
      if (bodyMaterialRef.current && bodyMaterialRef.current.color.getHexString() !== new THREE.Color(stateRef.current.color).getHexString()) {
        bodyMaterialRef.current.color.set(stateRef.current.color);
      }

      // Update equipment if changed
      const newEqRaw = JSON.stringify(stateRef.current.equipment);
      if (currentEqRaw !== newEqRaw) {
        currentEqRaw = newEqRaw;
        rebuildEquipment();
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate(performance.now());

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      
      // Cleanup geometries and materials
      scene.traverse((object: any) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((m: any) => m.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, []); // Only run once on mount

  return <div ref={mountRef} className="w-full h-full cursor-pointer" style={{ touchAction: 'none' }} />;
}
📁 DATEI 3: /components/configurator/TrailerConfigurator.tsx
Erstelle diese Datei mit folgendem kompletten Code:

import { useState } from 'react';
import { TrailerScene } from './TrailerScene';
import { Settings, DoorOpen, DoorClosed, Palette, Coffee, Snowflake, Droplets, Info } from 'lucide-react';

export function TrailerConfigurator() {
  const [hatchOpen, setHatchOpen] = useState(false);
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [color, setColor] = useState('#ffffff');
  const [equipment, setEquipment] = useState<string[]>(['counter']);

  const toggleEquipment = (item: string) => {
    setEquipment(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const calculatePrice = () => {
    let base = 8500;
    if (equipment.includes('coffee')) base += 2500;
    if (equipment.includes('fridge')) base += 800;
    if (equipment.includes('sink')) base += 450;
    return base;
  };

  const handleContact = () => {
    alert(`Konfiguration:\nFarbe: ${color}\nAusstattung: ${equipment.join(', ')}\nPreis: ${calculatePrice()} €`);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* 3D Scene Area */}
      <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden relative shadow-inner min-h-[50vh]">
        <TrailerScene 
          hatchOpen={hatchOpen} 
          doorsOpen={doorsOpen}
          color={color}
          equipment={equipment}
          onToggleHatch={() => setHatchOpen(!hatchOpen)}
          onToggleDoors={() => setDoorsOpen(!doorsOpen)}
        />
        
        {/* Quick Controls */}
        <div className="absolute top-6 left-6 bg-white/70 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-white/40 flex items-center gap-2">
          <Info className="w-4 h-4 text-[#2E3C45]" />
          <span className="text-sm font-medium text-[#2E3C45]">Klicken Sie auf Klappen/Türen zum Öffnen</span>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 bg-white/70 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/40">
           <button 
             onClick={() => setHatchOpen(!hatchOpen)} 
             className={`px-4 py-3 rounded-xl transition-all flex items-center gap-2 font-medium ${hatchOpen ? 'bg-[#2E3C45] text-white' : 'bg-white text-[#2E3C45] hover:bg-gray-50'}`}
           >
              {hatchOpen ? <DoorOpen className="w-5 h-5" /> : <DoorClosed className="w-5 h-5" />}
              Verkaufsklappe
           </button>
           <button 
             onClick={() => setDoorsOpen(!doorsOpen)} 
             className={`px-4 py-3 rounded-xl transition-all flex items-center gap-2 font-medium ${doorsOpen ? 'bg-[#2E3C45] text-white' : 'bg-white text-[#2E3C45] hover:bg-gray-50'}`}
           >
              {doorsOpen ? <DoorOpen className="w-5 h-5" /> : <DoorClosed className="w-5 h-5" />}
              Hecktüren
           </button>
        </div>
      </div>

      {/* Config Panel */}
      <div className="w-full lg:w-96 bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col overflow-hidden shrink-0">
        <div className="p-6 bg-[#2E3C45] text-white">
          <h2 className="text-2xl font-bold">Konfigurator</h2>
          <p className="text-white/70 text-sm mt-1">Stellen Sie Ihren Anhänger zusammen</p>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto space-y-8">
          {/* Colors */}
          <div>
            <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-4 flex items-center gap-2">
              <Palette className="w-4 h-4" /> Außenfarbe
            </h3>
            <div className="flex gap-4">
              {['#ffffff', '#1C1F2B', '#B7D3E9', '#d1d5db'].map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-12 h-12 rounded-full border-2 transition-all ${color === c ? 'border-[#2E3C45] scale-110 shadow-md' : 'border-gray-200 hover:scale-105'}`}
                  style={{ backgroundColor: c }}
                  title={`Farbe: ${c}`}
                />
              ))}
            </div>
          </div>

          {/* Equipment */}
          <div>
            <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4" /> Ausstattung
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 hover:border-gray-200 cursor-pointer transition-all">
                <input type="checkbox" checked={equipment.includes('coffee')} onChange={() => toggleEquipment('coffee')} className="w-5 h-5 text-[#2E3C45] rounded focus:ring-[#B7D3E9]" />
                <div className="w-10 h-10 bg-[#B7D3E9]/20 rounded-xl flex items-center justify-center text-[#2E3C45]">
                  <Coffee className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="block font-semibold text-[#1C1F2B]">Profi Kaffeemaschine</span>
                  <span className="text-sm text-gray-500">+ 2.500 €</span>
                </div>
              </label>
              
              <label className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 hover:border-gray-200 cursor-pointer transition-all">
                <input type="checkbox" checked={equipment.includes('fridge')} onChange={() => toggleEquipment('fridge')} className="w-5 h-5 text-[#2E3C45] rounded focus:ring-[#B7D3E9]" />
                <div className="w-10 h-10 bg-[#B7D3E9]/20 rounded-xl flex items-center justify-center text-[#2E3C45]">
                  <Snowflake className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="block font-semibold text-[#1C1F2B]">Getränkekühlschrank</span>
                  <span className="text-sm text-gray-500">+ 800 €</span>
                </div>
              </label>

              <label className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 hover:border-gray-200 cursor-pointer transition-all">
                <input type="checkbox" checked={equipment.includes('sink')} onChange={() => toggleEquipment('sink')} className="w-5 h-5 text-[#2E3C45] rounded focus:ring-[#B7D3E9]" />
                <div className="w-10 h-10 bg-[#B7D3E9]/20 rounded-xl flex items-center justify-center text-[#2E3C45]">
                  <Droplets className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="block font-semibold text-[#1C1F2B]">Waschbecken-Set</span>
                  <span className="text-sm text-gray-500">+ 450 €</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Price & Action */}
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <div className="flex justify-between items-end mb-6">
            <div>
              <span className="text-sm text-gray-500 block mb-1">Gesamtpreis (Netto)</span>
              <span className="text-3xl font-bold text-[#2E3C45]">
                {calculatePrice().toLocaleString('de-DE')} €
              </span>
            </div>
          </div>
          <button 
            onClick={handleContact} 
            className="w-full bg-[#B7D3E9] text-[#1C1F2B] font-bold py-4 rounded-xl hover:bg-[#a1c4e0] transition-colors shadow-sm"
          >
            Angebot anfordern
          </button>
        </div>
      </div>
    </div>
  );
}
📁 DATEI 4: /App.tsx
Nutze den TrailerConfigurator in deiner App:

import { TrailerConfigurator } from './components/configurator/TrailerConfigurator';

export default function App() {
  return (
    <div className="min-h-screen gradient-accent p-8">
      <div className="container mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-[#1C1F2B] mb-4">
            3D Trailer Konfigurator
          </h1>
          <p className="text-xl text-[#2E3C45]">
            Gestalten Sie Ihren individuellen Verkaufsanhänger
          </p>
        </div>
        
        <TrailerConfigurator />
      </div>
    </div>
  );
}