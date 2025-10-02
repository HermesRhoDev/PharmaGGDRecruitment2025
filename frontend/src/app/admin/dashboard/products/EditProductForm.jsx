'use client';

import React, { useState, useEffect } from 'react';
import WysiwygEditor from '../../../../components/WysiwygEditor';

const EditProductForm = ({ product, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    reference: '',
    brand: '',
    description: '',
    quantity: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        reference: String(product.reference || ''),
        brand: product.brand || '',
        description: product.description || '',
        quantity: product.quantity || ''
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur pour ce champ
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
    
    // Erase error for description
    if (errors.description) {
      setErrors(prev => ({
        ...prev,
        description: ""
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    
    // Erase error for image
    if (errors.image) {
      setErrors(prev => ({
        ...prev,
        image: ""
      }));
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

    if (!formData.reference || !formData.reference.trim()) {
      newErrors.reference = "La référence est obligatoire";
    } else if (formData.reference.length > 100) {
      newErrors.reference = "La référence ne peut pas dépasser 100 caractères";
    }

    if (!formData.brand.trim()) {
      newErrors.brand = "La marque est obligatoire";
    }

    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      newErrors.quantity = "La quantité doit être positive ou nulle";
    }

    // Image validation
    if (selectedImage) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(selectedImage.type)) {
        newErrors.image = "L'image doit être au format JPEG, PNG, JPG, GIF ou WebP";
      }
      
      const maxSize = 2 * 1024 * 1024; // 2MB / 2MO
      if (selectedImage.size > maxSize) {
        newErrors.image = "L'image ne peut pas dépasser 2 Mo";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('price', parseFloat(formData.price));
      formDataToSend.append('reference', formData.reference);
      formDataToSend.append('brand', formData.brand);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('quantity', parseInt(formData.quantity));
      
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      await onSubmit(formDataToSend);
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
    }
  };

  if (!product) {
    return <div>Chargement...</div>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ marginBottom: "30px", color: "#333" }}>Modifier le produit</h2>
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {/* Name */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Nom du produit *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                border: errors.name ? "1px solid #dc3545" : "1px solid #ddd",
                borderRadius: "4px"
              }}
              disabled={isLoading}
            />
            {errors.name && (
              <span style={{ color: "#dc3545", fontSize: "14px" }}>{errors.name}</span>
            )}
          </div>

          {/* Price */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Prix (€) *
            </label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                border: errors.price ? "1px solid #dc3545" : "1px solid #ddd",
                borderRadius: "4px"
              }}
              disabled={isLoading}
            />
            {errors.price && (
              <span style={{ color: "#dc3545", fontSize: "14px" }}>{errors.price}</span>
            )}
          </div>

          {/* Reference */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Référence *
            </label>
            <input
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              placeholder="Ex: REF-12345 ou 34009359558381774632039"
              style={{
                width: "100%",
                padding: "8px",
                border: errors.reference ? "1px solid #dc3545" : "1px solid #ddd",
                borderRadius: "4px"
              }}
              disabled={isLoading}
            />
            {errors.reference && (
              <span style={{ color: "#dc3545", fontSize: "14px" }}>{errors.reference}</span>
            )}
          </div>

          {/* Brand */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Marque *
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                border: errors.brand ? "1px solid #dc3545" : "1px solid #ddd",
                borderRadius: "4px"
              }}
              disabled={isLoading}
            />
            {errors.brand && (
              <span style={{ color: "#dc3545", fontSize: "14px" }}>{errors.brand}</span>
            )}
          </div>

          {/* Quantity */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Quantité en stock *
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              style={{
                width: "100%",
                padding: "8px",
                border: errors.quantity ? "1px solid #dc3545" : "1px solid #ddd",
                borderRadius: "4px"
              }}
              disabled={isLoading}
            />
            {errors.quantity && (
              <span style={{ color: "#dc3545", fontSize: "14px" }}>{errors.quantity}</span>
            )}
          </div>

          {/* Image */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Image du produit
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{
                width: "100%",
                padding: "8px",
                border: errors.image ? "1px solid #dc3545" : "1px solid #ddd",
                borderRadius: "4px"
              }}
              disabled={isLoading}
            />
            {errors.image && (
              <span style={{ color: "#dc3545", fontSize: "14px" }}>{errors.image}</span>
            )}
            {selectedImage && (
              <div style={{ marginTop: "10px" }}>
                <p style={{ fontSize: "14px", color: "#666" }}>
                  Nouveau fichier sélectionné: {selectedImage.name}
                </p>
              </div>
            )}
            {product.image && !selectedImage && (
              <div style={{ marginTop: "10px" }}>
                <p style={{ fontSize: "14px", color: "#666" }}>
                  Image actuelle: {product.image}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* WYSIWYG */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>
            Description du produit
          </label>
          <div style={{ 
            border: errors.description ? "1px solid #dc3545" : "1px solid #ddd",
            borderRadius: "4px",
            minHeight: "200px"
          }}>
            <WysiwygEditor
              value={formData.description}
              onChange={handleDescriptionChange}
              placeholder="Décrivez votre produit..."
            />
          </div>
          {errors.description && (
            <span style={{ color: "#dc3545", fontSize: "14px" }}>{errors.description}</span>
          )}
        </div>

        <div style={{ display: "flex", gap: "10px", alignSelf: "flex-start" }}>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              backgroundColor: isLoading ? "#6c757d" : "#28a745",
              color: "white",
              padding: "12px 24px",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              cursor: isLoading ? "not-allowed" : "pointer"
            }}
          >
            {isLoading ? "Modification en cours..." : "Modifier le produit"}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            style={{
              backgroundColor: "#6c757d",
              color: "white",
              padding: "12px 24px",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              cursor: isLoading ? "not-allowed" : "pointer"
            }}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductForm;