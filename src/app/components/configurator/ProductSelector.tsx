import {
  CookingPot,
  Refrigerator,
  Droplets,
  PanelsTopLeft,
  Plus,
} from "lucide-react";
import { demoProducts } from "./demoProducts";
import { useConfiguratorCopy } from "./copy";
import type { Product } from "./types";
const icons = {
  cooking: CookingPot,
  cooling: Refrigerator,
  water: Droplets,
  furniture: PanelsTopLeft,
};
export function ProductSelector({
  selected,
  onSelect,
}: {
  selected?: string;
  onSelect: (product: Product) => void;
}) {
  const { text, name } = useConfiguratorCopy();
  return (
    <section className="asea-catalog">
      <h2>{text("products")}</h2>
      <div className="asea-products">
        {demoProducts
          .filter((p) => p.active)
          .map((p) => {
            const Icon = icons[p.category];
            return (
              <button
                key={p.id}
                aria-pressed={selected === p.id}
                onClick={() => onSelect(p)}
                className="asea-product"
              >
                <Icon size={29} strokeWidth={1.3} />
                <span>{name(p.name)}</span>
                <Plus size={15} />
              </button>
            );
          })}
      </div>
    </section>
  );
}
