#!/bin/bash

set -e

echo "Running preflight checks..."

if [ -z "$DATABASE_URL" ]; then
    echo "ERROR: DATABASE_URL environment variable is missing"
    exit 1
fi

if echo "$DATABASE_URL" | grep -qi "sqlite"; then
    echo "ERROR: SQLite is not allowed. Use Supabase Postgres only."
    exit 1
fi

cd backend

if [ -d "core/migrations" ]; then
    if grep -r "sqlite" core/migrations/*.py 2>/dev/null; then
        echo "ERROR: Found SQLite references in migrations"
        exit 1
    fi
fi

echo "Preflight checks passed!"
exit 0
