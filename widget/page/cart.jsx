const {
  removeItemsFromCart,
  itemExistsInCart,
  getCart,
  getCartItemCount,
  getCartTotal,
} = VM.require("${config_account}/widget/lib.cart") || {
  removeItemsFromCart: () => {},
  itemExistsInCart: () => false,
  getCart: () => {},
  getCartItemCount: () => {},
  getCartTotal: () => {},
};

const Root = styled.div`
  display: flex;
  .rhs {
    flex-wrap: nowrap;
    white-space: nowrap;
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

const nearIcon = (
  <svg
    width="40px"
    height="40px"
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

const cart = getCart();
const count = getCartItemCount();
const total = getCartTotal();
return (
  <div>
    <h1>Cart {count ? count : "Empty"}</h1>
    <Root>
      <div className="w-100">
        <Cards>
          {cart &&
            Object.values(cart).map((data, index) => (
              <Widget
                src={`${config_account}/widget/components.NFT.Card`}
                props={{
                  data,
                  key: index,
                }}
              />
            ))}
        </Cards>
        {count ? (
          <button
            onClick={() => {
              removeItemsFromCart(Object.values(cart));
            }}
          >
            Clear Cart
          </button>
        ) : (
          ""
        )}
      </div>
      {count ? (
        <div className="rhs">
          <h2 className="d-flex">
            Total: {total} {nearIcon}
          </h2>
        </div>
      ) : (
        ""
      )}
    </Root>
  </div>
);
