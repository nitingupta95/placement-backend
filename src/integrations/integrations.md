src/
└── integrations/
    ├── email/
    │   ├── mailgun.integration.ts     # wrapper for Mailgun API
    │   ├── nodemailer.integration.ts  # fallback local SMTP
    │   └── sendgrid.integration.ts    # optional, if using SendGrid
    ├── storage/
    │   ├── s3.integration.ts          # AWS S3 file uploads (logo, resume)
    │   ├── gcs.integration.ts         # Google Cloud Storage (optional)
    │   └── cloudinary.integration.ts  # image hosting alternative
    ├── ai/
    │   ├── resumeAnalyzer.integration.ts  # optional: AI resume screening or summarization
    │   └── recommendation.integration.ts  # optional: job recommendation system
    ├── payments/
    │   ├── stripe.integration.ts      # example payment processor
    │   ├── razorpay.integration.ts    # Indian market
    │   └── webhook.handler.ts         # handles payment webhook callbacks
    ├── auth/
    │   ├── oauth.integration.ts       # Google, GitHub login
    │   └── jwt.helper.ts              # issue/verify JWT tokens
    ├── messaging/
    │   ├── twilio.integration.ts      # SMS alerts
    │   └── whatsapp.integration.ts    # WhatsApp Business API
    ├── monitoring/
    │   ├── sentry.integration.ts      # error tracking
    │   └── datadog.integration.ts     # metrics
    └── index.ts                       # central export (for imports like integrations.s3.upload)
