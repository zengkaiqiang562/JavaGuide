#!/usr/bin/env sh

# 终止一个错误
set -e

# 构建
npm run docs-build

# 进入生成的构建文件夹
cd dist

# 如果你是要部署到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果你想要部署到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master
# git push -f git@github.com:zengkaiqiang562/zengkaiqiang562.github.io.git master
git push -f https://zengkaiqiang562@github.com/zengkaiqiang562/zengkaiqiang562.github.io.git master

# 如果你想要部署到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages

cd -
