document.addEventListener('DOMContentLoaded', function() {
  init();
  setupEventListeners();
});

function init() {
  updateTimestamp();
  setInterval(updateTimestamp, 60000);
  renderProducts(products);
}

function setupEventListeners() {
  document.getElementById('sortBy')?.addEventListener('change', handleSortChange);
  document.getElementById('filterBy')?.addEventListener('change', handleFilterChange);
}

function handleSortChange(event) {
  const sortValue = event.target.value;
  let sortedProducts = [...products];

  switch (sortValue) {
    case 'nameAsc':
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'nameDesc':
      sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'priceLow':
      sortedProducts.sort((a, b) => a.price - b.price);
      break;
    case 'priceHigh':
      sortedProducts.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      sortedProducts.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
      break;
    default:
      // Default sorting (no sort)
      break;
  }

  // Apply any active filters
  const currentFilter = document.getElementById('filterBy')?.value;
  if (currentFilter && currentFilter !== 'all') {
    sortedProducts = filterProducts(sortedProducts, currentFilter);
  }

  renderProducts(sortedProducts);
}

function handleFilterChange(event) {
  const filterValue = event.target.value;
  let filteredProducts = filterProducts(products, filterValue);

  // Apply any active sorting
  const currentSort = document.getElementById('sortBy')?.value;
  if (currentSort && currentSort !== 'default') {
    const sortEvent = { target: { value: currentSort } };
    handleSortChange(sortEvent);
    return;
  }

  renderProducts(filteredProducts);
}

function filterProducts(productsToFilter, filterValue) {
  switch (filterValue) {
    case 'inStock':
      return productsToFilter.filter(product => product.inStock);
    case 'outOfStock':
      return productsToFilter.filter(product => !product.inStock);
    default:
      return productsToFilter;
  }
}

function renderProducts(productsToRender) {
  const productsGrid = document.getElementById('productsGrid');
  const loadingSpinner = document.getElementById('loadingSpinner');
  const template = document.getElementById('productCardTemplate');
  
  if (!productsGrid || !template) {
    console.error("Missing necessary elements: productsGrid or productCardTemplate");
    return;
  }

  // Clear the grid
  productsGrid.innerHTML = '';
  
  if (loadingSpinner) {
    productsGrid.appendChild(loadingSpinner);
  }

  setTimeout(() => {
    loadingSpinner?.remove();
    
    if (productsToRender.length === 0) {
      const noProductsMessage = document.createElement('p');
      noProductsMessage.textContent = 'No products found matching your criteria.';
      noProductsMessage.className = 'no-products-message';
      productsGrid.appendChild(noProductsMessage);
      updateProductCount(0, products.length);
      return;
    }

    productsToRender.forEach(product => {
      const productCard = template.content.cloneNode(true);
      if (!(productCard instanceof Node)) {
        console.error("Invalid product card structure.");
        return;
      }

      const productImage = productCard.querySelector('.product-image');
      if (productImage) {
        productImage.setAttribute('data-src', product.imageUrl);
        productImage.setAttribute('alt', product.name);
        productImage.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
      }
      
      const nameElement = productCard.querySelector('.product-name');
      if (nameElement) {
        nameElement.textContent = product.name;
      }

      const priceElement = productCard.querySelector('.product-price');
      if (priceElement) {
        priceElement.textContent = formatPrice(product.price);
      }
      
      const stockElement = productCard.querySelector('.product-stock');
      if (stockElement) {
        stockElement.innerHTML = '<span class="stock-indicator"></span> ' + (product.inStock ? 'In Stock' : 'Out of Stock');
        stockElement.classList.add(product.inStock ? 'in-stock' : 'out-of-stock');
      }

      productsGrid.appendChild(productCard);
    });

    const productImages = document.querySelectorAll('.product-image[data-src]');
    observeElements(productImages, (element) => {
      if (element.dataset.src) {
        element.src = element.dataset.src;
      }
    });

    updateProductCount(productsToRender.length, products.length);
  }, 200);
}