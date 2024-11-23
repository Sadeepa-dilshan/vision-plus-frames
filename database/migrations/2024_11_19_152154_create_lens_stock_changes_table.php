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
        Schema::create('lens_stock_changes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lens_stock_id')->constrained()->onDelete('cascade');
            $table->foreignId('lens_id')->nullable()->constrained()->onDelete('set null'); 
            $table->date('change_date'); 
            $table->integer('change_qty'); 
            $table->string('status')->default('minus');
            $table->foreignId('branch_id')->nullable()->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lens_stock_changes');
    }
};
