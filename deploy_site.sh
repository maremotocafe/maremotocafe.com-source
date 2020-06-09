#!/bin/bash
# Script used to build the website with Hugo and upload it to the site's
# GitHub repository. You can optionally use a parameter to assign a
# commit message.

set -e

# Making sure it's running in the correct directory
cd "$(dirname "${BASH_SOURCE[0]}")"

TIMESTAMP=$(date +"%Y-%m-%d %H:%M")
MSG="$1"

cd public

echo ">> Updating site from remote branch..."
git fetch origin
git reset --hard origin/master

cd ..

echo ">> Building site..."
rm -rf public/css public/images public/css public/js public/plugins
hugo

cd public

echo ">> Deploying to GitHub..."
git add .
if [ -n "$MSG" ]; then
    git commit -m "$MSG"
else
    git commit -m "Build on $TIMESTAMP"
fi
git push origin master
