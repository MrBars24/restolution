<?php

namespace App\Http\Resources\Web;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $menuArray = json_decode($this->menu);
        $menusString = implode(', ', array_map(function ($menu) {
            return $menu->name;
        }, $menuArray));

        return [
            'id' => $this->id,
            'restaurant_id' => $this->restaurant_id,
            'table_number' => $this->table_number,
            'menu_array' => $menusString,
            'menu' => $menuArray,
            'dine_in_out' => $this->dine_in_out,
            'payment_method' => $this->payment_method,
            'status' => $this->status,
            'total_amount' => $this->total_amount,
            'discount_amount' => $this->discount_amount,
            'vatable' => $this->vatable,
            'vat' => $this->vat,
            'cooked_by' => $this->cooked_by,
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
