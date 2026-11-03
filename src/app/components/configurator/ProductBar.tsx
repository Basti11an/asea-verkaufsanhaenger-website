import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { products } from "./data/products";
import type { ProductDefinition } from "./types";
import { useConfiguratorCopy } from "./copy";

type ProductBarProps = {
  onProductClick: (product: ProductDefinition) => void;
  editing: boolean;
};

export function ProductBar({ onProductClick, editing }: ProductBarProps) {
  const { text, name } = useConfiguratorCopy();
  const stripRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: -1 | 1) => {
    if (!stripRef.current) return;
    stripRef.current.scrollLeft += direction * 520;
  };

  return (
    <section className={`asea-product-bar${editing ? " is-editing" : ""}`} aria-label={text("products")}>
      <div className="asea-product-bar-heading">
        <h2>{text("products")}</h2>
        <div className="asea-product-categories" aria-hidden="true">
          <span>{text("categoryCooking")}</span><span>{text("categoryCooling")}</span><span>{text("categoryHygiene")}</span><span>{text("categoryWorktops")}</span><span>{text("categoryCabinets")}</span>
        </div>
      </div>
      <button type="button" className="asea-strip-arrow" onClick={() => scroll(-1)} aria-label={text("scrollProductsLeft")}><ChevronLeft size={17} /></button>
      <div className="asea-product-strip" ref={stripRef}>
        {products.filter((product) => product.active).map((product) => {
          const productName = name(product.name);
          return (
            <button
              key={product.id}
              type="button"
              className={`asea-product-card is-${product.category}`}
              title={productName}
              onClick={() => onProductClick(product)}
            >
              <span className="asea-product-image-space" aria-hidden="true" />
              <span className="asea-product-name">{productName}</span>
              <span className="asea-product-hover" role="tooltip"><strong>{productName}</strong></span>
            </button>
          );
        })}
      </div>
      <button type="button" className="asea-strip-arrow" onClick={() => scroll(1)} aria-label={text("scrollProductsRight")}><ChevronRight size={17} /></button>
    </section>
  );
}
