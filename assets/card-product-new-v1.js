window.cardProductFunc = function () {
  const initializeAllSwipersOnPageLoad = () => {
    document.querySelectorAll(".product-card").forEach((card) => {
      const swiperContainer = card.querySelector(".swiper-container--lazy");
      if (!swiperContainer) return;

      const swiperWrapper = swiperContainer.querySelector(".swiper-wrapper");
      const existingSlides = swiperWrapper.querySelectorAll(".swiper-slide");

      if (existingSlides.length > 0) {
        const swiper = new Swiper(swiperContainer.querySelector(".swiper"), {
          lazy: {
            loadPrevNext: true,
            loadOnTransitionStart: true,
          },
          slidesPerView: 1,
          initialSlide: 2,
          watchSlidesProgress: true,
          loop: existingSlides.length > 1,
          navigation: {
            nextEl: swiperContainer.querySelector(".swiper-button-next"),
            prevEl: swiperContainer.querySelector(".swiper-button-prev"),
          },
          pagination: {
            el: swiperContainer.querySelector(".swiper-pagination"),
          },
          on: {
            init: function () {
              swiperContainer.classList.add("swiper-initialized");
              swiperContainer.setAttribute("aria-hidden", "false");
            },
          },
        });

        card.swiperInstance = swiper;
      }
    });
  };

  const initSwiper = (container) => {
    const mediaCount = parseInt(container.dataset.mediaCount);
    if (mediaCount < 1) return;
  
    const isDesktop = window.innerWidth > 989;
    const initialSlide = isDesktop && container.dataset.start === "1" ? 1 : 0;
  
    return new Swiper(container.querySelector(".swiper"), {
      lazy: {
        loadPrevNext: true,
        loadOnTransitionStart: true,
      },
      watchSlidesProgress: true,
      spaceBetween: 30,
      slidesPerView: 1,
      loop: mediaCount > 1,
      initialSlide: initialSlide,
      navigation: {
        nextEl: container.querySelector(".swiper-button-next"),
        prevEl: container.querySelector(".swiper-button-prev"),
      },
      pagination: {
        el: container.querySelector(".swiper-pagination"),
      },
      on: {
        init: function () {
          container.classList.add("swiper-initialized");
          container.setAttribute("aria-hidden", "false");
        },
      },
    });
  };

  const groupMediaByColor = (productData) => {
    const colorGroups = { noColor: [] };
    const colorOptionIndex = productData.options.indexOf("Color");

    productData.media.forEach((media) => {
      if (colorOptionIndex !== -1 && media.alt) {
        const colorValue = media.alt.toLowerCase();
        if (!colorGroups[colorValue]) {
          colorGroups[colorValue] = [];
        }
        colorGroups[colorValue].push(media);
      } else {
        colorGroups.noColor.push(media);
      }
    });

    return colorGroups;
  };

  const processProductCards = () => {
    document.querySelectorAll(".product-card").forEach((card) => {
      try {
        const productData = JSON.parse(
          card.querySelector("[data-product-json]").textContent
        );
        const colorSwatches = card.querySelectorAll(".color-swatch");
        const sizeSelector = card.querySelector(".size-selector");
        const priceWrapper = card.querySelector(".price-wrapper");
        const swiperContainer = card.querySelector(".swiper-container--lazy");
        const productHandle = card.dataset.productHandle;
        const productLink = card.querySelector(".js-product-link");
        const titleLink = card.querySelector(".product-card__title a");

        const colorGroups = groupMediaByColor(productData);
        let selectedColorValue = null;
        let swiperInstance = null;

        if (swiperContainer) {
          swiperInstance = initSwiper(swiperContainer);
        }

        colorSwatches.forEach((swatch) => {
          swatch.addEventListener("click", function () {
            if (this.disabled) return;

            const variantId = this.dataset.variantId;
            const colorValue = this.dataset.colorValue;
            selectedColorValue = colorValue;

            const selectedVariant =
              productData.variants.find(
                (v) => v.id == variantId && v.available
              ) || productData.variants.find((v) => v.id == variantId);

            if (!selectedVariant) return;

            updatePrice(priceWrapper, selectedVariant);

            if (sizeSelector) {
              updateSizeAvailability(productData, sizeSelector, colorValue);
            }

            if (swiperInstance) {
              updateSwiperForColor(
                swiperInstance,
                colorGroups[colorValue.toLowerCase()],
                productData,
                selectedVariant,
                productHandle,
                card
              );
            }

            const variantUrl = `/products/${productHandle}?variant=${selectedVariant.id}`;
            updateProductLinks(card, variantUrl);

            colorSwatches.forEach((s) =>
              s.classList.remove("color-swatch--selected")
            );
            this.classList.add("color-swatch--selected");
          });
        });

        if (sizeSelector) {
          sizeSelector.querySelectorAll(".size-btn").forEach((button) => {
            button.addEventListener("click", function (e) {
              e.preventDefault();
              if (this.disabled || !this.dataset.variantId) return;

              let colorValue = selectedColorValue;
              if (!colorValue && colorSwatches.length > 0) {
                const selectedSwatch = Array.from(colorSwatches).find(
                  (swatch) =>
                    swatch.classList.contains("color-swatch--selected")
                );
                colorValue = selectedSwatch
                  ? selectedSwatch.dataset.colorValue
                  : colorSwatches[0].dataset.colorValue;
              }

              const selectedVariant = findVariantForSize(
                productData,
                this,
                colorValue
              );
              if (selectedVariant) {
                addToCart(selectedVariant);
              }
            });
          });
        }
      } catch (error) {
        console.error("Error processing product card:", error);
      }
    });
  };

  const updatePrice = (priceWrapper, variant) => {
    if (!priceWrapper) return;

    let priceHtml = "";
    if (variant.compare_at_price > variant.price) {
      priceHtml = `<span class="price-sale">${Shopify.formatMoney(
        variant.price
      )}</span>
                   <span class="price-compare-at">${Shopify.formatMoney(
                     variant.compare_at_price
                   )}</span>`;
    } else {
      priceHtml = `<span class="price-standard">${Shopify.formatMoney(
        variant.price
      )}</span>`;
    }
    priceWrapper.querySelector(".price-regular").innerHTML = priceHtml;
    priceWrapper.dataset.variantId = variant.id;
  };

  const updateSizeAvailability = (productData, sizeSelector, colorValue) => {
    const sizeButtons = sizeSelector.querySelectorAll(".size-btn");
    const sizeOptionIndex = productData.options.indexOf("Size");
    const colorOptionIndex = productData.options.indexOf("Color");

    if (sizeOptionIndex === -1 || colorOptionIndex === -1) return;

    const availableSizes = productData.variants
      .filter((v) => v.options[colorOptionIndex] === colorValue && v.available)
      .map((v) => v.options[sizeOptionIndex]);

    sizeButtons.forEach((button) => {
      const sizeValue = button.dataset.sizeValue;
      const isAvailable = availableSizes.includes(sizeValue);
      const sizeVariant = productData.variants.find(
        (v) =>
          v.options[colorOptionIndex] === colorValue &&
          v.options[sizeOptionIndex] === sizeValue
      );

      button.classList.toggle("size-btn--disabled", !isAvailable);
      button.disabled = !isAvailable;
      button.setAttribute(
        "aria-label",
        isAvailable ? sizeValue : `${sizeValue} (Out of stock)`
      );
      if (sizeVariant) {
        button.dataset.variantId = sizeVariant.id;
        button.dataset.variantUrl = `/products/${productData.handle}?variant=${sizeVariant.id}`;
      }
    });
  };

  const updateSwiperForColor = (
    swiper,
    mediaItems,
    productData,
    selectedVariant,
    productHandle,
    card
  ) => {
    const container = swiper.el.closest(".swiper-container--lazy");
    const wrapper = swiper.el.querySelector(".swiper-wrapper");
    const navNext = container.querySelector(".swiper-button-next");
    const navPrev = container.querySelector(".swiper-button-prev");
    const pagination = container.querySelector(".swiper-pagination");
    const productLink = card.querySelector(".product-card__image-link.js-product-link");
    const isDesktop = window.innerWidth > 989;
    const selectedColorValue = card.querySelector(".pd-selected-color-value");

    // Update selected color value
    if (selectedColorValue && selectedVariant?.options) {
      // Find the index of the "Color" option (case-insensitive)
      const colorIndex = productData.options.findIndex(option => option.toLowerCase() === "color");
      if (colorIndex !== -1 && selectedVariant.options[colorIndex]) {
        selectedColorValue.innerText = selectedVariant.options[colorIndex];
      } else {
        selectedColorValue.innerText = "";
      }
    }

    swiper.removeAllSlides();
    navNext?.classList.add("hidden");
    navPrev?.classList.add("hidden");
    pagination?.classList.add("hidden");
  
    let slidesAdded = false;
  
    if (mediaItems && mediaItems.length > 0) {
      if (mediaItems.length > 1) {
  
        const firstMedia = mediaItems[0];
        const variantId = getVariantIdForMedia(productData, firstMedia);
        const linkHtml = `
          <a href="/products/${productHandle}?variant=${variantId || productData.variants[0]?.id || ""}" class="product-card__image-link js-product-link">
            <img 
              src="${firstMedia.src}" 
              alt="${firstMedia.alt || ""}"
              class="product-card__primary-image"
              loading="lazy"
              width="600"
              sizes="(max-width: 767px) 100vw, 50vw"
              srcset="
                ${firstMedia.src}?width=300 300w,
                ${firstMedia.src}?width=400 400w,
                ${firstMedia.src}?width=500 500w,
                ${firstMedia.src}?width=600 600w"
            >
          </a>
        `;
        productLink.outerHTML = linkHtml;
        const updatedProductLink = card.querySelector(".product-card__image-link.js-product-link");
        updatedProductLink.classList.add("has-multiple-media");
        container.classList.add("has-multiple-media");
        updatedProductLink.classList.remove("has-multiple-media-reverse");
        container.classList.remove("has-multiple-media-reverse");
      } else {
        productLink.classList.remove("has-multiple-media");
        container.classList.remove("has-multiple-media");
        productLink.classList.remove("has-multiple-media-reverse");
        container.classList.remove("has-multiple-media-reverse");
      }
  
      mediaItems.forEach((media, index) => {
        const variantId = getVariantIdForMedia(productData, media);
        const slideHtml = `
          <div class="swiper-slide ${
            index === 0
              ? "first-swiper-slide"
              : index === 1
              ? "second-swiper-slide"
              : ""
          }"
            data-media-id="${media.id}"
            data-media-position="${index + 1}"
            data-variant-id="${variantId || ""}">
            <a href="/products/${productHandle}?variant=${variantId || productData.variants[0]?.id || ""}">
              <img 
                src="${media.src}" 
                alt="${media.alt || ""}"
                class="product-card__gallery-image swiper-lazy"
                loading="lazy"
                width="600"
                sizes="(max-width: 767px) 100vw, 50vw"
                srcset="
                  ${media.src}?width=300 300w,
                  ${media.src}?width=400 400w,
                  ${media.src}?width=500 500w,
                  ${media.src}?width=600 600w"
              >
            </a>
          </div>
        `;
        swiper.appendSlide(slideHtml);
        slidesAdded = true;
      });
    } else if (selectedVariant && selectedVariant.featured_image) {
      
      if (selectedVariant.featured_image) {
        let mediaIndex = 0;
        for (let i = 0; i < productData.media.length; i++) {
          if (productData.media[i].id === selectedVariant.featured_image.id) {
            mediaIndex = i;
            break;
          }
        }
        if (productData.media.length > mediaIndex + 1) {
          const firstMedia = productData.media[mediaIndex + 1];
          const variantId = getVariantIdForMedia(productData, firstMedia);
          const linkHtml = `
            <a href="/products/${productHandle}?variant=${variantId || productData.variants[0]?.id || ""}" class="product-card__image-link js-product-link">
              <img 
                src="${firstMedia.src}" 
                alt="${firstMedia.alt || ""}"
                class="product-card__primary-image"
                loading="lazy"
                width="600"
                sizes="(max-width: 767px) 100vw, 50vw"
                srcset="
                  ${firstMedia.src}?width=300 300w,
                  ${firstMedia.src}?width=400 400w,
                  ${firstMedia.src}?width=500 500w,
                  ${firstMedia.src}?width=600 600w"
              >
            </a>
          `;
          productLink.outerHTML = linkHtml;
        }
      }
      
      const updatedProductLink = card.querySelector(".product-card__image-link.js-product-link");
      
      let hasNextImage = false;
      if (selectedVariant.featured_image) {
        let mediaIndex = 0;
        for (let i = 0; i < productData.media.length; i++) {
          if (productData.media[i].id === selectedVariant.featured_image.id) {
            mediaIndex = i;
            break;
          }
        }
        hasNextImage = productData.media.length > mediaIndex + 1;
      }
      
      if (!hasNextImage) {
        updatedProductLink.classList.remove("has-multiple-media-reverse");
        container.classList.remove("has-multiple-media-reverse");
        updatedProductLink.classList.remove("has-multiple-media");
        container.classList.remove("has-multiple-media");
      } else {
        updatedProductLink.classList.remove("has-multiple-media");
        container.classList.remove("has-multiple-media");
        updatedProductLink.classList.add("has-multiple-media-reverse");
        container.classList.add("has-multiple-media-reverse");
      }
      
      const media = selectedVariant.featured_image;
      const slideHtml = `
        <div class="swiper-slide first-swiper-slide"
          data-media-id="${media.id || ""}"
          data-media-position="1"
          data-variant-id="${selectedVariant.id}">
          <a href="/products/${productHandle}?variant=${selectedVariant.id}">
            <img 
              src="${media.src}" 
              alt="${media.alt || ""}"
              class="product-card__gallery-image swiper-lazy"
              loading="lazy"
              width="600"
              sizes="(max-width: 767px) 100vw, 50vw"
              srcset="
                ${media.src}?width=300 300w,
                ${media.src}?width=400 400w,
                ${media.src}?width=500 500w,
                ${media.src}?width=600 600w"
            >
          </a>
        </div>
      `;
      swiper.appendSlide(slideHtml);
      slidesAdded = true;
      
    } else {
      
      productLink.classList.remove("has-multiple-media");
      container.classList.remove("has-multiple-media");
      productLink.classList.remove("has-multiple-media-reverse");
      container.classList.remove("has-multiple-media-reverse");
    
      const media = productData.media[0];
      if (media) {
        const variantId = productData.variants[0]?.id || "";
        const slideHtml = `
          <div class="swiper-slide first-swiper-slide"
            data-media-id="${media.id}"
            data-media-position="1"
            data-variant-id="${variantId}">
            <a href="/products/${productHandle}${variantId ? `?variant=${variantId}` : ""}">
              <img 
                src="${media.src}" 
                alt="${media.alt || ""}"
                class="product-card__gallery-image swiper-lazy"
                loading="lazy"
                width="600"
                sizes="(max-width: 767px) 100vw, 50vw"
                srcset="
                  ${media.src}?width=300 300w,
                  ${media.src}?width=400 400w,
                  ${media.src}?width=500 500w,
                  ${media.src}?width=600 600w"
              >
            </a>
          </div>
        `;
        swiper.appendSlide(slideHtml);
        slidesAdded = true;
      }
    }
  
    if (isDesktop && mediaItems && mediaItems.length > 1) {
      swiper.params.initialSlide = 1;
      swiper.update();
      swiper.slideTo(1, 0);
    } else {
      swiper.params.initialSlide = 0;
      swiper.update();
      swiper.slideTo(0, 0);
    }
  
    if (slidesAdded && swiper.slides.length > 1) {
      navNext?.classList.remove("hidden");
      navPrev?.classList.remove("hidden");
      pagination?.classList.remove("hidden");
    }
  };

  const getVariantIdForMedia = (productData, media) => {
    if (!media || !productData.variants) return null;
    const variant = productData.variants.find(
      (v) => v.featured_image && v.featured_image.src === media.src
    );
    return variant ? variant.id : null;
  };

  const updateProductLinks = (card, url) => {
    const productLink = card.querySelector(".js-product-link");
    const titleLink = card.querySelector(".product-card__title a");
    const slideLinks = card.querySelectorAll(".swiper-slide a");
    const singleMediaLink = card.querySelector(".single-media a");

    if (productLink) productLink.href = url;
    if (titleLink) titleLink.href = url;
    if (slideLinks.length) {
      slideLinks.forEach((link) => {
        link.href = url;
      });
    }
    if (singleMediaLink) singleMediaLink.href = url;
  };

  const findVariantForSize = (productData, button, selectedColorValue) => {
    const colorOptionIndex = productData.options.indexOf("Color");
    const sizeOptionIndex = productData.options.indexOf("Size");
    const sizeValue = button.dataset.sizeValue;

    if (colorOptionIndex !== -1 && sizeOptionIndex !== -1) {
      let colorValue = selectedColorValue;
      if (!colorValue) {
        const availableColors = productData.variants
          .filter((v) => v.available)
          .map((v) => v.options[colorOptionIndex])
          .filter((v, i, a) => a.indexOf(v) === i);
        colorValue =
          availableColors[0] ||
          productData.variants[0].options[colorOptionIndex];
      }

      return (
        productData.variants.find(
          (v) =>
            v.options[colorOptionIndex] === colorValue &&
            v.options[sizeOptionIndex] === sizeValue &&
            v.available
        ) ||
        productData.variants.find(
          (v) =>
            v.options[colorOptionIndex] === colorValue &&
            v.options[sizeOptionIndex] === sizeValue
        )
      );
    }

    return productData.variants.find((v) => v.id == button.dataset.variantId);
  };

  const addToCart = (variant) => {
    const miniCart =
      document.querySelector("mini-cart") ||
      document.querySelector("cart-drawer");
    const formData = new FormData();
    formData.append("id", variant.id);
    formData.append("quantity", 1);

    if (miniCart?.getSectionsToRender) {
      formData.append(
        "sections",
        miniCart.getSectionsToRender().map((section) => section.id)
      );
    }
    formData.append("sections_url", window.location.pathname);
    document.body.classList.add("adding-to-cart");
    fetch(window.Shopify.routes.root + "cart/add.js", {
      method: "POST",
      headers: { "X-Requested-With": "XMLHttpRequest" },
      body: formData,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status) {
          if (typeof publish === "function") {
            publish(PUB_SUB_EVENTS.cartError, {
              source: "size-swatch",
              productVariantId: variant.id,
              errors: response.errors || response.description,
            });
          }
          throw new Error(response.errors || response.description);
        }

        if (miniCart?.renderContents) {
          miniCart.renderContents(response);
        }

        if (miniCart?.open) {
          miniCart.classList.remove("is-empty");
          miniCart.open();
        }

        if (typeof publish === "function") {
          publish(PUB_SUB_EVENTS.cartUpdate, {
            source: "size-swatch",
            productVariantId: variant.id,
          });
        }
      })
      .catch((error) => {
        console.error("Add to cart failed:", error);
      })
      .finally(() => {
        // Remove loading class
        document.body.classList.remove("adding-to-cart");
      });
  };

  const initializeColorSwatches = () => {
    const swatchContainers = document.querySelectorAll('.color-swatches');
    swatchContainers.forEach(container => {
      const swiperElement = container.querySelector('.swiper');
      if (swiperElement) {
        new Swiper(swiperElement, {
          slidesPerView: "auto",
          spaceBetween: 10,
          freeMode: true,
          a11y: false,
          navigation: {
            nextEl: container.querySelector('.swiper-button-next'),
            prevEl: container.querySelector('.swiper-button-prev'),
          },
          on: {
            init: function () {
              const nextButton = container.querySelector('.swiper-button-next');
              const prevButton = container.querySelector('.swiper-button-prev');

              const checkLockClasses = () => {
                if (nextButton.classList.contains('swiper-button-lock') && 
                    prevButton.classList.contains('swiper-button-lock')) {
                  container.classList.add('no-padding');
                } else {
                  container.classList.remove('no-padding');
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
    });
  };

  if (document.readyState !== "loading") {
    processProductCards();
    initializeColorSwatches();
  } else {
    document.addEventListener("DOMContentLoaded", processProductCards);
    document.addEventListener("DOMContentLoaded", initializeColorSwatches);
  }
};

window.cardProductFunc();
