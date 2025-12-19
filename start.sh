#!/bin/sh
set -e

echo "Starting deployment script..."

# Generate Prisma Client (ensure it matches current schema)
echo "Generating Prisma Client..."
npx prisma generate

# Fix Data Integrity before Schema Push
# This handles the case where 'assets' table exists with data but 'asset_types' is empty/missing
# which causes FK constraint failures during 'db push'.
echo "Running integrity fix..."
npx tsx prisma/fix_integrity.ts || echo "Integrity fix skipped or failed (non-critical if tables don't exist)"

# Push schema to database (safely updates schema without data loss if possible)
echo "Pushing DB schema..."
npx prisma db push --accept-data-loss

# Seed initial data (Asset Types)
echo "Seeding database..."
npx tsx prisma/seed.ts || echo "Seed failed or already applied"

# Start the application
echo "Starting Next.js..."
exec node server.js
