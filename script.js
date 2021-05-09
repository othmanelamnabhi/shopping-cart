// Select items to be used for the project
const cartButton = document.querySelector("#cart-button");
const cartContent = document.querySelector("#cart-content");
const productTemplate = document.querySelector("#product-template");
const cartItemTemplate = document.querySelector("#cart-item-template");
const productsGrid = document.querySelector("#products-grid");
const cartItemsGrid = document.querySelector("#cart-items-grid");
let productsArray = [];
let requestURL = "./items.json";

// Load cart items stored in local storage if present
let cartItemsArray = loadCartItems() || [];
cartItemsArray.forEach((cartItem) => {
  renderCartItem(cartItem);
  updateBadgeCount();
  updateCartTotal();
  showCartIcon();
});

// Show or hide the modal when it is clicked
cartButton.addEventListener("click", showHideCartModal);
function showHideCartModal() {
  cartContent.classList.toggle("invisible");
}
// Fetch and render products from JSON file
if (window.location.pathname == "/store.html") {
  fetchJSONData(requestURL);
}

// Add event listener to all add to cart buttons
document.addEventListener("click", (e) => {
  if (!e.target.matches("[data-product-id]")) return;

  productsArray.forEach((product) => {
    if (e.target.dataset.productId == product.id) {
      // If product already exists in cart, just increment total and quantity
      if (
        cartItemsGrid.querySelector(
          `[data-cart-item-id="${e.target.dataset.productId}"]`
        )
      ) {
        const cartItem = cartItemsGrid.querySelector(
          `[data-cart-item-id="${e.target.dataset.productId}"]`
        );
        cartItem
          .querySelector("[data-cart-item-multiplier]")
          .classList.remove("invisible");
        // Loop through Cart Items Array and increment multiplier and price
        cartItemsArray.forEach((item) => {
          if (item.id == e.target.dataset.productId) {
            item.multiplier += 1;
            cartItem.querySelector(
              "[data-cart-item-multiplier]"
            ).innerText = `x${item.multiplier}`;
            cartItem.querySelector(
              "[data-cart-item-price]"
            ).innerText = convertFromCentsToDollars(
              item.multiplier * item.priceCents
            );
          }
        });
        saveCartItems(cartItemsArray);
        updateCartTotal();
      } else {
        // if product is not in cart, render it
        product.multiplier = 1;
        renderCartItem(product);
        cartItemsArray.push(product);
        saveCartItems(cartItemsArray);
        updateCartTotal();
        updateBadgeCount();
        showCartIcon();
      }
    }
  });
});

function renderCartItem(object) {
  let clonedCartItemTemplate = cartItemTemplate.content.cloneNode(true);

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
  const cartItemId = clonedCartItemTemplate.querySelector(
    "[data-cart-item-id]"
  );

  cartItemColor.src = `https://dummyimage.com/210x130/${object.imageColor}/${object.imageColor}`;
  cartItemName.innerText = object.name;
  // Since the JSON file contains the price as an integer and in cents we divide by 100
  cartItemPrice.innerText = convertFromCentsToDollars(object.priceCents);
  cartItemId.dataset.cartItemId = object.id;
  if (object.multiplier > 1) {
    cartItemMultiplier.classList.remove("invisible");
  }
  cartItemsGrid.appendChild(clonedCartItemTemplate);
}

// Add event listener to the delete button of CART ITEMS
document.addEventListener("click", (e) => {
  if (!e.target.matches("[data-remove-from-cart-button]")) return;
  const cartItemToBeDeleted = e.target.closest("[data-cart-item-id]");
  cartItemToBeDeleted.remove();

  // Update the array of cart items with the remaining ones
  cartItemsArray = cartItemsArray.filter((cartItem) => {
    return cartItemToBeDeleted.dataset.cartItemId != cartItem.id;
  });
  saveCartItems(cartItemsArray);
  updateCartTotal();
  updateBadgeCount();
  hideCartIcon();
});

// Send a request and fetch data from JSON file then send array to renderProducts()
async function fetchJSONData(jsonLink) {
  const response = await fetch(jsonLink);
  const products = await response.json();
  returnProductArray(products);
  renderProducts(products);
}
// Grab the request response and push it into an array
function returnProductArray(requestResponse) {
  productsArray.push(...requestResponse);
}

// Dynamically render products from JSON file that we stored in an ARRAY
function renderProducts(arrayOfAllProducts) {
  arrayOfAllProducts.forEach((product) => {
    let clonedTemplate = productTemplate.content.cloneNode(true);
    // Add attributes to the HTML to make them easy to select and also to store data in case
    const productId = clonedTemplate.querySelector("[data-product-id]");
    const productName = clonedTemplate.querySelector("[data-product-name]");
    const productCategory = clonedTemplate.querySelector(
      "[data-product-category]"
    );
    const productPrice = clonedTemplate.querySelector("[data-product-price]");
    const productColor = clonedTemplate.querySelector("[data-product-color]");

    // Replace template text by text in the products array
    productColor.src = `https://dummyimage.com/420x260/${product.imageColor}/${product.imageColor}`;
    productCategory.innerText = product.category;
    productName.innerText = product.name;
    // Since the JSON file contains the price as an integer and in cents we divide by 100
    productPrice.innerText = `$${(product.priceCents / 100).toFixed(2)}`;
    productId.dataset.productId = product.id;
    productsGrid.appendChild(clonedTemplate);
  });
}

function convertFromCentsToDollars(amount) {
  return `$${(amount / 100).toFixed(2)}`;
}

function showCartIcon() {
  if (cartItemsArray.length > 0) {
    cartButton.classList.remove("invisible");
  }
}

function hideCartIcon() {
  if (cartItemsArray.length < 1) {
    cartButton.classList.add("invisible");
    cartContent.classList.add("invisible");
  }
}

function saveCartItems(array) {
  const GLOBAL_KEY = "SHOPPING CART PROJECT";
  localStorage.setItem(
    `${GLOBAL_KEY} - Cart Items`,
    JSON.stringify(cartItemsArray)
  );
}

function loadCartItems() {
  const GLOBAL_KEY = "SHOPPING CART PROJECT";
  return JSON.parse(localStorage.getItem(`${GLOBAL_KEY} - Cart Items`));
}

function updateBadgeCount() {
  const badge = document.querySelector("#cart-badge");
  badge.innerText = cartItemsArray.length;
}

function updateCartTotal() {
  const cartTotal = document.querySelector("#cart-total");
  const totalAmount = cartItemsArray.reduce((sum, currentvalue) => {
    return sum + currentvalue.multiplier * currentvalue.priceCents;
  }, 0);
  cartTotal.innerText = convertFromCentsToDollars(totalAmount);
}
