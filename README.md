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
