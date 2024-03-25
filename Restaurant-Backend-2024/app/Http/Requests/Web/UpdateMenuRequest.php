<?php

namespace App\Http\Requests\Web;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMenuRequest extends FormRequest
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
            'restaurant_id' => 'required:menu,restaurant_id,'.$this->id,
            'name' => 'required',
            'ingredients' => 'required|array',
            'price' => 'required|integer',
            'status' => 'required',
            'menutab_id' => 'required',
            'category' => 'required',
            'preparation_time' => 'required',
            'image' => 'nullable',
        ];
    }
}
