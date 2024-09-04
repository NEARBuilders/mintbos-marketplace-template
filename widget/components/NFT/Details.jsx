const { isDarkModeOn, data, NftCount, listingCount } = props;
const { buyToken } = VM.require(
  "${config_account}/widget/Mintbase.NFT.modules"
);

const { buyTokenAsADao } = VM.require(
  "${config_account}/widget/Mintbase.utils.sdk"
) || { buyTokenAsADao: () => {} };

const { href } = VM.require("buildhub.near/widget/lib.url") || {
  href: () => {},
};

const nearIcon = (
  <svg
    width="25px"
    height="25px"
    viewBox="0 0 18 18"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    class="fill-current text-black dark:text-white"
  >
    <path
      d="M5.10976 4.05615C5.47596 4.05615 5.81596 4.24601 6.00779 4.55812L8.07455 7.62657C8.14188 7.7277 8.11455 7.86404 8.01343 7.93136C7.93145 7.98601 7.823 7.97925 7.74835 7.91502L5.71399 6.15052C5.68019 6.1201 5.62807 6.12319 5.59765 6.157C5.58385 6.17249 5.57652 6.19249 5.57652 6.21305V11.7376C5.57652 11.7832 5.61343 11.8198 5.65906 11.8198C5.68357 11.8198 5.70667 11.8091 5.72216 11.7902L11.8717 4.42911C12.072 4.19277 12.3661 4.05643 12.6757 4.05615H12.8906C13.4723 4.05615 13.9438 4.5277 13.9438 5.10939V12.8902C13.9438 13.4719 13.4723 13.9435 12.8906 13.9435C12.5244 13.9435 12.1844 13.7536 11.9926 13.4415L9.92582 10.3731C9.8585 10.2719 9.88582 10.1356 9.98695 10.0683C10.0689 10.0136 10.1774 10.0204 10.252 10.0846L12.2864 11.8491C12.3202 11.8795 12.3723 11.8764 12.4027 11.8426C12.4165 11.8271 12.4238 11.8071 12.4236 11.7866V6.26066C12.4236 6.21503 12.3867 6.17841 12.341 6.17841C12.3168 6.17841 12.2934 6.18911 12.2779 6.20798L6.1292 13.5705C5.92892 13.8069 5.63483 13.9432 5.32526 13.9435H5.11033C4.52864 13.9438 4.05681 13.4725 4.05624 12.8908V5.10939C4.05624 4.5277 4.52779 4.05615 5.10948 4.05615H5.10976Z"
      fill="currentColor"
    ></path>
  </svg>
);

const usdtIcon = (
  <svg
    width="25px"
    height="25px"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    class="fill-current text-black dark:text-white"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M17.9572 6V8.12708H13.4849V9.60186C16.6259 9.75946 18.9825 10.4068 19 11.1826L18.9999 12.8C18.9824 13.5759 16.6259 14.2231 13.4849 14.3807V18H10.5152V14.3807C7.37411 14.2231 5.01749 13.5759 5 12.8L5.00012 11.1826C5.01759 10.4068 7.37411 9.75946 10.5152 9.60186V8.12708H6.04284V6H17.9572ZM12 13.2696C15.3521 13.2696 18.1538 12.7222 18.8395 11.9913C18.258 11.3715 16.1549 10.8837 13.4849 10.7497V12.2938C13.0063 12.3178 12.5095 12.3304 12 12.3304C11.4905 12.3304 10.9937 12.3178 10.5152 12.2938V10.7497C7.84511 10.8837 5.74197 11.3715 5.16051 11.9913C5.84619 12.7222 8.64794 13.2696 12 13.2696Z"
      fill="currentColor"
    ></path>
  </svg>
);

const usdcIcon = (
  <svg
    width="25px"
    height="24px"
    viewBox="0 0 18 18"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    class="fill-current text-black dark:text-white"
  >
    <path
      d="M7.47402 14.1481C7.4776 14.1885 7.47065 14.2292 7.45386 14.2661C7.43706 14.3031 7.41099 14.3351 7.37817 14.359C7.34535 14.3829 7.30691 14.3979 7.26658 14.4025C7.22625 14.4072 7.1854 14.4013 7.148 14.3855C5.94359 13.9999 4.89282 13.2416 4.14728 12.2201C3.40175 11.1986 3 9.96668 3 8.70205C3 7.43741 3.40175 6.20547 4.14728 5.18396C4.89282 4.16245 5.94359 3.40419 7.148 3.01858C7.1854 3.00277 7.22625 2.9969 7.26658 3.00155C7.30691 3.0062 7.34535 3.0212 7.37817 3.0451C7.41099 3.06901 7.43706 3.10099 7.45386 3.13796C7.47065 3.17492 7.4776 3.2156 7.47402 3.25604V3.71913C7.47124 3.78612 7.44975 3.851 7.41197 3.90639C7.3742 3.96179 7.32166 4.00549 7.26031 4.03255C6.30285 4.38214 5.47599 5.01761 4.89178 5.85286C4.30756 6.68811 3.99423 7.68276 3.99423 8.70205C3.99423 9.72134 4.30756 10.716 4.89178 11.5512C5.47599 12.3865 6.30285 13.022 7.26031 13.3716C7.32166 13.3986 7.3742 13.4423 7.41197 13.4977C7.44975 13.5531 7.47124 13.618 7.47402 13.685V14.1481Z"
      fill="currentColor"
    ></path>
    <path
      d="M9.46248 12.4304C9.46248 12.4963 9.4363 12.5595 9.38968 12.6061C9.34307 12.6527 9.27985 12.6789 9.21393 12.6789H8.71681C8.65089 12.6789 8.58767 12.6527 8.54106 12.6061C8.49444 12.5595 8.46826 12.4963 8.46826 12.4304V11.6456C8.03635 11.629 7.62386 11.4618 7.30235 11.1729C6.98084 10.884 6.77059 10.4917 6.70807 10.064C6.70268 10.0308 6.70459 9.99674 6.71368 9.9643C6.72276 9.93185 6.7388 9.90177 6.76068 9.87615C6.78256 9.85052 6.80975 9.82996 6.84037 9.8159C6.87099 9.80184 6.90431 9.79462 6.938 9.79472H7.50499C7.5626 9.79522 7.61827 9.81552 7.66266 9.85223C7.70706 9.88894 7.73746 9.9398 7.74877 9.99629C7.85411 10.4878 8.13969 10.8676 9.00757 10.8676C9.6494 10.8676 10.1047 10.51 10.1047 9.97362C10.1047 9.43711 9.83638 9.23408 8.89366 9.07966C7.50404 8.89264 6.84568 8.47002 6.84568 7.38101C6.86174 6.95441 7.03741 6.5494 7.33791 6.24617C7.63841 5.94294 8.04182 5.76361 8.46826 5.74369V4.97365C8.46826 4.90773 8.49444 4.84451 8.54106 4.7979C8.58767 4.75128 8.65089 4.7251 8.71681 4.7251H9.21393C9.27985 4.7251 9.34307 4.75128 9.38968 4.7979C9.4363 4.84451 9.46248 4.90773 9.46248 4.97365V5.76556C9.82128 5.80342 10.1584 5.95556 10.4242 6.19955C10.69 6.44354 10.8703 6.76647 10.9386 7.12072C10.9453 7.15438 10.9445 7.18912 10.9361 7.22241C10.9278 7.2557 10.9121 7.2867 10.8902 7.31318C10.8684 7.33965 10.8409 7.36093 10.8098 7.37546C10.7787 7.38999 10.7448 7.39742 10.7104 7.3972H10.1876C10.1334 7.39668 10.0808 7.37861 10.0377 7.34569C9.99468 7.31277 9.96346 7.26678 9.94875 7.21461C9.80729 6.73539 9.46482 6.52756 8.86936 6.52756C8.211 6.52756 7.86975 6.84467 7.86975 7.29156C7.86975 7.76292 8.06468 7.99868 9.07239 8.14501C10.4379 8.33184 11.145 8.72201 11.145 9.88414C11.131 10.3335 10.9515 10.7618 10.6409 11.0868C10.3304 11.4118 9.9107 11.6107 9.46248 11.6451V12.4304Z"
      fill="currentColor"
    ></path>
    <path
      d="M10.7825 14.3855C10.7451 14.4013 10.7043 14.4072 10.6639 14.4025C10.6236 14.3979 10.5852 14.3829 10.5523 14.359C10.5195 14.3351 10.4934 14.3031 10.4766 14.2661C10.4599 14.2292 10.4529 14.1885 10.4565 14.1481V13.685C10.4559 13.6172 10.476 13.5508 10.5142 13.4948C10.5524 13.4387 10.6068 13.3957 10.6702 13.3716C11.6277 13.022 12.4545 12.3865 13.0387 11.5512C13.6229 10.716 13.9363 9.72134 13.9363 8.70205C13.9363 7.68276 13.6229 6.68811 13.0387 5.85286C12.4545 5.01761 11.6277 4.38214 10.6702 4.03255C10.6088 4.00549 10.5563 3.96179 10.5185 3.90639C10.4808 3.85099 10.4593 3.78612 10.4565 3.71912V3.25604C10.4529 3.2156 10.4599 3.17492 10.4766 3.13796C10.4934 3.10099 10.5195 3.06901 10.5523 3.0451C10.5852 3.0212 10.6236 3.0062 10.6639 3.00155C10.7043 2.9969 10.7451 3.00277 10.7825 3.01858C11.9869 3.40419 13.0377 4.16245 13.7832 5.18396C14.5288 6.20547 14.9305 7.43741 14.9305 8.70205C14.9305 9.96668 14.5288 11.1986 13.7832 12.2201C13.0377 13.2416 11.9869 13.9999 10.7825 14.3855Z"
      fill="currentColor"
    ></path>
  </svg>
);

const listingType = {
  near: nearIcon,
  "ft::a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near": usdcIcon,
  "ft::dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near": usdtIcon,
  "usdc.fakes.testnet": usdcIcon,
  "usdt.fakes.testnet": usdtIcon,
};

const Container = styled.div`
  display: grid;
  margin: 10px 0;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  .layout {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .view-nft {
    padding: 30px;
    background: ${isDarkModeOn ? "rgb(30, 32, 48)" : "#f6f5f4"};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: 800px;
    border-radius: 5px;
    @media screen and (max-width: 768px) {
      min-width: 100%;
      padding: 10px;
    }
  }
  .layout-image {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
  }
  .nft {
    width: 512px;
    height: 512px;
    object-fit: contain;
    @media screen and (max-width: 768px) {
      width: 200px;
      height: 200px;
    }
  }
  .desc {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    @media screen and (max-width: 768px) {
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }
  }
  .item {
    display: flex;
    flex-direction: column;
    padding: 7px 10px;
    gap: 3px;
    background: #ffffff;
    text-decoration: none;
    border-radius: 5px;
    color: #000000;
  }
  .item-view {
    display: flex;
    flex-direction: column;
    padding: 7px 10px;
    gap: 3px;
    background: #ffffff;
    text-decoration: none;
    border-radius: 5px;
    color:  #000000;
  }
  .title {
    color:  #000000;
    margin: 20px 0;
    font-size: 30px;
    font-weight: 500;
    @media screen and (max-width: 768px) {
      font-size: 20px;
    }
  }
  .layout-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .audit {
    border: none;
    background: #ebeae9;
    padding: 5px 10px;
    border-radius: 5px;
    max-height: 40px;
    cursor: pointer;
    :hover {
      background: #9dc7f3;
    }
    @media screen and (max-width: 768px) {
      font-size: 16px;
    }
  }
  .text-desc {
    color: "#164b8e;
  }
  .minter {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    gap: 30px;
  }

  .footer {
    display: flex;
    margin-top: 20px;
    flex-direction: column;
    gap: 20px;
    color:  #000000;
  }
  .btn-nft {
    border: 1px solid #000000;
    background: none;
    padding: 3px 6px;
    border-radius: 5px;
    color:  #000000;
    cursor: pointer;
  }
  .split {
    background: #f6f5f4;
    padding: 10px 20px;
    max-height: 300px;
    width: 100%;
    min-width: 800px;
    border-radius: 5px 5px 0 0;
    cursor: pointer;
    transition-duration: 0.2s;
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    @media screen and (max-width: 768px) {
      min-width: 100%;
    }
  }
  .splits {
    background: #f6f5f4;
    padding: 30px;
    max-height: 300px;
    width: 100%;
    min-width: 800px;
    border-radius: 5px;
    overflow: hidden;
    transition: height 0.25s ease-out;
    color:  #000000;
  }
  .split-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 20px;
    color:  #000000;
  }
  .left {
    margin-top: 10px;
    font-size: 19px;
    font-weight: 600;
  }
  .right {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    gap: 10px;
  }
  .split-content {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    @media screen and (max-width: 768px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      font-size: 16px;
    }
  }
  .right-header {
    padding: 10px 20px;
    color: gray;
    background: #eceae8;
    width: 100%;
    display: flex;
    text-align: start;
    align-items: start;
    justify-content: start;
    flex-direction: row;
    gap: 3px;
  }
  .right-footer {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    padding: 20px 20px;
    @media screen and (max-width: 768px) {
      justify-content: center;
    }
  }
  .right-main {
    color:  #000000;
    padding: 10px 20px;
    margin-top: 10px;
  }
  .right-container {
    border: none;
    background: #f6f5f4;
    display: flex;
    flex-direction: column;
    min-width: 400px;
    max-height: 200px;
    border-radius: 5px;
    margin-right: 40px;
  }
  .truncate {
    display: block;
    width: 180px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .text {
    color:  #000000;
  }
  .btn-cus {
    background:  #000000;
    border: none;
    border-radius: 5px;
    outline: none;
    padding: 5px 20px;
    width: 100%;
    color: #ffffff;
  }
  .custom-sale {
    display: flex;
    justify-content: end;
  }
  @media screen and (max-width: 768px) {
    .item-view {
      flex-direction: row;
      justify-content: space-between;
      background: none;
      padding: 0 10px;
    }
    .item {
      width: 100%;
    }
    .minter {
      flex-direction: column;
      padding: 0px 10px;
      gap: 10px;
      margin-top: 10px;
    }
    .item-minter {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .btn-nft {
      font-size: 13px;
    }
    .text-decs {
      font-size: 15px;
    }
    .splits {
      min-width: 100%;
      font-size: 16px;
      padding: 10px;
    }
    .custom-sale {
      display: block;
    }
    .right-container {
      min-width: 100%;
    }
  }
`;

const [dropdowVisible, setDropDownVisible] = useState(true);
const [visible, setVisible] = useState(true);

const hanleVisible = () => {
  setDropDownVisible(!dropdowVisible);
};

const hanleVisibleDetails = () => {
  setVisible(!visible);
};

const YoctoToNear = (amountYocto) => {
  return new Big(amountYocto || 0).div(new Big(10).pow(24)).toString();
};

const getUsdValue = (price) => {
  const convertToNear = YoctoToNear(price);
  const res = fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=near&vs_currencies=usd`
  );
  if (res.ok) {
    const multiplyBy = Object.values(res?.body)[0]?.usd;
    const value = multiplyBy * Number(convertToNear)?.toFixed(2);
    return value?.toFixed(4) !== "NaN" ? `$${value?.toFixed(2)}` : 0;
  }
};

const firstListing = data?.listings[0];

const handleBuy = () => {
  if (!context.accountId) return;
  buyToken(
    data?.nft_contract_id,
    data?.token_id,
    data?.listings[0]?.price,
    context?.networkId === "mainnet",
    firstListing?.currency
  );
};

return !data ? (
  <div>Please enter nft data to view it's details</div>
) : (
  <Container>
    <div className="layout">
      <div className="view-nft">
        <div className="layout-image">
          {/* {data.media && data.media.startsWith("https://arweave.net/") ? ( */}
          <img className="nft" src={data.media} alt="nft" />
          {/* ) : (
            <img
              className="nft"
              src={`https://image-cache-service-z3w7d7dnea-ew.a.run.app/media?url=https://arweave.net/${data.media}`}
              alt="nft"
            />
          )} */}
        </div>
        <div className="layout-title">
          <div className="title">
            {data.title ? data.title : "This NFT has no title"}
          </div>
          {/* <button className="audit">Audited</button> */}
        </div>
        <div className="desc">
          <a href="#" className="item-view">
            <small>Contract</small>
            <Link
              to={href({
                widgetSrc: "${config_account}/widget/Mintbase.App.Index",
                params: {
                  page: "contract",
                  accountId: data?.nft_contract_id,
                },
              })}
            >
              <small className="text-desc">{data?.nft_contract_id}</small>
            </Link>
          </a>
          <a href="#" className="item-view">
            <small>Owner</small>
            <Link
              to={href({
                widgetSrc: "${config_account}/widget/Mintbase.App.Index",
                params: {
                  page: "human",
                  accountId: data?.owner,
                },
              })}
            >
              <small className="text-desc">{data?.owner}</small>
            </Link>
          </a>
          <a href="#" className="item-view">
            <small>Total Minted</small>
            <small>{NftCount}</small>
          </a>
        </div>
        <div className="minter">
          <small className="item-minter">
            <span>Minter: </span>
            <a href="#" className="text-desc text-decoration-none">
              {data.minter}
            </a>
          </small>
          <small className="item-minter">
            <span>Token Id:</span>
            <span>{data.token_id}</span>
          </small>
          <small className="item-minter">
            <span>Type: </span>
            <span>Image</span>
          </small>
        </div>
        <div className="footer">
          <div className="px-2">{data.description}</div>
          {/* <div className="d-flex flex-row gap-3">
            <a
              onClick={() => {
                clipboard.writeText(props.text).then(() => {
                  State.update({ copied: true });
                  if (props.onCopy) {
                    props.onCopy(props.text);
                  }
                });
              }}
              className="btn-nft d-flex flex-row gap-1 align-items-center text-decoration-none"
            >
              <div>Share</div>
            </a>
            <a
              href={`https://www.mintbase.xyz/meta/${
                data.id && data.id.replace(":", "%3A")
              }?affiliateAccount=${data.listings[0].listed_by}`}
              target="_blank"
              className="btn-nft d-flex flex-row gap-1 align-items-center text-decoration-none"
            >
              <img
                width="18"
                height="18"
                src="https://img.icons8.com/pulsar-line/48/share-3.png"
                alt="share-3"
              />
              <div>AffiliateDirect Link</div>
            </a>
          </div> */}
        </div>
      </div>
      <div>
        <div onClick={hanleVisible} className="split border-bottom">
          <div className="split-title">
            <div className="left">Splits</div>
            <div className="right">
              <img
                width="20"
                height="20"
                src="https://img.icons8.com/color/48/info--v1.png"
                alt="info--v1"
              />
              {dropdowVisible ? (
                <img
                  width="20"
                  height="20"
                  src="https://img.icons8.com/ios-glyphs/30/chevron-up.png"
                  alt="chevron-up"
                />
              ) : (
                <img
                  width="20"
                  height="20"
                  src="https://img.icons8.com/ios-glyphs/30/chevron-down.png"
                  alt="chevron-up"
                />
              )}
            </div>
          </div>
        </div>
        {dropdowVisible && (
          <div className="splits">
            <div className="split-content">
              <div className="item">
                <div className="d-flex flex-row gap-2 align-items-center">
                  <div
                    class="error"
                    style={{
                      background: "#c74c4c",
                      height: "10px",
                      width: "10px",
                      borderRadius: "50px",
                    }}
                  ></div>
                  <small>Forever Royalties</small>
                </div>
                <small>0%</small>
              </div>
              <div className="item">
                <div className="d-flex flex-row gap-2 align-items-center">
                  <div
                    className="success"
                    style={{
                      background: "#0a7d6c",
                      height: "10px",
                      width: "10px",
                      borderRadius: "50px",
                    }}
                  ></div>
                  <small>Split Revenue</small>
                </div>
                <small>97.5%</small>
              </div>
              <div className="item">
                <div className="d-flex flex-row gap-2 align-items-center">
                  <div
                    className="disable"
                    style={{
                      background: "#b3b5bd",
                      height: "10px",
                      width: "10px",
                      borderRadius: "50px",
                    }}
                  ></div>
                  <small>Market</small>
                </div>
                <small>2.5%</small>
              </div>
            </div>
          </div>
        )}
      </div>
      <div>
        <div onClick={hanleVisibleDetails} className="split border-bottom">
          <div className="split-title">
            <div className="left">Details</div>
            <div className="right">
              {visible ? (
                <img
                  width="20"
                  height="20"
                  src="https://img.icons8.com/ios-glyphs/30/chevron-up.png"
                  alt="chevron-up"
                />
              ) : (
                <img
                  width="20"
                  height="20"
                  src="https://img.icons8.com/ios-glyphs/30/chevron-down.png"
                  alt="chevron-up"
                />
              )}
            </div>
          </div>
        </div>
        {visible && (
          <div className="splits">
            <div className="d-flex flex-column gap-3">
              <div className="d-flex flex-row">
                <span>Storage Gateway:&nbsp;</span>
                <a
                  href={data.base_uri}
                  target="_blank"
                  className="d-flex flex-row align-items-center text-decoration-none"
                  style={{ color: "#5861a8" }}
                >
                  <span className="truncate">{data.base_uri}</span>
                  <img
                    width="10"
                    height="10"
                    src="https://img.icons8.com/ios/50/up-right-arrow.png"
                    alt="down-left-arrow"
                  />
                </a>
              </div>
              <div className="d-flex flex-row">
                <span>Storage ID:&nbsp;</span>
                <a
                  href={data.media}
                  target="_blank"
                  className="d-flex flex-row align-items-center text-decoration-none"
                  style={{ color: "#5861a8" }}
                >
                  <span className="truncate">
                    {data.media &&
                      data.media.replace("https://arweave.net/", "")}
                  </span>
                  <img
                    className="ml-"
                    width="10"
                    height="10"
                    src="https://img.icons8.com/ios/50/up-right-arrow.png"
                    alt="down-left-arrow"
                  />
                </a>
              </div>
              <div className="d-flex flex-row">
                <span>Contract:&nbsp;</span>
                <a
                  href={`https://www.mintbase.xyz/contract/${data.nft_contract_id}/nfts/all/0`}
                  target="_blank"
                  className="d-flex flex-row align-items-center text-decoration-none"
                  style={{ color: "#5861a8" }}
                >
                  <span className="truncate">{data.nft_contract_id}</span>
                  <img
                    width="10"
                    height="10"
                    src="https://img.icons8.com/ios/50/up-right-arrow.png"
                    alt="down-left-arrow"
                  />
                </a>
              </div>
              <div className="d-flex flex-row">
                <span>Metadata ID:&nbsp;</span>
                <a
                  href={`https://www.mintbase.xyz/meta/${data.id}`}
                  target="_blank"
                  className="d-flex flex-row align-items-center text-decoration-none"
                  style={{ color: "#5861a8" }}
                >
                  <span className="truncate">{data.metadata_id}</span>
                  <img
                    width="10"
                    height="10"
                    src="https://img.icons8.com/ios/50/up-right-arrow.png"
                    alt="down-left-arrow"
                  />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    <div className="custom-sale">
      <div className="right-container">
        <div className="right-header">
          <span className="text" style={{ fontWeight: 500 }}>
            {listingCount}{" "}
          </span>{" "}
          of{" "}
          <span className="text" style={{ fontWeight: 500 }}>
            {NftCount}{" "}
          </span>{" "}
          Listed{" "}
          <span className="text" style={{ fontWeight: 500 }}>
            {" "}
            as Simple Sale
          </span>
        </div>
        {data?.listings[0]?.price > 1 ? (
          <div>
            <div className="right-main">
              <span className="d-flex flex-row justify-content-start">
                Lowest Price
              </span>
              <div className="text text-left d-flex flex-row justify-content-start align-items-end">
                <div style={{ fontSize: "25px", fontWeight: 600 }}>
                  {firstListing?.price
                    ? firstListing?.currency === "near"
                      ? YoctoToNear(firstListing?.price)
                      : (firstListing?.price / 1000000).toFixed(2)
                    : ""}
                  {listingType[firstListing?.currency]}
                </div>
                <strong
                  className="font-weight-light"
                  style={{
                    fontSize: "16px",
                    marginLeft: "20px",
                    color: "gray",
                  }}
                >
                  {firstListing?.currency === "near"
                    ? getUsdValue(firstListing?.price)
                    : (firstListing?.price / 1000000).toFixed(2)}
                </strong>
              </div>
            </div>
            <div className="right-footer">
              {firstListing?.price &&
                context?.accountId !== data?.owner &&
                context?.accountId && (
                  <button onClick={handleBuy} className="btn-cus">
                    Buy With Crypto
                  </button>
                )}
            </div>
          </div>
        ) : (
          <div className="mx-5 my-3 text-left">Not listed</div>
        )}
      </div>
    </div>
  </Container>
);
