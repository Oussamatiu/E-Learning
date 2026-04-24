<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Wallet extends Model
{
    protected $fillable = ['user_id', 'balance'];

    protected $casts = [
        'balance' => 'decimal:2',
    ];

    /* ── Relationships ── */

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function transactions()
    {
        return $this->hasMany(WalletTransaction::class, 'user_id', 'user_id');
    }

    /* ── Helpers ── */

    /**
     * Safely increment balance using atomic DB update (race-condition safe).
     */
    public function credit(float $amount): void
    {
        $this->increment('balance', $amount);
    }

    public function debit(float $amount): void
    {
        if ($this->balance < $amount) {
            throw new \RuntimeException('Insufficient wallet balance.');
        }
        $this->decrement('balance', $amount);
    }
}
