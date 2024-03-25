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
        Schema::create('promos', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('restaurant_id');
            $table->string('category');
            $table->json('menu')->nullable();
            $table->date('datefrom');
            $table->date('dateto');
            $table->string('voucher_name');
            $table->string('voucher_code');
            $table->string('discount_type');
            $table->bigInteger('discount_amount');
            $table->string('limit');
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
        Schema::table('promos', function (Blueprint $table) {
            // Reverse the changes if needed
            $table->dropColumn(['menu', 'datefrom', 'dateto', 'voucher_code', 'discount_type', 'discount_amount', 'limit']);
            // Reverse any modifications to existing columns
            $table->renameColumn('name', 'code');
        });
    }
};
