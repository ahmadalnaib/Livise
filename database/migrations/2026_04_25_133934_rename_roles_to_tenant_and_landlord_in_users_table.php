<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('users')->where('role', 'seeker')->update(['role' => 'tenant']);

        DB::table('users')
            ->whereIn('id', function ($query) {
                $query->select('owner_id')->from('rooms');
            })
            ->update(['role' => 'landlord']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('users')->where('role', 'landlord')->update(['role' => 'tenant']);
        DB::table('users')->where('role', 'tenant')->update(['role' => 'seeker']);
    }
};
