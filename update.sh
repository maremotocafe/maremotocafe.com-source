#!/bin/bash
# Simple script to update the files.

# Making sure it's running in the correct directory
# shellcheck disable=SC2164
cd "$(dirname "${BASH_SOURCE[0]}")"

git pull origin master
