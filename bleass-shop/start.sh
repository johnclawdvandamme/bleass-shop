#!/bin/bash
set -e
echo "=== STARTING BLEASS BACKEND ==="
echo "Files in /app:"
ls -la /app/
echo "---"
echo "Files in /app/bleass-backend:"
ls -la /app/bleass-backend/ 2>/dev/null || echo "no bleass-backend dir"
echo "---"
echo "Checking medusa..."
which medusa || echo "medusa not found"
cd /app/bleass-backend
exec medusa start
