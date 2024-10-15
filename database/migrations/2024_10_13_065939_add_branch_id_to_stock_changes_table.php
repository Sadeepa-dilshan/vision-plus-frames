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
        Schema::table('stock_changes', function (Blueprint $table) {
            $table->foreignId('branch_id')
            ->nullable()
            ->constrained() // Automatically references 'id' on 'branches' table
            ->onDelete('cascade'); // When a branch is deleted, related stock_changes are deleted
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stock_changes', function (Blueprint $table) {
            // Drop the foreign key constraint and the column
            $table->dropForeign(['branch_id']);
            $table->dropColumn('branch_id');
        });
    }
};
