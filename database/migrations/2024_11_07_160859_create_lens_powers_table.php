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
        Schema::create('lens_powers', function (Blueprint $table) {
            $table->id();  
            $table->unsignedBigInteger('lens_id');  
            $table->unsignedBigInteger('power_id'); 
            $table->decimal('value', 8, 2);  

            $table->timestamps();

            // Adding foreign key constraints (optional)
            $table->foreign('lens_id')->references('id')->on('lenses')->onDelete('cascade');
            $table->foreign('power_id')->references('id')->on('powers')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lens_powers');
    }
};
