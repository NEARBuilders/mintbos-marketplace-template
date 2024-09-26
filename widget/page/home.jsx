const { getStoreNFTs, fetchNFTInfo } = VM.require(
  "${alias_GENADROP}/widget/Mintbase.utils.sdk"
) || {
  getStoreNFTs: () => new Promise((resolve) => resolve([])),
  fetchNFTInfo: () => {},
};

const { storeId } = props;

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

return (
  <Root>
    {loading ? (
      <h5>Loading...</h5>
    ) : (
      <>
        <div className="hero">
          <h1>Black Dragon Marketplace</h1>
        </div>
        {countNFTs > 0 ? (
          <>
            <Cards>
              {nftData &&
                nftData.map((data, index) => {
                  /* will porpbably have to move this to mintbos sdk*/
                  const { infoNFT, dataTransaction } = fetchNFTInfo(
                    data?.metadata_id
                  );
                  data.listings = infoNFT.listings;
                  return (
                    <Widget
                      src={`${config_account}/widget/components.NFT.Card`}
                      props={{
                        data,
                        key: index,
                        page: "home",
                      }}
                    />
                  );
                })}
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
          <h5>No items found.</h5>
        )}
      </>
    )}
  </Root>
);
