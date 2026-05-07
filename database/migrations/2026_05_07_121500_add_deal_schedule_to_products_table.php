<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->timestamp('deal_starts_at')->nullable()->after('deal_percentage');
            $table->timestamp('deal_ends_at')->nullable()->after('deal_starts_at');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['deal_starts_at', 'deal_ends_at']);
        });
    }
};
