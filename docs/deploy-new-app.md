# Deploy new app for first time

## Pull down latest apps onto server

`ssh dev "cd ./sendbird-uikit-app-samples && git pull origin main"`

## Install app dependancies
`ssh dev "cd ./sendbird-uikit-app-samples/app-name && npm install"`


## Start node app
`ssh dev "cd ./sendbird-uikit-app-samples/app-name && API_TOKEN=5a02bc2428de1a03402ffa9ea9b58f73eb1dd066 APP_ID=4AE6ADF2-29F8-447D-A0D5-1C22184FDB3F pm2 start npm --name "name-of-app" -- start"`

## Update ngix config
`ssh dev`
`sudo nano /etc/nginx/sites-enabled/default`

add the following config to the second location block

location /{route-name}/ {
proxy_set_header   X-Forwarded-For $remote_addr;
proxy_set_header   Host $http_host;
proxy_pass         http://127.0.0.1:5000/{port};
}

## Restart nginx

`sudo service nginx restart`