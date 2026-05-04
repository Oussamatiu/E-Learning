<?php

namespace App\Http\Controllers;

use App\Mail\VerfyEmail;
use App\Mail\VerifyEmail;
use App\Models\Instructor;
use App\Models\Student;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            // ✅ Validation
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|min:8|confirmed',
                'role_id' => 'required|exists:roles,id'
            ]);
            
           
            DB::beginTransaction();

            $verificationToken = Str::random(60);

            $user = User::create([
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'role_id' => $validatedData['role_id'],
                'email_verification_token' => hash('sha256', $verificationToken),
                'email_verification_expires_at' => now()->addMinutes(60),
            ]);
    
            DB::commit();
            
               Mail::to($user->email)->send(new VerfyEmail($verificationToken, $user));
            
           
            return response()->json([
                'message' => 'Registration successful. Please check your email to verify your account.',
                'user' => $user
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Validation errors
            return response()->json([
                'message' => 'Validation failed',
                'error' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack(); // إذا صار خطأ في DB أو mail
            return response()->json([
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }
        
        if (!$user->email_verified_at) {
            return response()->json([
                'message' => 'Please verify your email first'
            ], 403);
        }

        // ✅ استخدام Sanctum لإنشاء التوكن
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user->load('role')
        ], 200);
    }

    public function logout(Request $request)
    {
        // ✅ استخدام Sanctum للتسجيل الخروج
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logout successful'], 200);
    }

    public function me(Request $request)
    {
        return response()->json(['user' => $request->user()->load('role')]);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'name'  => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
        ]);
        $user->update($validated);
        return response()->json(['message' => 'User updated', 'user' => $user->load('role')]);
    }

    public function verifyEmail(Request $request)
{
    ;

    $hashedToken = hash('sha256', $request->token);

    $user = User::where('email_verification_token', $hashedToken)->first();

    if (!$user) {
        return response()->json(['message' => 'Invalid token'], 400);
    }

    if ($user->email_verified_at) {
        return response()->json(['message' => 'Already verified'], 400);
    }

    if ($user->email_verification_expires_at < now()) {
        return response()->json(['message' => 'Token expired'], 400);
    }

    $user->update([
        'email_verified_at' => now(),
        'email_verification_token' => null,
        'email_verification_expires_at' => null,
    ]);

    return response()->json([
        'message' => 'Email verified successfully',
        'role_id' => $user->role_id,
    ], 200);
}
}
