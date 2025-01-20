
interface HTMLTypes {
    otp?: string;
    resetLink?: string;
    userName: string;
    companyName: string;
}

export const resetPasswordEmailTemplate = ({ resetLink, userName, companyName, otp }: HTMLTypes) => {
    return `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border: 1px solid #dddddd;
            border-radius: 8px;
            overflow: hidden;
        }
        .email-header {
            background-color: #007bff;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .email-body {
            padding: 20px;
        }
        .email-body p {
            margin: 10px 0;
        }
        .email-footer {
            text-align: center;
            padding: 15px;
            font-size: 12px;
            color: #888;
            background-color: #f1f1f1;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            font-size: 16px;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 5px;
        }
        .button:hover {
            background-color: #0056b3;
        }
        .paraColor{
         color: white
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>Reset Your Password</h1>
        </div>
        <div class="email-body">
            <p>Hello ${userName || 'User'},</p>
            <p>You recently requested to reset your password for your account. Click the button below to reset it and your OTP is ${otp}. This reset link and OTP is valid for 2 minute only</p>
            <a href="${resetLink}" class="button"><p class="paraColor">Reset Password</p></a>
            <p>If you didn’t request this, please ignore this email.</p>
            <p>Thanks,<br>${companyName || 'Your Company'} Team</p>
        </div>
        <div class="email-footer">
            <p>&copy; 2025 ${companyName || 'Your Company'}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
};

export const otpEmailTemplate = ({ otp, userName, companyName }: HTMLTypes) => {
    return `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border: 1px solid #dddddd;
            border-radius: 8px;
            overflow: hidden;
        }
        .email-header {
            background-color: #28a745;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .email-body {
            padding: 20px;
        }
        .email-body p {
            margin: 10px 0;
        }
        .email-footer {
            text-align: center;
            padding: 15px;
            font-size: 12px;
            color: #888;
            background-color: #f1f1f1;
        }
        .otp {
            display: inline-block;
            padding: 10px 20px;
            margin: 20px 0;
            font-size: 20px;
            color: #ffffff;
            background-color: #28a745;
            text-align: center;
            border-radius: 5px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>Your OTP Code</h1>
        </div>
        <div class="email-body">
            <p>Hello ${userName || 'User'},</p>
            <p>Your OTP code for verifying your account is:</p>
            <div class="otp">${otp}</div>
            <p>Please use this code to complete your verification. This code is valid for 2 minutes.</p>
            <p>If you didn’t request this, please ignore this email.</p>
            <p>Thanks,<br>${companyName || 'Your Company'} Team</p>
        </div>
        <div class="email-footer">
            <p>&copy; 2025 ${companyName || 'Your Company'}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
};

