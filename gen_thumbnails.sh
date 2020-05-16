#!/bin/sh
# Script to generate thumbnails for the items in the menu. The resized
# images will keep its aspect ratio.

set -e

# The image directories are relative to $DIR
DIR="static"
MENU="data/es/menu.yml"
SIZE="465x350"

sed -n 's/imagen:\s\?\(.*.jpg\)/\1/p' "$MENU" | uniq | while read image; do
    thumbnail=$(echo $image | sed 's/\(.*\).jpg/\1_small.jpg/')
    if [ -f "$DIR/$thumbnail" ]; then
        echo ">> Skipping $image as it already exists"
        continue
    fi

    echo -n ">> Generating $thumbnail ... "
    magick "$DIR/$image" -resize "$SIZE" "$DIR/$thumbnail"
    echo "done"
done
