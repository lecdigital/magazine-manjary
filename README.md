# மஞ்சரி (Manjary) — Literary Platform & Magazine CMS

Full-stack web platform for **Manjary (மஞ்சரி)** authored and edited by **M. Thayalan (எம். தயாளன்)**. Built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, **`next-intl` (Tamil & English)**, **NextAuth**, **Stripe Dynamic Pricing**, and **Prisma ORM**.

---

## Quick Start (Local SQLite Phase)

```bash
# 1. Install dependencies
npm install

# 2. Push schema to local SQLite and seed Tamil Unicode starter data
npm run db:setup

# 3. Start development server
npm run dev
```

Visit `http://localhost:3000` (automatically routes to `/ta` Tamil default locale, with `/en` English switcher).

### Seeded Admin Portal Credentials
- **Admin Login URL**: `http://localhost:3000/ta/login` (or `/ta/admin`)
- **Email**: `admin@manjary.com`
- **Password**: `ManjaryAdmin2026!`

---

## Git & GitHub Workflow

```bash
# Initialize Git, stage all source files (ignoring .env and *.db), and create initial commit
npm run git:init

# Connect your GitHub remote and push
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

---

## 2-Step Hostinger MySQL Migration

When your Hostinger MySQL database is ready:

1. **Update `prisma/schema.prisma`**:
   Change `provider = "sqlite"` to `provider = "mysql"` in the `datasource db` block.
2. **Update `.env` and Push Tables**:
   Set `DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DB_NAME"` in `.env` and run:
   ```bash
   npx prisma db push
   ```
   *(Optional)* Seed the production database with starter data:
   ```bash
   npm run db:seed
   ```

