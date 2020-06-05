#!/bin/sh
# Script to generate thumbnails for the items in the menu. The resized
# images will keep its aspect ratio.

set -e

# The image directories are relative to $DIR
BLACKLIST="dev/miniaturas_excepciones.txt"
DIR="static"
MENU="data/es/menu.yml"
SIZE="465x350"

sed -n 's/imagen:\s\?\(.*.jpg\)/\1/p' "$MENU" | uniq | while read image; do
    if grep -q "$image" "$BLACKLIST"; then
        echo ">> Skipping $image as it's in the blacklist"
        continue
    fi

    thumbnail=$(echo $image | sed 's/\(.*\).jpg/\1_small.jpg/')

    echo -n ">> Generating $thumbnail ... "
    magick "$DIR/$image" -resize "$SIZE" "$DIR/$thumbnail"
    echo "done"
done
