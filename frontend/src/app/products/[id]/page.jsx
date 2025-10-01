"use client";

import { useState, useEffect } from "react";
import {
  getPublicProduct,
  getRelatedProducts,
} from "App/server/publicProductActions";
import ProductCard from "App/components/ProductCard";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import "App/styles/product-detail.scss";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id;

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProductData = async () => {
      setLoading(true);
      setError("");

      try {
        // Charger le produit
        const productResult = await getPublicProduct(productId);

        if (productResult.success) {
          setProduct(productResult.data);

          // Charger les produits similaires
          const relatedResult = await getRelatedProducts(productId);
          if (relatedResult.success) {
            setRelatedProducts(relatedResult.data);
          }
        } else {
          setError(productResult.error || "Produit non trouvé");
        }
      } catch (err) {
        setError("Erreur lors du chargement du produit");
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProductData();
    }
  }, [productId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "");
  };

  // Fonction pour convertir la structure Slate.js en HTML
  const convertSlateToHtml = (slateData) => {
    if (!slateData) return "";

    try {
      // Si c'est déjà du HTML, le retourner tel quel
      if (typeof slateData === "string" && slateData.includes("<")) {
        return slateData;
      }

      // Si c'est une string JSON, la parser
      const data =
        typeof slateData === "string" ? JSON.parse(slateData) : slateData;

      if (!Array.isArray(data)) return "";

      return data.map((node) => convertNodeToHtml(node)).join("");
    } catch (error) {
      console.error("Erreur lors de la conversion Slate:", error);
      return slateData; // Retourner la donnée brute en cas d'erreur
    }
  };

  const convertNodeToHtml = (node) => {
    if (!node) return "";

    const { type, children } = node;

    // Convertir le contenu des enfants
    const content = children
      ? children
          .map((child) => {
            if (child.text !== undefined) {
              let text = child.text;
              if (child.bold) text = `<strong>${text}</strong>`;
              if (child.italic) text = `<em>${text}</em>`;
              if (child.underline) text = `<u>${text}</u>`;
              return text;
            }
            return convertNodeToHtml(child);
          })
          .join("")
      : "";

    // Convertir selon le type de nœud
    switch (type) {
      case "paragraph":
        return `<p>${content}</p>`;
      case "heading-one":
        return `<h1>${content}</h1>`;
      case "heading-two":
        return `<h2>${content}</h2>`;
      case "heading-three":
        return `<h3>${content}</h3>`;
      case "heading-four":
        return `<h4>${content}</h4>`;
      case "heading-five":
        return `<h5>${content}</h5>`;
      case "heading-six":
        return `<h6>${content}</h6>`;
      case "bulleted-list":
        return `<ul>${content}</ul>`;
      case "numbered-list":
        return `<ol>${content}</ol>`;
      case "list-item":
        return `<li>${content}</li>`;
      case "blockquote":
        return `<blockquote>${content}</blockquote>`;
      default:
        return content;
    }
  };

  const handleAddToCart = () => {
    // Fonction factice pour le moment
    if (product.quantity > 0) {
      alert("Produit ajouté au panier !");
    }
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <header className="product-header">
          <div className="container">
            <div className="header-content">
              <Link href="/" className="logo">
                <h1>PharmaGDD</h1>
              </Link>
              <nav className="main-nav">
                <Link href="/" className="nav-link">
                  Accueil
                </Link>
                <Link href="/products" className="nav-link">
                  Produits
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="product-main">
          <div className="container">
            <div className="loading-section">
              <div className="loading-spinner"></div>
              <p>Chargement du produit...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail-page">
        <header className="product-header">
          <div className="container">
            <div className="header-content">
              <Link href="/" className="logo">
                <h1>PharmaGDD</h1>
              </Link>
              <nav className="main-nav">
                <Link href="/" className="nav-link">
                  Accueil
                </Link>
                <Link href="/products" className="nav-link">
                  Produits
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="product-main">
          <div className="container">
            <div className="error-section">
              <h2>Erreur</h2>
              <p className="error-message">{error}</p>
              <Link href="/products" className="back-button">
                Retour aux produits
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      {/* Header */}
      <header className="product-header">
        <div className="container">
          <div className="header-content">
            <Link href="/" className="logo">
              <h1>PharmaGDD</h1>
            </Link>
            <nav className="main-nav">
              <Link href="/" className="nav-link">
                Accueil
              </Link>
              <Link href="/products" className="nav-link">
                Produits
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="product-main">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="breadcrumb">
            <Link href="/">Accueil</Link>
            <span className="separator">›</span>
            <Link href="/products">Produits</Link>
            <span className="separator">›</span>
            <span className="current">{product.name}</span>
          </nav>

          {/* Product Details */}
          <div className="product-detail">
            <div className="product-gallery">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={600}
                  height={400}
                  className="product-image"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div className="product-image-placeholder">
                  <svg
                    width="120"
                    height="120"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              )}
            </div>

            <div className="product-info">
              <div className="product-header-info">
                <h1 className="product-title">{product.name}</h1>
                <p className="product-brand">{product.brand}</p>
                <p className="product-reference">
                  Référence: {product.reference}
                </p>
              </div>

              <div className="product-price-section">
                <div className="product-price">
                  {formatPrice(product.price)}
                </div>
                <div className="product-stock">
                  {product.quantity > 0 ? (
                    <span className="in-stock">✓ En stock</span>
                  ) : (
                    <span className="out-of-stock">✗ Rupture de stock</span>
                  )}
                </div>
              </div>

              <div className="product-actions">
                <button
                  className={`add-to-cart-button ${
                    product.quantity > 0 ? "available" : "unavailable"
                  }`}
                  onClick={handleAddToCart}
                  disabled={product.quantity === 0}>
                  {product.quantity > 0 ? (
                    <>
                      <svg
                        class="w-6 h-6 text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24">
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7h-1M8 7h-.688M13 5v4m-2-2h4"
                        />
                      </svg>
                      Ajouter au panier
                    </>
                  ) : (
                    <>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
                          fill="currentColor"
                        />
                      </svg>
                      Produit indisponible
                    </>
                  )}
                </button>

                <Link href="/products" className="back-button">
                  ← Retour aux produits
                </Link>
              </div>

              {product.description && (
                <div className="product-description">
                  <h3>Description</h3>
                  <div
                    className="description-content"
                    dangerouslySetInnerHTML={{
                      __html: convertSlateToHtml(product.description),
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="related-products">
              <h2>Produits similaires</h2>
              <div className="related-products-grid">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    product={relatedProduct}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
