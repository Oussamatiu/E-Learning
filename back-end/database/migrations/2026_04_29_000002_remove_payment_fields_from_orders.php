<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['stripe_payment_intent_id', 'payment_method', 'payment_method_type']);
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('stripe_payment_intent_id')->nullable()->after('user_id');
            $table->string('payment_method')->nullable()->after('stripe_payment_intent_id');
            $table->string('payment_method_type')->nullable()->after('payment_method');
        });
    }
};
