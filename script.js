// Select items to be used for the project
const cartButton = document.querySelector("#cart-button");
const cartContent = document.querySelector("#cart-content");
const productTemplate = document.querySelector("template");
const productsGrid = document.querySelector("#products-grid");
let requestURL = "./items.json";

// Show or hide the modal when it is clicked
cartButton.addEventListener("click", showHideCartModal);
function showHideCartModal() {
  cartContent.classList.toggle("invisible");
}

fetchJSONData(requestURL);

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
    productCategory.innerText = product.category;
    productName.innerText = product.name;
    // Since the JSON file contains the price as an integer and in cents we divide by 100
    productPrice.innerText = `$${(product.priceCents / 100).toFixed(2)}`;
    productId.dataset.productId = product.id;
    console.log(clonedTemplate);
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
    renderProducts(products);
  };
}

// <div class="lg:w-1/4 md:w-1/2 p-4 w-full">
//   <div class="block relative h-48 rounded overflow-hidden">
//     <img
//       alt="ecommerce"
//       class="object-cover object-center w-full h-full block"
//       src="https://dummyimage.com/420x260/F00/F00"
//     />
//   </div>
//   <div class="mt-4 flex items-end justify-between">
//     <div>
//       <h3 class="text-gray-500 text-xs tracking-widest title-font uppercase mb-1">
//         Primary Color
//       </h3>
//       <h2 class="text-gray-900 title-font text-lg font-medium">Red</h2>
//       <p class="mt-1">$16.00</p>
//     </div>
//     <button class="text-white py-2 px-4 text-xl bg-blue-500 rounded hover:bg-blue-700">
//       Add To Cart
//     </button>
//   </div>
// </div>;
