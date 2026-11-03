import { ChefHat, ChevronLeft, ChevronRight, Droplets, PanelsTopLeft, Refrigerator, Warehouse } from "lucide-react";
import { useRef, useState } from "react";
import { products } from "./data/products";
import type { ProductCategory, ProductDefinition } from "./types";
import { useConfiguratorCopy } from "./copy";

type ProductBarProps = {
  onProductClick: (product: ProductDefinition) => void;
  editing: boolean;
};

const categories: readonly { id: ProductCategory; label: "categoryCooking" | "categoryCooling" | "categoryHygiene" | "categoryWorktops" | "categoryCabinets"; icon: typeof ChefHat }[] = [
  { id: "cooking", label: "categoryCooking", icon: ChefHat },
  { id: "cooling", label: "categoryCooling", icon: Refrigerator },
  { id: "hygiene", label: "categoryHygiene", icon: Droplets },
  { id: "worktops", label: "categoryWorktops", icon: PanelsTopLeft },
  { id: "cabinets", label: "categoryCabinets", icon: Warehouse },
];

export function ProductBar({ onProductClick, editing }: ProductBarProps) {
  const { text, name } = useConfiguratorCopy();
  const stripRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<ProductCategory>("cooking");
  const [hoverInfo, setHoverInfo] = useState<{ name: string; left: number; top: number } | null>(null);
  const visibleProducts = products.filter((product) => product.active && product.category === activeCategory);
  const scroll = (direction: -1 | 1) => {
    if (!stripRef.current) return;
    stripRef.current.scrollLeft += direction * 520;
  };

  const selectCategory = (category: ProductCategory) => {
    setActiveCategory(category);
    setHoverInfo(null);
    if (stripRef.current) stripRef.current.scrollLeft = 0;
  };

  return (
    <section className={`asea-product-bar${editing ? " is-editing" : ""}`} aria-label={text("products")}>
      <div className="asea-product-bar-heading">
        <h2>{text("products")}</h2>
      </div>
      <div className="asea-product-categories" role="tablist" aria-label={text("products")}>
        {categories.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={activeCategory === id}
            className={activeCategory === id ? "is-active" : undefined}
            onClick={() => selectCategory(id)}
          >
            <Icon size={12} aria-hidden="true" />
            {text(label)}
          </button>
        ))}
      </div>
      <button type="button" className="asea-strip-arrow" onClick={() => scroll(-1)} aria-label={text("scrollProductsLeft")}><ChevronLeft size={17} /></button>
      <div className="asea-product-strip" ref={stripRef}>
        {visibleProducts.map((product) => {
          const productName = name(product.name);
          return (
            <button
              key={product.id}
              type="button"
              className={`asea-product-card is-${product.category}`}
              title={productName}
              onClick={() => onProductClick(product)}
              onMouseEnter={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                const popoverWidth = 210;
                setHoverInfo({
                  name: productName,
                  left: Math.min(Math.max(rect.left + rect.width / 2 - popoverWidth / 2, 8), window.innerWidth - popoverWidth - 8),
                  top: rect.top - 8,
                });
              }}
              onMouseLeave={() => setHoverInfo(null)}
            >
              <span className="asea-product-image-space" aria-hidden="true" />
              <span className="asea-product-name">{productName}</span>
            </button>
          );
        })}
      </div>
      <button type="button" className="asea-strip-arrow" onClick={() => scroll(1)} aria-label={text("scrollProductsRight")}><ChevronRight size={17} /></button>
      {hoverInfo && (
        <div
          className="asea-product-popover"
          role="tooltip"
          style={{ left: hoverInfo.left, top: hoverInfo.top }}
        >
          <strong>{hoverInfo.name}</strong>
        </div>
      )}
    </section>
  );
}
