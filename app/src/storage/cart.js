const StorageCart = function () {
  const saveCart = function (cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const getCart = () => {
    const cart = localStorage.getItem("cart");

    if(cart === null) return null;
     
    return JSON.parse(cart);
  };

  return {
    saveCart,
    getCart,
  };
};
