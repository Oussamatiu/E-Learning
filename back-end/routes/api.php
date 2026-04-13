<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CategorieController;
use App\Http\Controllers\LessonController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']); 
Route::post('/logout', [AuthController::class, 'logout'])->middleware('check.api.token');
Route::get('/verify-email', [AuthController::class, 'verifyEmail']);
Route::get('/courses', [CourseController::class, 'index']);
Route::get('/categories', [CategorieController::class, 'index']);
Route::resource('/courses', CourseController::class)->middleware('check.api.token')->except(['index']);
Route::post('/courses/{courseId}/lessons', [LessonController::class, 'store'])->middleware('check.api.token');
Route::delete('/courses/{courseId}/lessons/{lessonId}',[LessonController::class, 'destroy'])->middleware('check.api.token');
Route::put('/courses/{courseId}/lessons/{lessonId}',[LessonController::class, 'update'])->middleware('check.api.token');