"use client";

import Link from 'next/link';
import Image from 'next/image';

export default function ProductCard({ product }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
  };

  const truncateDescription = (text, maxLength = 100) => {
    if (!text) return '';
    const cleanText = stripHtml(text);
    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.substring(0, maxLength) + '...';
  };

  return (
    <div className="product-card">
      <Link href={`/products/${product.id}`} className="product-link">
        <div className="product-image-container">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              width={300}
              height={200}
              className="product-image"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className="product-image-placeholder">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-brand">{product.brand}</p>

          <div className="product-footer">
            <div className="product-price">
              {formatPrice(product.price)}
            </div>
            <div className="product-stock">
              {product.quantity > 0 ? (
                <span className="in-stock">En stock</span>
              ) : (
                <span className="out-of-stock">Rupture de stock</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}