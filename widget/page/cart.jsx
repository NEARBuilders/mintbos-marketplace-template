const {
  removeItemsFromCart,
  itemExistsInCart,
  getCart,
  getCartItemCount,
  getCartTotal,
} = VM.require("${config_account}/widget/SDK.cart") || {
  removeItemsFromCart: () => {},
  itemExistsInCart: () => false,
  getCart: () => {},
  getCartItemCount: () => {},
  getCartTotal: () => {},
};
return <h1>Cart</h1>;
