import { Droplets, Flame, PackageOpen, Snowflake } from "lucide-react";
import { products } from "./data/products";
import type { ProductCategory, ProductDefinition } from "./types";
import { useConfiguratorCopy } from "./copy";

type ProductBarProps = {
  onProductClick: (product: ProductDefinition) => void;
};

const categoryIcons = {
  cooking: Flame,
  cooling: Snowflake,
  hygiene: Droplets,
  furniture: PackageOpen,
} satisfies Record<ProductCategory, typeof Flame>;

export function ProductBar({ onProductClick }: ProductBarProps) {
  const { text, name } = useConfiguratorCopy();

  return (
    <section className="asea-product-bar" aria-label={text("products")}>
      <h2>{text("products")}</h2>
      <div className="asea-product-strip">
        {products.filter((product) => product.active).map((product) => {
          const Icon = categoryIcons[product.category];
          const productName = name(product.name);
          return (
            <button
              key={product.id}
              type="button"
              className={`asea-product-card is-${product.category}`}
              title={productName}
              onClick={() => onProductClick(product)}
            >
              <Icon size={17} aria-hidden="true" />
              <span>{productName}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
