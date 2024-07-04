# Preview Deploys of Cloudflare Workers and Neon via GitHub Actions

This is a demo of preview environment deployments using GitHub Actions. For each Pull Request a new Cloudflare Worker environment is created with a unique URL as well as a Neon database branch to work with.

The Cloudflare Worker is an OpenAPI 3.1 demo using [itty-router-openapi](https://github.com/cloudflare/itty-router-openapi). To make things awkward Cloudflare renamed `itty-router-openapi` to `chanfana` but we started from the itty demo so we're sticking to it.

This is an example project made to be used as a quick start into building OpenAPI compliant Workers that generates the
`openapi.json` schema automatically from code and validates the incoming request to the defined parameters or request body.

## Get started

First get the project setup by running `npm install`

```shell
npm install
```

### Cloudflare

You'll need a [Cloudflare Workers](https://workers.dev) account.

Install the wrangler cli

```shell
npm i -g wrangler
```

Login to your Cloudflare account in wrangler

```shell
wrangler login
```

### Neon

You'll need a [Neon](https://neon.tech/) account.

Install the [neon cli](https://github.com/neondatabase/neonctl#readme)

```shell
npm i -g neonctl
```

Login to your Neon account in the neon cli

```shell
neon auth
```

### Database

For local development you need the `DATABASE_URL` environment variable, this can be created using the neon cli

```shell
export DATABASE_URL="`neonctl cs`"
echo "DATABASE_URL=$DATABASE_URL" >> .env
```

## Environments

Cloudflare Workers need the `.dev.vars` but we don't want to have multiple environment files so we run the following command to link that file to our `.env` file which is used by Prisma and everything else.

```shell
ln -s .env .dev.vars
```

## Project structure

1. Your main router is defined in `src/index.ts`.
2. Each endpoint has its own file in `src/endpoints/`.
3. For more information read the [itty-router-openapi official documentation](https://cloudflare.github.io/itty-router-openapi/).

## Development

1. Run `wrangler dev` to start a local instance of the API.
2. Open `http://localhost:9000/` in your browser to see the Swagger interface where you can try the endpoints.
3. Changes made in the `src/` folder will automatically trigger the server to reload, you only need to refresh the Swagger interface.

## Preview Deployments

1. Add your [Neon Project ID](https://console.neon.tech/app/projects/) to GitHub vars as `NEON_PROJECT_ID`
2. Add your [Neon API Key](https://console.neon.tech/app/settings/api-keys) to GitHub secrets as `NEON_API_KEY`
3. Add your [Cloudflare API Token](https://dash.cloudflare.com/profile/api-tokens) to GitHub secrets as `CLOUDFLARE_API_TOKEN`
4. Add your [Cloudflare Account ID](https://dash.cloudflare.com/) to GitHub secrets as `CLOUDFLARE_ACCOUNT_ID` for use in the `pr-cleanup.yml` workflow

As you create Pull Requests for your changes the [pr-preview.yml](./.github/workflows/pr-preview.yml) workflow file will automatically create a "Preview Worker". The default name for your work will be the github repository name `neon-cf-worker-prisma` and your preview deployment names will incorporate the Pull Request number into the end such that preview workers use names like: `neon-cf-worker-prisma-pr-2`.

## Deployments

When your PR is closed the Preview Deployment will automatically be deleted. Both the Neon Database Preview as well as the Cloudflare Worker Preview.

The [deploy.yml](./.github/workflows/deploy.yml) workflow is the final workflow to run, pushing the Preview Deployed Worker into the default production worker. This system does not use Worker versioning.
