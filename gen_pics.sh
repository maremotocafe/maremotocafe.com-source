#!/bin/bash
# Script to automatically generate the thumbnails and compress the images.

set -e

# Making sure it's running in the correct directory
cd "$(dirname "${BASH_SOURCE[0]}")"

PICS_DIR="static/images/carta"

echo ">> Generating thumbnails..."
if yes | ./gen_thumbnails.sh; then
    mv out/* "$PICS_DIR"
fi

echo ">> Compressing images..."
if yes | ./process_pics.sh "$PICS_DIR"; then
    mv out/* "$PICS_DIR"
fi
