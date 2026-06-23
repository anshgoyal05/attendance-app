# Attendance Management System

Full-stack attendance tracker built with Next.js 15, Prisma ORM, and PostgreSQL.

## Free Database Recommendation

Use **Supabase Postgres (free tier)**.

## 1) Create free Postgres database (Supabase)

1. Go to https://supabase.com and create a free project.
2. Open **Project Settings -> Database**.
3. Copy the **Connection string** (URI).
4. Ensure SSL is enabled (`?sslmode=require`).

## 2) Configure environment

```bash
cp .env.example .env
```

Set these values:

```env
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres?sslmode=require"
JWT_SECRET="any-long-random-string"
SETUP_SECRET="any-secret-you-choose"
```

## 3) Install and initialize database

```bash
npm install
npm run db:setup
npm run dev
```

Default login:
- Username: `student`
- Password: `student123`

## 4) Deploy online (Vercel + Supabase)

1. Push this repository to GitHub.
2. Import repo in Vercel.
3. Add env vars in Vercel project settings:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `SETUP_SECRET`
4. Deploy.
5. Seed prod once:

```bash
curl -X POST https://YOUR-APP.vercel.app/api/setup \
  -H "x-setup-secret: YOUR_SETUP_SECRET"
```

## Scripts

- `npm run dev` - start local server
- `npm run build` - production build
- `npm run db:push` - apply Prisma schema
- `npm run db:seed` - seed default user/subjects
- `npm run db:setup` - `db:push` + `db:seed`

## Notes

- Docker is no longer required.
- Any managed Postgres free tier works (Supabase, Neon, Railway).
