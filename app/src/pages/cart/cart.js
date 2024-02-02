const Cart = function (storage) {
  let selectedProducts = [];
  let total = 0;
  let cartModal = undefined;
  let messageModal = undefined;
  let user = {
    name: "",
    cpf: "",
    email: "",
  };

  const getSelectedProducts = function () {
    return selectedProducts;
  };

  const checkDuplicateProduct = function (id) {
    const index = selectedProducts.findIndex((item) => item.id === id);
    if (index > -1) return true;
    return false;
  };

  const recalculateTotal = () => {
    let _total = 0;
    selectedProducts.forEach((item) => {
      _total += item.price * item.quantity;
    });

    total = _total;
  };

  const setTotal = function (value) {
    total = value.toFixed(2);
  };

  const setTotalDom = function () {
    const totalElement = document.querySelectorAll(".total");
    recalculateTotal();

    totalElement.forEach((item) => {
      item.innerText = `R$ ${total}`;
    });
  };

  const setQuantityProducts = function () {
    const quantityElement = document.getElementById("quantity");
    quantityElement.innerText = `${selectedProducts.length} Produto(s)`;
  };

  const updateDomProductItem = (id, price, quantity) => {
    const product = document.getElementById(`item-${id}`);
    product.querySelector(".item-quantity").innerText = quantity;
    product.querySelector(".item-price").innerText = `R$ ${price}`;
  };

  const addProduct = function (product) {
    selectedProducts.push({
      id: product.id,
      name: product.name,
      quantity: product.quantity,
      availableQuantity: product.availableQuantity,
      price: product.price,
      image: product.image,
      priceId: product.priceId,
      barCode: product.barCode,
    });

    const _total = total + product.price * product.quantity;
    setTotal(_total);

    setTotalDom();
    setQuantityProducts();

    displayNotification();
  };

  const removeAllProducts = () => {
    selectedProducts = [];

    setTotalDom();
    setQuantityProducts();
    setCartModal();
  };

  const removeProduct = function (id) {
    const index = selectedProducts.findIndex((item) => item.id === id);
    if (id > -1) {
      const item = selectedProducts.splice(index, 1);

      const _total = total - item[0].price * item[0].quantity;
      setTotal(_total);
    }

    setTotalDom();
    setQuantityProducts();
    setCartModal();
  };

  const increaseItemQuantity = function (id) {
    const item = selectedProducts.find((item) => item.id === id);

    if (item && item.quantity + 1 <= item.availableQuantity) {
      item.quantity += 1;
      const _total = total + item.price;
      setTotal(_total);
      updateDomProductItem(
        id,
        (item.price * item.quantity).toFixed(2),
        item.quantity
      );
      setTotalDom();
      setQuantityProducts();
    }
  };

  const decreaseItemQuantity = function (id) {
    const item = selectedProducts.find((item) => item.id === id);
    if (item && item.quantity - 1 > 0) {
      item.quantity -= 1;
      const _total = total - item.price;
      setTotal(_total);
    }

    if (item && item.quantity - 1 === 0) {
      removeProduct(id);
      return;
    }

    updateDomProductItem(
      id,
      (item.price * item.quantity).toFixed(2),
      item.quantity
    );
    setTotalDom();
    setQuantityProducts();
  };

  const showCart = function () {
    setCartModal();
    if (cartModal) cartModal.show();
  };

  const createProductCheckout = async function () {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    const _date = date.toISOString().split("T")[0];

    const result = await createCheckout({
      name: user.name,
      cpf: user.cpf,
      email: user.email,
      total,
      expireDate: _date,
      boletoNumber: 8880,
      items: selectedProducts.map((item) => {
        return {
          produto: {
            codigo_barras: parseInt(item.barCode),
          },
          valor_unitario: item.price,
          quantidade: item.quantity,
          fk_tipo_preco_id: 1,
        };
      }),
    });

    cartModal.hide();
    removeAllProducts();

    const _result = JSON.parse(result);

    displayMessageModal(
      `Pedido criado com succeso. Codigo da venda: ${_result.codigo_venda}`,
      "success"
    );
  };

  const setCartModal = function () {
    const modalProductsContainer = document.getElementById(
      "modal-products-container"
    );

    let productsElements = `
      <div class="d-flex justify-content-between" class="quantity">
        <span>Você tem ${selectedProducts.length} item(s) no carrinho</span>
      </div>
    `;
    for (let index = 0; index < selectedProducts.length; index++) {
      const product = selectedProducts[index];
      const _price = product.price * product.quantity;

      productsElements += `
        <div
          class="d-flex justify-content-between align-items-center mt-3 p-2 items rounded"
          id="item-${product.id}"
        >
          <div class="d-flex flex-row">
            <img
              class="rounded"
              src="${product.image}"
              width="40"
            />
            <div class="mx-2">
              <span class="font-weight-bold d-block"
                >${product.name}</span
              >
            </div>
          </div>
          <div class="d-flex flex-row align-items-center">
            <span class="d-block item-quantity">${product.quantity}</span
            ><span class="d-block mx-5 font-weight-bold item-price">R$ ${_price}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-arrow-down-circle cart-icon decrease-product"
              viewBox="0 0 16 16"
              data-key="${product.id}"
            >
              <path
                fill-rule="evenodd"
                d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-arrow-up-circle cart-icon increase-product"
              viewBox="0 0 16 16"
              data-key="${product.id}"
            >
              <path
                fill-rule="evenodd"
                d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-trash3 cart-icon remove-product"
              viewBox="0 0 16 16"
              data-key="${product.id}"
            >
              <path
                d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"
              />
            </svg>
          </div>
        </div>
      `;
    }

    modalProductsContainer.innerHTML = productsElements;

    setButtons();
  };

  const displayMessageModal = (message, alertType) => {
    const modalBody = document
      .getElementById("messageModal")
      .querySelector(".modal-body");

    modalBody.innerHTML = `
      <div class="alert alert-${alertType}">
        ${message}
      </div>
    `;

    messageModal.show();
  };

  const setMessageModal = function () {
    const _messageModal = new bootstrap.Modal("#messageModal", {});
    messageModal = _messageModal;
  };

  const setShowCart = function () {
    const cart = document.getElementById("cart");
    const _cartModal = new bootstrap.Modal("#cartModal", {});
    cart.addEventListener("click", (e) => {
      showCart();
    });
    cartModal = _cartModal;
  };

  const setButtons = function () {
    document.querySelectorAll(".remove-product").forEach((item) => {
      item.addEventListener("click", (e) => {
        const key = e.target.getAttribute("data-key");
        removeProduct(key);
      });
    });
    document.querySelectorAll(".increase-product").forEach((item) => {
      item.addEventListener("click", (e) => {
        const key = e.target.getAttribute("data-key");
        increaseItemQuantity(key);
      });
    });
    document.querySelectorAll(".decrease-product").forEach((item) => {
      item.addEventListener("click", (e) => {
        const key = e.target.getAttribute("data-key");
        decreaseItemQuantity(key);
      });
    });
  };

  const handleInputChange = function (field, value) {
    user[field] = value;
  };

  const displayNotification = () => {
    const cartNotification = document.getElementById("cart-notification");
    console.log(cartNotification);
    cartNotification.classList.add("show");

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    setTimeout(() => {
      cartNotification.classList.remove("show");
    }, 2000);
  };

  const setInputFields = function () {
    document.querySelectorAll(".purchase-inputs").forEach((item) => {
      item.addEventListener("change", (e) => {
        handleInputChange(e.target.name, e.target.value);
      });
    });
  };

  const setClearCart = function () {
    document.getElementById("clear-cart").addEventListener("click", (e) => {
      removeAllProducts();
    });
  };

  const setCheckout = function () {
    document
      .getElementById("confirm-purchase")
      .addEventListener("click", (e) => {
        if (
          selectedProducts.length > 0 &&
          user.cpf !== "" &&
          user.email !== "" &&
          user.name !== ""
        ) {
          createProductCheckout();
        }
      });
  };

  const init = function () {
    const cart = storage.getCart();

    if (cart !== null) {
      selectedProducts = cart;
      recalculateTotal();
    }

    setTotalDom();
    setQuantityProducts();
    setShowCart();
    setClearCart();
    setCheckout();
    setInputFields();
    setMessageModal();
  };

  return {
    init,
    addProduct,
    getSelectedProducts,
    checkDuplicateProduct,
  };
};
