<?php

namespace App\Http\Resources\Web;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RestaurantResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reference_number' => $this->reference_number,
            'name' => $this->name,
            'table_number' => $this->table_number,
            'house_number' => $this->house_number,
            'barangay' => $this->barangay,
            'municipality' => $this->municipality,
            'province' => $this->province,
            'longitude' => $this->longitude,
           'latitude' => $this->latitude,
            'corporate_account' => $this->corporate_account,
            'corporate_name' => $this->corporate_name,
            'logo' => $this->logo,
            // 'created_by' => $this->created_by,
            // 'updated_by' => $this->updated_by,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
