// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(key) {
  const queryString = window.location.search;
  const queryParams = new URLSearchParams(queryString);
  return queryParams.get(key);
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false,
) {
  const htmlStrings = list.map(templateFn);
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

async function loadTemplate(path) {
  const response = await fetch(path);

  const template = await response.text();
  return template;
}

// Cart count indicator
export function cartCount(count = 0) {
  const cartIndicator = document.querySelector("sup");
  const currentCart = getLocalStorage("so-cart");

  try {
    // if cart isn't empty...
    if (currentCart !== null) {
      // cycle through and count each item
      currentCart.forEach((i) => {
        count += parseInt(i.Quantity); // parsing int to prevent leading 0
      });
      cartIndicator.classList.add("cart-count");
      // update html
      cartIndicator.innerText = count;
    }
    if (count <= 0) {
      cartIndicator.classList.remove("cart-count");
      cartIndicator.innerText = "";
    }
  } catch {
    console.error("Error in cartCount() if-statement.");
  }
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("/partials/header.html");
  const footerTemplate = await loadTemplate("/partials/footer.html");
  const headerElement = document.querySelector("header");
  const footerElement = document.querySelector("footer");
  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
  cartCount();
}

export function alertMessage(message, scroll = true) {
  // find the main html element to add the banner to
  const main = document.querySelector("main");

  // create the banner div and give it the css class
  const banner = document.createElement("div");
  banner.classList.add("alert-banner");

  // create the message paragraph and add to banner
  const msg = document.createElement("p");
  msg.innerText = message;
  banner.append(msg);

  // create the dismiss image and add it to the banner
  const alertImage = document.createElement("img");
  alertImage.src = "/images/alert-icon.svg";
  banner.appendChild(alertImage);

  // add onclick listner and look for clicking of the dismiss image
  banner.addEventListener("click", (ev) => {
    if (ev.target.tagName === "IMG") {
      main.removeChild(banner);
    }
  });

  // add the banner to the top of the page
  main.prepend(banner);

  // scroll to the top so the message is visible
  if (scroll) {
    window.scrollTo(0, 0);
  }
}
