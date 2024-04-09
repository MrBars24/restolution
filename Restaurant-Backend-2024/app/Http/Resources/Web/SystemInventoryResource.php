<?php

namespace App\Http\Resources\Web;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SystemInventoryResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return parent::toArray($request);
        // return [
        //     'id' => $this->id,
        //     'restaurant_id' => $this->restaurant_id,
        //     'name' => $this->name,
        //     'quantity' => $this->quantity,
        //     'unit' => $this->unit,
        //     'unit_cost' => $this->unit_cost,
        //     'total_cost' => $this->total_cost,
        //     'created_by' => $this->createdBy,
        //     'updated_by' => $this->updatedBy,
        //     'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        //     'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        // ];
    }
}
