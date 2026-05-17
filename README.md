# Getting Started

Enter the following command to install all dependencies:

```bash
yarn
```

Make sure Docker is running and spin up the supabase db from your local by running the command:

```bash
yarn run connect:dev-supabase
```

You should be able to view your database on:

```bash
http://localhost:54323/project/default
```

Then, run the development server with the command:

```bash
yarn dev
```

You can access the application now by going to:

```bash
http://localhost:3000
```

## Error Monitoring with Sentry

This application includes Sentry error monitoring for production environments. To set it up:

1. Create a Sentry project at [sentry.io](https://sentry.io)
2. Copy your DSN from the project settings
3. Add the following environment variables to your `.env.local` file:
   ```
   NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
   SENTRY_ORG=your_sentry_org_slug
   SENTRY_PROJECT=your_sentry_project_slug
   SENTRY_AUTH_TOKEN=your_sentry_auth_token_here
   ```
4. Sentry will automatically capture and report errors from:
   - GraphQL resolvers
   - API routes
   - Authentication flows
   - Client-side JavaScript errors
   - Server-side errors

## Useful Supabase Commands

```bash
supabase init
supabase login
supabase start
supabase stop
supabase link --project-ref $REFERENCE_ID
supabase db push
supabase db pull
supabase db dump
supabase db dump --local
supabase db dump --local --data-only
```

## Future Features

- Compare your lists with others given their id
