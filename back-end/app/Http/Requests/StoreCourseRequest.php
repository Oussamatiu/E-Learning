<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCourseRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'required|integer|exists:categories,id',
            'price' => 'nullable|numeric|min:0',
            'level' => ['nullable', Rule::in(['beginner', 'intermediate', 'advanced', 'all-levels'])],
            'status' => ['nullable', Rule::in(['draft', 'published'])],
            'thumbnail_file' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',

            'outcomes' => 'required|array|min:1',
            'outcomes.*' => 'required|string',

            // Sections and lessons are optional here (created separately via API)
            'sections' => 'nullable|array',
            'sections.*.title' => 'nullable|string|max:255',
            'sections.*.lessons' => 'nullable|array',
            'sections.*.lessons.*.title' => 'nullable|string|max:255',
            'sections.*.lessons.*.content' => 'nullable|string',
            'sections.*.lessons.*.video_file' => 'nullable|file|mimes:mp4,mov,ogg,webm|max:102400',
            'sections.*.lessons.*.is_free' => 'nullable|boolean',
            'sections.*.lessons.*.duration' => 'nullable|integer|min:0',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'The course title is required.',
            'category_id.required' => 'The category is required.',
            'category_id.exists' => 'The selected category does not exist.',
            'price.min' => 'The price must be at least 0.',
            'level.in' => 'The selected level is invalid.',
            'status.in' => 'The selected status is invalid.',
            'outcomes.required' => 'At least one learning outcome is required.',
            'outcomes.min' => 'At least one learning outcome is required.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Ensure outcomes array exists
        if (!isset($this->outcomes)) {
            $this->merge(['outcomes' => []]);
        }

        // Ensure sections array exists
        if (!isset($this->sections)) {
            $this->merge(['sections' => []]);
        }
    }
}