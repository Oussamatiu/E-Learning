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
        Schema::table('orders', function (Blueprint $table) {
            // Remove the course_id foreign key constraint
            $table->dropForeign(['course_id']);
            $table->dropColumn('course_id');

            // Add new columns for Stripe integration
            $table->string('stripe_payment_intent_id')->nullable()->after('user_id');
            $table->string('payment_method')->nullable()->after('stripe_payment_intent_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Reverse the changes
            $table->foreignId('course_id')->nullable()->constrained()->onDelete('cascade');

            $table->dropColumn(['stripe_payment_intent_id', 'payment_method']);
        });
    }
};