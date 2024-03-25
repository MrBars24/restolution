<?php

namespace App\Http\Requests\Web;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReservationRequest extends FormRequest
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
            'table_number' => 'required|unique:reservations,table_number,'.$this->id,
            'time' => 'required',
            'date' => 'required',
            'number_of_guest' => 'required',
            'guest_name' => 'required',
            'notes' => 'nullable',
        ];
    }
}
