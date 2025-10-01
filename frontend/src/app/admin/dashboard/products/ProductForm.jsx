"use client";

import { useState } from "react";
import WysiwygEditor from "../../../../components/WysiwygEditor";

export default function ProductForm({ 
  product = null, 
  onSave, 
  onCancel, 
  isLoading, 
  mode = "edit" // "edit" ou "create"
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
    
    // Effacer l'erreur pour la description
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
      
      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Effacer l'erreur d'image
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

    // Validation de la description
    if (formData.description) {
      try {
        const parsed = JSON.parse(formData.description);
        const textLength = getTextLength(parsed);
        if (textLength > 50000) {
          newErrors.description = "La description ne peut pas dépasser 50000 caractères";
        }
      } catch {
        // Si ce n'est pas du JSON, vérifier la longueur du texte brut
        if (formData.description.length > 50000) {
          newErrors.description = "La description ne peut pas dépasser 50000 caractères";
        }
      }
    }

    // Validation de l'image
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

  // Fonction utilitaire pour calculer la longueur du texte dans Slate
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
      // Créer FormData pour gérer les fichiers
      const formDataToSend = new FormData();
      
      // Ajouter les données du formulaire
      formDataToSend.append('name', formData.name);
      formDataToSend.append('price', parseFloat(formData.price));
      formDataToSend.append('reference', formData.reference);
      formDataToSend.append('brand', formData.brand);
      formDataToSend.append('quantity', parseInt(formData.quantity));
      formDataToSend.append('description', formData.description || '');
      
      // Ajouter l'image si sélectionnée
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
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "8px",
        width: "90%",
        maxWidth: "600px",
        maxHeight: "90vh",
        overflow: "auto"
      }}>
        <h2 style={{ marginBottom: "20px" }}>{title}</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Image actuelle et upload */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Image du produit
            </label>
            
            {/* Aperçu de l'image */}
            {imagePreview && (
              <div style={{ marginBottom: "10px" }}>
                <img 
                  src={imagePreview} 
                  alt="Aperçu du produit" 
                  style={{ 
                    width: "100px", 
                    height: "100px", 
                    objectFit: "cover", 
                    borderRadius: "4px",
                    border: "1px solid #ddd"
                  }} 
                />
              </div>
            )}
            
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
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
          </div>

          {/* Nom du produit */}
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

          {/* Description */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
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
              <span style={{ color: "#dc3545", fontSize: "14px", display: "block", marginTop: "5px" }}>
                {errors.description}
              </span>
            )}
          </div>

          {/* Prix */}
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

          {/* Référence */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Référence *
            </label>
            <input
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              placeholder="Ex: 34009359558381774632039"
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

          {/* Marque */}
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

          {/* Quantité */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Quantité en stock *
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
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

          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: "10px 20px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor: "white",
                cursor: "pointer"
              }}
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "4px",
                backgroundColor: "#0a7a4b",
                color: "white",
                cursor: "pointer"
              }}
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