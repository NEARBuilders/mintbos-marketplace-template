<!-- markdownlint-disable MD014 -->
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD041 -->
<!-- markdownlint-disable MD029 -->

<div align="center">

  <h1>near bos web component</h1>

  <p>
    <strong>Easily embed a <a href="https://near.social" target="_blank">near social widget</a> into any web app and deploy to <a href="https://web4.near.page/" target="_blank">web4</a>.</strong>
  </p>

</div>

`near-social-viewer` is a [web component (custom element)](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) that implements the [near-social-vm](https://github.com/NearSocial/VM) for rendering code stored on-chain in the [SocialDB](https://github.com/NearSocial/social-db) smart contract (social.near). It is the simplest way to create your own [near social viewer](https://github.com/NearSocial/viewer) and it is the easiest method for embedding [Widgets](https://thewiki.near.page/near.social_widgets) into any web application.

<details>
  <summary>Table of Contents</summary>

- [Usage](#usage)
- [Attributes](#attributes)
- [Configuration Options](#configuration-options)
- [Local Widget Development](#local-widget-development)
  - [Proxy RPC](#proxy-rpc)
  - [Redirect Map](#redirect-map)
  - [Hot Reload](#hot-reload)
- [Setup & Local Development](#setup--local-development)
  - [Installing Dependencies](#installing-dependencies)
  - [Running the App](#running-the-app)
  - [Building for Production](#building-for-production)
  - [Running Tests](#running-tests)
- [Adding VM Custom Elements](#adding-vm-custom-elements)
- [Configuring Ethers](#configuring-ethers)
- [Landing Page for SEO Friendly URLs](#landing-page-for-seo-friendly-urls)
- [Publishing to NEARFS](#publishing-to-nearfs)
- [Contributing](#contributing)

</details>

## Usage

<details open>
  <summary>Via CDN</summary>

Include the following script tags in your HTML:

```html
<script src="https://cdn.jsdelivr.net/npm/near-bos-webcomponent@latest/dist/runtime.REPLACE_WITH_BUNDLE_HASH.bundle.js"></script>
<script src="https://cdn.jsdelivr.net/npm/near-bos-webcomponent@latest/dist/main.REPLACE_WITH_BUNDLE_HASH.bundle.js"></script>
```

Be sure to replace `REPLACE_WITH_BUNDLE_HASH` with the respective hash, which can be found via the asset-manifest:

<https://cdn.jsdelivr.net/npm/near-bos-webcomponent@latest/dist/asset-manifest.json>

</details>

<details>
  <summary>Via NEARFS web4 gateway</summary>

Include the following script tags in your HTML:

```html
<script src="https://ipfs.web4.near.page/ipfs/REPLACE_WITH_NEARFS_CID/runtime.REPLACE_WITH_BUNDLE_HASH.bundle.js"></script>
<script src="https://ipfs.web4.near.page/ipfs/REPLACE_WITH_NEARFS_CID/main.REPLACE_WITH_BUNDLE_HASH.bundle.js"></script>
```

Be sure to replace `REPLACE_WITH_NEARFS_CID` with the cid you get from [publishing to nearfs](#publishing-to-nearfs) and replace `REPLACE_WITH_BUNDLE_HASH` with the respective hash, which can be found via the asset-manifest:

<https://ipfs.web4.near.page/ipfs/REPLACE_WITH_NEARFS_CID/asset-manifest.json>

</details>

<br />

Once included, you can use the web component in your HTML:

```html
<near-social-viewer src="mob.near/widget/N" initialprops='{"hashtag": "build"}' />
```

## Attributes

The web component supports several attributes:

- `src`: the src of the widget to render (e.g. `devs.near/widget/default`)
- `code`: raw, valid, stringified widget code to render (e.g. `"return <p>hello world</p>"`)
- `initialprops`: initial properties to be passed to the rendered widget
- `rpc`: rpc url to use for requests within the VM
- `network`: network to connect to for rpc requests & wallet connection
- `config`: options to modify the underlying VM or usage with devtools, see available [configurations](#configuration-options)

## Configuration Options

To support specific features of the VM or an accompanying development server, provide a configuration following this structure:

```jsonc
{
  "dev": { 
    // Configuration options dedicated to the development server
    "hotreload": { 
      "enabled": boolean, // Determines if hot reload is enabled (e.g., true)
      "wss": string // WebSocket server URL to connect to. Optional. Defaults to `ws://${window.location.host}` (e.g., "ws://localhost:3001")
    }
  },
  // Configuration options for the VM
  "vm": {
    "features": {
      "enableComponentSrcDataKey": boolean, // adds the "data-component" attribute specifying the rendered component's "src"
    }
  }
}
```

## Local Widget Development

There are several strategies for accessing local widget code during development.

### Proxy RPC

The recommended, least invasive strategy is to provide a custom RPC url that proxies requests for widget code. Widget code is stored in the [socialdb](https://github.com/NearSocial/social-db), and so it involves an RPC request to get the stringified code. We can proxy this request to use local data instead.

Either build a custom proxy server, or use [bos-workspace](https://github.com/nearbuilders/bos-workspace) which provides a proxy by default and will automatically inject it to the `rpc` attribute if you provide the path to your web component's dist, or a link to it stored on [NEARFS](https://github.com/vgrichina/nearfs). See more in [Customizing the Gateway](https://github.com/NEARBuilders/bos-workspace?tab=readme-ov-file#customizing-the-gateway).

### Redirect Map

The NEAR Social VM supports a feature called `redirectMap` which allows you to load widgets from other sources than the on-chain social db. An example redirect map can look like this:

```json
{ "devhub.near/widget/devhub.page.feed": { "code": "return 'hello';" } }
```

The result of applying this redirect map is that the widget `devhub.near/widget/devhub.page.feed` will be replaced by a string that says `hello`.

The `near-social-viewer` web component supports loading a redirect map from the session storage, which is useful when using the viewer for local development or test pipelines.

By setting the session storage key `nearSocialVMredirectMap` to the JSON value of the redirect map, the web component will pass this to the VM Widget config.

Another option is to use the same mechanism as [near-discovery](https://github.com/near/near-discovery/), where you can load components from a locally hosted [bos-loader](https://github.com/near/bos-loader) by adding the key `flags` to localStorage with the value `{"bosLoaderUrl": "http://127.0.0.1:3030" }`. There also exists an input at [dev.near.org/flags](https://dev.near.org/flags) to input this url.

### Hot Reload

The above strategies require changes to be reflected either on page reload, or from a fresh rpc request. For faster updates, there is an option in `config` to enable hot reload via dev.hotreload (see [configurations](#configuration-options)). This will try to connect to a web socket server on the same port, or via the provided url, to use redirectMap with most recent data.

This feature works best when accompanied with [bos-workspace](https://github.com/nearbuilders/bos-workspace), which will automatically inject a config to the attribute if you provide the path to your web component's dist, or a link to it stored on [NEARFS](https://github.com/vgrichina/nearfs). See more in [Customizing the Gateway](https://github.com/NEARBuilders/bos-workspace?tab=readme-ov-file#customizing-the-gateway). It can be disabled with the `--no-hot` flag.

## Setup & Local Development

### Installing dependencies

```bash
yarn install
```

### Running the app

First, run the development server:

```bash
yarn run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Building for production

```bash
yarn run prod
```

### Running tests

```bash
npm run test
```

See the full [testing guide](./playwright-tests/README.md).

## Adding VM Custom Elements

Since [NearSocial/VM v2.1.0](https://github.com/NearSocial/VM/blob/master/CHANGELOG.md#210), a gateway can register custom elements where the key is the name of the element, and the value is a function that returns a React component. For example:

```javascript
initNear({
  customElements: {
    Link: (props) => {
      if (!props.to && props.href) {
        props.to = props.href;
        delete props.href;
      }
      if (props.to) {
        props.to = sanitizeUrl(props.to);
      }
      return <Link {...props} />;
    },
  },
});
```

This is a helpful feature for exposing packages and component libraries that otherwise cannot be accessed through an iframe in typical Widget development. It enables developers to provide a sandbox for builders wanting to build with these elements without going through all the setup.

To distribute a specialized near-bos-webcomponent with its own custom elements:

1. Use the [template](https://github.com/new?template_name=near-bos-webcomponent&template_owner=NEARBuilders) to create a new web component
2. Install the necessary packages and add the custom VM element to `initNear` function
3. Build and distribute the resulting `/dist`

Then, the path to this dist can be referenced via the `-g` flag with [bos-workspace](https://github.com/nearbuilders/bos-workspace).

```cmd
bos-workspace dev -g ./path/to/dist
```

This will start a local dev server using the custom gateway, so you may develop your local widgets through it with access to the custom element.

## Configuring Ethers

Since [NearSocial/VM v1.3.0](https://github.com/NearSocial/VM/blob/master/CHANGELOG.md#130), the VM has exposed Ethers and ethers in the global scope, as well as a Web3Connect custom element for bringing up wallet connect.

There already exists support for most common EVM chains, but to add a new chain to your web3 provider, find your chain on [ChainList](https://chainlist.org/) and then add the necessary details to the [chains.json](./src/utils/web4/chains.json). Be sure to include a testnet configuration as well. This will enable you to connect to the specified chain when using `<Web3Connect />` within a widget running inside your custom web component.

You can configure the projectId and appMetadata in [utils/web4/ethers.js](./src/utils/web3/ethers.js) as well.

For more information on how to utilize [Ethers.js](https://docs.ethers.org/v6/) in your widgets, see [NEAR for Ethereum developers](https://docs.near.org/tutorials/near-components/ethers-js). To see a list of existing EVM components built by the community, see [here](https://near.social/hackerhouse.near/widget/EVMComponents).

## Landing page for SEO friendly URLs

Normally, the URL path decides which component to be loaded. The path `/devhub.near/widget/app` will load the `app` component from the `devhub.near` account. DevHub is an example of a collection of many components that are part of a big app, and the `app` component is just a proxy to components that represent a `page`. Which page to display is controlled by the `page` query string parameter, which translates to `props.page` in the component.

In order to create a SEO friendly URL for such a page, we would like to represent a path like `/devhub.near/widget/app?page=community&handle=webassemblymusic` to be as easy as `/community/webassemblymusic`. And we do not want the viewer to look for a component named according to the path.

We can obtain this by setting the `src` attribute pointing to the component we want to use, and also set the `initialProps` attribute to the values taken from the URL path.

An example of this can be found in [router.spec.js](./playwright-tests/tests/router.spec.js).

```javascript
test("for supporting SEO friendly URLs, it should be possible to set initialProps and src widget from any path", async ({
  page,
}) => {
  await page.goto("/community/webassemblymusic");
  await page.evaluate(() => {
    const viewerElement = document.querySelector("near-social-viewer");
    viewerElement.setAttribute("src", "devhub.near/widget/app");
    const pathparts = location.pathname.split("/");
    viewerElement.setAttribute(
      "initialProps",
      JSON.stringify({ page: pathparts[1], handle: pathparts[2] })
    );
  });
  await expect(
    await page.getByText("WebAssembly Music", { exact: true })
  ).toBeVisible();
});
```

Here you can see that the viewer element `src` attribute is set to use the `devhub.near/widget/app` component, and the `initialProps` set to values from the path.

## Publishing to NEARFS

For testing how the library would work when used from CDN, you may publish it to NEARFS.

To publish, use the helper script to create and upload an [IPFS CAR](https://car.ipfs.io/), deployed to nearfs with a signature from your NEAR account.

```bash
yarn prepare:release <signer account> <signer key> <network>
```

This script will output the CID to terminal, as well as automatically save it under nearfs.cid in package.json.

**Parameters:**

- `signer account`: NEAR account to use for signing IPFS URL update transaction, see [web4-deploy](https://github.com/vgrichina/web4-deploy?tab=readme-ov-file#deploy-fully-on-chain-to-nearfs)
- `signer key`:  NEAR account private key to use for signing. Should have base58-encoded key starting with `ed25519:`. Will attempt to sign from keychain (~/.near-credentials/) if not provided.
- `network`: NEAR network to use. Defaults to mainnet.

This is an example of the NEARFS url, and you should replace with the cid you received above:

<https://ipfs.web4.near.page/ipfs/bafybeiftqwg2qdfhjwuxt5cjvvsxflp6ghhwgz5db3i4tqipocvyzhn2bq/>

After uploading, it normally takes some minutes before the files are visible on NEARFS. When going to the expected URL based on the IPFS address we saw above, we will first see the message `Not found`.

# Marketplace

<img src="https://i.imgur.com/FjcUss9.png" alt="cover_image" width="0" />

Unlock Your NFT Storefront: Clone & Customize Your Path to Blockchain Success with this whitelabel marketplace template!

[![Demo](https://img.shields.io/badge/Demo-Visit%20Demo-brightgreen)](https://marketplace-template.mintbase.xyz/)
[![Deploy](https://img.shields.io/badge/Deploy-on%20Vercel-blue)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMintbase%2Ftemplates%2Ftree%2Fmain%2Fmarketplace)

**Tooling:**

[![Use Case](https://img.shields.io/badge/Use%20Case-Marketplace-blue)](#)
[![Tools](https://img.shields.io/badge/Tools-@mintbase.js/sdk%2C@mintbase.js/react%2C@mintbase.js/data%2CArweave%2CMintbase%20Wallet-blue)](#)
[![Framework](https://img.shields.io/badge/Framework-NearBOS-blue)](#)

**Author:**

[![Author](https://img.shields.io/twitter/follow/mintbase?style=social&logo=twitter)](https://twitter.com/mintbase) [![Organization](https://img.shields.io/badge/MintBOS-blue)](https://www.mintbase.genadrop.xyz)

## Project Walkthrough

### Setup

install dependencies
```
yarn
```
and
run the project
```
yarn dev:apps
```


This guide will take you step by step through the process of creating a basic marketplace where you can purchase tokens and filter your selection by price. It uses `getStoreNFTs`  and `buyTokens` from [mintbos sdk](https://near.social/bos.genadrop.near/widget/Mintbase.App.Index?page=resources&tab=sdk_guide) for retrieving data and executing marketplace methods.

The mintbase-sdk provides convenient functions for retrieving data from mintbasee indexer. In this example, you will be able to view and purchase NFTs from a specific store.

You can find more information on Github: [GitHub link](https://github.com/Mintbase/mintbase-js/tree/beta/packages/data)

A live demo of the marketplace can be found here: [Live demo link](https://marketplace-template.mintbase.xyz/)

## Step 1: Connect Wallet

Before proceeding, it is important to have a wallet connection feature implemented in your application in order to interact with the contract. To do this, you can check our guide [Wallet Connection Guide](https://docs.mintbase.xyz/dev/getting-started/add-wallet-connection-to-your-react-app).

## Step 2: Get NFTs from Store

In this example, we utilized useState to manage the loading state when retrieving NFTs from the contract via the storeNfts method. This method returns all listed NFTs from the specified contract, allowing you to display them in the user interface.

```jsx
// bos.genadrop.near/widget/Mintbase.utils.get_store_nfts.jsx
const  { getStoreNFTs }  =  VM.require(
"${alias_GENADROP}/widget/Mintbase.utils.sdk"
) ||  {  getStoreNFTs:  ()  =>  new  Promise((resolve)  =>  resolve([]))  };

const perPage =  52;
const  [nftData, setNftData]  =  useState([]);
const  [loading, setLoading]  =  useState(true);
const  [countNFTs, setCountNFTs]  =  useState(0);
const  [pageNumber, setPageNumber]  =  useState(1);

getStoreNFTs &&
getStoreNFTs({
offset:  (pageNumber -  1)  * perPage,
id: storeId ??  "nft.genadrop.near",
limit: perPage,
listedFilter:  true,
accountId: context?.accountId  ||  "jgodwill.near",
})
.then(({ results, totalRecords, errors })  =>  {
if  (errors)  {
console.error(errors);
}
setCountNFTs(totalRecords);
setLoading(false);
setNftData(results);
})
.catch((error)  =>  {
console.error(error);
});
```

## Step 3: Get Store Data

To control the tabs, we need to retrieve store data using the storeData method. This method returns the data from the specified contract, enabling you to display it in the user interface.

```ts
// src/hooks/useStoreData.ts
import { useQuery } from 'react-query';
import { storeData } from '@mintbase-js/data';

const useStoreData = () => {
  const defaultStores = process.env.NEXT_PUBLIC_STORES || MAINNET_CONFIG.stores;
  const formattedStores = defaultStores.split(/[ ,]+/);

  const { isLoading, error, data } = useQuery('storeData', () => storeData(formattedStores), {
    retry: false,
    refetchOnWindowFocus: false,
    select: mapStoreData,
  });

  return { ...data, error, loading: isLoading };
};

export { useStoreData };

```
## Step 4: Get Metadata from an NFT

To display NFT pricing information, available quantities, and other details in the user interface, it is necessary to access the NFT metadata using the metadataByMetadataId method.

```ts
// src/hooks/useMetadataByMetadataId.ts
import { useQuery } from 'react-query';
import { metadataByMetadataId } from '@mintbase-js/data';

const useMetadataByMetadataId = ({ metadataId }) => {
  const { isLoading, data: metadata } = useQuery('metadataByMetadataId', () => metadataByMetadataId(metadataId), {
    retry: false,
    refetchOnWindowFocus: false,
    select: mapMetadata,
  });

  return { ...metadata, isTokenListLoading: isLoading };
};

export { useMetadataByMetadataId };
```

## Step 5: Get Current NEAR Price

To obtain the current price of the NFT in USD, it is necessary to retrieve the current Near price. We accomplish this by using the nearPrice method.

```ts
// src/hooks/useNearPrice.ts
import { useEffect, useState } from 'react';
import { nearPrice } from '@mintbase-js/data';

const useNearPrice = () => {
  const [nearPriceData, setNearPriceData] = useState('0');

  useEffect(() => {
    const getNearPrice = async () => {
      const { data: priceData, error } = await nearPrice();
      setNearPriceData(error ? '0' : priceData);
    };

    getNearPrice();
  }, []);

  return nearPriceData;
};

export { useNearPrice };
``````

## Step 6: Execute the Contract Call - Buy

The execute method accepts one or more contract call objects and executes them using a specified wallet instance. In this example, we need to use the execute method to execute the "buy" call, allowing the user to purchase the desired NFT.

````ts
const singleBuy = async () => {
    const wallet = await selector.wallet();

    if (tokenId) {
      (await execute(
        { wallet, callbackArgs: callback },
        {
          ...buy({
            contractAddress: nftContractId,
            tokenId,
            affiliateAccount:
              process.env.NEXT_PUBLIC_AFFILIATE_ACCOUNT ||
              MAINNET_CONFIG.affiliate,
            marketId,
            price: nearToYocto(currentPrice?.toString()) || "0",
          }),
        }
      )) as FinalExecutionOutcome;
    }
  };
``````

## Set ENV variables

Once that's done, copy the `.env.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.example .env.local
```

if you use windows without powershell or cygwin:

```bash
copy .env.example .env.local
```

To get your `api key` visit :

[Mintbase Developers Page for Mainnet](https://www.mintbase.xyz/developer):
[Mintbase Developers Page for testnet](https://testnet.mintbase.xyz/developer):

```
NEXT_PUBLIC_DEVELOPER_KEY=your_mintbase_api_key
```

`NEXT_PUBLIC_NETWORK` could be `testnet` or `mainnet`

```
NEXT_PUBLIC_NETWORK=testnet
```

`NEXT_PUBLIC_STORES` is your store's ids

```
NEXT_PUBLIC_STORES=latium.mintspace2.testnet,mufasa.mintspace2.testnet
```

`NEXT_PUBLIC_AFFILIATE_ACCOUNT` is your near account where your should get your market fee

```
NEXT_PUBLIC_AFFILIATE_ACCOUNT=your_near_account.near
```

## Get in touch

- Support: [Join the Telegram](https://tg.me/mintdev)
- Twitter: [@mintbase](https://twitter.com/mintbase)

<img src="https://i.imgur.com/DPWBh8C.png" alt="detail_image" width="0" />

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you're interested in contributing to this project, please read the [contribution guide](./CONTRIBUTING).

<div align="right">
<a href="https://nearbuilders.org" target="_blank">
<img
  src="https://builders.mypinata.cloud/ipfs/QmWt1Nm47rypXFEamgeuadkvZendaUvAkcgJ3vtYf1rBFj"
  alt="Near Builders"
  height="40"
/>
</a>
</div>
