#!/usr/bin/env bash

this_dir=$(dirname $0)

find build/ -name '*.*' | while read filename; do
    if [[ $filename = *"package.json"* ]]; then
        # patch package names in package.json
        sed -i '.bak' 's/@lingui\//@sector-labs\/lingui-/g' "$filename"
        rm "$filename.bak"

        # patch versions in package.json
        node "$this_dir/patch.js" "$1" "$filename"

    elif [[ $filename = *".js"* ]]; then
        # patch imports in js files
        sed -i '.bak' 's/@lingui\//@sector-labs\/lingui-/g' "$filename"
        rm "$filename.bak"
    fi
done
