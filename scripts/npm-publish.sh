#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

eval FORCE_PUBLISH=false
eval EXEC_CHANGE_REGISTRY=false
eval NPM_REGISTRY=false
eval NPM_EMAIL=""
eval TOKEN_REGISTRY=""
eval OPTIONS=""
eval EXEC_GIT_NPM_INSTALL_JSAPI=false
eval GIT_ISH=""
eval EXEC_SLEEP=false
eval SLEEP_TIME="0"
eval EXEC_VERSION_JSAPI=false
eval JSAPI_VERSION=""
eval BUILD_BASEREF=""

eval projects=( "core"
    "insights"
    "content-services"
    "process-services" )


DIR="$DIR/../"
cd "$DIR"
echo "Current folder $DIR"
echo "PACKAGE JSON"
cat package.json
echo "PACKAGE NPMC"
cat .npmrc

show_help() {
    echo "Usage: npm-publish.sh"
    echo ""
    echo "-f or --force publish the package with force"
    echo "-r or --registry to publish in an alternative npm registry -registry 'http://npm.local.me:8080/' "
    echo "-token auth token for publish in the npm registry"
    echo "-t or --tag to add a tag when publish a package"
    echo "--sleep add a sleep before any publish"
    echo "-gitjsapi to build all the components against a commit-ish version of the JS-API"
    echo "-vjsapi <commit-ish>      Install different version from npm of JS-API defined in the package.json"
}

enable_force(){
    OPTIONS="$OPTIONS -force"
}

enable_change_registry(){
    NPM_REGISTRY=$1
    EXEC_CHANGE_REGISTRY=true
}

enable_registry_email(){
    NPM_EMAIL=$1
}

enable_build_base_ref() {
    BUILD_BASEREF=$1
}

set_sleep(){
    SLEEP_TIME=$1
    EXEC_SLEEP=true
}

get_token_registry(){
    TOKEN_REGISTRY=$1

    if [[ "${TOKEN_REGISTRY}" == "" ]]
    then
      echo "token missing -token"
      exit 0
    fi
}

enable_js_api_git_link() {
    GIT_ISH='git://github.com/Alfresco/alfresco-js-api.git#'$1
    EXEC_GIT_NPM_INSTALL_JSAPI=true
}

add_tag(){
    eval TAG=$1

    if [[ "${TAG}" == "" ]]
    then
      echo "tag missing -t | -tag"
      exit 0
    fi

    echo "====== TAG WILL BE ADDED DURING THE PUBLISH: ${TAG} ====="
    OPTIONS="$OPTIONS --tag $1"
}

version_js_api() {
    JSAPI_VERSION=$1

    if [[ "${JSAPI_VERSION}" == "" ]]
    then
      echo "JSAPI version required with -vJSApi"
      exit 0
    fi

    EXEC_VERSION_JSAPI=true
}

change_registry(){
    if [[ "${NPM_REGISTRY}" == "" ]]
    then
      echo "NPM registry required WITH OPTION -r | -registry"
      exit 0
    fi

    rm .npmrc

    echo "====== CHANGE REGISTRY: ${NPM_REGISTRY} ====="
    touch .npmrc
    echo 'registry=https://'${NPM_REGISTRY} >> .npmrc
    echo '//'${NPM_REGISTRY}':_authToken="'${TOKEN_REGISTRY}'"' >> .npmrc
    echo '_auth='${TOKEN_REGISTRY} >> .npmrc
    cat .npmrc
}

while [[ $1 == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -t|--tag)  add_tag $2; shift 2;;
      -f|--force)  enable_force; shift;;
      -token) get_token_registry $2; shift 2;;
      --sleep) set_sleep $2; shift 2;;
      -r|--registry) enable_change_registry $2; shift 2;;
      -email) enable_registry_email $2; shift 2;;
      -gitjsapi)  enable_js_api_git_link $2; shift 2;;
      -base)  enable_build_base_ref $2; shift 2;;
      -vjsapi)  version_js_api $2; shift 2;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 0;;
    esac
done

echo "====== INSTALL AND CLEAN ===== "
npm install rimraf
echo "====== STEP CLEAN ===== "
npm run clean
echo "====== START INSTALL ===== "
npm install
echo "====== END INSTALL  ===== "

echo "====== Build ADF from the path '$BUILD_BASEREF'====="
npm run build -- --base-href $BUILD_BASEREF  --deploy-url $BUILD_BASEREF

if $EXEC_CHANGE_REGISTRY == true; then
change_registry
fi

echo "====== PUBLISHING: ${DESTDIR} ===== npm publish ${OPTIONS}"
npm publish ${OPTIONS} || exit 1

if $EXEC_CHANGE_REGISTRY == true; then
    rm .npmrc
fi

if $EXEC_SLEEP == true; then
    echo "====== SLEEP ${SLEEP_TIME}"
    sleep ${SLEEP_TIME}
fi

cd ${DIR}
