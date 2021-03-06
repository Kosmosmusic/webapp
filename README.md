# Kosmosmusic Webapp

![Master](https://github.com/Kosmosmusic/webapp/workflows/Master/badge.svg) ![PR validation](https://github.com/Kosmosmusic/webapp/workflows/PR%20validation/badge.svg)

## Requirements

- [`Node.js`](https://nodejs.org/)
- [`NPM`](https://nodejs.org/)
- [`Git`](https://git-scm.com/)

### Client Environment variables

these are required and used by a `src/set-env.ts`, variables should be stored in `.env` file in the project root

```
SOUNDCLOUD_CLIENT_ID=soundcloud_client_id
FIREBASE_API_KEY=firebase_api_key
FIREBASE_AUTH_DOMAIN=firebase_auth_domain
FIREBASE_DATABASE_URL=firebase_database_url
FIREBASE_PROJECT_ID=firebase_project_id
FIREBASE_STORAGE_BUCKET=firebase_storeage_bucket
FIREBASE_MESSAGING_SENDER_ID=firebase_messaging_sender_id
FIREBASE_APP_ID=firebase_application_id
GOOGLE_APIS_BROWSER_KEY=google_apis_browser_key
GOOGLE_APIS_CLIENT_ID=google_apis_client_id
```

TODO `PRIVILIGED_ACCESS_FIREBASE_UID` is admin user account id, leave it empty for now;

alternatively a script `bash/set-env.sh` can guide you through the process of setting environment variables, use it like

```
bash shell/set-env.sh
```

or

```
npm run set-env
```

#### How to get client environment variables

##### Soundcloud credentials (requires Soundcloud account)

TODO

##### Firebase credentials (requires Google account)

Variables list: `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_DATABASE_URL`, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID`

1. go to [firebase console](https://console.firebase.google.com);
2. add a project;
3. on the project dashboard page hit `Add Firebase to your webapp`, and copy required credentials;

##### Google Apis browser key, client id (requires Google account)

Variables list: `GOOGLE_APIS_BROWSER_KEY`, `GOOGLE_APIS_CLIENT_ID`

1. create credentials via [google developers console](https://console.developers.google.com/apis/credentials), choose `API keys` when selecting credentials type;
2. use `Browser key` as a value for `GOOGLE_APIS_BROWSER_KEY` environment variable;
3. create creadentials via [google developers console](https://console.developers.google.com/apis/credentials), choose `OAuth client ID` when selecting credentials type, use `Client ID` as a value for `GOOGLE_APIS_CLIENT_ID` environment variable.

### Installation and Start

the following command installs required local dependencies, clears build, sets file watchers, and starts a server

```
npm start
```

### Firebase deploment (hosting + cloud functions)

#### Server Environment variables

requires manual `.env` file creation in the directory `./functions/` with the following contents

```
MAILER_HOST=smtp.gmail.com
MAILER_PORT=465
MAILER_EMAIL=sender_email_address@gmail.com
MAILER_CLIENT_ID=mailer_client_id.apps.googleusercontent.com
MAILER_CLIENT_SECRET=mailer_client_secret
MAILER_REFRESH_TOKEN=mailer_refresh_token
MAILER_RECIPIENT_EMAIL_CONTACT=recipient_email_address@any_domain.tld
MAILER_RECIPIENT_EMAIL_DEMO=recipient_email_address@any_domain.tld
MAILER_RECIPIENT_EMAIL_BOOKING=recipient_email_address@any_domain.tld
MAILER_RECIPIENT_EMAIL_MASTERING=recipient_email_address@any_domain.tld
```

To use Gmail you may need to configure [Allow Less Secure Apps](https://www.google.com/settings/security/lesssecureapps) in your Gmail account unless you are using 2FA in which case you would have to create an [Application Specific password](https://security.google.com/settings/security/apppasswords). You may also need to unlock your account with [Allow access to your Google account](https://accounts.google.com/DisplayUnlockCaptcha) to use SMTP.

##### How to get server environment variables

1. use a gmail address as a value for variable `MAILER_EMAIL`;
2. `creation of creadentials is optional if you already did it earlier`: being authenticated under gmail address from `step 1` create creadentials via [google developers console](https://console.developers.google.com/apis/credentials), choose `OAuth client ID` when selecting credentials type, use `Client ID` as a value for `MAILER_CLIENT_ID` environment variable;
3. use `Client Secret` value from created creadentials as a `MAILER_CLIENT_SECRET` variable value;
4. to get `MAILER_REFRESH_TOKEN` value do the following:

- go to [googleoauth 2.0 playground](https://developers.google.com/oauthplayground);
- hit cog `settings` button to the right;
- check `Use your own credentials`, and fill in `OAuth Client ID`, and `OAuth Client secret`, which were obtained in the previous steps;
- `Step 1: Select & authorize APIs`: scroll down to `Gmail API v1`, expand it, select `https://mail.google.com`;
- `Step 2: Exchange authorization code for tokens`: hit `Exchange authorization code for tokens`, and use `Refresh token` value as a `MAILER_REFRESH_TOKEN`;
- that's all, assign `MAILER_ACCESS_TOKEN` value `empty` like `MAILER_ACCESS_TOKEN=empty`.

##### Bassdrive proxy demo

Run it like `node functions/bassdrive-proxy-demo/bassdrive-proxy.js`, it will start on `http://localhost:8080`. Player demo: `http://localhost:8080/index.html`.

#### Deploy

deploy the whole project

```
firebase deploy
```

only hosting

```
firebase deploy --only hosting
```

only functions

```
firebase deploy --only functions
```

## Documentation

- [`Firebase: Web Setup`](https://firebase.google.com/docs/web/setup)
- [`Firebase: Administrative Commands`](https://firebase.google.com/docs/cli/#administrative_commands)
- [`Azure DevOps Services: JavaScript and Node.js`](https://docs.microsoft.com/en-us/azure/devops/pipelines/languages/javascript?view=vsts&tabs=yaml)

## Some package scripts overview

```
build - build everything
build-prod - build production app
build-prod-firebase - build production app for firebase
express-prod - start node server in production mode
install-firebase - install firebase dependencies
install-global - install global dependencies
install-local - install local dependencies
install-project - install project dependencies
lint - lint codebase
ng-build - build default project
ng-build-prod - build default production project
ng-build-prod-firebase - build default production project for firebase
reset-client-app-env - reset client application environment
set-client-app-env - set client application environment
set-env - set environment variables
prestart - prestart hook
start": "node server.js & ng serve",
test - execute tests in continuous mode
test-single-run - single tests execution
test-single-run-and-report - single tests execution, and report generation
test-single-run-and-report-to-dist - single tests execution, and report generation to dist
```

## Licenses

- [`Kosmosmusic`](LICENSE)
