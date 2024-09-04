const Card = ({ data }) => {
    return (
        <div className="d-flex flex-column gap-1 w-15 p-3">
            <Link
                to={`{config_index}?page=product&contractId=${data.nft_contract_id}&metadataId=${data?.metadataId}`}
                target="_blank"
            >
                <Widget
                    src="mob.near/widget/NftImage"
                    props={{
                        nft: {
                            tokenId: listing.token_id,
                            contractId: listing.nft_contract_id,
                        },
                        style: {
                            width: size,
                            height: size,
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
                disabled={!accountId}
                onClick={() => {
                    if (!accountId) return;
                    buy(priceYocto, listing.token_id, listing.nft_contract_id);
                }}
                style={{
                    border: "1px solid black",
                    backgroundColor: "white",
                    color: "black",
                    fontSize: "18px",
                    cursor: "pointer",
                }}
            >
                Buy {priceNear} N
            </button>
        </div>
    );
};