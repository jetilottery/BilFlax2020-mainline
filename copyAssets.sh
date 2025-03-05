#!/usr/bin/env bash
rm -rf ./src/main/webapp/assetPacks/desktop/spine;
rm -rf ./src/main/webapp/assetPacks/mobile/spine;
rm -rf ./src/main/webapp/assetPacks/tablet/spine;
mkdir ./src/main/webapp/assetPacks/desktop/spine/
mkdir ./src/main/webapp/assetPacks/mobile/spine/
mkdir ./src/main/webapp/assetPacks/tablet/spine/

rm -rf ./src/main/webapp/assetPacks/desktop/splash;
rm -rf ./src/main/webapp/assetPacks/mobile/splash;
rm -rf ./src/main/webapp/assetPacks/tablet/splash;
mkdir ./src/main/webapp/assetPacks/desktop/splash/
mkdir ./src/main/webapp/assetPacks/mobile/splash/
mkdir ./src/main/webapp/assetPacks/tablet/splash/

cp ./src/art/spine/landscape/*.* ./src/main/webapp/assetPacks/desktop/spine
cp ./src/art/spine/portrait/*.* ./src/main/webapp/assetPacks/desktop/spine
cp ./src/art/spine/portrait/*.* ./src/main/webapp/assetPacks/mobile/spine
cp ./src/art/spine/portrait/*.* ./src/main/webapp/assetPacks/tablet/spine

cp ./src/art/splash/*.* ./src/main/webapp/assetPacks/desktop/splash
cp ./src/art/splash/*.* ./src/main/webapp/assetPacks/mobile/splash
cp ./src/art/splash/*.* ./src/main/webapp/assetPacks/tablet/splash

mv ./src/main/webapp/assetPacks/desktop/splash/backgroundFill.jpg ./src/main/webapp/assetPacks/desktop/images
mv ./src/main/webapp/assetPacks/mobile/splash/backgroundFill.jpg ./src/main/webapp/assetPacks/mobile/images
mv ./src/main/webapp/assetPacks/tablet/splash/backgroundFill.jpg ./src/main/webapp/assetPacks/tablet/images