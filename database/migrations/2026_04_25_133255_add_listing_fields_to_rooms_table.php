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
        Schema::table('rooms', function (Blueprint $table) {
            $table->string('listing_type')->nullable()->after('owner_id');
            $table->string('contact_first_name')->nullable()->after('listing_type');
            $table->string('contact_last_name')->nullable()->after('contact_first_name');
            $table->string('contact_email')->nullable()->after('contact_last_name');
            $table->string('size_label')->nullable()->after('contact_email');
            $table->json('facilities')->nullable()->after('size_label');
            $table->foreignId('city_id')->nullable()->change();
            $table->decimal('price_per_night', 10, 2)->default(0)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rooms', function (Blueprint $table) {
            $table->dropColumn([
                'listing_type',
                'contact_first_name',
                'contact_last_name',
                'contact_email',
                'size_label',
                'facilities',
            ]);
            $table->decimal('price_per_night', 10, 2)->change();
        });
    }
};
