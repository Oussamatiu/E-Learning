<?php

namespace App\Http\Controllers;

use App\Mail\VerfyEmail;
use App\Models\ApiToken;
use App\Models\instructor;
use App\Models\student;
use App\Models\role;
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
            'password' => 'required|string|min:8',
            'role_id' => 'required|exists:roles,id'
        ]);

        // ✅ Transaction: حماية العمليات في DB
        DB::beginTransaction();

        $verificationToken = Str::random(60);

        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
            'role_id' => $validatedData['role_id'],
            'email_verification_token' => hash('sha256', $verificationToken),
        ]);

        $role = Role::find($validatedData['role_id']);
        if ($role->title == 'student') {
            Student::create([
                "id" => $user->id,
                "user_id" => $user->id
            ]);
        } elseif ($role->title == 'instructor') {
            Instructor::create([
                "id" => $user->id,
                "user_id" => $user->id
            ]);
        }

        // ✅ إرسال البريد الإلكتروني
        Mail::to($user->email)->send(new VerfyEmail($verificationToken, $user));

        DB::commit();

        return response()->json([
            'message' => 'Registration successful. Please check your email to verify your account.',
            'user' => $user
        ], 201);

    } catch (\Illuminate\Validation\ValidationException $e) {
        // Validation errors
        return response()->json([
            'message' => 'Validation failed',
            'errors' => $e->errors()
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
            'password' => 'required|string',
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
        $plainToken = Str::random(60);

        ApiToken::create([
            'user_id' => $user->id,
            'token' => hash('sha256', $plainToken),
            'expires_at' => now()->addDays(7)
        ]);

        return response()->json([
            'message' => 'Login successful',
            'token' => $plainToken,
            'user' => $user
        ], 200);
    }

    public function logout(Request $request)
    {
        $token = $request->bearerToken();
        if ($token) {
            ApiToken::where('token', hash('sha256', $token))->delete();
        }

        return response()->json(['message' => 'Logout successful'], 200);
    }
    public function verifyEmail(Request $request)
    {
        $token = $request->query('token');
        $hashedToken = hash('sha256', $token);
        
        $user = User::where('email_verification_token', $hashedToken)->first();
        if (!$user) {
            return response()->json(['message' => 'Invalid verification token'], 400);
        }

        $user->email_verified_at = now();
        $user->email_verification_token = null;
        $user->save();

        return response()->json(['message' => 'Email verified successfully'], 200);
    }
}