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

1. Build the distribution bundle, `pnpm run build`
2. Be sure to have deployed a web4 smart contract, such as the [web4-min-contract](https://github.com/vgrichina/web4-min-contract) to web4.YOUR_ACCOUNT.near. If deploying for the first time, you can replace the next step with `NEAR_ENV=testnet npx elliotBraem/web4-deploy#fix/update-min-contract ./dist web4.[YOUR_ACCOUNT].testnet --deploy-contract --nearfs`
3. Configure with the web4 account and run `pnpm run web4:deploy`

This final command will upload the `/dist` to [NEARFS](https://github.com/vgrichina/nearfs) and then call `web4_setStaticUrl` on your web4 contract to point to this uploaded bundle.

## Development

1. Configure [bos.config.json](../bos.config.json) `gateway.bundleUrl` to be a relative path to this custom gateway's dist, e.g. `./gateway-bundle/dist`
2. Make sure you have the dev command running for this, `pnpm run dev:gateway` from root, or `pnpm run dev` from here.
3. Once there has been as successful build, this prepares the `main.bundle.js` needed 