<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        \App\Models\User::insert([
            [
                'first_name' => 'Super',
                'last_name' => 'Admin',
                'role_id' => '1',
                'status' => 'active',
                'email' => 'ramcap2024@gmail.com',
                'password' => bcrypt('welcome@123'),
                'image' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        \App\Models\UserPermission::insert([
            [

                'user_id' => '1',
                'permission' => '["Cashier (Edit)","Cashier (Viewing)","Ingredients Input (Viewing)","Ingredients Summary (Viewing)","Ingredients Input (Create)","Ingredients Input (Edit)","Menu Tabs (Viewing)","Menu Tabs (Create)","Menu Tabs (Edit)","Menu Category (Viewing)","Menu Category (Create)","Menu Category (Edit)","Menu (Viewing)","Menu (Create)","Menu (Edit)","Inventory System (Viewing)","Inventory System (Create)","Inventory Actual (Viewing)","Inventory Actual (Create)","Inventory Actual (Edit)","Discount (Viewing)","Discount (Create)","Discount (Edit)","Restaurant (Viewing)","Restaurant (Create)","Restaurant (Edit)","Reservation (Viewing)","Reservation (Create)","Reservation (Edit)","User (Viewing)","User (Create)","User (Edit)","Inventory Remaining (Viewing)", "Reports"]',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
