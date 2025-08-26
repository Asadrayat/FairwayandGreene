document.addEventListener("DOMContentLoaded", function () {
  const steps = document.querySelectorAll(".account__step-item");
  const proceedButtons = document.querySelectorAll("[data-procceed]");

  function showStep(targetStep) {
    steps.forEach((step) => {
      step.classList.toggle("active", step.dataset.step == targetStep);
    });
  }

  showStep(1);

  proceedButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      showStep(btn.dataset.procceed);
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const accountDrawer = document.querySelector(".account__drawer");
  const headerDrawer = document.querySelector(".header__drawer");
  const overLay = document.querySelector(".overlay");
  const toggleButtons = document.querySelectorAll("[account-drawer]");
  const closeButton = document.querySelector("[account-drawer-close]");
  const body = document.body;
  const html = document.documentElement;

  function toggleDrawer(event) {
    event.preventDefault();
    const isActive = accountDrawer.classList.toggle("active");

    if (isActive && headerDrawer.classList.contains("active")) {
      headerDrawer.classList.remove("active");
      body.classList.remove("overflow-hidden");
      if (html.classList.contains("overflow-hidden")) {
        html.classList.remove("overflow-hidden");
      }
    }

    toggleButtons.forEach((button) => {
      button.setAttribute("aria-expanded", isActive);
    });
    accountDrawer.setAttribute("aria-hidden", !isActive);
    body.classList.toggle("overflow-hidden", isActive);
    overLay.classList.toggle("active", isActive);

    if (isActive) {
      accountDrawer.focus();
    } else {
      toggleButtons[0].focus();
    }
  }

  function closeDrawer() {
    accountDrawer.classList.remove("active");
    toggleButtons.forEach((button) => {
      button.setAttribute("aria-expanded", false);
    });
    accountDrawer.setAttribute("aria-hidden", true);
    body.classList.remove("overflow-hidden");
    if (html.classList.contains("overflow-hidden")) {
      html.classList.remove("overflow-hidden");
    }
    overLay.classList.remove("active");
    toggleButtons[0].focus();
  }

  toggleButtons.forEach((button) => {
    button.addEventListener("click", toggleDrawer);
  });
  closeButton.addEventListener("click", closeDrawer);
  overLay.addEventListener("click", closeDrawer);

  document.addEventListener("click", function (e) {
    if (
      accountDrawer.classList.contains("active") &&
      !accountDrawer.contains(e.target) &&
      !Array.from(toggleButtons).some((button) => button.contains(e.target))
    ) {
      closeDrawer();
    }
  });
});
