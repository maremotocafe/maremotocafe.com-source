#!/bin/bash
# Script used to build the website with Hugo and upload it to the 
# GitHub repositories. You can optionally use a parameter to assign a
# commit message.

set -e

# Making sure it's running in the correct directory
cd "$(dirname "${BASH_SOURCE[0]}")"

TIMESTAMP=$(date +"%Y-%m-%d %H:%M")
MSG="$1"

echo ">> Building site..."
hugo

echo ">> Deploying to GitHub..."
cd public
git add .
if [ -n "$MSG" ]; then
    git commit -m "$MSG"
else
    git commit -m "Build on $TIMESTAMP"
fi || true
# Doesn't matter if this command fails: maybe all files have already been
# uploaded, so just continue.
git push origin master || true

echo ">> Uploading source files..."
cd ..
git add .
if [ -n "$MSG" ]; then
    git commit -m "$MSG"
else
    git commit -m "Update on $TIMESTAMP"
fi || true
git push origin master || true
