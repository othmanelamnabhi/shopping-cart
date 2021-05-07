// Select items to be used for the project
const cartButton = document.querySelector("#cart-button");
const cartContent = document.querySelector("#cart-content");
const productTemplate = document.querySelector("#product-template");
const cartItemTemplate = document.querySelector("#cart-item-template");
const productsGrid = document.querySelector("#products-grid");
const cartItemsGrid = document.querySelector("#cart-items-grid");
let productsArray = [];
let requestURL = "./items.json";

// Show or hide the modal when it is clicked
cartButton.addEventListener("click", showHideCartModal);
function showHideCartModal() {
  cartContent.classList.toggle("invisible");
}
// Fetch and render products from JSON file
fetchJSONData(requestURL);
// Add event listener to all add to cart buttons
document.addEventListener("click", renderCartItem);

function renderCartItem(event) {
  if (!event.target.matches("[data-product-id]")) return;
  let clonedCartItemTemplate = cartItemTemplate.content.cloneNode(true);
  // Add attributes to the HTML to make them easy to select and also to store data in case
  // const productId = clonedTemplate.querySelector("[data-product-id]");
  const cartItemMultiplier = clonedCartItemTemplate.querySelector(
    "[data-cart-item-multiplier]"
  );
  const cartItemName = clonedCartItemTemplate.querySelector(
    "[data-cart-item-name]"
  );
  const cartItemPrice = clonedCartItemTemplate.querySelector(
    "[data-cart-item-price]"
  );
  const cartItemColor = clonedCartItemTemplate.querySelector(
    "[data-cart-item-color]"
  );

  // Replace template text by text in JSON file
  productsArray.forEach((product) => {
    console.log(event.target);
    if (event.target.dataset.productId == product.id) {
      cartItemColor.src = `https://dummyimage.com/210x130/${product.imageColor}/${product.imageColor}`;
      cartItemColor.dataset.cartItemColor = product.imageColor;
      cartItemName.innerText = product.name;
      cartItemName.dataset.cartItemName = product.name;
      // Since the JSON file contains the price as an integer and in cents we divide by 100
      cartItemPrice.innerText = `$${(product.priceCents / 100).toFixed(2)}`;
      cartItemPrice.dataset.productPrice = product.priceCents;

      //productId.dataset.productId = product.id;
      cartItemsGrid.appendChild(clonedCartItemTemplate);
    }
  });
}

// Dynamically render products from JSON file by using template
function renderProducts(productsArray) {
  productsArray.forEach((product) => {
    let clonedTemplate = productTemplate.content.cloneNode(true);
    // Add attributes to the HTML to make them easy to select and also to store data in case
    const productId = clonedTemplate.querySelector("[data-product-id]");
    const productName = clonedTemplate.querySelector("[data-product-name]");
    const productCategory = clonedTemplate.querySelector(
      "[data-product-category]"
    );
    const productPrice = clonedTemplate.querySelector("[data-product-price]");
    const productColor = clonedTemplate.querySelector("[data-product-color]");

    // Replace template text by text in JSON file
    productColor.src = `https://dummyimage.com/420x260/${product.imageColor}/${product.imageColor}`;
    productColor.dataset.productColor = product.imageColor;
    productCategory.innerText = product.category;
    productCategory.dataset.productCategory = product.category;
    productName.innerText = product.name;
    productName.dataset.productName = product.name;
    // Since the JSON file contains the price as an integer and in cents we divide by 100
    productPrice.innerText = `$${(product.priceCents / 100).toFixed(2)}`;
    productPrice.dataset.productPrice = product.priceCents;
    productId.dataset.productId = product.id;
    productsGrid.appendChild(clonedTemplate);
  });
}

// Send a request and fetch data from JSON file then send array to renderProducts()
function fetchJSONData(jsonLink) {
  let request = new XMLHttpRequest();
  request.open("GET", jsonLink);
  request.responseType = "json";
  request.send();

  request.onload = function () {
    const products = request.response;
    returnProductArray(products);
    renderProducts(products);
  };
}
// Grab the request response and push it into an array
function returnProductArray(requestResponse) {
  productsArray.push(...requestResponse);
}

// Try new approach
// Store the array in the JSON file in a variable
// Modify the renderProducts function, delete the attributes, keep only ID
