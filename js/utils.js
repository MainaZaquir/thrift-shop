/**
 * Formats a price in Kenyan Shillings
 * @param {number} price - The price to format
 * @returns {string} The formatted price
 */
function formatPrice(price) {
  if (typeof price !== 'number' || isNaN(price)) {
    return 'Price unavailable';
  }
  return `Ksh. ${price.toLocaleString('en-KE')}`;
}

/**
 * Formats a date in a readable format
 * @param {string} dateString - The date string to format
 * @returns {string} The formatted date
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  if (isNaN(date)) {
    return 'Date unavailable';
  }
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString('en-KE', options);
}

/**
 * Updates the current timestamp using formatDate
 */
function updateTimestamp() {
  const timestampElement = document.getElementById('timestamp');
  if (!timestampElement) return;

  const now = new Date();
  timestampElement.textContent = formatDate(now.toISOString());
}

/**
 * Observe elements for lazy loading or any custom action
 * @param {NodeList} targets - Elements to observe
 * @param {Function} callback - Callback to execute when element enters viewport
 */
function observeElements(targets, callback) {
  if (!callback || typeof callback !== 'function') {
    console.error('A callback function must be provided to observeElements');
    return;
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry.target);
          observerInstance.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px 50px 0px'
    });

    targets.forEach(target => {
      observer.observe(target);
    });
  } else {
    // Fallback for older browsers
    targets.forEach(target => {
      callback(target);
    });
  }
}

/**
 * Updates the product count display
 * @param {number} count - The count to display
 * @param {number} total - The total number of products
 */
function updateProductCount(count, total) {
  const productCountElement = document.getElementById('productCount');
  if (!productCountElement) return;

  if (count === total) {
    productCountElement.textContent = `Showing all ${count} products`;
  } else {
    productCountElement.textContent = `Showing ${count} of ${total} products`;
  }
}

/**
 * Creates a new HTML element with optional classes and attributes
 * @param {string} tag - The tag name of the element
 * @param {string} [classNames=''] - Space-separated class names
 * @param {Object} [attributes={}] - Attributes to set on the element
 * @returns {HTMLElement} The created element
 */
function createElement(tag, classNames = '', attributes = {}) {
  const element = document.createElement(tag);
  if (classNames) element.className = classNames;
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
}