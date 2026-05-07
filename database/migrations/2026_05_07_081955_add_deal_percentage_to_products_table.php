<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {

            $table->boolean('is_deal')
                ->default(false);

            $table->integer('deal_percentage')
                ->nullable()
                ->after('is_deal');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {

            $table->dropColumn([
                'is_deal',
                'deal_percentage'
            ]);
        });
    }
};
