#!/bin/bash
# Simple script to reset to the remote branch.

# Making sure it's running in the correct directory
# shellcheck disable=SC2164
cd "$(dirname "${BASH_SOURCE[0]}")"

git fetch origin
git reset --hard origin/master
