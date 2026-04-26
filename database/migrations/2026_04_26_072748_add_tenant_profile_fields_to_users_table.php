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
        Schema::table('users', function (Blueprint $table) {
            $table->json('languages')->nullable()->after('tenant_approved_at');
            $table->json('skills')->nullable()->after('languages');
            $table->json('hobbies')->nullable()->after('skills');
            $table->text('bio')->nullable()->after('hobbies');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['languages', 'skills', 'hobbies', 'bio']);
        });
    }
};
