function redirectHome() {
  window.location.href = "index.html";
}

window.addEventListener("load", function () {
  const cart = Cart(StorageCart());
  cart.init();
  Products(cart).init();
});