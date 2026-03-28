<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class lesson extends Model
{
    protected $fillable = [
        'title',
        'video_url',
        'duration',
        'course_id'
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
