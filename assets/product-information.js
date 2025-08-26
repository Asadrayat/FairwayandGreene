class ProductInformation extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    if(this.querySelector(".pinfo-gallery-swiper"))
      this.initSwiperSlider();
    this.querySelector("color-variant").addEventListener(
      "input",
      this.handleColorVariantEvent.bind(this)
    );

    this.querySelector("size-variant-picker").addEventListener(
      "input",
      this.handleSizeVariantEvent.bind(this)
    );
  }

  handleColorVariantEvent(e) {
    const { productUrl } = e.target.dataset;
    this.fetchData(productUrl);
    this.updateURL(productUrl);
  }

  handleSizeVariantEvent(e) {
    const { url } = e.target.dataset;

    this.fetchData(url);
    this.updateURL(url);
  }

  async fetchData(url) {
    const response = await fetch(url);
    const data = await response.text();
    const html = new DOMParser().parseFromString(data, "text/html");
    this.renderEl(html);
  }

  renderEl(html) {
    if (
      html.querySelector("product-info-media") &&
      this.querySelector("product-info-media")
    ) {
      this.querySelector("product-info-media").innerHTML =
        html.querySelector("product-info-media").innerHTML;

      if(this.querySelector(".pinfo-gallery-swiper"))
        this.initSwiperSlider();
    }

    if (this.querySelector(".pinfo-top") && html.querySelector(".pinfo-top")) {
      this.querySelector(".pinfo-top").innerHTML =
        html.querySelector(".pinfo-top").innerHTML;
    }

    if (
      this.querySelector("size-variant-picker") &&
      html.querySelector("size-variant-picker")
    ) {
      this.querySelector("size-variant-picker").innerHTML = html.querySelector(
        "size-variant-picker"
      ).innerHTML;
    }

    if (
      this.querySelector("color-variant") &&
      html.querySelector("color-variant")
    ) {
      this.querySelector("color-variant").innerHTML =
        html.querySelector("color-variant").innerHTML;
    }

    if (
      this.querySelector(".pinfo-form-wrapper") &&
      html.querySelector(".pinfo-form-wrapper")
    ) {
      this.querySelector(".pinfo-form-wrapper").innerHTML = html.querySelector(
        ".pinfo-form-wrapper"
      ).innerHTML;
    }
  }

  updateURL(url) {
    if (typeof url !== "string" || !url.startsWith("/")) {
      console.error("Invalid URL format");
      return;
    }

    if(this.dataset?.updateUrl === 'true')
      window.history.pushState({}, "", url);
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

document.addEventListener("DOMContentLoaded", (e) => {
  customElements.define("product-information", ProductInformation);
});
