class ProductInformation extends HTMLElement {
  constructor() {
    super();
    this.handleEvents();
  }

  connectedCallback() {
    if (this.querySelector(".pinfo-gallery-swiper")) this.initSwiperSlider();
    // if (this.querySelector(".color-options .swiper")) this.initColorOptionsSwiper();
    this.querySelector("pinfo-variant-picker").addEventListener(
      "input",
      this.handleVariantEvent.bind(this)
    );
    this.loaderPdp();
    this.loaderPdpMobile();
    
    this.initMobileSwiper();
    this.initImageZoomOnHover();
  }
  loaderPdp() {
    this.querySelectorAll(".color__variant__btn").forEach(cvBtn => {
      cvBtn.addEventListener("click", () => {
        document.querySelectorAll(".info-media-image").forEach(e => {
          e.classList.add("pdp__image_loader"); // add loader
          setTimeout(() => {
            e.classList.remove("pdp__image_loader"); // remove after 2s
          }, 2000);
        });     
      })
    })    
  }
  loaderPdpMobile() {
    this.querySelectorAll(".color__variant__btn").forEach(cvBtn => {
      cvBtn.addEventListener("click", () => {
      document.querySelectorAll(".pdp_media__wrap_sm").forEach(e => {
        e.classList.add("pdp__image_loader"); // add loader
        setTimeout(() => {
          e.classList.remove("pdp__image_loader"); // remove after 2s
        }, 2000);
      });      
      })
    })    
  }
  initMobileSwiper() {
    this.mobielSwiper = new Swiper(".pdp-media-sm .swiper", {
      slidesPerView: 1,
      scrollbar: {
        el: ".swiper-scrollbar",
        draggable: true,
      },
      pagination: {
        el: ".pdp-media-sm .swiper-pagination",
      },
      on: {
        init: function () {
          document.querySelector(".total").textContent = this.slides.length;
          document.querySelector(".current").textContent = this.realIndex + 1;
        },
        slideChange: function () {
          document.querySelector(".current").textContent = this.realIndex + 1;
        },
      },
    });
  }

  initColorOptionsSwiper() {
    this.colorOptionsSwiper = new Swiper(".color-options .swiper", {
      slidesPerView: "auto",
      spaceBetween: 10,
      navigation: {
        nextEl: ".color-options .swiper-button-next",
        prevEl: ".color-options .swiper-button-prev",
      },
      on: {
        init: function () {
          const colorOptions = this.el.closest('.color-options');
          const nextButton = colorOptions.querySelector('.swiper-button-next');
          const prevButton = colorOptions.querySelector('.swiper-button-prev');

          const checkLockClasses = () => {
            if (nextButton.classList.contains('swiper-button-lock') && 
                prevButton.classList.contains('swiper-button-lock')) {
              colorOptions.classList.add('no-padding');
            } else {
              colorOptions.classList.remove('no-padding');
            }
          };

          checkLockClasses();

          const observer = new MutationObserver(checkLockClasses);
          observer.observe(nextButton, { attributes: true, attributeFilter: ['class'] });
          observer.observe(prevButton, { attributes: true, attributeFilter: ['class'] });
        },
      },
    });
  }
  

initImageZoomOnHover() {
  if (window.innerWidth <= 989) return;

  const imageContainers = this.querySelectorAll(".pdp__image");

  imageContainers.forEach((container) => {
    const img = container.querySelector("img.media");
    console.log(img)
    if (!img) return;

    img.style.transition = "transform 0.3s ease";

    let isZoomed = false;

    container.addEventListener("click", () => {
      isZoomed = !isZoomed;

      if (isZoomed) {
        container.classList.add("zoomed");
      } else {
        container.classList.remove("zoomed");
        img.style.transformOrigin = "center center";
      }
    });

    container.addEventListener("mousemove", (e) => {
      if (!isZoomed) return;

      const rect = img.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      img.style.transformOrigin = `${x}% ${y}%`;
    });

    container.addEventListener("mouseleave", () => {
      isZoomed = false;
      container.classList.remove("zoomed");
      img.style.transformOrigin = "center center";
    });
  });
}



  handleEvents() {


    this.form = this.querySelector('form[action$="/cart/add"]');
    this.cartDrawer = document.querySelector("cart-drawer");
    this.submitButton = this.querySelector('button[type="submit"]');

    if (this.form) {
      this.form.addEventListener("submit", this.handleAddToCart.bind(this));
    }
  }


  
  handleVariantEvent(e) {
  
    const { variantUrl } = e.target.dataset;
    // console.log(variantUrl)
    this.fetchData(variantUrl);
    this.updateURL(variantUrl);
    const variantId = Number(
      new URLSearchParams(variantUrl.split("?")[1]).get("variant")
    );

    let selectedVariant = productVariants.find((v) => v.id === variantId);

    if (document.querySelector("stock-notify")) {
      notifyPopup(selectedVariant);
    }   
  }

  async fetchData(url) {
    if (this.querySelector("pinfo-variant-picker")) {
      this.querySelector("pinfo-variant-picker").style.pointerEvents = "none";
      this.querySelector("pinfo-variant-picker").style.opacity = "0.7";
    }
    const response = await fetch(url);
    const data = await response.text();
    const html = new DOMParser().parseFromString(data, "text/html");
      
    this.renderEl(html);
    window.sizeGuide();
  }

  renderEl(html) {
    // if (this.querySelector(".pinfo-top") && html.querySelector(".pinfo-top")) {
    //   this.querySelector(".pinfo-top").innerHTML =
    //     html.querySelector(".pinfo-top").innerHTML;
    // }
    if (this.querySelector(".pinfo-top .pinfo-price-wrapper") && html.querySelector(".pinfo-top .pinfo-price-wrapper")) {
      this.querySelector(".pinfo-top .pinfo-price-wrapper").innerHTML =
        html.querySelector(".pinfo-top .pinfo-price-wrapper").innerHTML;
    }
    if (
      this.querySelector("pinfo-variant-picker") &&
      html.querySelector("pinfo-variant-picker")
    ) {
      this.querySelector("pinfo-variant-picker").innerHTML = html.querySelector(
        "pinfo-variant-picker"
      ).innerHTML;
    }
    // if (this.querySelector(".color-options .swiper")) this.initColorOptionsSwiper();
    if (document.querySelector("pqa-new")) {
      document.querySelector("pqa-new").innerHTML =
        html.querySelector("pqa-new").innerHTML;
    }
    if (this.querySelector("--inventory-message")) {
      this.querySelector("--inventory-message").innerHTML =
        html.querySelector("--inventory-message").innerHTML;
    }

    if (
      this.querySelector(".pinfo-form-wrapper") &&
      html.querySelector(".pinfo-form-wrapper")
    ) {
      this.querySelector(".pinfo-form-wrapper").innerHTML = html.querySelector(
        ".pinfo-form-wrapper"
      ).innerHTML;
    }
    
    if (
      this.querySelector(".p-model-info") &&
      html.querySelector(".p-model-info")
    ) {
      this.querySelector(".p-model-info").innerHTML = html.querySelector(
        ".p-model-info"
      ).innerHTML;
    }

    if (
      this.querySelector("product-info-media") &&
      html.querySelector("product-info-media")
    ) {
      this.querySelector("product-info-media").innerHTML =
        html.querySelector("product-info-media").innerHTML;
    }
    
    this.initImageZoomOnHover();
    this.loaderPdp();
    this.loaderPdpMobile();


    if (
      document.querySelector(".pqa-new-form") &&
      html.querySelector(".pqa-new-form")
    ) {
      console.log("------------", html.querySelector(".pqa-new-form"));
      document.querySelector(".pqa-new-form").innerHTML =
        html.querySelector(".pqa-new-form").innerHTML;
    }

    this.initMobileSwiper();

    this.handleEvents();
    window.viewerCountPastDay();
    
    if (this.querySelector("pinfo-variant-picker")) {
      this.querySelector("pinfo-variant-picker").style.pointerEvents = "unset";
      this.querySelector("pinfo-variant-picker").style.opacity = "1";
    }
    window.setupHeaderDrawer();
  }

  updateURL(url) {

    if (typeof url !== "string" || !url.startsWith("/")) {
      console.error("Invalid URL format");
      return;
    }

    if (this.dataset?.updateUrl === "true"){
      window.history.pushState({}, "", url);    
    }
      
  }



  handleAddToCart(e) {
    e.preventDefault();

    // Set loading state
    if (this.submitButton) {
      this.submitButton.classList.add("loading");
      this.submitButton.innerHTML = '<span class="loader"></span> Adding...';
      this.submitButton.disabled = true;
    }

    const formData = new FormData(this.form);
    const variantId = formData.get("id");

    if (this.cartDrawer && this.cartDrawer.getSectionsToRender) {
      formData.append(
        "sections",
        this.cartDrawer.getSectionsToRender().map((section) => section.id)
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
              source: "product-form",
              productVariantId: variantId,
              errors: response.errors || response.description,
            });
          }
          throw new Error(response.errors || response.description);
        }

        if (this.cartDrawer && this.cartDrawer.renderContents) {
          this.cartDrawer.renderContents(response);
        }

        if (this.cartDrawer && this.cartDrawer.open) {
          this.cartDrawer.classList.remove("is-empty");
          this.cartDrawer.open();
        }

        if (typeof publish === "function") {
          publish(PUB_SUB_EVENTS.cartUpdate, {
            source: "product-form",
            productVariantId: variantId,
          });
        }
      })
      .catch((error) => {
        console.error("Add to cart failed:", error);
      })
      .finally(() => {
        if (this.submitButton) {
          this.submitButton.classList.remove("loading");
          this.submitButton.textContent = "Add To Cart";
          this.submitButton.disabled = false;
        }
      });
  }

  initSwiperSlider() {
    if (this.gallerySwiper) this.gallerySwiper.destroy(true, true);
    this.gallerySwiper = new Swiper(".pinfo-gallery-swiper", {
      slidesPerView: 2,
      spaceBetween: 0,
      watchSlidesProgress: true,
    });

    if (this.thumbSwiper) this.thumbSwiper.destroy(true, true);
    this.thumbSwiper = new Swiper(".pinfo-thumb-swiper", {
      slidesPerView: 1,
      thumbs: {
        swiper: this.gallerySwiper,
      },
    });
  }
}



document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const scrollThreshold = 300;
  let isScrolled = false;

  window.addEventListener("scroll", function () {
    const shouldBeScrolled = window.scrollY > scrollThreshold;

    if (shouldBeScrolled !== isScrolled) {
      isScrolled = shouldBeScrolled;
      if (isScrolled) {
        body.classList.add("pad__bottom");
      } else {
        body.classList.remove("pad__bottom");
      }
    }
  });
});

window.initFaqAccordions = function () {
  const faqAccordions = document.querySelectorAll(".pr-faq-item");
  const openFaqAccordion = (accordion) => {
    const content = accordion.querySelector(".pr-faq-content");
    accordion.classList.add("active");
    content.style.maxHeight = content.scrollHeight + "px";
  };

  const closeFaqAccordion = (accordion) => {
    const content = accordion.querySelector(".pr-faq-content");
    accordion.classList.remove("active");
    content.style.maxHeight = null;
  };

  if (faqAccordions.length > 0) {
    openFaqAccordion(faqAccordions[0]);

    faqAccordions.forEach((accordion) => {
      const header = accordion.querySelector(".pr-faq-header");
      const content = accordion.querySelector(".pr-faq-content");

      accordion.onclick = () => {
        if (content.style.maxHeight) {
          closeFaqAccordion(accordion);
        } else {
          faqAccordions.forEach((accordion) => closeFaqAccordion(accordion));
          openFaqAccordion(accordion);
        }
      };
    });
  }
};

document.addEventListener("DOMContentLoaded", function () {
  window.initFaqAccordions();
});




class ProductQuickAdd extends HTMLElement {
  constructor() {
    super();

    this.addEventListener("input", this.handleVariantInput.bind(this));
    this.addEventListener("click", this.handleSubmitEvemt.bind(this));
  }


  handleVariantInput(e) {
    const variantUrl = e.target.value;

    if (variantUrl && document.querySelector("product-information")) {
      const productInfo = document.querySelector("product-information");
      productInfo.fetchData(variantUrl);
      productInfo.updateURL(variantUrl);
    }
  }

  handleSubmitEvemt(e) {
    if (e.target.closest("form")) {
      e.preventDefault();
    }

    if (e.target.tagName === "BUTTON") {
      this.handleAddToCart(e.target.closest("form"), e.target);
    }
  }

  handleAddToCart(form, btn) {
    if (!form) return;

    if (btn) {
      // btn.classList.add("loading");
      btn.textContent = "Adding To Cart ...";
      btn.style.pointerEvents = "none";
      btn.style.opacity = ".7";
    }
    this.cart =
      document.querySelector("cart-notification") ||
      document.querySelector("cart-drawer");
    let formData = new FormData(form);
    if (this.cart) {
      formData.append(
        "sections",
        this.cart.getSectionsToRender().map((section) => section.id)
      );
    }
    fetch(window.Shopify.routes.root + "cart/add.js", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        this.cart.renderContents(response);
      })
      .finally(() => {
        if (btn) {
          // btn.classList.remove("loading");
          btn.textContent = "Add To Cart";
          btn.style.pointerEvents = "unset";
          btn.style.opacity = "1";
        }
        if (document.querySelector(".new-header-cart-icon"))
          document.querySelector(".new-header-cart-icon").click();

        if (this.cart && this.cart.classList.contains("is-empty"))
          this.cart.classList.remove("is-empty");
        initswiperincart();
      });


  }
}

document.addEventListener("DOMContentLoaded", (e) => {
  customElements.define("product-information", ProductInformation);
  customElements.define("pqa-new", ProductQuickAdd);
});



window.viewerCountPastDay = function() {
  const viewerElement = document.getElementById('viewer-count');
  
  if (!viewerElement || !viewerElement.dataset.productId || !viewerElement.dataset.min || !viewerElement.dataset.max) {
    return;
  }
  const productId = viewerElement.dataset.productId;
  const storageKey = `viewerCount_${productId}`;
  const min = parseInt(viewerElement.dataset.min);
  const max = parseInt(viewerElement.dataset.max);

  function updateViewerCount() {
    const viewerCount = Math.floor(Math.random() * (max - min + 1)) + min;
    const numberElement = document.getElementById('viewer-number');
    if (numberElement) {
      numberElement.textContent = viewerCount;
      localStorage.setItem(storageKey, viewerCount);
      localStorage.setItem(`${storageKey}_timestamp`, new Date().getTime());
    }
  }

  function isSameDayInEST(timestamp) {
    const now = new Date();
    const estOffset = -5 * 60;
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const estNow = new Date(utc + (estOffset * 60000));
    const storedDate = new Date(parseInt(timestamp));
    const estStored = new Date(storedDate.getTime() + (estOffset * 60000));

    return (
      estNow.getFullYear() === estStored.getFullYear() &&
      estNow.getMonth() === estStored.getMonth() &&
      estNow.getDate() === estStored.getDate()
    );
  }

  function scheduleDailyUpdate() {
    const storedCount = localStorage.getItem(storageKey);
    const storedTimestamp = localStorage.getItem(`${storageKey}_timestamp`);
    const numberElement = document.getElementById('viewer-number');

    if (storedCount && storedTimestamp && isSameDayInEST(storedTimestamp) && numberElement) {
      numberElement.textContent = storedCount;
    } else {
      updateViewerCount();
    }

    const now = new Date();
    const estOffset = -5 * 60;
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const estNow = new Date(utc + (estOffset * 60000));
    const target = new Date(estNow);
    target.setHours(24, 0, 0, 0);

    if (estNow > target) {
      target.setDate(target.getDate() + 1);
    }

    const msUntilMidnight = target.getTime() - estNow.getTime();

    setTimeout(() => {
      updateViewerCount();
      setInterval(updateViewerCount, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);
  }

  scheduleDailyUpdate();
};



document.addEventListener("DOMContentLoaded", function () {
  window.viewerCountPastDay();
});
function getDeliveryWindow() {
  const today = new Date();

  const startDate = new Date(today);
  startDate.setDate(today.getDate() + 4);

  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 7);

  const options = { month: 'short', day: 'numeric' };

  const formattedStart = startDate.toLocaleDateString('en-US', options);
  const formattedEnd = endDate.toLocaleDateString('en-US', options);

  // return `${formattedStart} - ${formattedEnd}`;
  const deliveryDateText = `${formattedStart} - ${formattedEnd}`;
  const deliverySpans = document.querySelectorAll('.--delivery-date');
  deliverySpans.forEach(span => {
    span.textContent = deliveryDateText;
  });
}

