const Products = function () {
  let pageIndex = 1;
  let pageSize = 10;
  let searchValue = "";

  const setPageIndex = function (index) {
    pageIndex = index;
  };

  const setPageSize = function (size) {
    pageSize = size;
  };

  const setSearch = function (search) {
    searchValue = search;
  };

  const handlePreviousPage = function (e) {
    const button = document.getElementById("previous");
    const index = button.getAttribute("data-index");
    if (index) {
      setPageIndex(index);
      searchProducts();
    }
  };

  const handleNextPage = function (e) {
    const button = document.getElementById("next");
    const index = button.getAttribute("data-index");
    console.log(index);
    if (index) {
      setPageIndex(index);
      searchProducts();
    }
  };

  const handlePageSize = function (e) {
    setPageSize(e.target.value);
    searchProducts();
  };

  const handleSearchChange = function (e) {
    setSearch(e.target.value);
    searchProducts();
  };

  const setPagination = function (previousUrl, nextUrl) {
    const previousButton = document.getElementById("previous");
    const nextButton = document.getElementById("next");

    if (previousUrl !== null) {
      const index = previousUrl.split("=")[1];
      previousButton.setAttribute("data-index", index);
    } else {
      previousButton.removeAttribute("data-index");
    }

    if (nextUrl !== null) {
      const index = nextUrl.split("=")[1];
      nextButton.setAttribute("data-index", index);
    } else {
      nextButton.removeAttribute("data-index");
    }
  };

  const setEmptyProducts = function () {
    const emptyContainer = document.getElementById("products-empty");
    emptyContainer?.classList.remove("disable");
  };

  const removeEmptyProducts = function () {
    const emptyContainer = document.getElementById("products-empty");
    emptyContainer?.classList.add("disable");
  };

  const setProducts = function (products) {
    if (products === null) {
      setEmptyProducts();
      return "";
    }

    const _products = JSON.parse(products);

    if (_products.data.length === 0) {
      setEmptyProducts();
      return "";
    }

    console.log(_products);

    let elements = "";
    for (let index = 0; index < _products.data.length; index++) {
      const product = _products.data[index];

      let quantity = "Esgotado";
      let availabilityClass = "sold-off";
      let addCartButton = "";
      if (product.quantidade > 0) {
        quantity = `${product.quantidade} unidades`;
        availabilityClass = "";
        addCartButton = `
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
          <button class="btn btn-primary" type="button">Adicionar</button>
        </div>
        `
      }

      elements += `
        <div class="col">
          <div class="card shadow-sm ${availabilityClass}">
            <div class="products-img-container">
              <img src="${product.imagem}" class="card-img-top" alt="${product.descricao}" />
            </div>
            <div class="card-body">
              <h5 class="card-title fs-6">${product.descricao}</h5>
              <span class="card-text fs-6">
                <small class="text-muted">${quantity}</small> </span
              ><br />
              <span class="card-text fs-6">
                <small class="text-muted">R$ ${product.custo_total}</small> </span
              ><br />
              ${addCartButton}
            </div>
          </div>
        </div>
      `;
    }

    setPagination(_products.prev_page_url, _products.next_page_url);

    return elements;
  };

  const searchProducts = async function () {
    removeEmptyProducts();

    const searchInput = document.getElementById("products-spinner");
    const productsItems = document.getElementById("products-items");
    searchInput?.classList.remove("disable");
    productsItems?.classList.add("disable");
    const products = await search({
      page: pageIndex,
      perPage: pageSize,
      searchValue,
    });

    searchInput?.classList.add("disable");

    productsItems.innerHTML = setProducts(products);

    productsItems?.classList.remove("disable");
  };

  const initPageSize = function () {
    const searchInput = document.getElementById("products-size");
    if (searchInput) {
      searchInput.addEventListener("change", handlePageSize);
    }
  };

  const initSearchForm = function () {
    const searchInput = document.getElementById("products-search");
    if (searchInput) {
      searchInput.addEventListener("change", handleSearchChange);
    }
  };

  const initPagination = function () {
    const previousButton = document.getElementById("previous");
    const nextButton = document.getElementById("next");
    previousButton?.addEventListener("click", handlePreviousPage);
    nextButton?.addEventListener("click", handleNextPage);
  };

  const init = function () {
    initPageSize();
    initSearchForm();
    searchProducts();
    initPagination();
  };

  return {
    init,
  };
};

window.addEventListener("load", function () {
  Products().init();
});
