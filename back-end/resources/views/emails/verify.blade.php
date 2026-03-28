<h2>Hello {{ $user->name }}</h2>

<p>Click below to verify your email:</p>

<a href="{{ url('/api/verify-email?token=' . $token) }}">
    Verify Email
</a>