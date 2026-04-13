<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = [
            'title',
            'description',
            'price',
            'level',
            'status',
            'thumbnail',
            'instructor_id',
            'category_id',
            'image',
            'duration',
            'students_count',
            'rating'
        ];

    public function students()
    {
        return $this->belongsToMany(Student::class, 'payments')
            ->withPivot('amount', 'status', 'payment_method', 'transaction_id')
            ->withTimestamps();
    }
    public function instructor()
    {
        return $this->belongsTo(Instructor::class);
    }
    public function category()
    {
        return $this->belongsTo(categorie::class);
    }
}
