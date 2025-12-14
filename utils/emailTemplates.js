export const emailTemplate_PasswordReset = ({otp})=>{
    return  `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>OTP Verification</title>
</head>
<body style="background-color: #f4f4f7; margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table width="100%" style="max-width: 600px; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 15px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: #4f46e5; padding: 25px; text-align: center; color: #ffffff; font-size: 26px; font-weight: bold;">
                            Verification Code
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding: 30px;">
                            <p style="font-size: 16px; color: #333;">
                                Hi,
                            </p>
                            <p style="font-size: 16px; color: #333;">
                                To complete your action, please use the One-Time Password (OTP) below. This code is valid for <strong>10 minutes</strong>.
                            </p>

                            <div style="text-align: center; margin: 30px 0;">
                                <span style="display: inline-block; background: #4f46e5; color: #ffffff; padding: 15px 30px; border-radius: 8px; font-size: 28px; letter-spacing: 4px; font-weight: bold;">
                                    {${otp}}
                                </span>
                            </div>

                            <p style="font-size: 15px; color: #555;">
                                If you did not request this code, please ignore this email or contact support immediately.
                            </p>

                            <p style="font-size: 15px; color: #333; margin-top: 30px;">
                                Kind Regards,<br>
                                <strong>Your Company Team</strong>
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background: #f4f4f7; padding: 20px; text-align: center; font-size: 13px; color: #999;">
                            © 2025 Your Company. All rights reserved.
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`
}

export const emailTemplate_Verification = ({otp})=>{
    return `<!-- Verification Email (HTML) -->
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>Verify your account</title>
  <style>
    /* Basic email-safe styles */
    body { margin:0; padding:0; background-color:#f4f6f8; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color:#333333; }
    table { border-collapse:collapse; }
    img { border:0; display:block; }
    .container { width:100%; max-width:680px; margin:0 auto; }
    .card { background:#ffffff; border-radius:12px; padding:28px; box-shadow:0 6px 18px rgba(22, 28, 37, 0.06); }
    .logo { width:120px; height:auto; }
    h1 { font-size:20px; margin:0 0 8px; }
    p { margin:0 0 16px; line-height:1.5; color:#495057; }
    .btn { display:inline-block; padding:12px 20px; border-radius:8px; text-decoration:none; font-weight:600; }
    .btn-primary { background:#7b1fa2; color:#ffffff; }
    .otp { font-size:26px; letter-spacing:4px; font-weight:700; color:#111827; background:#f8fafc; padding:14px 18px; border-radius:8px; display:inline-block; }
    .muted { color:#8892a6; font-size:13px; }
    .footer { font-size:12px; color:#98a1b3; margin-top:18px; }
    /* Responsive */
    @media (max-width:520px) {
      .card { padding:20px; border-radius:10px; }
      .logo { width:100px; }
    }
  </style>
</head>
<body>
  <!-- Preheader (hidden in email clients) -->
  <span style="display:none; max-height:0; overflow:hidden; font-size:1px; color:#fff;">Verify your email to finish creating your account.</span>

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding:28px 16px;">
        <table class="container" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td align="center" style="padding-bottom:18px;">
              <!-- Logo -->
              <img src="{{LOGO_URL}}" alt="{{COMPANY_NAME}} logo" class="logo">
            </td>
          </tr>

          <tr>
            <td class="card" style="padding:28px;">
              <h1>Verify your account</h1>
              <p>Hello <strong>{{USER_NAME}}</strong>,</p>

              <p>Thanks for creating an account with <strong>{{COMPANY_NAME}}</strong>. Please verify your email address to activate your account and secure it.</p>

              <!-- CTA button -->
              <p style="text-align:center; margin:20px 0;">
                <a href="{{VERIFICATION_LINK}}" class="btn btn-primary" target="_blank" rel="noopener">Verify my account</a>
              </p>

              <!-- OTP fallback -->
              <p style="text-align:center; margin:10px 0;">
                <span class="muted">Or use this code:</span><br>
                <span class="otp">{${otp}}</span>
              </p>

              <p class="muted">This code will expire in <strong>{{EXPIRATION_MINUTES}} minutes</strong>. If you didn't request this, please ignore this email or contact support.</p>

              <hr style="border:none; border-top:1px solid #eef2f7; margin:20px 0;">

              <p style="margin-bottom:0;"><strong>Need help?</strong></p>
              <p class="muted" style="margin-top:6px;">If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break:break-all;"><a href="{{VERIFICATION_LINK}}" style="color:#6b21a8; text-decoration:underline;">{{VERIFICATION_LINK}}</a></p>

              <div class="footer">
                <p style="margin:12px 0 0;">{{COMPANY_NAME}} • {{COMPANY_ADDRESS}}</p>
                <p style="margin:6px 0 0;">If you didn’t create an account, no further action is required.</p>
                <p style="margin:6px 0 0;"><a href="{{UNSUBSCRIBE_LINK}}" style="color:#98a1b3; text-decoration:underline;">Unsubscribe</a></p>
              </div>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-top:14px; color:#98a1b3; font-size:12px;">
              © <span id="year">{{YEAR}}</span> {{COMPANY_NAME}}. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}