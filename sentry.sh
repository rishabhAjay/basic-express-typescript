#!/usr/bin/env bash
if [ "$1" == "" ]; then
    echo "No remote alias provided"
    exit 1
fi

if [ "$2" == "" ]; then
    echo "No branch provided"
    exit 1
fi
if git push $1 $2; then
    VERSION=`npx sentry-cli releases propose-version`
# Workflow to create releases, upload commits and sourcemaps
    npx sentry-cli releases new "$VERSION"
    npx sentry-cli releases set-commits "$VERSION" --auto
    npm run build
    npx sentry-cli releases files "$VERSION" upload-sourcemaps ./dist --ignore-file .sentryignore
    npx sentry-cli releases finalize "$VERSION"
   
else
    echo "pushing to remote repo failed"
    exit 1
fi