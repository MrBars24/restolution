<?php

namespace App\Http\Resources\Web;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PromoResource extends JsonResource
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
            'refID' => $this->reference_number,
            'restaurant_id' => $this->restaurant_id,
            'restaurant_name' => $this->restaurant_name,
            'category' => $this->category,
            'menu' => json_decode($this->menu),
            'datefrom' => $this->datefrom,
            'dateto' => $this->dateto,
            'date_range' => $this->datefrom . " - " . $this->dateto,
            'voucher_name' => $this->voucher_name,
            'voucher_code' => $this->voucher_code,
            'discount_type' => $this->discount_type,
            'discount_amount' => $this->discount_amount,
            'limit' => $this->limit,
            'created_by' => $this->createdBy,
            'updated_by' => $this->updatedBy,
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
