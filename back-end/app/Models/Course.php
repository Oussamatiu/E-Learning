<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'price',
        'level',
        'status',
        'thumbnail',
        'instructor_id',
        'category_id',
        'duration',
        'students_count',
        'rating',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'rating' => 'decimal:2',
        'duration' => 'integer',
        'students_count' => 'integer',
    ];

    // Relationships
    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function instructorProfile()
    {
        return $this->belongsTo(InstructorProfile::class, 'instructor_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function sections()
    {
        return $this->hasMany(Section::class);
    }

    public function outcomes()
    {
        return $this->hasMany(Outcome::class);
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'course_id');
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    // Helper methods
    public function getLevelBadge(): string
    {
        return match ($this->level) {
            'beginner' => 'Beginner',
            'intermediate' => 'Intermediate',
            'advanced' => 'Advanced',
            default => 'All Levels',
        };
    }

    public function getStatusBadge(): string
    {
        return $this->status === 'published' ? 'Published' : 'Draft';
    }

    public function getCoursesCountAttribute(): int
    {
        return $this->instructor ? $this->instructor->courses()->count() : 0;
    }

    public function getStudentsCountAttribute(): int
    {
        return $this->enrollments()->count();
    }

    public function getReviewsCountAttribute(): int
    {
        return $this->reviews_count ?? 0;
    }
}
