<?php

namespace App\Http\Resources\Web;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $ingredientsArray = json_decode($this->ingredients);
        $ingredientsString = implode(', ', array_map(function ($ingredient) {
            return $ingredient->name;
        }, $ingredientsArray));

        return [
            'id' => $this->id,
            'restaurant_id' => $this->restaurant_id,
            'name' => $this->name,
            'ingredients' => $ingredientsString,
            'ingredients_array' => $ingredientsArray,
            'preparation_time' => $this->preparation_time,
            'price' => $this->price,
            'status' => $this->status,
            'menutab_id' => $this->menutab_id,
            'menutab' => $this->menutab,
            // 'category_name' => $this->category_name,
            'category' => json_decode($this->category),
            'image' => $this->image,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
