document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelectorAll(".curreny__selector-options")
    .forEach((selector) => {
      const button = selector.querySelector(".country-button");
      const countryList = selector.querySelector(".country-list");
      const countryInput = selector.querySelector(".selected-country-code");
      const form = selector.querySelector(".country-selector-form");

      // Ensure initial state
      countryList.style.display = "none";

      button.addEventListener("click", function (e) {
        e.preventDefault(); // Prevent button from submitting form
        toggleCountryList();
      });

      selector.querySelectorAll(".country-list li").forEach((item) => {
        item.addEventListener("click", function () {
          const selectedCountry = this.dataset.value;
          const selectedCurrency = this.dataset.currency;
          const selectedSymbol = this.dataset.symbol;
          const flagSrc = this.querySelector(".country-flag").src;

          button.innerHTML = `
          <img class="country-flag" src="${flagSrc}" alt="Flag">
          <span class="country-currency">${selectedCurrency}</span>(${selectedSymbol})
          <svg width="14" height="10" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `;

          // Update and submit form
          countryInput.value = selectedCountry;
          countryList.style.display = "none";
          button.classList.remove("active");

          // Submit the form programmatically
          form.dispatchEvent(new Event("change")); // Trigger Shopify's form handler
          form.submit();
        });
      });

      document.addEventListener("click", function (event) {
        if (!selector.contains(event.target)) {
          countryList.style.display = "none";
          button.classList.remove("active");
        }
      });

      function toggleCountryList() {
        if (countryList.style.display === "block") {
          countryList.style.display = "none";
          button.classList.remove("active");
        } else {
          countryList.style.display = "block";
          button.classList.add("active");
        }
      }
    });
});
