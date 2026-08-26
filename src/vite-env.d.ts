/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_EMAILJS_SERVICE_ID?: string;
  readonly VITE_EMAILJS_PUBLIC_KEY?: string;
  readonly VITE_EMAILJS_INTERNAL_TEMPLATE_ID?: string;
  readonly VITE_EMAILJS_CUSTOMER_TEMPLATE_ID?: string;
  readonly VITE_EMAILJS_INTERNAL_RECIPIENT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'three/examples/jsm/controls/OrbitControls' {
  import type { Camera, Vector3 } from 'three';

  export class OrbitControls {
    constructor(object: Camera, domElement?: HTMLElement);
    enabled: boolean;
    enableDamping: boolean;
    dampingFactor: number;
    enablePan: boolean;
    enableZoom: boolean;
    minDistance: number;
    maxDistance: number;
    maxPolarAngle: number;
    target: Vector3;
    update(): void;
    dispose(): void;
  }
}

declare module 'three/examples/jsm/renderers/CSS2DRenderer' {
  import { Object3D, type Camera, type Scene, type Vector3 } from 'three';

  export class CSS2DObject extends Object3D {
    constructor(element?: HTMLElement);
    element: HTMLElement;
    position: Vector3;
  }

  export class CSS2DRenderer {
    constructor(parameters?: { element?: HTMLElement });
    domElement: HTMLElement;
    setSize(width: number, height: number): void;
    render(scene: Scene, camera: Camera): void;
  }
}
