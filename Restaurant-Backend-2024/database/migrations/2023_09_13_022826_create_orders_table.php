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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('restaurant_id');
            $table->json('menu');
            $table->bigInteger('table_number');
            $table->string('dine_in_out');
            $table->string('payment_method');
            $table->string('status');
            $table->decimal('total_amount', 8,2);
            $table->decimal('discount_amount', 8,2)->nullable();
            $table->decimal('vatable', 8,2);
            $table->decimal('vat', 8,2);
            $table->bigInteger('discount_id')->nullable();
            $table->bigInteger('special_discount_id')->nullable();
            $table->string('customer_name');
            $table->json('waiter')->nullable();
            $table->string('cooked_by')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
