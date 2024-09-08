const { href } = VM.require("buildhub.near/widget/lib.url") || {
  href: () => {},
};
const { addItemsToCart, removeItemsFromCart, itemExistsInCart } = VM.require(
  "${config_account}/widget/lib.cart"
) || {
  addItemsToCart: () => {},
  removeItemsFromCart: () => {},
  itemExistsInCart: () => false,
};

const existsInCart = itemExistsInCart(data);
const Card = ({ data }) => {
  if (!data) {
    return "Loading";
  }
  const size = "100%";
  return (
    <div className="d-flex flex-column gap-1 w-15 p-3">
      <Link
        to={href({
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
      </Link>
      <button
        onClick={() => {
          if (existsInCart) {
            removeItemsFromCart([data]);
          } else {
            // item.ft = "NEAR";
            addItemsToCart([data]);
          }
        }}
        style={{
          border: "1px solid black",
          backgroundColor: "white",
          color: "black",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        {existsInCart ? "Remove from cart" : "Add to cart"}
      </button>
    </div>
  );
};

return <Card {...props} />;
