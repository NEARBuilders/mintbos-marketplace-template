  const { getStoreNFTs } = VM.require(
    "${alias_GENADROP}/widget/Mintbase.utils.sdk"
  );


const product = ({ storeId}) => {

    const perPage = 52;
    const [nftData, setNftData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [countNFTs, setCountNFTs] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    useEffect(() => {
        getStoreNFTs({
            offset: (pageNumber - 1) * perPage,
            id: storeId ?? "nft.genadrop.near",
            limit: perPage,
            listedFilter: true,
            accountId: context?.accountId || "jgodwill.near",
        })
            .then(({ results, totalRecords, errors }) => {
                if (errors) {
                    // handle those errors like a pro
                    console.error(errors);
                }
                // do something great with this precious data
                setCountNFTs(totalRecords);
                setLoading(false);
                setNftData(results);
            })
            .catch((error) => {
                // handle errors from fetch itself
                console.error(error);
            });
    }, [limit, offset, pageNumber]);

    const Root = styled.div`
    .pagination_container {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      align-content: center;
    }
`;

const Cards = styled.div`
display: grid;
grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
grid-gap: 24px;
border-radius: 0.7em;
width: 100%;
justify-content: center;
margin: 1em auto;
@media (max-width: 500px) {
  margin-left: 0.5rem !important;
}
@media (max-width: 380px) {
  margin-left: 0.1rem !important;
}
`;
    return <Root>{countNFTs > 0 ? (
        <>
            <Cards>
                {nftData &&
                    nftData.map((data, index) => (
                        <Widget
                            src="${alias_GENADROP}/widget/Mintbase.NFT.Index"
                            props={{
                                data,
                                key: index,
                            }}
                        />
                    ))}
            </Cards>
            <div className="pagination_container">
                <p className="w-100 px-4">
                    <Widget
                        src="${alias_GENADROP}/widget/Mintbase.TablePagination"
                        props={{
                            totalItems: countNFTs,
                            itemsPerPage: perPage,
                            notInTable: true,
                            currentPage: pageNumber,
                            onPageChange: (pageNumber) => setPageNumber(pageNumber),
                        }}
                    />
                </p>
            </div>
        </>
    ) : (
        <h5>The store has no listed NFTs yet.</h5>
    )}
    </Root>
    {/* <div className="d-flex gap-4 flex-wrap">
    {data.body.data?.mb_views_active_listings_by_storeIdap(
        (listing, i) => {
            const priceYocto = listing.price
                .toLocaleString()
                .replace(/,/g, "")
                .replace(/\s/g, "");
            const priceNear = YoctoToNear(priceYocto);

            return (
                <div className="d-flex flex-column gap-1 w-15 p-3">
                    <a
                        href={`https://mintbase.xyz/meta/${listing.metadata_id}/`}
                        target="_blank"
                    >
                        <Widget
                            src="mob.near/widget/NftImage"
                            props={{
                                nft: {
                                    tokenId: listing.token_id,
                                    storeId: listing.nft_storeIdd,
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
                    </a>
                    <button
                        disabled={!accountId}
                        onClick={() => {
                            if (!accountId) return;
                            buy(priceYocto, listing.token_id, listing.nft_storeIdd);
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
        }
    )}
</div>; */}
};

return <product {...props} />;