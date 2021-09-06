#!/bin/bash
if [[ -z "$token" ]]
then
    echo "Enter Github access token:"
    read gh_token
else
    gh_token=${token}
fi
echo "@moggiez:registry=https://npm.pkg.github.com/" > ./src/.npmrc
echo "//npm.pkg.github.com/:_authToken=${gh_token}" >> ./src/.npmrc