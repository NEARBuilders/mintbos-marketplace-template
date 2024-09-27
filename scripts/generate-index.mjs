// Production build 

import { program } from "commander";
import fs from "fs/promises";
import path from "path";
import axios from "axios";

program
  .option("-n, --network <network>", "Specify the network", "mainnet")
  .option("-o, --output <output>", "Specify the output directory", "public")
  .parse(process.argv);

const options = program.opts();

const WEB4_IPFS_GATEWAY = {
  mainnet: "https://ipfs.web4.near.page/ipfs/",
  testnet: "https://ipfs.web4.testnet.page/ipfs/",
};

async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    process.exit(1);
  }
}

async function fetchManifest(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching manifest from: ${url}`);
    throw new Error("Failed to fetch manifest");
  }
}

async function getBundleUrls(bundleUrl, network, rootDir) {
  let manifestUrl;
  let baseUrl;

  if (
    path.isAbsolute(bundleUrl) ||
    bundleUrl.startsWith("./") ||
    bundleUrl.startsWith("../")
  ) {
    // Local path
    const packageJsonPath = path.join(rootDir, "gateway-bundle", "package.json");
    const packageJson = await readJsonFile(packageJsonPath);
    const cid = packageJson.nearfs?.cid;

    if (!cid) {
      throw new Error("CID not found in package.json");
    }

    baseUrl = `${WEB4_IPFS_GATEWAY[network]}${cid}`;
    manifestUrl = `${baseUrl}/asset-manifest.json`;
  } else {
    // Remote URL
    baseUrl = bundleUrl;
    manifestUrl = `${baseUrl}/asset-manifest.json`;
  }

  try {
    const manifest = await fetchManifest(manifestUrl);
    return manifest.entrypoints.map((entrypoint) => `${baseUrl}/${entrypoint}`);
  } catch (error) {
    console.error(`Error processing manifest: ${error}`);
    return [];
  }
}

async function generateIndexHtml() {
  const cwd = process.cwd();
  const bosConfigPath = path.join(cwd, "bos.config.json");
  const bosConfig = await readJsonFile(bosConfigPath);
  const [_, widget] = bosConfig.index.split("/widget/");
  const metadataPath = path.join(cwd, "widget", `${widget}.metadata.json`);
  const metadata = await readJsonFile(metadataPath);

  const bundleUrls = await getBundleUrls(
    bosConfig.gateway.bundleUrl,
    options.network,
    cwd
  );
  const scriptTags = bundleUrls
    .map((url) => `<script src="${url}" defer></script>`)
    .join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <title>${metadata.name}</title>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">

    <meta property="og:url" content="${metadata.linktree.website}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${metadata.name}">
    <meta property="og:description" content="${metadata.description}">
    <meta property="og:image" content="${bosConfig.ipfs.gateway + "/" + metadata.image.ipfs_cid}">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${metadata.name}">
    <meta name="twitter:description" content="${metadata.description}">
    <meta name="twitter:image" content="${bosConfig.ipfs.gateway + "/" + metadata.image.ipfs_cid}">

    <link rel="icon" href="${bosConfig.ipfs.gateway + "/" + metadata.image.ipfs_cid}" type="image/x-icon">

    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@near-wallet-selector/modal-ui-js@8.7.2/styles.css"
    />
    <style>
      html,
      body {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
        overflow: hidden;
        box-sizing: border-box;
      }
      body {
        background-color: #fff !important;
        scroll-behavior: smooth;
        display: flex;
      }
      #bw-root {
        width: 100%;
        height: 100%;
      }
    </style>
    ${scriptTags}
</head>
<body>
    <div id="bw-root">
        <${bosConfig.gateway.tagName} src="${bosConfig.index}" network="${options.network}"></${bosConfig.gateway.tagName}>
    </div>
    <script async="" src="https://ga.jspm.io/npm:es-module-shims@1.10.0/dist/es-module-shims.js" crossorigin="anonymous"></script>
    <script type="importmap">
      {
        "imports": {
          "@near-wallet-selector/core": "https://ga.jspm.io/npm:@near-wallet-selector/core@8.9.10/index.js",
          "@near-wallet-selector/here-wallet": "https://ga.jspm.io/npm:@near-wallet-selector/here-wallet@8.9.10/index.js",
          "@near-wallet-selector/meteor-wallet": "https://ga.jspm.io/npm:@near-wallet-selector/meteor-wallet@8.9.10/index.js",
          "@near-wallet-selector/mintbase-wallet": "https://ga.jspm.io/npm:@near-wallet-selector/mintbase-wallet@8.9.10/index.js",
          "@near-wallet-selector/modal-ui-js": "https://ga.jspm.io/npm:@near-wallet-selector/modal-ui-js@8.9.10/index.js",
          "@near-wallet-selector/my-near-wallet": "https://ga.jspm.io/npm:@near-wallet-selector/my-near-wallet@8.9.10/index.js",
          "@near-wallet-selector/nightly": "https://ga.jspm.io/npm:@near-wallet-selector/nightly@8.9.10/index.js",
          "@near-wallet-selector/sender": "https://ga.jspm.io/npm:@near-wallet-selector/sender@8.9.10/index.js"
        },
        "scopes": {
          "https://ga.jspm.io/": {
            "@here-wallet/core": "https://ga.jspm.io/npm:@here-wallet/core@1.6.6/build/index.js",
            "@meteorwallet/sdk": "https://ga.jspm.io/npm:@meteorwallet/sdk@1.0.9/dist/meteor-sdk/src/index.js",
            "@mintbase-js/wallet": "https://ga.jspm.io/npm:@mintbase-js/wallet@0.6.0-beta.3/lib/index.js",
            "@near-js/accounts": "https://ga.jspm.io/npm:@near-js/accounts@0.1.4/lib/index.js",
            "@near-js/crypto": "https://ga.jspm.io/npm:@near-js/crypto@0.0.5/lib/index.js",
            "@near-js/keystores": "https://ga.jspm.io/npm:@near-js/keystores@0.0.5/lib/index.js",
            "@near-js/keystores-browser": "https://ga.jspm.io/npm:@near-js/keystores-browser@0.0.5/lib/index.js",
            "@near-js/providers": "https://ga.jspm.io/npm:@near-js/providers@0.0.7/lib/index.js",
            "@near-js/signers": "https://ga.jspm.io/npm:@near-js/signers@0.0.5/lib/index.js",
            "@near-js/transactions": "https://ga.jspm.io/npm:@near-js/transactions@0.2.1/lib/index.js",
            "@near-js/types": "https://ga.jspm.io/npm:@near-js/types@0.0.4/lib/index.js",
            "@near-js/utils": "https://ga.jspm.io/npm:@near-js/utils@0.0.4/lib/index.js",
            "@near-js/wallet-account": "https://ga.jspm.io/npm:@near-js/wallet-account@0.0.7/lib/index.js",
            "@near-wallet-selector/wallet-utils": "https://ga.jspm.io/npm:@near-wallet-selector/wallet-utils@8.9.10/index.js",
            "@noble/curves/ed25519": "https://ga.jspm.io/npm:@noble/curves@1.2.0/ed25519.js",
            "@noble/hashes/crypto": "https://ga.jspm.io/npm:@noble/hashes@1.3.3/crypto.js",
            "@noble/hashes/sha256": "https://ga.jspm.io/npm:@noble/hashes@1.3.3/sha256.js",
            "@noble/hashes/sha512": "https://ga.jspm.io/npm:@noble/hashes@1.3.2/sha512.js",
            "@noble/hashes/utils": "https://ga.jspm.io/npm:@noble/hashes@1.3.2/utils.js",
            "ajv": "https://ga.jspm.io/npm:ajv@8.16.0/dist/dev.ajv.js",
            "ajv-formats": "https://ga.jspm.io/npm:ajv-formats@2.1.1/dist/index.js",
            "ajv/dist/compile/codegen": "https://ga.jspm.io/npm:ajv@8.11.2/dist/compile/codegen/index.js",
            "base-x": "https://ga.jspm.io/npm:base-x@3.0.9/src/index.js",
            "bn.js": "https://ga.jspm.io/npm:bn.js@5.2.1/lib/bn.js",
            "borsh": "https://ga.jspm.io/npm:borsh@0.7.0/lib/index.js",
            "bs58": "https://ga.jspm.io/npm:bs58@4.0.1/index.js",
            "buffer": "https://ga.jspm.io/npm:@jspm/core@2.0.1/nodelibs/browser/buffer.js",
            "capability": "https://ga.jspm.io/npm:capability@0.2.5/index.js",
            "capability/es5": "https://ga.jspm.io/npm:capability@0.2.5/es5.js",
            "charenc": "https://ga.jspm.io/npm:charenc@0.0.2/charenc.js",
            "copy-to-clipboard": "https://ga.jspm.io/npm:copy-to-clipboard@3.3.3/index.js",
            "crypt": "https://ga.jspm.io/npm:crypt@0.0.2/crypt.js",
            "crypto": "https://ga.jspm.io/npm:@jspm/core@2.0.1/nodelibs/browser/crypto.js",
            "decode-uri-component": "https://ga.jspm.io/npm:decode-uri-component@0.2.2/index.js",
            "depd": "https://ga.jspm.io/npm:depd@2.0.0/lib/browser/index.js",
            "dijkstrajs": "https://ga.jspm.io/npm:dijkstrajs@1.0.3/dijkstra.js",
            "encode-utf8": "https://ga.jspm.io/npm:encode-utf8@1.0.3/index.js",
            "error-polyfill": "https://ga.jspm.io/npm:error-polyfill@0.1.3/index.js",
            "events": "https://ga.jspm.io/npm:events@3.3.0/events.js",
            "fast-deep-equal": "https://ga.jspm.io/npm:fast-deep-equal@3.1.3/index.js",
            "filter-obj": "https://ga.jspm.io/npm:filter-obj@1.1.0/index.js",
            "http": "https://ga.jspm.io/npm:@jspm/core@2.0.1/nodelibs/browser/http.js",
            "http-errors": "https://ga.jspm.io/npm:http-errors@1.8.1/index.js",
            "https": "https://ga.jspm.io/npm:@jspm/core@2.0.1/nodelibs/browser/https.js",
            "inherits": "https://ga.jspm.io/npm:inherits@2.0.4/inherits_browser.js",
            "is-mobile": "https://ga.jspm.io/npm:is-mobile@4.0.0/index.js",
            "js-sha256": "https://ga.jspm.io/npm:js-sha256@0.9.0/src/sha256.js",
            "json-schema-traverse": "https://ga.jspm.io/npm:json-schema-traverse@1.0.0/index.js",
            "lru_map": "https://ga.jspm.io/npm:lru_map@0.4.1/dist/lru.js",
            "mustache": "https://ga.jspm.io/npm:mustache@4.2.0/mustache.js",
            "nanoid": "https://ga.jspm.io/npm:nanoid@3.3.6/index.browser.js",
            "near-abi": "https://ga.jspm.io/npm:near-abi@0.1.1/lib/index.js",
            "near-api-js": "https://ga.jspm.io/npm:near-api-js@2.1.4/lib/browser-index.js",
            "near-api-js/lib/providers": "https://ga.jspm.io/npm:near-api-js@3.0.4/lib/providers/index.js",
            "near-api-js/lib/utils": "https://ga.jspm.io/npm:near-api-js@3.0.4/lib/utils/index.js",
            "near-api-js/lib/utils/key_pair": "https://ga.jspm.io/npm:near-api-js@3.0.4/lib/utils/key_pair.js",
            "near-api-js/lib/utils/serialize": "https://ga.jspm.io/npm:near-api-js@3.0.4/lib/utils/serialize.js",
            "node-fetch": "https://ga.jspm.io/npm:node-fetch@2.7.0/browser.js",
            "o3": "https://ga.jspm.io/npm:o3@1.0.3/index.js",
            "process": "https://ga.jspm.io/npm:@jspm/core@2.0.1/nodelibs/browser/process.js",
            "qrcode": "https://ga.jspm.io/npm:qrcode@1.5.3/lib/browser.js",
            "query-string": "https://ga.jspm.io/npm:query-string@7.1.3/index.js",
            "randombytes": "https://ga.jspm.io/npm:randombytes@2.1.0/browser.js",
            "rxjs": "https://ga.jspm.io/npm:rxjs@7.8.1/dist/esm5/index.js",
            "safe-buffer": "https://ga.jspm.io/npm:safe-buffer@5.2.1/index.js",
            "setprototypeof": "https://ga.jspm.io/npm:setprototypeof@1.2.0/index.js",
            "sha1": "https://ga.jspm.io/npm:sha1@1.1.1/sha1.js",
            "split-on-first": "https://ga.jspm.io/npm:split-on-first@1.1.0/index.js",
            "statuses": "https://ga.jspm.io/npm:statuses@1.5.0/dev.index.js",
            "strict-uri-encode": "https://ga.jspm.io/npm:strict-uri-encode@2.0.0/index.js",
            "text-encoding-utf-8": "https://ga.jspm.io/npm:text-encoding-utf-8@1.0.2/lib/encoding.lib.js",
            "toggle-selection": "https://ga.jspm.io/npm:toggle-selection@1.0.6/index.js",
            "toidentifier": "https://ga.jspm.io/npm:toidentifier@1.0.1/index.js",
            "tslib": "https://ga.jspm.io/npm:tslib@2.6.3/tslib.es6.mjs",
            "tweetnacl": "https://ga.jspm.io/npm:tweetnacl@1.0.3/nacl-fast.js",
            "u3": "https://ga.jspm.io/npm:u3@0.1.1/index.js",
            "uri-js": "https://ga.jspm.io/npm:uri-js@4.4.1/dist/es5/uri.all.js",
            "uuid4": "https://ga.jspm.io/npm:uuid4@2.0.3/browser.mjs"
          },
          "https://ga.jspm.io/npm:@here-wallet/core@1.6.6/": {
            "near-api-js": "https://ga.jspm.io/npm:near-api-js@3.0.4/lib/browser-index.js"
          },
          "https://ga.jspm.io/npm:@meteorwallet/sdk@1.0.9/": {
            "@near-js/crypto": "https://ga.jspm.io/npm:@near-js/crypto@1.2.4/lib/index.js",
            "@near-js/transactions": "https://ga.jspm.io/npm:@near-js/transactions@1.2.2/lib/index.js"
          },
          "https://ga.jspm.io/npm:@near-js/accounts@1.0.4/": {
            "@near-js/crypto": "https://ga.jspm.io/npm:@near-js/crypto@1.2.1/lib/index.js",
            "@near-js/providers": "https://ga.jspm.io/npm:@near-js/providers@0.1.1/lib/index.js",
            "@near-js/signers": "https://ga.jspm.io/npm:@near-js/signers@0.1.1/lib/index.js",
            "@near-js/transactions": "https://ga.jspm.io/npm:@near-js/transactions@1.1.2/lib/index.js",
            "@near-js/utils": "https://ga.jspm.io/npm:@near-js/utils@0.1.0/lib/index.js",
            "ajv": "https://ga.jspm.io/npm:ajv@8.11.2/dist/dev.ajv.js"
          },
          "https://ga.jspm.io/npm:@near-js/crypto@1.2.1/": {
            "@near-js/utils": "https://ga.jspm.io/npm:@near-js/utils@0.1.0/lib/index.js"
          },
          "https://ga.jspm.io/npm:@near-js/crypto@1.2.1/_/LX1h3mee.js": {
            "@noble/curves/ed25519": "https://ga.jspm.io/npm:@noble/curves@1.2.0/esm/ed25519.js"
          },
          "https://ga.jspm.io/npm:@near-js/crypto@1.2.1/_/LoRIA3Ec.js": {
            "@noble/curves/ed25519": "https://ga.jspm.io/npm:@noble/curves@1.2.0/esm/ed25519.js"
          },
          "https://ga.jspm.io/npm:@near-js/crypto@1.2.4/": {
            "@near-js/types": "https://ga.jspm.io/npm:@near-js/types@0.2.1/lib/index.js",
            "@near-js/utils": "https://ga.jspm.io/npm:@near-js/utils@0.2.2/lib/index.js"
          },
          "https://ga.jspm.io/npm:@near-js/crypto@1.2.4/_/HcaMPL-t.js": {
            "@noble/curves/ed25519": "https://ga.jspm.io/npm:@noble/curves@1.2.0/esm/ed25519.js"
          },
          "https://ga.jspm.io/npm:@near-js/crypto@1.2.4/_/LX1h3mee.js": {
            "@noble/curves/ed25519": "https://ga.jspm.io/npm:@noble/curves@1.2.0/esm/ed25519.js"
          },
          "https://ga.jspm.io/npm:@near-js/keystores-browser@0.0.9/": {
            "@near-js/crypto": "https://ga.jspm.io/npm:@near-js/crypto@1.2.1/lib/index.js",
            "@near-js/keystores": "https://ga.jspm.io/npm:@near-js/keystores@0.0.9/lib/index.js"
          },
          "https://ga.jspm.io/npm:@near-js/keystores@0.0.9/": {
            "@near-js/crypto": "https://ga.jspm.io/npm:@near-js/crypto@1.2.1/lib/index.js"
          },
          "https://ga.jspm.io/npm:@near-js/providers@0.1.1/": {
            "@near-js/transactions": "https://ga.jspm.io/npm:@near-js/transactions@1.1.2/lib/index.js",
            "@near-js/utils": "https://ga.jspm.io/npm:@near-js/utils@0.1.0/lib/index.js",
            "http-errors": "https://ga.jspm.io/npm:http-errors@1.7.2/index.js",
            "node-fetch": "https://ga.jspm.io/npm:node-fetch@2.6.7/browser.js"
          },
          "https://ga.jspm.io/npm:@near-js/signers@0.1.1/": {
            "@near-js/crypto": "https://ga.jspm.io/npm:@near-js/crypto@1.2.1/lib/index.js",
            "@near-js/keystores": "https://ga.jspm.io/npm:@near-js/keystores@0.0.9/lib/index.js"
          },
          "https://ga.jspm.io/npm:@near-js/transactions@1.1.2/": {
            "borsh": "https://ga.jspm.io/npm:borsh@1.0.0/lib/cjs/index.js"
          },
          "https://ga.jspm.io/npm:@near-js/transactions@1.2.2/": {
            "@near-js/types": "https://ga.jspm.io/npm:@near-js/types@0.2.1/lib/index.js",
            "borsh": "https://ga.jspm.io/npm:borsh@1.0.0/lib/cjs/index.js"
          },
          "https://ga.jspm.io/npm:@near-js/utils@0.1.0/": {
            "bs58": "https://ga.jspm.io/npm:bs58@4.0.0/index.js",
            "mustache": "https://ga.jspm.io/npm:mustache@4.0.0/mustache.js"
          },
          "https://ga.jspm.io/npm:@near-js/utils@0.2.2/": {
            "@near-js/types": "https://ga.jspm.io/npm:@near-js/types@0.2.1/lib/index.js",
            "bs58": "https://ga.jspm.io/npm:bs58@4.0.0/index.js",
            "mustache": "https://ga.jspm.io/npm:mustache@4.0.0/mustache.js"
          },
          "https://ga.jspm.io/npm:@near-js/wallet-account@1.1.1/": {
            "@near-js/accounts": "https://ga.jspm.io/npm:@near-js/accounts@1.0.4/lib/index.js",
            "@near-js/crypto": "https://ga.jspm.io/npm:@near-js/crypto@1.2.1/lib/index.js",
            "@near-js/transactions": "https://ga.jspm.io/npm:@near-js/transactions@1.1.2/lib/index.js",
            "@near-js/utils": "https://ga.jspm.io/npm:@near-js/utils@0.1.0/lib/index.js",
            "borsh": "https://ga.jspm.io/npm:borsh@1.0.0/lib/cjs/index.js"
          },
          "https://ga.jspm.io/npm:@noble/curves@1.2.0/esm/ed25519.js": {
            "@noble/hashes/sha512": "https://ga.jspm.io/npm:@noble/hashes@1.3.2/esm/sha512.js",
            "@noble/hashes/utils": "https://ga.jspm.io/npm:@noble/hashes@1.3.2/esm/utils.js"
          },
          "https://ga.jspm.io/npm:@noble/hashes@1.3.2/": {
            "@noble/hashes/crypto": "https://ga.jspm.io/npm:@noble/hashes@1.3.2/crypto.js"
          },
          "https://ga.jspm.io/npm:@noble/hashes@1.3.2/esm/_sha2.js": {
            "@noble/hashes/crypto": "https://ga.jspm.io/npm:@noble/hashes@1.3.2/esm/crypto.js"
          },
          "https://ga.jspm.io/npm:@noble/hashes@1.3.2/esm/sha512.js": {
            "@noble/hashes/crypto": "https://ga.jspm.io/npm:@noble/hashes@1.3.2/esm/crypto.js"
          },
          "https://ga.jspm.io/npm:@noble/hashes@1.3.2/esm/utils.js": {
            "@noble/hashes/crypto": "https://ga.jspm.io/npm:@noble/hashes@1.3.2/esm/crypto.js"
          },
          "https://ga.jspm.io/npm:ajv-formats@2.1.1/": {
            "ajv": "https://ga.jspm.io/npm:ajv@8.11.2/dist/dev.ajv.js"
          },
          "https://ga.jspm.io/npm:bs58@4.0.0/": {
            "base-x": "https://ga.jspm.io/npm:base-x@2.0.6/index.js"
          },
          "https://ga.jspm.io/npm:http-errors@1.7.2/": {
            "depd": "https://ga.jspm.io/npm:depd@1.1.2/lib/browser/index.js",
            "inherits": "https://ga.jspm.io/npm:inherits@2.0.3/inherits_browser.js",
            "setprototypeof": "https://ga.jspm.io/npm:setprototypeof@1.1.1/index.js",
            "toidentifier": "https://ga.jspm.io/npm:toidentifier@1.0.0/index.js"
          },
          "https://ga.jspm.io/npm:http-errors@1.8.1/": {
            "depd": "https://ga.jspm.io/npm:depd@1.1.2/lib/browser/index.js"
          },
          "https://ga.jspm.io/npm:near-api-js@3.0.4/": {
            "@near-js/accounts": "https://ga.jspm.io/npm:@near-js/accounts@1.0.4/lib/index.js",
            "@near-js/crypto": "https://ga.jspm.io/npm:@near-js/crypto@1.2.1/lib/index.js",
            "@near-js/keystores": "https://ga.jspm.io/npm:@near-js/keystores@0.0.9/lib/index.js",
            "@near-js/keystores-browser": "https://ga.jspm.io/npm:@near-js/keystores-browser@0.0.9/lib/index.js",
            "@near-js/providers": "https://ga.jspm.io/npm:@near-js/providers@0.1.1/lib/index.js",
            "@near-js/signers": "https://ga.jspm.io/npm:@near-js/signers@0.1.1/lib/index.js",
            "@near-js/transactions": "https://ga.jspm.io/npm:@near-js/transactions@1.1.2/lib/index.js",
            "@near-js/utils": "https://ga.jspm.io/npm:@near-js/utils@0.1.0/lib/index.js",
            "@near-js/wallet-account": "https://ga.jspm.io/npm:@near-js/wallet-account@1.1.1/lib/index.js",
            "borsh": "https://ga.jspm.io/npm:borsh@1.0.0/lib/cjs/index.js"
          }
        }
      }
    </script>
    <script type="module">
        import { setupWalletSelector } from "@near-wallet-selector/core";
        import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
        import { setupHereWallet } from "@near-wallet-selector/here-wallet";
        import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
        import { setupSender } from "@near-wallet-selector/sender";
        import { setupNightly } from "@near-wallet-selector/nightly";
        import { setupMintbaseWallet } from "@near-wallet-selector/mintbase-wallet";

        const selector = await setupWalletSelector({
            network: "${options.network}",
            modules: [
                setupMyNearWallet(),
                setupHereWallet(),
                setupMeteorWallet(),
                setupSender(),
                setupNightly(),
                setupMintbaseWallet()
            ],
        });

        const viewer = document.querySelector("${bosConfig.gateway.tagName}");
        viewer.selector = selector;
    </script>
</body>
</html>`;

  const outputPath = path.join(cwd, options.output, "index.html");
  await fs.mkdir(path.join(cwd, options.output), { recursive: true });
  await fs.writeFile(outputPath, html);
  console.log(`Generated index.html in ${outputPath}`);
}

generateIndexHtml().catch(console.error);
