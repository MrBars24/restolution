<?php

namespace App\Http\Requests\Web;

use Illuminate\Foundation\Http\FormRequest;

class StorePromoRequest extends FormRequest
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
        $category = $this->input('category');
        return [
            // 'restaurant_id' /=> 'required',
            'category' => 'required|string',
            'menu' => ($category == 'SELECTED') ? 'required|array' : 'nullable',
            'datefrom' => 'required',
            'dateto' => 'required',
            'voucher_code' => 'nullable',
            'voucher_name' => 'required',
            'discount_type' => 'required',
            'discount_amount' => 'required',
            'limit' => 'required',
            'created_by' => 'nullable',
        ];
    }

    public function messages(): array
    {
        return [
            'category.required' => 'You need to select "ALL SERVICES" or "CHOOSE SERVICES"',
            'limit.required' => 'You need to select "SINGLE USE" or "MULTIPLE USE"',
            'discount_type.required' => 'You need to select "Percentage ( % )" or "Fix Amount ( ₱ )"',
            'discount_amount.required' => 'The Discount Percentage/Amount is required',
            // 'restaurant_id.required' => 'You need to create your Restaurant first.',
        ];
    }
}
