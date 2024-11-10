<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLensStocksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lens_stocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lens_id')->constrained('lenses')->onDelete('cascade'); 
            $table->integer('initial_count')->default(0); 
            $table->integer('qty')->default(0); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('lens_stocks');
    }
}
