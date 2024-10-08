/**
 * Items must have "id" and "price" properties
 */

const CART_KEY = "${alias_CART_KEY";
const DEFAULT_CART = {};

return {
  getCart: () => {
    const cart = JSON.parse(
      Storage.get(CART_KEY) ?? JSON.stringify(DEFAULT_CART)
    );
    return cart;
  },
  getCartItemCount: () => {
    const cart = JSON.parse(
      Storage.get(CART_KEY) ?? JSON.stringify(DEFAULT_CART)
    );
    return Object.keys(cart).length;
  },
  getCartTotal: () => {
    const cart = JSON.parse(
      Storage.get(CART_KEY) ?? JSON.stringify(DEFAULT_CART)
    );
    let total = 0;

    Object.values(cart).forEach((item) => {
      total += Number(item.price);
    });

    return total;
  },
  addItemsToCart: (items) => {
    const cart = JSON.parse(
      Storage.get(CART_KEY) ?? JSON.stringify(DEFAULT_CART)
    );
    if (Array.isArray(items)) {
      items.forEach((item) => {
        cart[item.token_id] = item;
      });
    } else if (typeof items === "object") {
      cart[items.token_id] = items;
    } else {
      console.log("Attempted to add invalid item to cart, item: ", items);
      return;
    }

    Storage.set(CART_KEY, JSON.stringify(cart));
    console.log("added successfully to cart", cart);
  },
  removeItemsFromCart: (items) => {
    const cart = JSON.parse(
      Storage.get(CART_KEY) ?? JSON.stringify(DEFAULT_CART)
    );
    if (Array.isArray(items)) {
      items.forEach((item) => {
        delete cart[item.token_id];
      });
    } else if (typeof items === "object") {
      delete cart[items.token_id];
    } else {
      console.log("Attempted to remove invalid item from cart, item: ", items);
      return;
    }

    Storage.set(CART_KEY, JSON.stringify(cart));
  },
  clearCart: () => {
    Storage.set(CART_KEY, JSON.stringify(DEFAULT_CART));
  },
  updateItemInCart: (item) => {
    const cart = JSON.parse(
      Storage.get(CART_KEY) ?? JSON.stringify(DEFAULT_CART)
    );
    if (cart[item.token_id]) {
      cart[item.token_id] = item; // Update the item in the cart directly
      Storage.set(CART_KEY, JSON.stringify(cart));
    } else {
      console.log("Item not found in cart:", item);
    }
    console.log("cart", cart);
  },
  itemExistsInCart: (item) => {
    const cart = JSON.parse(
      Storage.get(CART_KEY) ?? JSON.stringify(DEFAULT_CART)
    );
    return cart[item.token_id] !== undefined;
  },
};
