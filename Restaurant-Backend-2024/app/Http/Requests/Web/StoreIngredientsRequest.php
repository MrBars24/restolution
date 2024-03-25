<?php

namespace App\Http\Requests\Web;

use Illuminate\Foundation\Http\FormRequest;

class StoreIngredientsRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            // 'restaurant_id' => 'required',
            'name' => 'required',
            'unit' => 'required',
            'quantity' => 'required|integer',
            'unit_cost' => 'required|integer',
        ];
    }

    // public function messages(): array
    // {
    //     return [
    //         'restaurant_id.required' => 'You need to create your Restaurant first.',
    //     ];
    // }
}
