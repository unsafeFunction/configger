#!/bin/bash
#  Test local build
cd /srv/Projects/lims-frontend
echo "git stash"
git stash
echo  "git pull"
git pull https://rostislav.malyshev:"2460226Rr!"@qa.git.mirimus.com/Mirimus/lims-frontend.git
echo "npm run build:local"
npm run build:local
echo "push to bunny" 

