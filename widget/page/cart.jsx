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
          <h2>Total: {total}N</h2>
        </div>
      ) : (
        ""
      )}
    </Root>
  </div>
);
