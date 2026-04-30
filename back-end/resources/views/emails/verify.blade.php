<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f9f9f9; margin: 0; padding: 0; }
    .container { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb; }
    .header { background: #592b98; padding: 28px 32px; }
    .header h1 { color: #fff; margin: 0; font-size: 20px; }
    .body { padding: 32px; color: #374151; }
    .highlight { background: #f8f5ff; border-left: 4px solid #592b98; padding: 16px 20px; border-radius: 4px; margin: 20px 0; }
    .highlight p { margin: 4px 0; font-size: 14px; }
    .highlight strong { color: #592b98; }
    .btn { display: inline-block; margin-top: 24px; background: #592b98; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-size: 15px; font-weight: bold; }
    .btn:hover { background: #4a2280; }
    .note { font-size: 12px; color: #9ca3af; margin-top: 16px; }
    .footer { background: #f3f4f6; padding: 16px 32px; text-align: center; font-size: 12px; color: #9ca3af; }
  </style>
</head>
<body>
  <div class="container">

    <div class="header">
      <h1>✉️ Verify Your Email</h1>
    </div>

    <div class="body">
      <p>Hi <strong>{{ $user->name }}</strong>,</p>
      <p>Welcome to <strong>LearnTrack</strong>! Please verify your email address to activate your account.</p>

      <div class="highlight">
        <p><strong>Name:</strong> {{ $user->name }}</p>
        <p><strong>Email:</strong> {{ $user->email }}</p>
      </div>

      <p>Click the button below to verify your email address:</p>

      <a href="{{ env('FRONTEND_URL') }}/verify-email/{{ $token }}" class="btn">
        ✅ Verify Email
      </a>

      <p class="note">
        ⚠️ This link will expire in <strong>60 minutes</strong>.<br>
        If you did not create an account, you can safely ignore this email.
      </p>
    </div>

    <div class="footer">
      LearnTrack · You're receiving this because you recently registered on our platform.
    </div>

  </div>
</body>
</html>