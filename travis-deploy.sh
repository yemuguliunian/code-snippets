#!/user/bin/env sh

npm run hub

cd snippent

git init
git add -A
git commit -m 'deploy'

cd -