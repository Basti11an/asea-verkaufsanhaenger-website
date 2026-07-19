import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

interface TrailerSceneProps {
  hatchOpen: boolean;
  doorsOpen: boolean;
  exteriorColor: string;
  floorColor: string;
  counterColor: string;
  doorColor: string;
  equipment: string[];
  setup: string;
  zoom: number;
  onToggleHatch: () => void;
  onToggleDoors: () => void;
}

export function TrailerScene({ hatchOpen, doorsOpen, exteriorColor, floorColor, counterColor, doorColor, equipment, setup, zoom, onToggleHatch, onToggleDoors }: TrailerSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  
  // Keep references to scene objects to update them when props change
  const hatchRef = useRef<THREE.Group | null>(null);
  const leftDoorRef = useRef<THREE.Group | null>(null);
  const rightDoorRef = useRef<THREE.Group | null>(null);
  const bodyMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const doorMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const floorMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const counterMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const woodMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const equipmentGroupRef = useRef<THREE.Group | null>(null);
  const countersGroupRef = useRef<THREE.Group | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const labelsRef = useRef<CSS2DObject[]>([]);
  
  // Track current animation state
  const stateRef = useRef({
    hatchOpen,
    doorsOpen,
    exteriorColor,
    floorColor,
    counterColor,
    doorColor,
    equipment,
    setup,
    zoom,
    onToggleHatch,
    onToggleDoors
  });

  useEffect(() => {
    stateRef.current = { hatchOpen, doorsOpen, exteriorColor, floorColor, counterColor, doorColor, equipment, setup, zoom, onToggleHatch, onToggleDoors };
  }, [hatchOpen, doorsOpen, exteriorColor, floorColor, counterColor, doorColor, equipment, setup, zoom, onToggleHatch, onToggleDoors]);

  // Update zoom when it changes
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.minDistance = zoom;
      controlsRef.current.maxDistance = zoom;
    }
  }, [zoom]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#87CEEB'); // Sky blue

    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 100);
    camera.position.set(5, 2, 6);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.appendChild(renderer.domElement);

    // Label renderer
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';
    mountRef.current.appendChild(labelRenderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.minDistance = zoom;
    controls.maxDistance = zoom;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Ground collision
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 1.2, 0);
    controls.enableZoom = false; // Disable mouse wheel zoom
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 10, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.bias = -0.0001;
    scene.add(dirLight);

    // Ground plane with grass texture
    const groundGeo = new THREE.PlaneGeometry(50, 50);
    const groundMat = new THREE.MeshStandardMaterial({ 
      color: '#4a7c3f', // Grass green
      roughness: 0.9 
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    scene.add(ground);

    // Add simple grass pattern
    const grassPattern = new THREE.Group();
    for (let i = 0; i < 100; i++) {
      const blade = new THREE.Mesh(
        new THREE.PlaneGeometry(0.1, 0.2),
        new THREE.MeshStandardMaterial({ color: '#3d6b32', side: THREE.DoubleSide })
      );
      blade.position.set(
        (Math.random() - 0.5) * 30,
        0.05,
        (Math.random() - 0.5) * 30
      );
      blade.rotation.x = -Math.PI / 2;
      blade.rotation.z = Math.random() * Math.PI;
      grassPattern.add(blade);
    }
    scene.add(grassPattern);

    // --- MATERIALS ---
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: stateRef.current.exteriorColor,
      metalness: 0.1,
      roughness: 0.2,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
    });
    bodyMaterialRef.current = bodyMat;

    // Interactive parts material (slightly lighter/highlighted)
    const interactiveMat = new THREE.MeshPhysicalMaterial({
      color: stateRef.current.doorColor,
      metalness: 0.2,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      emissive: new THREE.Color(stateRef.current.doorColor).multiplyScalar(0.1),
    });
    doorMaterialRef.current = interactiveMat;

    const frameMat = new THREE.MeshStandardMaterial({ color: '#888888', metalness: 0.8, roughness: 0.3 });
    const floorMat = new THREE.MeshStandardMaterial({ color: stateRef.current.floorColor, roughness: 0.9 });
    floorMaterialRef.current = floorMat;
    
    const counterMat = new THREE.MeshStandardMaterial({ color: stateRef.current.counterColor, roughness: 0.6, metalness: 0.1 });
    counterMaterialRef.current = counterMat;
    
    const woodMat = new THREE.MeshStandardMaterial({ color: '#6b4423', roughness: 0.8 });

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

    // Helper to create labels
    const createLabel = (text: string, color = '#1C1F2B') => {
      const div = document.createElement('div');
      div.className = 'equipment-label';
      div.textContent = text;
      div.style.color = color;
      div.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
      div.style.padding = '4px 8px';
      div.style.borderRadius = '8px';
      div.style.fontSize = '11px';
      div.style.fontWeight = '600';
      div.style.border = '1px solid rgba(0,0,0,0.1)';
      div.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      div.style.pointerEvents = 'none';
      div.style.userSelect = 'none';
      const label = new CSS2DObject(div);
      labelsRef.current.push(label);
      return label;
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
    
    const hatchPanel = createMesh(new THREE.BoxGeometry(0.06, 1.0, 3.0), interactiveMat.clone());
    hatchPanel.position.set(0, -0.5, 0);
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
    const leftDoorPanel = createMesh(new THREE.BoxGeometry(0.9, 2.1, 0.06), interactiveMat.clone());
    leftDoorPanel.position.set(0.45, 0, 0);
    leftDoorPanel.userData = { isDoor: true };
    leftDoorGroup.add(leftDoorPanel);
    
    trailer.add(leftDoorGroup);
    leftDoorRef.current = leftDoorGroup;

    const rightDoorGroup = new THREE.Group();
    rightDoorGroup.position.set(0.9, 1.45, -1.975);
    const rightDoorPanel = createMesh(new THREE.BoxGeometry(0.9, 2.1, 0.06), interactiveMat.clone());
    rightDoorPanel.position.set(-0.45, 0, 0);
    rightDoorPanel.userData = { isDoor: true };
    rightDoorGroup.add(rightDoorPanel);
    
    trailer.add(rightDoorGroup);
    rightDoorRef.current = rightDoorGroup;

    // Counters Container (dynamic based on setup)
    const countersContainer = new THREE.Group();
    trailer.add(countersContainer);
    countersGroupRef.current = countersContainer;

    // Equipment Container
    const equipmentContainer = new THREE.Group();
    trailer.add(equipmentContainer);
    equipmentGroupRef.current = equipmentContainer;

    // Helper to create a counter table
    const createCounter = (width: number, depth: number, height: number, x: number, y: number, z: number) => {
      const counterGroup = new THREE.Group();
      counterGroup.position.set(x, y, z);

      // Table top
      const top = createMesh(new THREE.BoxGeometry(width, 0.05, depth), counterMat);
      top.position.set(0, height, 0);
      counterGroup.add(top);

      // Legs (4 corners)
      const legGeo = new THREE.BoxGeometry(0.05, height, 0.05);
      const legMat = new THREE.MeshStandardMaterial({ color: '#333333', roughness: 0.8 });
      
      const leg1 = createMesh(legGeo, legMat);
      leg1.position.set(-width/2 + 0.05, height/2, -depth/2 + 0.05);
      counterGroup.add(leg1);

      const leg2 = createMesh(legGeo, legMat);
      leg2.position.set(width/2 - 0.05, height/2, -depth/2 + 0.05);
      counterGroup.add(leg2);

      const leg3 = createMesh(legGeo, legMat);
      leg3.position.set(-width/2 + 0.05, height/2, depth/2 - 0.05);
      counterGroup.add(leg3);

      const leg4 = createMesh(legGeo, legMat);
      leg4.position.set(width/2 - 0.05, height/2, depth/2 - 0.05);
      counterGroup.add(leg4);

      return counterGroup;
    };

    // Helper to create a wall shelf
    const createWallShelf = (width: number, depth: number, x: number, y: number, z: number) => {
      const shelfGroup = new THREE.Group();
      shelfGroup.position.set(x, y, z);

      const shelf = createMesh(new THREE.BoxGeometry(depth, 0.04, width), woodMat);
      shelf.position.set(0, 0, 0);
      shelfGroup.add(shelf);

      // Brackets
      const bracketGeo = new THREE.BoxGeometry(0.03, 0.15, 0.03);
      const bracketMat = new THREE.MeshStandardMaterial({ color: '#444444', metalness: 0.7, roughness: 0.3 });
      
      const bracket1 = createMesh(bracketGeo, bracketMat);
      bracket1.position.set(0.1, -0.075, -width/2 + 0.1);
      shelfGroup.add(bracket1);

      const bracket2 = createMesh(bracketGeo, bracketMat);
      bracket2.position.set(0.1, -0.075, width/2 - 0.1);
      shelfGroup.add(bracket2);

      return shelfGroup;
    };

    // Build counters based on setup
    const rebuildCounters = () => {
      // Clear all counters
      while (countersContainer.children.length > 0) {
        countersContainer.remove(countersContainer.children[0]);
      }

      const currentSetup = stateRef.current.setup;

      // Front Counter - FULL WIDTH serving counter (all setups have this)
      const frontCounterGroup = new THREE.Group();
      
      // Counter top - full width
      const frontTop = createMesh(new THREE.BoxGeometry(0.6, 0.05, 3.0), counterMat);
      frontTop.position.set(0.65, 1.35, 0);
      frontCounterGroup.add(frontTop);

      // Counter front panel
      const frontPanel = createMesh(new THREE.BoxGeometry(0.02, 0.95, 3.0), counterMat);
      frontPanel.position.set(0.35, 0.875, 0);
      frontCounterGroup.add(frontPanel);

      // Counter back wall
      const backPanel = createMesh(new THREE.BoxGeometry(0.02, 0.95, 3.0), counterMat);
      backPanel.position.set(0.95, 0.875, 0);
      frontCounterGroup.add(backPanel);

      // Counter side walls
      const sideLeft = createMesh(new THREE.BoxGeometry(0.6, 0.95, 0.02), counterMat);
      sideLeft.position.set(0.65, 0.875, 1.49);
      frontCounterGroup.add(sideLeft);

      const sideRight = createMesh(new THREE.BoxGeometry(0.6, 0.95, 0.02), counterMat);
      sideRight.position.set(0.65, 0.875, -1.49);
      frontCounterGroup.add(sideRight);

      countersContainer.add(frontCounterGroup);

      if (currentSetup === 'full' || currentSetup === 'basic') {
        // Back Counter
        const backCounter = createCounter(0.8, 0.6, 0.95, 0.5, 0.4, -1.3);
        countersContainer.add(backCounter);
      }

      if (currentSetup === 'full') {
        // Middle Counter
        const middleCounter = createCounter(0.8, 0.6, 0.95, 0.5, 0.4, 0.0);
        countersContainer.add(middleCounter);
      }

      if (currentSetup === 'full' || currentSetup === 'basic') {
        // Wall Shelf (left side, multiple levels)
        const wallShelf1 = createWallShelf(2.0, 0.35, -0.65, 0.8, 0);
        countersContainer.add(wallShelf1);

        const wallShelf2 = createWallShelf(2.0, 0.35, -0.65, 1.4, 0);
        countersContainer.add(wallShelf2);

        const wallShelf3 = createWallShelf(2.0, 0.35, -0.65, 2.0, 0);
        countersContainer.add(wallShelf3);
      }
    };

    rebuildCounters();

    // Build equipment function
    const rebuildEquipment = () => {
      // Clear all existing labels from DOM
      labelsRef.current.forEach(label => {
        if (label.element && label.element.parentNode) {
          label.element.parentNode.removeChild(label.element);
        }
      });
      labelsRef.current = [];

      // Clear all equipment
      while (equipmentContainer.children.length > 0) {
        const child = equipmentContainer.children[0];
        equipmentContainer.remove(child);
      }
      
      const eq = stateRef.current.equipment;

      // Coffee Machine - Front Counter
      if (eq.includes('coffee')) {
        const coffeeGroup = new THREE.Group();
        coffeeGroup.position.set(0.5, 1.4, 1.3);
        
        const machineBody = createMesh(
          new THREE.BoxGeometry(0.35, 0.4, 0.35),
          new THREE.MeshPhysicalMaterial({ color: '#2a2a2a', metalness: 0.8, roughness: 0.2 })
        );
        machineBody.position.set(0, 0.2, 0);
        coffeeGroup.add(machineBody);

        const machineTop = createMesh(
          new THREE.BoxGeometry(0.4, 0.05, 0.4),
          new THREE.MeshStandardMaterial({ color: '#dddddd', metalness: 0.9, roughness: 0.1 })
        );
        machineTop.position.set(0, 0.425, 0);
        coffeeGroup.add(machineTop);

        // Coffee taps
        const tapGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.08);
        const tapMat = new THREE.MeshStandardMaterial({ color: '#cccccc', metalness: 1, roughness: 0.1 });
        
        const tap1 = createMesh(tapGeo, tapMat);
        tap1.position.set(-0.1, 0.15, 0.2);
        tap1.rotation.set(Math.PI/2, 0, 0);
        coffeeGroup.add(tap1);

        const tap2 = createMesh(tapGeo, tapMat);
        tap2.position.set(0.1, 0.15, 0.2);
        tap2.rotation.set(Math.PI/2, 0, 0);
        coffeeGroup.add(tap2);

        const coffeeLabel = createLabel('Kaffeemaschine', '#b08a57');
        coffeeLabel.position.set(0, 0.6, 0);
        coffeeGroup.add(coffeeLabel);
        
        equipmentContainer.add(coffeeGroup);
      }

      // Display Case (Vitrine) - Front Counter
      if (eq.includes('vitrine')) {
        const vitrineGroup = new THREE.Group();
        vitrineGroup.position.set(0.5, 1.4, 1.3);
        
        const vBase = createMesh(
          new THREE.BoxGeometry(0.5, 0.1, 0.5),
          new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.5 })
        );
        vBase.position.set(0, 0.05, 0);
        vitrineGroup.add(vBase);

        const vGlass = new THREE.Mesh(
          new THREE.BoxGeometry(0.48, 0.5, 0.48),
          new THREE.MeshPhysicalMaterial({ 
            color: '#e0f0ff', 
            transmission: 0.9, 
            opacity: 1, 
            transparent: true, 
            roughness: 0.05,
            metalness: 0.0
          })
        );
        vGlass.position.set(0, 0.35, 0);
        vitrineGroup.add(vGlass);

        const vitrineLabel = createLabel('Kühlvitrine', '#b08a57');
        vitrineLabel.position.set(0, 0.7, 0);
        vitrineGroup.add(vitrineLabel);

        equipmentContainer.add(vitrineGroup);
      }

      // Grill - Middle Counter
      if (eq.includes('grill')) {
        const grillGroup = new THREE.Group();
        grillGroup.position.set(0.5, 1.4, 0.0);
        
        const grillBase = createMesh(
          new THREE.BoxGeometry(0.5, 0.15, 0.5),
          new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.5 })
        );
        grillBase.position.set(0, 0.075, 0);
        grillGroup.add(grillBase);

        const grillPlate = createMesh(
          new THREE.BoxGeometry(0.45, 0.03, 0.45),
          new THREE.MeshStandardMaterial({ color: '#333333', metalness: 0.8, roughness: 0.2 })
        );
        grillPlate.position.set(0, 0.165, 0);
        grillGroup.add(grillPlate);

        // Grill lines
        for (let i = 0; i < 5; i++) {
          const line = createMesh(
            new THREE.BoxGeometry(0.45, 0.01, 0.02),
            new THREE.MeshStandardMaterial({ color: '#111111' })
          );
          line.position.set(0, 0.18, -0.18 + i * 0.09);
          grillGroup.add(line);
        }

        const grillLabel = createLabel('Grill', '#b08a57');
        grillLabel.position.set(0, 0.35, 0);
        grillGroup.add(grillLabel);

        equipmentContainer.add(grillGroup);
      }

      // Fryer - Middle Counter
      if (eq.includes('fryer')) {
        const fryerGroup = new THREE.Group();
        fryerGroup.position.set(0.5, 1.4, 0.0);
        
        const fryerBody = createMesh(
          new THREE.BoxGeometry(0.45, 0.2, 0.45),
          new THREE.MeshStandardMaterial({ color: '#d4d4d4', metalness: 0.6, roughness: 0.3 })
        );
        fryerBody.position.set(0, 0.1, 0);
        fryerGroup.add(fryerBody);

        const fryerBasket = createMesh(
          new THREE.BoxGeometry(0.35, 0.15, 0.35),
          new THREE.MeshStandardMaterial({ color: '#666666', metalness: 0.5, roughness: 0.5 })
        );
        fryerBasket.position.set(0, 0.175, 0);
        fryerGroup.add(fryerBasket);

        const fryerLabel = createLabel('Fritteuse', '#b08a57');
        fryerLabel.position.set(0, 0.35, 0);
        fryerGroup.add(fryerLabel);

        equipmentContainer.add(fryerGroup);
      }

      // Microwave - Back Counter
      if (eq.includes('microwave')) {
        const microGroup = new THREE.Group();
        microGroup.position.set(0.5, 1.4, -1.3);
        
        const microBody = createMesh(
          new THREE.BoxGeometry(0.45, 0.3, 0.35),
          new THREE.MeshStandardMaterial({ color: '#2a2a2a', metalness: 0.5, roughness: 0.3 })
        );
        microGroup.add(microBody);

        const microDoor = createMesh(
          new THREE.BoxGeometry(0.35, 0.25, 0.02),
          new THREE.MeshStandardMaterial({ color: '#1a1a1a', metalness: 0.8, roughness: 0.2 })
        );
        microDoor.position.set(0, 0, 0.185);
        microGroup.add(microDoor);

        const microLabel = createLabel('Mikrowelle', '#b08a57');
        microLabel.position.set(0, 0.25, 0);
        microGroup.add(microLabel);

        equipmentContainer.add(microGroup);
      }

      // Ice Cream Machine - Back Counter
      if (eq.includes('icecream')) {
        const iceGroup = new THREE.Group();
        iceGroup.position.set(0.5, 1.4, -1.3);
        
        const iceBody = createMesh(
          new THREE.BoxGeometry(0.4, 0.5, 0.35),
          new THREE.MeshPhysicalMaterial({ color: '#ffffff', metalness: 0.3, roughness: 0.2 })
        );
        iceBody.position.set(0, 0.25, 0);
        iceGroup.add(iceBody);

        // Dispensers
        for (let i = -1; i <= 1; i++) {
          const dispenser = createMesh(
            new THREE.CylinderGeometry(0.04, 0.04, 0.1),
            new THREE.MeshStandardMaterial({ color: '#cccccc', metalness: 1, roughness: 0.1 })
          );
          dispenser.position.set(i * 0.1, 0.05, 0.2);
          dispenser.rotation.set(Math.PI/2, 0, 0);
          iceGroup.add(dispenser);
        }

        const iceLabel = createLabel('Eismaschine', '#b08a57');
        iceLabel.position.set(0, 0.6, 0);
        iceGroup.add(iceLabel);

        equipmentContainer.add(iceGroup);
      }

      // Fridge - Wall Shelf (lower)
      if (eq.includes('fridge')) {
        const fridgeGroup = new THREE.Group();
        fridgeGroup.position.set(-0.65, 0.8, 0.8);
        
        const fBody = createMesh(
          new THREE.BoxGeometry(0.3, 0.5, 0.4),
          new THREE.MeshStandardMaterial({ color: '#e8e8e8', metalness: 0.4, roughness: 0.3 })
        );
        fBody.position.set(0, 0.25, 0);
        fridgeGroup.add(fBody);

        const fGlass = new THREE.Mesh(
          new THREE.BoxGeometry(0.25, 0.45, 0.02),
          new THREE.MeshPhysicalMaterial({ 
            color: '#99ccff', 
            transmission: 0.85, 
            opacity: 1, 
            transparent: true, 
            roughness: 0.1,
            metalness: 0.1
          })
        );
        fGlass.position.set(0, 0.25, 0.21);
        fridgeGroup.add(fGlass);

        const fridgeLabel = createLabel('Kühlschrank', '#b08a57');
        fridgeLabel.position.set(0, 0.6, 0);
        fridgeGroup.add(fridgeLabel);

        equipmentContainer.add(fridgeGroup);
      }

      // Freezer - Wall Shelf (lower)
      if (eq.includes('freezer')) {
        const freezerGroup = new THREE.Group();
        freezerGroup.position.set(-0.65, 0.8, -0.8);
        
        const freezerBody = createMesh(
          new THREE.BoxGeometry(0.3, 0.5, 0.4),
          new THREE.MeshStandardMaterial({ color: '#e0e0e0', metalness: 0.4, roughness: 0.3 })
        );
        freezerBody.position.set(0, 0.25, 0);
        freezerGroup.add(freezerBody);

        const freezerLabel = createLabel('Gefriertruhe', '#b08a57');
        freezerLabel.position.set(0, 0.6, 0);
        freezerGroup.add(freezerLabel);

        equipmentContainer.add(freezerGroup);
      }

      // Sink - Wall Shelf (middle)
      if (eq.includes('sink')) {
        const sinkGroup = new THREE.Group();
        sinkGroup.position.set(-0.65, 1.4, 0.3);

        const basin = createMesh(
          new THREE.BoxGeometry(0.3, 0.08, 0.3),
          new THREE.MeshStandardMaterial({ color: '#b8b8b8', metalness: 0.7, roughness: 0.2 })
        );
        basin.position.set(0, 0, 0);
        sinkGroup.add(basin);

        const faucetBase = createMesh(
          new THREE.CylinderGeometry(0.015, 0.015, 0.12),
          new THREE.MeshStandardMaterial({ color: '#cccccc', metalness: 1, roughness: 0.1 })
        );
        faucetBase.position.set(0, 0.1, -0.12);
        sinkGroup.add(faucetBase);

        const faucetSpout = createMesh(
          new THREE.CylinderGeometry(0.012, 0.012, 0.12),
          new THREE.MeshStandardMaterial({ color: '#cccccc', metalness: 1, roughness: 0.1 })
        );
        faucetSpout.position.set(0, 0.18, -0.02);
        faucetSpout.rotation.set(Math.PI/2, 0, 0);
        sinkGroup.add(faucetSpout);

        const sinkLabel = createLabel('Waschbecken', '#b08a57');
        sinkLabel.position.set(0, 0.25, 0);
        sinkGroup.add(sinkLabel);

        equipmentContainer.add(sinkGroup);
      }

      // Hot Water Boiler - Wall Shelf (middle)
      if (eq.includes('hotwater')) {
        const boilerGroup = new THREE.Group();
        boilerGroup.position.set(-0.65, 1.4, -0.3);
        
        const boilerBody = createMesh(
          new THREE.CylinderGeometry(0.12, 0.12, 0.35),
          new THREE.MeshStandardMaterial({ color: '#d4d4d4', metalness: 0.7, roughness: 0.3 })
        );
        boilerBody.position.set(0, 0.175, 0);
        boilerGroup.add(boilerBody);

        const boilerTap = createMesh(
          new THREE.CylinderGeometry(0.015, 0.015, 0.06),
          new THREE.MeshStandardMaterial({ color: '#cccccc', metalness: 1, roughness: 0.1 })
        );
        boilerTap.position.set(0, 0.05, 0.14);
        boilerTap.rotation.set(Math.PI/2, 0, 0);
        boilerGroup.add(boilerTap);

        const boilerLabel = createLabel('Heißwasser', '#b08a57');
        boilerLabel.position.set(0, 0.4, 0);
        boilerGroup.add(boilerLabel);

        equipmentContainer.add(boilerGroup);
      }

      // Water Tank - Wall Shelf (upper)
      if (eq.includes('watertank')) {
        const tankGroup = new THREE.Group();
        tankGroup.position.set(-0.65, 2.0, 0);
        
        const tank = createMesh(
          new THREE.CylinderGeometry(0.15, 0.15, 0.4),
          new THREE.MeshStandardMaterial({ color: '#4488cc', metalness: 0.3, roughness: 0.4, transparent: true, opacity: 0.7 })
        );
        tank.position.set(0, 0.2, 0);
        tankGroup.add(tank);

        const tankLabel = createLabel('Wassertank', '#b08a57');
        tankLabel.position.set(0, 0.45, 0);
        tankGroup.add(tankLabel);

        equipmentContainer.add(tankGroup);
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
      labelRenderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let lastTime = performance.now();
    let currentEqRaw = JSON.stringify(stateRef.current.equipment);
    let currentSetupRaw = stateRef.current.setup;

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
      if (bodyMaterialRef.current && bodyMaterialRef.current.color.getHexString() !== new THREE.Color(stateRef.current.exteriorColor).getHexString()) {
        bodyMaterialRef.current.color.set(stateRef.current.exteriorColor);
      }

      // Update door color if changed
      if (doorMaterialRef.current && doorMaterialRef.current.color.getHexString() !== new THREE.Color(stateRef.current.doorColor).getHexString()) {
        doorMaterialRef.current.color.set(stateRef.current.doorColor);
        doorMaterialRef.current.emissive.set(new THREE.Color(stateRef.current.doorColor).multiplyScalar(0.1));
      }

      // Update floor color if changed
      if (floorMaterialRef.current && floorMaterialRef.current.color.getHexString() !== new THREE.Color(stateRef.current.floorColor).getHexString()) {
        floorMaterialRef.current.color.set(stateRef.current.floorColor);
      }

      // Update counter color if changed  
      if (counterMaterialRef.current && counterMaterialRef.current.color.getHexString() !== new THREE.Color(stateRef.current.counterColor).getHexString()) {
        counterMaterialRef.current.color.set(stateRef.current.counterColor);
      }

      // Update equipment if changed
      const newEqRaw = JSON.stringify(stateRef.current.equipment);
      if (currentEqRaw !== newEqRaw) {
        currentEqRaw = newEqRaw;
        rebuildEquipment();
      }

      // Update counters if setup changed
      if (currentSetupRaw !== stateRef.current.setup) {
        currentSetupRaw = stateRef.current.setup;
        rebuildCounters();
        rebuildEquipment(); // Also rebuild equipment to match new counters
      }

      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
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
      
      // Clean up all labels
      labelsRef.current.forEach(label => {
        if (label.element && label.element.parentNode) {
          label.element.parentNode.removeChild(label.element);
        }
      });
      labelsRef.current = [];
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      if (mountRef.current && labelRenderer.domElement) {
        mountRef.current.removeChild(labelRenderer.domElement);
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