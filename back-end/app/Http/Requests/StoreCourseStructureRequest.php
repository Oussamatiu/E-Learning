<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCourseStructureRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'sections' => 'required|array|min:1',
            'sections.*.title' => 'required|string|max:255',
            'sections.*.description' => 'nullable|string',
            'sections.*.order' => 'nullable|integer',
            'sections.*.lessons' => 'nullable|array',
            'sections.*.lessons.*.title' => 'nullable|string|max:255',
            'sections.*.lessons.*.content' => 'nullable|string',
            'sections.*.lessons.*.order' => 'nullable|integer',
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
            'title.required' => 'Course title is required.',
            'title.max' => 'Course title must not exceed 255 characters.',
            'description.required' => 'Course description is required.',
            'sections.min' => 'Course must have at least one section.',
            'sections.*.title.required' => 'Section title is required.',
        ];
    }
}
