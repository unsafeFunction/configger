#!/bin/bash
#  Test build

if [[ $1 == "local" ]]
then
        rclone_conf="bunny_rm:"
		build_script=$1
elif [[ $1 == "mirimus-qa" ]]
then
        rclone_conf="bunny_qa:"
		build_script=$1
elif [[ $1 == "mirimus-prod" ]]
then
        rclone_conf="bunny_prod:"
		build_script=$1
elif [[ $1 == "accelevir-prod" ]]
then
        rclone_conf="bunny_aclv:"
		build_script="aclv"
elif [[ $1 == "wynn-prod" ]]
then
        rclone_conf="bunny_wynn:"
		build_script="wynn"
else
        echo "Wrong build conf"
        exit 1
fi;
echo "Building script:"$build_script
frontend_dir="/srv/Projects/lims-frontend"
frontend_build_dir="/srv/Projects/lims-frontend/build"
cd  $frontend_dir
echo "git stash"
git stash
echo  "git pull"
git pull
cp template.build .env-cmdrc
echo "npm run build:"$build_script
npm run build:$build_script
echo "push to bunny"
rclone sync $frontend_build_dir $rclone_conf 