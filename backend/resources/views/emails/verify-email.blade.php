<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - KEVIN PMT</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9fafb;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .content {
            padding: 40px 30px;
        }
        .content p {
            margin: 15px 0;
            font-size: 16px;
        }
        .button {
            display: inline-block;
            background-color: #f97316;
            color: white;
            padding: 12px 40px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: bold;
            margin: 20px 0;
            font-size: 16px;
        }
        .button:hover {
            background-color: #ea580c;
        }
        .footer {
            background-color: #f3f4f6;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
        }
        .highlight {
            background-color: #fef3c7;
            padding: 15px;
            border-left: 4px solid #f97316;
            margin: 20px 0;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to KEVIN PMT! 👋</h1>
        </div>

        <div class="content">
            <p>Hi <strong>{{ $user->name }}</strong>,</p>

            <p>Thank you for creating an account! To get started, please verify your email address by clicking the button below:</p>

            <div style="text-align: center;">
                <a href="{{ $verificationLink }}" class="button">Verify Email Address</a>
            </div>

            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px;">{{ $verificationLink }}</p>

            <div class="highlight">
                <strong>⏰ Note:</strong> This verification link will expire in 24 hours. If it expires, you can request a new one when logging in.
            </div>

            <p>If you didn't create this account, you can safely ignore this email.</p>

            <p>Best regards,<br>
            <strong>KEVIN PMT Team</strong></p>
        </div>

        <div class="footer">
            <p>© 2026 KEVIN PMT. All rights reserved.</p>
            <p>Widianto & Sumbogo - Project Management Tool</p>
        </div>
    </div>
</body>
</html>
