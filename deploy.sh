#!/bin/bash
set -xe

if [ $TRAVIS_BRANCH == 'master'  ] && [ $TRAVIS_EVENT_TYPE == 'push' ] ; then
  eval "$(ssh-agent -s)"
  ssh-add
  npm run build
  mv build html
  rsync -rq --delete \
  $TRAVIS_BUILD_DIR/html git@104.211.24.171:/var/www
else
  echo "Not deploying, since this branch isn't master."
fi
