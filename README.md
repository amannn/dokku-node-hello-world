# dokku-node-hello-world

> An instruction on how to deploy a node app to a server that is running [dokku](https://dokku.com/).

## Setup

### App

1. Ensure the app meets these requirements:
   1. The app accepts `process.env.PORT`
   2. If the app has a build step, specify it in a [`postinstall` hook in `package.json`](https://github.com/amannn/dokku-node-hello-world/blob/477acd005b712b7bb48a0157f055765114ce9014/package.json#L9).
   3. If the app has private dependencies, specify them using the syntax `"dependency-name": "git+ssh://git@bitbucket.org:organization/repository.git#tag"`.
   4. The default node buildpack will specify `NODE_ENV=production` by default. If you need a different environment for a specific task (e.g. `npm run test`), specify it explicitly in the respective npm script (e.g. `NODE_ENV=test npm run test`).
2. `git remote add dokku dokku@dokku-host:node-app`

This repository contains an app that meets these requirements (but has no private dependencies).

### Dokku host

First [install dokku](https://dokku.com/docs/getting-started/installation/).

Then:

```sh
# Create the app
dokku apps:create node-app

# Set up a port mapping
dokku config:set node-app DOKKU_PROXY_PORT_MAP=http:80:5000

# Enable installing dev dependencies
dokku config:set node-app NPM_CONFIG_PRODUCTION=false
```

#### Private dependencies

If the app has private dependencies e.g. from Bitbucket, setup ssh keys:

1. Install [dokku-deployment-keys](https://github.com/cedricziel/dokku-deployment-keys). If the generated public key isn't printed, look it up under `/home/dokku/.deployment-keys/shared/.ssh/id_rsa.pub`.
2. Add the public key to a Bitbucket user that has access to the used repositories (usually a dedicated build user).
2. Install [dokku-hostkeys](https://github.com/cedricziel/dokku-hostkeys-plugin) and run `dokku hostkeys:shared:autoadd bitbucket.org`.
3. Login as the `dokku` user and verify the app can be cloned and its dependencies installed. If there are issues, [generate an ssh key manually](https://confluence.atlassian.com/bitbucket/set-up-an-ssh-key-728138079.html#SetupanSSHkey-ssh2) and try again. After this, copy the key pair to `.deployment-keys/shared/.ssh/` and the `known_hosts` file to `.hostkeys/shared/.ssh/`.

## Deploy

After the app and the host is set up, you can deploy with `git push dokku master` from the app directory on your local machine.

## Environment parameters

Parameters that are secret or affect Dokku behaviour should be applied via `dokku config:set node-app ENV_PARAM_1=false`. These parameters are shared for all commands that are executed during the deploy (e.g. `npm run build` and `npm run start`).

Other env parameters should be applied in npm scripts so they are decoupled from the hosting (e.g. `NODE_ENV=production npm start`).

## Adding a domain

1. `dokku domains:add node-app www.domain.tld`
2. Add an `A` record that points to the public IP of the server.

## SSL certificate

1. Make sure the app has a domain.
2. Install [dokku-letsencrypt](https://github.com/dokku/dokku-letsencrypt).
3. `dokku letsencrypt node-app`
4. `dokku letsencrypt:cron-job --add` so the certificate is renewed automatically.

## Continuous deployment from Bitbucket

1. Enable pipelines.
2. Generate an SSH key for the pipelines script and [add it to dokku](http://dokku.viewdocs.io/dokku/deployment/user-management/#adding-ssh-keys).
3. Add the dokku host as a known host in pipelines.
4. If you're using private dependencies, also add bitbucket.org as a known host.
5. Define the environment variable `DOKKU_REMOTE_URL`.
6. Use the [`bitbucket-pipelines.yml`](./bitbucket-pipelines.yml) file from this repo.

## Resources

 - [Deploying a Node.js Application on Digital Ocean Using dokku](http://jakeklassen.com/post/deploying-a-node-app-on-digital-ocean-using-dokku/)
 - [Deploy nuxt to Dokku](https://nuxtjs.org/faq/dokku-deployment/)
