#!/bin/bash

# Check if git, node and npm are installed
if ! [ -x "$(command -v git)" ]; then
    echo 'Error: git is not installed.' >&2
    exit 1
fi
if ! [ -x "$(command -v node)" ]; then
    echo 'Error: node is not installed.' >&2
    exit 1
fi
if ! [ -x "$(command -v npm)" ]; then
    echo 'Error: npm is not installed.' >&2
    exit 1
fi

# If git pull is successful, also install the npm dependencies, else, exit
git stash --include-untracked
git reset --hard
git clean -fd
if git pull; then
    echo "Successfully downloaded the latest version of the codebase, now installing the required dependencies..."
    npm install
else
    echo "No updates available."
    exit 0
fi