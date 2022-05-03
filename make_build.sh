#!/bin/bash
#  Test build

if [[ $1 == "local" ][
then
        rclone_conf="bunny_rm:"
elif [[ $1 == "mirimus-qa:" ]]
then
        rclone_conf="bunny_qa"
elif [[ $1 == "mirimus-prod:" ]]
then
        rclone_conf="bunny_prod"
elif [[ $1 == "accelevir-prod:" ]]
then
        rclone_conf="bunny_aclv:"
elif [[ $1 == "wynn-prod" ]]
then
        rclone_conf="bunny_wynn:"
else
        echo "Wrong build conf"
        exit 1
fi;
echo "Building:"$1
frontend_dir="/srv/Projects/lims-frontend"
frontend_build_dir="/srv/Projects/lims-frontend/build"
cd  $frontend_dir
echo "git stash"
git stash
echo  "git pull"
git pull
cp template.build .env-cmdrc
echo "npm run build:"$1
npm run build:$1
echo "push to bunny"
#rclone sync $frontend_build_dir $rclone_conf 