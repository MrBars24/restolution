<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('actual_inventories', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('restaurant_id');
            $table->string('name');
            $table->bigInteger('quantity');
            $table->string('unit');
            $table->bigInteger('unit_cost');
            $table->bigInteger('total_cost');
            $table->bigInteger('created_by')->nullable();
            $table->bigInteger('updated_by')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('actual_inventories');
    }
};
