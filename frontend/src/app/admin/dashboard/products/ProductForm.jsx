"use client";

import { useState } from "react";
import WysiwygEditor from "../../../../components/WysiwygEditor";

export default function ProductForm({ 
  product = null, 
  onSave, 
  onCancel, 
  isLoading, 
  mode = "edit"
}) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || "",
    reference: String(product?.reference || ""),
    brand: product?.brand || "",
    quantity: product?.quantity || "",
    description: product?.description || "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    product?.image ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${product.image}` : null
  );
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Erase error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleDescriptionChange = (value) => {
    setFormData(prev => ({
      ...prev,
      description: value
    }));
    
    // Erase error for description if it exists   
    if (errors.description) {
      setErrors(prev => ({
        ...prev,
        description: ""
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Erase error for image if it exists   
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ""
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est obligatoire";
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Le prix doit être supérieur à 0";
    }

    if (!formData.reference || parseInt(formData.reference) <= 0) {
      newErrors.reference = "La référence doit être un nombre positif";
    }

    if (!formData.brand.trim()) {
      newErrors.brand = "La marque est obligatoire";
    }

    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      newErrors.quantity = "La quantité doit être positive ou nulle";
    }

    // Description length validation
    if (formData.description) {
      try {
        const parsed = JSON.parse(formData.description);
        const textLength = getTextLength(parsed);
        if (textLength > 50000) {
          newErrors.description = "La description ne peut pas dépasser 50000 caractères";
        }
      } catch {
        // If not JSON, check raw text length
        if (formData.description.length > 50000) {
          newErrors.description = "La description ne peut pas dépasser 50000 caractères";
        }
      }
    }

    // Image validation
    if (selectedImage) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(selectedImage.type)) {
        newErrors.image = "L'image doit être au format JPEG, PNG, JPG, GIF ou WebP";
      }
      
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (selectedImage.size > maxSize) {
        newErrors.image = "L'image ne peut pas dépasser 2 Mo";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Utility function to calculate text length in Slate nodes
  const getTextLength = (nodes) => {
    return nodes.reduce((length, node) => {
      if (node.text !== undefined) {
        return length + node.text.length;
      } else if (node.children) {
        return length + getTextLength(node.children);
      }
      return length;
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Create FormData to handle file uploads
      const formDataToSend = new FormData();
      
      // Add form data fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('price', parseFloat(formData.price));
      formDataToSend.append('reference', formData.reference);
      formDataToSend.append('brand', formData.brand);
      formDataToSend.append('quantity', parseInt(formData.quantity));
      formDataToSend.append('description', formData.description || '');
      
      // Add image if selected
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }
      
      onSave(formDataToSend);
    }
  };

  const title = mode === "create" ? "Créer un produit" : "Modifier le produit";
  const submitText = mode === "create" ? "Créer" : "Enregistrer";
  const loadingText = mode === "create" ? "Création..." : "Enregistrement...";

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <h2 className="admin-modal__title">{title}</h2>

        <form onSubmit={handleSubmit}>
          {/* Current product image and upload */}
          <div className="form-group">
            <label className="form-label">
              Image du produit
            </label>

            {imagePreview && (
              <div className="image-preview">
                <img
                  src={imagePreview}
                  alt="Aperçu du produit"
                  className="image-preview__img"
                />
              </div>
            )}

            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
              onChange={handleImageChange}
              className={`input ${errors.image ? "has-error" : ""}`}
              disabled={isLoading}
            />
            {errors.image && (
              <span className="error-text">{errors.image}</span>
            )}
          </div>

          {/* Product name */}
          <div className="form-group">
            <label className="form-label">
              Nom du produit *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input ${errors.name ? "has-error" : ""}`}
              disabled={isLoading}
            />
            {errors.name && (
              <span className="error-text">{errors.name}</span>
            )}
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">
              Description
            </label>
            <WysiwygEditor
              value={formData.description}
              onChange={handleDescriptionChange}
              placeholder="Entrez une description détaillée du produit..."
              maxLength={50000}
              error={errors.description}
            />
            {errors.description && (
              <span className="error-text block">
                {errors.description}
              </span>
            )}
          </div>

          {/* Price */}
          <div className="form-group">
            <label className="form-label">
              Prix (€) *
            </label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`input ${errors.price ? "has-error" : ""}`}
              disabled={isLoading}
            />
            {errors.price && (
              <span className="error-text">{errors.price}</span>
            )}
          </div>

          {/* Reference */}
          <div className="form-group">
            <label className="form-label">
              Référence *
            </label>
            <input
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              placeholder="Ex: 34009359558381774632039"
              className={`input ${errors.reference ? "has-error" : ""}`}
              disabled={isLoading}
            />
            {errors.reference && (
              <span className="error-text">{errors.reference}</span>
            )}
          </div>

          {/* Brand */}
          <div className="form-group">
            <label className="form-label">
              Marque *
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className={`input ${errors.brand ? "has-error" : ""}`}
              disabled={isLoading}
            />
            {errors.brand && (
              <span className="error-text">{errors.brand}</span>
            )}
          </div>

          {/* Quantity */}
          <div className="form-group form-group--lg">
            <label className="form-label">
              Quantité en stock *
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className={`input ${errors.quantity ? "has-error" : ""}`}
              disabled={isLoading}
            />
            {errors.quantity && (
              <span className="error-text">{errors.quantity}</span>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn--cancel"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn--submit"
              disabled={isLoading}
            >
              {isLoading ? loadingText : submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}