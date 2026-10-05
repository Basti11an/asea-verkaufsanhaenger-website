export type View = "top" | "side" | "front";
export type Product = {
  id: string;
  name: [string, string, string];
  category: "cooking" | "cooling" | "furniture" | "water";
  preferredView: View;
  width: number;
  height: number;
  depth: number;
  modelPath: null;
  active: boolean;
  rules?: {
    allowedAreas?: string[];
    blockedAreas?: string[];
    wheelArchAllowed?: boolean;
    countertopBehavior?: string;
    dependencies?: string[];
    conflicts?: string[];
  };
};
export type Placement = { id: string; productId: string; x: number; y: number };
