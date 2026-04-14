#!/bin/bash
set -e
echo "Starting BLEASS Backend..."
cd bleass-backend
exec medusa start
