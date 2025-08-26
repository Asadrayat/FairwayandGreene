class ProductCard extends HTMLElement {
  constructor() {
    super();
    this.attachEventListeners();
  }

  attachEventListeners() {
    // quick view
    if (this.querySelector(".pc-quick-add-btn")) {
      this.querySelector(".pc-quick-add-btn").addEventListener(
        "click",
        this.handleQuickViewEvent.bind(this)
      );
    }
  }

  handleQuickViewEvent(e) {
    const { productHandle, variantId } = e.currentTarget.dataset;
    const loadingAnimation = document.getElementById("loading-animation");
    loadingAnimation.classList.add("visible");

    fetch(`/products/${productHandle}`)
      .then((res) => res.text())
      .then((res) => {
        const html = new DOMParser().parseFromString(res, "text/html");
        console.log(html);
        if (html.querySelector(".pinfo-bundle-wrapper")) {
          html.querySelector(".pinfo-bundle-wrapper").remove();
        }
        if (html.querySelector("product-information")) {
          html
            .querySelector("product-information")
            .setAttribute("data-update-url", "false");
        }
        productQuickView.container.renderContent(
          html.querySelector("#product-information-container").innerHTML
        );
        // window.sizeGuide();
        productQuickView.container.open();
        // window.viewerCountPastDay();  
      })
      .catch((err) => console.log(err))
      .finally(() => {
        loadingAnimation.classList.remove("visible");
      });
  }
}

customElements.define("product-card", ProductCard);

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".cp2-quick-add-btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const variantId = this.dataset.variantId;
      const miniCart =
        document.querySelector("mini-cart") ||
        document.querySelector("cart-drawer");

      if (!variantId) return;

      const formData = new FormData();
      formData.append("id", variantId);
      formData.append("quantity", 1);

      if (miniCart && miniCart.getSectionsToRender) {
        formData.append(
          "sections",
          miniCart.getSectionsToRender().map((section) => section.id)
        );
      }
      formData.append("sections_url", window.location.pathname);
      fetch(window.Shopify.routes.root + "cart/add.js", {
        method: "POST",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.status) {
            if (typeof publish === "function") {
              publish(PUB_SUB_EVENTS.cartError, {
                source: "quick-add-button",
                productVariantId: variantId,
                errors: response.errors || response.description,
              });
            }
            throw new Error(response.errors || response.description);
          }

          if (miniCart && miniCart.renderContents) {
            miniCart.renderContents(response);
          }

          if (miniCart && miniCart.open) {
            // Remove is-empty class if it exists
            miniCart.classList.remove("is-empty");
            miniCart.open();
          }

          if (typeof publish === "function") {
            publish(PUB_SUB_EVENTS.cartUpdate, {
              source: "quick-add-button",
              productVariantId: variantId,
            });
          }
        })
        .catch((error) => {
          console.error("Add to cart failed:", error);
        });
    });
  });
});
