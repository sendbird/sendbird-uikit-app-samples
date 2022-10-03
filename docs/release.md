# Deploy latest version of node server

## Locally test app is still working

Either call the post endpoints with postman or run the demo clients locally and switch to using [localhost](http://localhost) in the app manifest and when starting the interactive conversation by calling /start.

## push code to github

`git push origin main`


## Pull latest code onto prod server

`ssh dev "cd sendbird-uikit-app-samples && git pull origin main"`


## Find the server you are updating

`ssh dev "pm2 ls"`

## Restart server

`ssh dev "pm2 restart $serverName"`

Restarting server $servername