### expected folder structure

src/
└── cron/
    ├── index.ts                     # registers all cron jobs (entry)
    ├── jobCleanup.ts                # cleans expired job postings or applications
    ├── analyticsReport.ts           # generates weekly or monthly analytics for superadmin
    ├── verifyPendingAccounts.ts     # auto-verifies or reminds pending college/company accounts
    ├── sendEmailReminders.ts        # sends email reminders to unplaced students or companies
    ├── dbBackup.ts                  # scheduled backup to S3 or cloud storage (optional)
    ├── notificationDispatcher.ts    # dispatches queued notifications
    └── scheduler.ts                 # uses node-cron / BullMQ to schedule all above jobs
