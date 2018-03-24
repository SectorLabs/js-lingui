#!/usr/bin/env bash

this_dir=$(dirname $0)

find build/ -name 'package.json' | while read package_json; do
    mv "$package_json" "$package_json.bak"
    cat "$package_json.bak" | sed 's/@lingui\//@sector-labs\/lingui-/' > "$package_json"

    node "$this_dir/patch.js" "$1" "$package_json"
done
