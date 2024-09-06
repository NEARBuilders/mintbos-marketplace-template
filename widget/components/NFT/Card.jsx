const { href } = VM.require("buildhub.near/widget/lib.url") || {
  href: () => {},
};
const Card = ({ data }) => {
  if (!data) {
    return "Loading";
  }
  const size = "100%";
  return (
    <div className="d-flex flex-column gap-1 w-15 p-3">
      <a
        href={href({
          widgetSrc: "${config_account}/widget/Index",
          params: {
            page: "product",
            contractId: data?.nft_contract_id,
            metadataId: data?.metadata_id,
          },
        })}
      >
        <Widget
          src="${alias_MOB}/widget/NftImage"
          props={{
            nft: {
              tokenId: data?.token_id,
              contractId: data?.nft_contract_id,
            },
            style: {
              width: size,
              height: "300px",
              objectFit: "cover",
              minWidth: size,
              minHeight: size,
              maxWidth: size,
              maxHeight: size,
              overflowWrap: "break-word",
            },
            className: "",
            fallbackUrl:
              "https://ipfs.near.social/ipfs/bafkreihdiy3ec4epkkx7wc4wevssruen6b7f3oep5ylicnpnyyqzayvcry",
          }}
        />
      </a>
      <button
        // disabled={!accountId}
        onClick={() => {
          //add this NFT as json object to the connect user's social DB account
        }}
        style={{
          border: "1px solid black",
          backgroundColor: "white",
          color: "black",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        Add to cart
      </button>
    </div>
  );
};

return <Card {...props} />;
