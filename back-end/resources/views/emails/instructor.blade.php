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
    .course-list { margin: 16px 0; padding: 0; list-style: none; }
    .course-item { padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
    .course-item:last-child { border-bottom: none; }
    .course-title { font-weight: bold; color: #592b98; font-size: 14px; }
    .course-price { color: #6b7280; font-size: 13px; }
    .footer { background: #f3f4f6; padding: 16px 32px; text-align: center; font-size: 12px; color: #9ca3af; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 New Course Sale!</h1>
    </div>
    <div class="body">
      <p>Hi there,</p>
      <p>Great news! A student has just purchased @if(count($courses) > 1)<strong>{{ count($courses) }} of your courses</strong>@else<one of your courses</strong>@endif on <strong>LearnTrack</strong>.</p>

      <ul class="course-list">
        @foreach($courses as $course)
        <li class="course-item">
          <div class="course-title">{{ $course->title }}</div>
          <div class="course-price">${{ number_format($course->price, 2) }}</div>
        </li>
        @endforeach
      </ul>

      <div class="highlight">
        <p><strong>Order ID:</strong> #{{ $order->id }}</p>
        <p><strong>Total Amount:</strong> ${{ number_format($order->price, 2) }}</p>
        <p><strong>Date:</strong> {{ $order->created_at->format('d M Y, H:i') }}</p>
      </div>

      <p>You can view your full earnings in your <strong>Wallet</strong> on the dashboard.</p>
      <p style="margin-top: 24px;">Thank you for teaching on LearnTrack! 🚀</p>
    </div>
    <div class="footer">
      LearnTrack · You're receiving this because you're an instructor on our platform.
    </div>
  </div>
</body>
</html>
