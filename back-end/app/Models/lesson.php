<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'video_path',
        'is_free',
        'order',
        'section_id',
    ];

    public function section()
    {
        return $this->belongsTo(Section::class);
    }
}
