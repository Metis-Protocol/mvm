#!/bin/bash
set -ex
region='us-east-2'
if [ -n "$1"  ]
then
    region=$1
fi

stack="metis"
if [ -n "$2" ]
then
    stack=$2
fi

account="950087689901"
if [ -n "$3" ]
then
    account=$3
fi

# --no-cache
echo 'Building metis_l2_geth_peer image'
cmd="sed -i s#REGION_VAR_FOR_ENV#$region#g ./settings/efs-utils.conf"
$cmd
# docker images|grep metis_l2_geth_peer|awk '{print $3}'|xargs docker rmi -f
docker build --no-cache -f ./Dockerfile -t metis_l2_geth_peer ../geth-peer
cmd="sed -i s#$region#REGION_VAR_FOR_ENV#g ./settings/efs-utils.conf"
$cmd

profile="aws --profile default ecr get-login-password --region $region"
login="docker login --username AWS --password-stdin $account.dkr.ecr.$region.amazonaws.com"
$profile | $login

echo 'Pushing metis_l2_geth_peer'
l2geth="docker tag metis_l2_geth_peer:latest $account.dkr.ecr.$region.amazonaws.com/$stack-l2-geth-peer:latest"
$l2geth
l2geth_push="docker push $account.dkr.ecr.$region.amazonaws.com/$stack-l2-geth-peer:latest"
$l2geth_push
