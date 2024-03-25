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
        Schema::create('restaurants', function (Blueprint $table) {
            $table->id();
            $table->string('reference_number')->nullable();
            $table->string('name');
            $table->bigInteger('table_number');
            $table->string('house_number');
            $table->string('barangay');
            $table->string('municipality');
            $table->string('province');
            $table->decimal('longitude', 20, 15)->nullable();
            $table->decimal('latitude', 20, 15)->nullable();
            $table->longText('logo');
            $table->bigInteger('corporate_account');
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
        Schema::dropIfExists('restaurants');
    }
};
