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
        Schema::create('order_trackers', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('order_id');
            $table->time('time_created');
            $table->time('time_process')->nullable();
            $table->time('time_served')->nullable();
            $table->time('time_completed')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_trackers');
    }
};
