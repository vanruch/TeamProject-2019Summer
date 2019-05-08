#!/bin/bash
set -xe

if [ $TRAVIS_BRANCH == 'master' ] ; then
  eval "$(ssh-agent -s)"
  ssh-add
  npm run build
  rsync -rq --delete \
  $TRAVIS_BUILD_DIR git@104.211.24.171:/var/www/html
else
  echo "Not deploying, since this branch isn't master."
fi
