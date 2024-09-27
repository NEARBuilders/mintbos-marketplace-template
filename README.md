# MintBOS Marketplace

Decentralized front ends meets NFT infrastructure on NEAR. Clone & customize this whitelabel marketplace template.

Read the full [documentation](https://mintbase.genadrop.xyz/docs).

[![Demo](https://img.shields.io/badge/Demo-Visit%20Demo-brightgreen)](TODO)
[![Deploy](https://img.shields.io/badge/Deploy-on%20Vercel-blue)](TODO)

**Tooling:**

[![Use Case](https://img.shields.io/badge/Use%20Case-Marketplace-blue)](#)
[![Framework](https://img.shields.io/badge/Framework-Near%20BOS-blue)](https://docs.near.org/build/near-components/what-is)

**Author:**

[![Author](https://img.shields.io/twitter/follow/genadrop?style=social&logo=twitter)](https://twitter.com/genadrop) [![Organization](https://img.shields.io/badge/MintBOS-blue)](https://www.mintbase.genadrop.xyz)

## Setup

Install dependencies

```cmd
pnpm install
```

and run the project

```cmd
pnpm run dev
```

## Project Walkthrough

This guide will take you step by step through the process of creating a basic marketplace where you can purchase tokens and filter your selection by price. It uses `getStoreNFTs` and `buyTokens` from [mintbos-sdk](https://near.social/bos.genadrop.near/widget/Mintbase.App.Index?page=resources&tab=sdk_guide) for retrieving data and executing marketplace methods.

The mintbos-sdk provides convenient functions for retrieving data from Mintbase indexer. In this example, you will be able to view and purchase NFTs from a specific store.

You can find more information on Github: [GitHub link](https://github.com/NEARBuilders/mintbos-marketplace-template)

A live demo of the marketplace can be found here: [Live demo link](TODO)

## Step 1: Connect Wallet

Before proceeding, it is important to have a wallet connection feature implemented in your application in order to interact with the contract. To do this, ensure you are accessing the Wallet custom element provided through the gateway.

```jsx
// widget/Index

const Header = () => (
  <div className="header">
    <div className="nav">
        // ... navbar
        <NavItem>
          {context.accountId ? (
            <ProfileIcon />
          ) : (
            <div style={{ width: 100 }} class="login-container">
              <Wallet
                provides={({ signIn, signOut }) => {
                  return (
                    <button
                      onClick={signIn}
                      type="button"
                      class="login-button button"
                    >
                      Login
                    </button>
                  );
                }}
              />
            </div>
          )}
        </NavItem>
      </div>
    </div>
  </div>
);
```

## Step 2: Get NFTs from Store

In this example, we utilized the getStoreNFTs method to retrieve NFTs and store this data in state via useState. This method returns all listed NFTs from the specified contract, allowing you to display them in the user interface.

```jsx
// widget/page/home
const { getStoreNFTs } = VM.require(
  "bos.genadrop.near/widget/Mintbase.utils.sdk"
) || { getStoreNFTs: () => new Promise((resolve) => resolve([])) };

const perPage = 52;
const [nftData, setNftData] = useState([]);
const [loading, setLoading] = useState(true);
const [countNFTs, setCountNFTs] = useState(0);
const [pageNumber, setPageNumber] = useState(1);

getStoreNFTs &&
  getStoreNFTs({
    offset: (pageNumber - 1) * perPage,
    id: storeId ?? "nft.genadrop.near",
    limit: perPage,
    listedFilter: true,
    accountId: context?.accountId || "jgodwill.near",
  })
    .then(({ results, totalRecords, errors }) => {
      if (errors) {
        console.error(errors);
      }
      setCountNFTs(totalRecords);
      setLoading(false);
      setNftData(results);
    })
    .catch((error) => {
      console.error(error);
    });
```

## Step 3: Get Store Data

To control the tabs, we need to retrieve store data using the getCombinedStoreData method. This method returns the data from the specified contract, enabling you to display it in the user interface.

```jsx
// bos.genadrop.near/widget/Mintbase.utils.get_combined_store_data.jsx
const { getCombinedStoreData } = VM.require(
  "bos.genadrop.near/widget/Mintbase.utils.sdk"
) || {
  getCombinedStoreData: () => {},
};

const [storeData, setStoreData] = useState(null);

useEffect(() => {
  accountId &&
    getCombinedStoreData({ id: accountId, limit, offset })
      .then(({ data, errors }) => {
        if (errors) {
          console.error(errors);
        }
        setStoreData(data);
      })
      .catch((error) => {
        console.error(error);
      });
}, [accountId]);
```

## Step 6: Execute the Contract Call - Buy

The execute method accepts one or more contract call objects and executes them using a specified wallet instance. In this example, we need to use the execute method to execute the "buy" call, allowing the user to purchase the desired NFT.

```jsx
// widget/page/product
const { buyTokens } = VM.require(
  "bos.genadrop.near/widget/Mintbase.NFT.modules"
) || { buyTokens: () => {} };

const { data } = props;

const firstListing = data?.listings[0];

const handleBuy = () => {
  if (!context.accountId) return;
  buyTokens({
    contractId: data?.nft_contract_id,
    tokenId: data?.token_id,
    price: data?.listings[0]?.price,
    mainnet: context?.networkId === "mainnet",
    ftAddress: firstListing?.currency,
  });
};
```

alternatively, for multiple NFTs in the cart, we map through the items from the local storage `cart` and pass them into the `buyTokens` method that executes thesame "buy" call as above

```jsx
//widget/page/cart
const { getCart } = VM.require("example.near/widget/lib.cart") || {
  getCart: () => {},
};

const cart = getCart();
const newData = Object.values(cart).map((data) => {
  const firstListing = data?.listings[0];
  return {
    contractId: data?.nft_contract_id,
    tokenId: data?.token_id,
    price: data?.listings[0]?.price,
    mainnet: context?.networkId === "mainnet",
    ftAddress: firstListing?.currency,
  };
});

const handleBuy = () => {
  const data = newData;

  if (!context.accountId) return;
  buyTokens(data);
};
```

## Step 7: Customize the Gateway

This repository optionally includes a custom gateway for full control of the environment the Widgets run in.

Reasons for customization may include:

1. Supporting more or different versions of wallets
2. Introducing external APIs through custom elements (e.g. `Wallet`, `Link`, or `StripePayment`)
3. Query parameter pre-processing, router configurations, etc.

Follow the [Customizing the Gateway](https://github.com/NEARBuilders/bos-workspace?tab=readme-ov-file#customizing-the-gateway) guide for how to customize.

Once done, remember to [Publish the build to NEARFS](./gateway-bundle/README.md#publishing-to-nearfs), and then this bundleUrl can be configured in `bos.config.json`.

## Step 8: Deploy to Web4

Rather than deploying to a hosting provider like Vercel, this repository comes equipped with the scripts necessary to deploy to [Web4](https://github.com/vgrichina/web4), for fully decentralized web hosting. For full documentation, refer to [web4-deploy](https://github.com/vgrichina/web4-deploy).

1. Build the distribution bundle, `pnpm run build`. This will populate metadata via the index widget's metadata json, and use details from bos.config.json to consturct the `index.html`.
2. Be sure to have deployed a web4 smart contract, such as the [web4-min-contract](https://github.com/vgrichina/web4-min-contract) to web4.YOUR_ACCOUNT.near
3. Configure with the web4 account and run `pnpm run web4:deploy`

This final command will upload the `/dist` to [NEARFS](https://github.com/vgrichina/nearfs) and then call `web4_setStaticUrl` on your web4 contract to point to this uploaded bundle.

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
