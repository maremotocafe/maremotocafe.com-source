#!/bin/sh
# This script automatically converts all the files in a provided directory
# into a compressed format for the web. It also resizes them to appropiate
# sizes.

set -e

if [ $# -ne 2 ]; then
    echo "Usage: $0 DIRECTORY START_NUM"
    exit 1
fi


COMPRESSED_LIST="dev/comprimidos.txt"
BASE_DIR="$1"
EXPORT_DIR="$BASE_DIR/out"
START_NUM=$2
MIN_SIZE=""
MAX_SIZE=""


if [ -d "$EXPORT_DIR" ]; then
    echo -n "Remove existing ${EXPORT_DIR}? [y/n]: "
    read confirm
    [ "$confirm" = "y" ] || (echo "Aborting" && exit 1)
    rm -rf "$EXPORT_DIR"
fi
mkdir -p "$EXPORT_DIR"


find "$BASE_DIR" -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | while read photo; do
    # The new image will be a jpeg, saved into the export directory
    name=$(echo "$EXPORT_DIR" | sed 's:\(.\+/\)\(\w\+\)\.\(jpg\|jpeg\|png\):'"$EXPORT_DIR"'/\2.jpg:')

    # Checking it hasn't been compressed before
    if grep -q "$name" "$COMPRESSED_LIST"; then
        echo -n "[$name] Skipped"
        continue
    fi

    # Converting it with magick
    echo -n "[$name] Converting $photo ... "
    magick "$photo" -resize "${MIN_SIZE}^" "$name"
    magick "$name" -resize "${MAX_SIZE}" -strip -interlace Plane -quality 85% "$name"
    echo "done"

    # Saving it into the previously compressed files
    echo "$name" >> "$COMPRESSED_LIST"
done
