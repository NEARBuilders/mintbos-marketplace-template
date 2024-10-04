# Custom Gateway

This code represents a [near-bos-webcomponent](https://github.com/NEARBuilders/near-bos-webcomponent), which describes the version of the near-social-vm and its dependencies that is used to render the widgets.

The gateway `bundleUrl` is configured in the [bos.config.json](../bos.config.json). It can either be a relative path to a web component's distribution bundle (`./gateway-bundle/dist`), such as this one, or it can use an existing bundle deployed to a remote url.

## Setup & Local Development

### Installing dependencies

```bash
pnpm install
```

### Running the app

First, run the development server:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Building for production

```bash
pnpm run prod
```

## Customizing the Gateway

This repository optionally includes a custom gateway for full control of the environment the Widgets run in.

Reasons for customization may include:

1. Supporting more or different versions of wallets
2. Introducing external APIs through custom elements (e.g. `Wallet`, `Link`, or `StripePayment`)
3. Query parameter pre-processing, router configurations, etc.

Follow the [Customizing the Gateway](https://github.com/NEARBuilders/bos-workspace?tab=readme-ov-file#customizing-the-gateway) guide for how to customize.

Once done, remember to [Publish the build to NEARFS](./gateway-bundle/README.md#publishing-to-nearfs), and then this bundleUrl can be configured in `bos.config.json`.

## Publishing to NEARFS

To publish, use the helper script to create and upload an [IPFS CAR](https://car.ipfs.io/), deployed to nearfs with a signature from your NEAR account.

```bash
pnpm prepare:release <signer account> <signer key> <network>
```

This script will output the CID to terminal, as well as automatically save it under nearfs.cid in package.json.

**Parameters:**

- `signer account`: NEAR account to use for signing IPFS URL update transaction, see [web4-deploy](https://github.com/vgrichina/web4-deploy?tab=readme-ov-file#deploy-fully-on-chain-to-nearfs)
- `signer key`: NEAR account private key to use for signing. Should have base58-encoded key starting with `ed25519:`. Will attempt to sign from keychain (~/.near-credentials/) if not provided.
- `network`: NEAR network to use. Defaults to mainnet.

This is an example of the NEARFS url, and you should replace with the cid you received above:

<https://ipfs.web4.near.page/ipfs/bafybeiftqwg2qdfhjwuxt5cjvvsxflp6ghhwgz5db3i4tqipocvyzhn2bq/>

After uploading, it normally takes some minutes before the files are visible on NEARFS. When going to the expected URL based on the IPFS address we saw above, we will first see the message `Not found`.

## Deploy to Web4

Rather than deploying to a hosting provider like Vercel, this repository comes equipped with the scripts necessary to deploy to [Web4](https://github.com/vgrichina/web4), for fully decentralized web hosting. For full documentation, refer to [web4-deploy](https://github.com/vgrichina/web4-deploy).

**Prerequisite**: Have a web4 contract deployed. If you have not deployed one, create a [web4 near subaccount](https://docs.near.org/tools/near-cli#create) (web4.YOUR_ACCOUNT.near) before continuing.

1. Build the distribution bundle, `pnpm run build`
2. Use [web4-deploy](https://github.com/vgrichina/web4-deploy) to deploy a web4 smart contract:

If deploying for the first time, append `--deploy-contract` to automatically deploy a [minimum web4 contract](https://github.com/vgrichina/web4-min-contract).

```cmd
NEAR_ENV=testnet npx vgrichina/web4-deploy ./dist web4.[YOUR_ACCOUNT].testnet --nearfs
```

This will upload the build output (`./dist`) to [nearfs](https://github.com/vgrichina/nearfs) then set this will set the static url for web4_get to return.

Going forward, you can also configure and use the `web4:deploy` command with the correct network and web4 account and run `pnpm run web4:deploy`.

## Development

1. Configure [bos.config.json](../bos.config.json) `gateway.bundleUrl` to be a relative path to this custom gateway's dist, e.g. `./gateway-bundle/dist`
2. Make sure you have the dev command running for this, `pnpm run dev:gateway` from root, or `pnpm run dev` from this directory.
3. Once there has been as successful build, this prepares the `asset-manifest.json` needed to inject scripts into dev index.html.
4. Run the dev command in the root `pnpm run dev`. This will serve your widgets through the custom gateway.
5. Reload the page after making changes to the gateway-bundle.
