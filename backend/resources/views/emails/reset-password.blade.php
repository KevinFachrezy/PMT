<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - KEVIN PMT</title>
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
        .warning {
            background-color: #fee2e2;
            padding: 15px;
            border-left: 4px solid #dc2626;
            margin: 20px 0;
            border-radius: 4px;
            color: #991b1b;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset Request 🔐</h1>
        </div>

        <div class="content">
            <p>Hi <strong>{{ $user->name }}</strong>,</p>

            <p>We received a request to reset your password for your KEVIN PMT account. Click the button below to reset your password:</p>

            <div style="text-align: center;">
                <a href="{{ $resetLink }}" class="button">Reset Your Password</a>
            </div>

            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px;">{{ $resetLink }}</p>

            <div class="warning">
                <strong>⚠️ Security Note:</strong> This password reset link will expire in 24 hours. If you didn't request a password reset, please ignore this email or change your password immediately if you suspect unauthorized access.
            </div>

            <p>For security reasons:</p>
            <ul>
                <li>Never share this link with anyone</li>
                <li>The link will only work once</li>
                <li>Use a strong password when resetting</li>
            </ul>

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
