#!/bin/bash
set -e

CURRENT="$(node -pe "require('./package.json')['version']")"

echo "📌 Current version is: v${CURRENT/v/}"
echo "🔫 Enter new version: "
read -r VERSION
VERSION="v${VERSION/v/}"

read -p "Tag to $VERSION - are you sure? (y/n) " -n 1 -r

echo
if [[ $REPLY =~ ^[Yy]$ ]]; then

  echo "$VERSION ?"

  git add -A

  npm version "$VERSION" -m "chore: release $VERSION"

  # git tag $VERSION

  git push

  git push --tags
fi