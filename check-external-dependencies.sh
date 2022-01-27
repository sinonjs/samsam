#!/bin/sh

if ! command -v mkdocs ; then
    echo "You need to install MkDocs to release a version. See https://www.mkdocs.org/getting-started/"
    exit 1
fi

exit 0
