# command to give rules chmod u+x deploy.sh
# ./deploy.sh to deploy

echo "Switching to branch main"
git checkout main

echo "Building app..."
npm run production

echo "Deploying files to server..."
scp -r dist/* root@someUser:someUrl
echo "Changing image directory rights"
ssh root@someUser chmod 777 someUrlAssets

echo "Done!"