#!/bin/sh
set -e

echo "Starting deployment script..."

# Generate Prisma Client (ensure it matches current schema)
echo "Generating Prisma Client..."
npx prisma generate

# Push schema to database (safely updates schema without data loss if possible)
echo "Pushing DB schema..."
npx prisma db push --accept-data-loss

# Start the application
echo "Starting Next.js..."
exec node server.js
