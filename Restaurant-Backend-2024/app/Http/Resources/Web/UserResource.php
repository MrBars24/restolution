<?php

namespace App\Http\Resources\Web;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        switch ($this->role_id) {
            case 1:
            $role = 'Super Admin';
            break;
            case 2:
            $role = 'Corporate Manager';
            break;
            case 3:
            $role = 'Branch Manager';
            break;
            case 4:
            $role = 'Kitchen';
            break;
            case 5:
            $role = 'Cashier';
            break;
            case 6:
            $role = 'Waiter';
            break;
        }

        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'fullname' => $this->first_name . " " . $this->last_name,
            'email' => $this->email,
            'status' => $this->status,
            'role_id' => $this->role_id,
            'role' => $role,
            'permission' => json_decode($this->permission),
            'restaurant_id' => $this->restaurant_id,
            'restaurant_name' => $this->restaurant_name,
            'allowed_restaurant' => $this->allowed_restaurant ?? null,
            'allowed_bm' => $this->allowed_bm ?? null,
            // 'permission' => json_decode($this->permission),
            // 'image' => $this->image,
            // 'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
