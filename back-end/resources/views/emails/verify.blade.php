<h2>Hello {{ $user->name }}</h2>

<p>Click below to verify your email:</p>

<a href="{{ env('FRONTEND_URL') }}/verify-email/{{ $token }}">
    Verify Email
</a>