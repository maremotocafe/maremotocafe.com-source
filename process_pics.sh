#!/bin/sh
# This script photo converts all the files in a provided directory
# into a compressed format for the web. It also resizes them to appropiate
# sizes.

set -e

if [ $# -ne 1 ]; then
    echo "Usage: $0 DIRECTORY"
    exit 1
fi


NO_RESIZE_LIST="dev/no_resize.txt"
COMPRESSED_LIST="dev/compressed.txt"
BASE_DIR="$1"
EXPORT_DIR="out"
MIN_SIZE="400x500"
MAX_SIZE="540x670"


if [ -d "$EXPORT_DIR" ]; then
    echo -n "Remove existing ${EXPORT_DIR}? [y/n]: "
    read confirm
    [ "$confirm" = "y" ] || (echo "Aborting" && exit 1)
    rm -rf "$EXPORT_DIR"
fi
mkdir -p "$EXPORT_DIR"

find "$BASE_DIR" -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | sort -n | while read photo; do
    # The new image will be a jpeg, saved into the export directory
    new_photo=$(echo "$photo" | sed 's:\(.\+/\)\(\w\+\)\.\(jpg\|jpeg\|png\):'"$EXPORT_DIR"'/\2.jpg:')

    # Checking it hasn't been compressed before and that it isn't a
    # thumbnail.
    if grep -q "$photo" "$COMPRESSED_LIST" || ( echo "$photo" | grep -q "_small.jpg" ); then
        echo "[$photo] Skipped"
        continue
    fi

    # Converting it with magick
    echo -n "[$photo] Converting $new_photo ... "
    if ! grep -q "$photo" "$NO_RESIZE_LIST"; then
        magick "$photo" -resize "${MIN_SIZE}<" "$new_photo"
        magick "$new_photo" -resize "${MAX_SIZE}>" "$new_photo"
        magick "$new_photo" -strip -interlace Plane -quality 85% "$new_photo"
    else
        magick "$photo" -strip -interlace Plane -quality 85% "$new_photo"
    fi
    echo "done"

    # Saving it into the previously compressed files
    echo "$photo" >> "$COMPRESSED_LIST"
done
