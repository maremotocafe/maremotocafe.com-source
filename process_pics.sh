#!/bin/bash
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
MIN_SIZE="500x700"
MAX_SIZE="700x700"


if [ -d "$EXPORT_DIR" ]; then
    echo -n "Remove existing ${EXPORT_DIR}? [y/n]: "
    read -r confirm
    [ "$confirm" = "y" ] || (echo "Aborting" && exit 1)
    rm -rf "$EXPORT_DIR"
fi
mkdir -p "$EXPORT_DIR"

num=0
while read -r photo; do
    # The new image will be a jpeg, saved into the export directory
    new_photo=$(echo "$photo" | sed -E 's:(.+/)+(.+)\.(jpg|jpeg|png):'"$EXPORT_DIR"'/\2_small.jpg:')

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
    num=$((num + 1))
done < <(find "$BASE_DIR" -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | sort -n)

# Error code for exit if no images were generated.
if [ $num -eq 0 ]; then exit 1; fi
