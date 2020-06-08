#!/bin/sh
# Script to generate thumbnails for the items in the menu. The resized
# images will keep its aspect ratio.

set -e

# The image directories are relative to $BASE_DIR
BLACKLIST="dev/no_resize.txt"
BASE_DIR="static"
EXPORT_DIR="out"
MENU="data/es/menu.yml"
SIZE="465x350"


if [ -d "$EXPORT_DIR" ]; then
    echo -n "Remove existing ${EXPORT_DIR}? [y/n]: "
    read confirm
    [ "$confirm" = "y" ] || (echo "Aborting" && exit 1)
    rm -rf "$EXPORT_DIR"
fi
mkdir -p "$EXPORT_DIR"

sed -n 's/imagen:\s\?\(.*.jpg\)/\1/p' "$MENU" | sort -n | uniq | while read photo; do
    # The new image will be a jpeg, saved into the export directory
    new_photo=$(echo "$photo" | sed 's:\(.\+/\)\(\w\+\)\.\(jpg\|jpeg\|png\):'"$EXPORT_DIR"'/\2_small.jpg:')

    if grep -q "$photo" "$BLACKLIST"; then
        echo "[$photo] Skipped"
        continue
    fi

    echo -n "[$photo] Generating $new_photo ... "
    magick "$BASE_DIR/$photo" -resize "$SIZE" "$new_photo"
    echo "done"
done
