#!/bin/bash
set -e

echo "Enter new version: "
read -r VERSION
VERSION="v${VERSION/v/}"

read -p "Tag to $VERSION - are you sure? (y/n) " -n 1 -r

echo
if [[ $REPLY =~ ^[Yy]$ ]]; then

  echo "$VERSION ?"

  npm version "$VERSION"

  git add -A

  git commit -m "chore: release $VERSION"

  git push

  git tag $VERSION

  git push --tags
fi