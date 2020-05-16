#!/bin/sh
# This script automatically converts all the files in a provided directory
# into a compressed format for the web.

set -e

EXPORT_DIR="out"

[ -n "$1" ] || (echo "No directory passed" && exit 1)
cd "$1"

if [ -d "$EXPORT_DIR" ]; then
    echo -n "Remove ${EXPORT_DIR}? [y/n]: "
    read confirm
    [ "$confirm" = "y" ] || (echo "Aborting" && exit 1)
    rm -rf "$EXPORT_DIR"
fi
mkdir "$EXPORT_DIR"

name=0
find . -maxdepth 1 -type f  \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | while read photo; do
    echo -n ">> [$name] Converting $photo ... "
    magick "$photo" -strip -interlace Plane -quality 85% "$EXPORT_DIR/$name.jpg"
    name=$((name + 1))
    echo "done"
done
