<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class student extends Model
{
    protected $fillable = [
        'user_id'
    ];

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'payments')
            ->withPivot('amount', 'status', 'payment_method', 'transaction_id')
            ->withTimestamps();
    }
}
