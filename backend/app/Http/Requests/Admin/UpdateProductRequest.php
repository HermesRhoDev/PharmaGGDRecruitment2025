<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;

        // Vérifier que l'utilisateur est un admin
        // return auth()->check() && auth()->user()->role->name === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric|min:0',
            'reference' => 'sometimes|required|integer|unique:products,reference',
            'brand' => 'sometimes|required|string|max:255',
            'quantity' => 'sometimes|required|integer|min:0',
            'image' => ['nullable|string|required', File::image()->max(2048)]
        ];
    }

    /**
     * Get custom error messages for validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Le nom du produit est obligatoire.',
            'name.string' => 'Le nom du produit doit être une chaîne de caractères.',
            'name.max' => 'Le nom du produit ne peut pas dépasser 255 caractères.',

            'price.required' => 'Le prix est obligatoire.',
            'price.numeric' => 'Le prix doit être un nombre.',
            'price.min' => 'Le prix ne peut pas être négatif.',

            'reference.required' => 'La référence est obligatoire.',
            'reference.integer' => 'La référence doit être un nombre entier.',
            'reference.unique' => 'Cette référence existe déjà.',

            'brand.required' => 'La marque est obligatoire.',
            'brand.string' => 'La marque doit être une chaîne de caractères.',
            'brand.max' => 'La marque ne peut pas dépasser 255 caractères.',

            'quantity.required' => 'La quantité est obligatoire.',
            'quantity.integer' => 'La quantité doit être un nombre entier.',
            'quantity.min' => 'La quantité ne peut pas être négative.',

            'image.string' => 'L\'image doit être une chaîne de caractères.',
            'image.max' => 'Le poids de l\'image ne peut dépasser 2Mo.',
            'image.required' => 'L\'image est obligatoire.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'nom du produit',
            'price' => 'prix',
            'reference' => 'référence',
            'brand' => 'marque',
            'quantity' => 'quantité',
            'image' => 'image'
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Supprimer les champs vides pour permettre les mises à jour partielles
        $this->merge(array_filter($this->all(), function ($value) {
            return $value !== null && $value !== '';
        }));
    }
}
