<?php

namespace App\Http\Requests\Web;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
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
            'restaurant_id' => 'required',
            'table_number' => 'required',
            'status' => 'required',
            'payment_method' => 'required',
            'dine_in_out' => 'required',
            'discount_amount' => 'nullable',
            'total_amount' => 'required',
            'vatable' => 'required',
            'vat' => 'required',
            'menu' => 'required|array',
            'customer_name' => 'required',
            'discount_id' => 'nullable',
        ];
    }
}
