#!/bin/sh
# Script used to build the website with Hugo and upload it to the vidify.org
# GitHub repository.

log() { echo -e "\e[36m$*\e[0m"; }
set -e

log "Building site..."
hugo

log "Deploying to GitHub..."
cd public
git add .
git commit -m "Build on $(date +"%Y-%m-%d %H:%M")"
git push origin master
