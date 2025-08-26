function applyTransitionDelay() {
  const megaMenuItems = document.querySelectorAll(".mega__menu-item-");
  const megaChildItems = document.querySelectorAll(".mega__child > li");

  megaChildItems.forEach((item, index) => {
    const delay = (index / megaChildItems.length) * 0.5;
    item.style.transitionDelay = `${delay}s`;
  });

  megaMenuItems.forEach((item, index) => {
    const delay = 0.5 + (index / megaMenuItems.length) * 0.5;
    item.style.transitionDelay = `${delay}s`;
  });
}

function removeTransitionDelay() {
  const megaMenuItems = document.querySelectorAll(".mega__menu-item-");
  const megaChildItems = document.querySelectorAll(".mega__child > li");

  megaMenuItems.forEach((item) => (item.style.transitionDelay = ""));
  megaChildItems.forEach((item) => (item.style.transitionDelay = ""));
}

/*
function setupMegaMenu() {
  let isMenuOpen = false;

  document.querySelectorAll(".site__nav-wrapper > li").forEach((item) => {
    item.addEventListener("mouseenter", function () {
      const megaMenu = this.querySelector(".mega__menu");
      if (megaMenu) {
        megaMenu.classList.add("open");
        applyTransitionDelay();
        isMenuOpen = true;
        document.addEventListener('wheel', preventScroll, { passive: false });
        document.addEventListener('touchmove', preventScroll, { passive: false });
      }
    });

    item.addEventListener("mouseleave", function () {
      const megaMenu = this.querySelector(".mega__menu");
      if (megaMenu) {
        megaMenu.classList.remove("open");
        removeTransitionDelay();
        isMenuOpen = false;
        document.removeEventListener('wheel', preventScroll);
        document.removeEventListener('touchmove', preventScroll);
      }
    });
  });

  function preventScroll(e) {
    if (isMenuOpen) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
}
*/

function setupMegaMenu() {
  let isMenuOpen = false;
  let overlay = null;
  document.querySelectorAll(".site__nav-wrapper > li").forEach((item) => {
    item.addEventListener("mouseenter", function () {
      const megaMenu = this.querySelector(".mega__menu");
      if (megaMenu) {
        megaMenu.classList.add("open");
        this.classList.add("menu-open"); // Add class to li
        applyTransitionDelay();
        isMenuOpen = true;
        overlay = document.createElement("div");
        overlay.classList.add("custom-overlay");
        document.body.appendChild(overlay);
        document.addEventListener('wheel', preventScroll, { passive: false });
        document.addEventListener('touchmove', preventScroll, { passive: false });
      }
    });

    item.addEventListener("mouseleave", function () {
      const megaMenu = this.querySelector(".mega__menu");
      if (megaMenu) {
        megaMenu.classList.remove("open");
        this.classList.remove("menu-open"); // Remove class from li
        removeTransitionDelay();
        isMenuOpen = false;
        if (overlay) {
          overlay.remove();
          overlay = null;
        }
        document.removeEventListener('wheel', preventScroll);
        document.removeEventListener('touchmove', preventScroll);
      }
    });
  });

  function preventScroll(e) {
    if (!isMenuOpen) return;

    const megaMenu = e.target.closest(".mega__menu");
    if (megaMenu) {
      const isScrollable = megaMenu.scrollHeight > megaMenu.clientHeight;
      if (isScrollable) {
        const scrollTop = megaMenu.scrollTop;
        const scrollHeight = megaMenu.scrollHeight;
        const clientHeight = megaMenu.clientHeight;
        const wheelDelta = e.deltaY || e.detail || e.wheelDelta;

        if (wheelDelta > 0 && scrollTop + clientHeight >= scrollHeight) {
          e.preventDefault();
          e.stopPropagation();
        } else if (wheelDelta < 0 && scrollTop <= 0) {
          e.preventDefault();
          e.stopPropagation();
        }
        return;
      }
    }

    e.preventDefault();
    e.stopPropagation();
  }
}

function setupStickyHeader(
  allowedTemplates,
  templateName,
  suffixName,
  isTransparent,
  isSticky
) {
  const siteHeader = document.querySelector(".site__header");
  if (!siteHeader) return;

  let allowedTemplatesArray = [];
  if (allowedTemplates) {
    const cleanedTemplates = allowedTemplates.replace(/\s/g, "");
    allowedTemplatesArray = cleanedTemplates.split(",");
  }

  if (
    !allowedTemplatesArray.length ||
    (!allowedTemplatesArray.includes(templateName) &&
      !allowedTemplatesArray.includes(suffixName)) ||
    !isTransparent ||
    !isSticky
  ) {
    return;
  }

  const shopifySection = siteHeader.closest(".shopify-section");
  if (!shopifySection) return;

  function updateStickyClass() {
    if (window.innerWidth <= 1249) return;

    if (window.scrollY > 300) {
      shopifySection.classList.remove("no__sticky");
      shopifySection.classList.add("sticky__header");
    } else {
      shopifySection.classList.add("no__sticky");
      shopifySection.classList.remove("sticky__header");
    }
  }

  function updateMargin() {
    if (window.innerWidth <= 1249) return;

    const sectionHeight = shopifySection.offsetHeight;
    const mainContent = document.querySelector("main#MainContent");
    if (mainContent && mainContent.firstElementChild) {
      mainContent.firstElementChild.style.marginTop = `-${sectionHeight}px`;
    }
  }

  updateStickyClass();
  updateMargin();

  window.addEventListener("scroll", updateStickyClass);
  window.addEventListener("resize", () => {
    updateStickyClass();
    updateMargin();
  });
}

function initSubmenuNavigation() {
  const openButtons = document.querySelectorAll(".open-submenu");
  const backButtons = document.querySelectorAll(".back-button");
  const grandchildToggles = document.querySelectorAll(".toggle-grandchild");
  let openGrandchildMenu = null;

  openButtons.forEach((button) =>
    button.addEventListener("click", () => {
      const submenu = button.closest("li").querySelector(".submenu");
      submenu?.classList.add("active");
    })
  );

  backButtons.forEach((button) =>
    button.addEventListener("click", () => {
      const submenu = button.closest(".submenu");
      submenu?.classList.remove("active");
    })
  );

  grandchildToggles.forEach((toggle) =>
    toggle.addEventListener("click", () => {
      const grandchildMenu = toggle
        .closest(".submenu-item")
        .querySelector(".grandchild-menu");
      const subMenuItem = grandchildMenu.closest(".has-grandchildren");

      if (grandchildMenu) {
        if (openGrandchildMenu && openGrandchildMenu !== grandchildMenu) {
          openGrandchildMenu.style.height = "0px";
          openGrandchildMenu.classList.remove("open");

          // Remove open class from previously opened parent .has-grandchildren
          const previousSubMenuItem =
            openGrandchildMenu.closest(".has-grandchildren");
          previousSubMenuItem?.classList.remove("open");
        }

        if (grandchildMenu.classList.contains("open")) {
          grandchildMenu.style.height = "0px";
          grandchildMenu.classList.remove("open");

          // Remove open class from the closest .has-grandchildren
          subMenuItem?.classList.remove("open");

          openGrandchildMenu = null;
        } else {
          grandchildMenu.style.height = `${grandchildMenu.scrollHeight}px`;
          grandchildMenu.classList.add("open");

          // Add open class to the closest .has-grandchildren
          subMenuItem?.classList.add("open");

          openGrandchildMenu = grandchildMenu;
        }
      }
    })
  );
}

function setupFixedHeader(
  allowedTemplates,
  templateName,
  suffixName,
  isTransparent
) {
  const mainHeader = document.querySelector(".site__header");
  if (!mainHeader) return;

  let allowedTemplatesArray = [];
  let not__transparent = false;
  if (allowedTemplates) {
    const cleanedTemplates = allowedTemplates.replace(/\s/g, "");
    allowedTemplatesArray = cleanedTemplates.split(",");
  }

  if (
    !allowedTemplatesArray.length ||
    (!allowedTemplatesArray.includes(templateName) &&
      !allowedTemplatesArray.includes(suffixName)) ||
    !isTransparent
  ) {
    not__transparent = true;
  }

  const headerSection = mainHeader.closest(".shopify-section");
  if (!headerSection) return;

  function adjustFixedPosition() {
    if (window.scrollY > 300) {
      // When scrolling down past 300px, add the fixed__header and animate it in
      headerSection.classList.remove("not__fixed");
      if (not__transparent) {
        headerSection.classList.remove("not__transparent");
      }
      headerSection.classList.add("fixed__header");
    } else {
      // When scrolling up inside 300px, animate it out and remove fixed__header
      headerSection.classList.add("not__fixed");
      if (not__transparent) {
        headerSection.classList.add("not__transparent");
      }
      headerSection.classList.remove("fixed__header");
    }
  }

  adjustFixedPosition();
  window.addEventListener("scroll", adjustFixedPosition);
  window.addEventListener("resize", adjustFixedPosition);
}

function setupStickyMenuScroll() {
  const menuContainers = document.querySelectorAll(".sticky__sm-nav-wrapper");
  if (menuContainers.length === 0) return;

  menuContainers.forEach((wrapper) => {
    const currentLink = wrapper.querySelector("a.active");
    if (currentLink) {
      const positionToScroll =
        currentLink.offsetLeft -
        wrapper.offsetWidth / 2 +
        currentLink.offsetWidth / 2;
      wrapper.scrollTo({
        left: positionToScroll,
        behavior: "smooth",
      });
    }
  });
}

window.setupHeaderDrawer = function () {
  const headerDrawer = document.querySelector(".header__drawer");
  const toggleButtons = document.querySelectorAll("[mobile-drawer-opener], [mbl-drawer-close]");
  const html = document.documentElement;
  const body = document.body;

  const toggleDrawer = (event) => {
    event.preventDefault();
    const isOpening = !headerDrawer.classList.contains("active");
    
    headerDrawer.classList.toggle("active");
    html.classList.toggle("overflow-hidden", isOpening);
    body.classList.toggle("drawer-open", isOpening);

    toggleButtons.forEach(button => {
      if (isOpening) {
        button.removeAttribute("mobile-drawer-opener");
        button.setAttribute("mbl-drawer-close", "");
      } else {
        button.removeAttribute("mbl-drawer-close");
        button.setAttribute("mobile-drawer-opener", "");
      }
    });
  };

  toggleButtons.forEach(button => {
    button.addEventListener("click", toggleDrawer);
  });

  document.addEventListener("click", (e) => {
    if (
      headerDrawer.classList.contains("active") &&
      !headerDrawer.contains(e.target) &&
      !Array.from(toggleButtons).some(button => button.contains(e.target))
    ) {
      headerDrawer.classList.remove("active");
      html.classList.remove("overflow-hidden");
      body.classList.remove("drawer-open");
      
      toggleButtons.forEach(button => {
        button.removeAttribute("mbl-drawer-close");
        button.setAttribute("mobile-drawer-opener", "");
      });
    }
  });
}

function initSubmenuNavigation() {
  const openButtons = document.querySelectorAll(".open-submenu");
  const backButtons = document.querySelectorAll(".back-button");
  const grandchildToggles = document.querySelectorAll(".toggle-grandchild");
  let openGrandchildMenu = null;

  openButtons.forEach((button) =>
    button.addEventListener("click", () => {
      const submenu = button.closest("li").querySelector(".submenu");
      submenu?.classList.add("active");
    })
  );

  backButtons.forEach((button) =>
    button.addEventListener("click", () => {
      const submenu = button.closest(".submenu");
      submenu?.classList.remove("active");
    })
  );

  grandchildToggles.forEach((toggle) =>
    toggle.addEventListener("click", () => {
      const grandchildMenu = toggle
        .closest(".submenu-item")
        .querySelector(".grandchild-menu");
      const subMenuItem = grandchildMenu.closest(".has-grandchildren");

      if (grandchildMenu) {
        if (openGrandchildMenu && openGrandchildMenu !== grandchildMenu) {
          openGrandchildMenu.style.height = "0px";
          openGrandchildMenu.classList.remove("open");

          // Remove open class from previously opened parent .has-grandchildren
          const previousSubMenuItem =
            openGrandchildMenu.closest(".has-grandchildren");
          previousSubMenuItem?.classList.remove("open");
        }

        if (grandchildMenu.classList.contains("open")) {
          grandchildMenu.style.height = "0px";
          grandchildMenu.classList.remove("open");

          // Remove open class from the closest .has-grandchildren
          subMenuItem?.classList.remove("open");

          openGrandchildMenu = null;
        } else {
          grandchildMenu.style.height = `${grandchildMenu.scrollHeight}px`;
          grandchildMenu.classList.add("open");

          // Add open class to the closest .has-grandchildren
          subMenuItem?.classList.add("open");

          openGrandchildMenu = grandchildMenu;
        }
      }
    })
  );
}

function setupDrawer() {
  const drawerLogo = document.querySelector(".drawer__logo");
  const drawerMenu = document.querySelector(".drawer-menu");
  const drawerUtensils = document.querySelector(".drawer__utensils");
  const siteHeader = document.querySelector(".site__header");

  if (drawerLogo && drawerMenu && drawerUtensils) {
    const logoHeight = drawerLogo.offsetHeight;
    const utensilsHeight = drawerUtensils.offsetHeight;
    drawerMenu.style.height = `calc(100% - ${logoHeight + utensilsHeight}px)`;
  }
}


function initNavigationDrawer() {
  const tabHeaders = document.querySelectorAll('.nav__tab-header-item');
  const tabContents = document.querySelectorAll('.nav__tab-content-item');
  const navTabContainer = document.querySelector('.nav-tab__container');
  const navGrands = document.querySelector('.nav__grands');

  // Activate first tab by default
  if (tabHeaders.length > 0 && tabContents.length > 0) {
    tabHeaders[0].classList.add('active');
    tabContents[0].classList.add('active');
  }

  const openChildMenu = (menuItem) => {
    const content = menuItem.querySelector('.grandchild__menu-wrapper');
    if (!content) return;
    menuItem.classList.add('active');
    content.style.maxHeight = `${content.scrollHeight}px`;
  };

  // Tab switching functionality
  tabHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const tabName = this.dataset.tab;
      const url = this.dataset.url;

      if (!tabName && url) {
        window.location.href = url;
        return;
      }

      if (tabName) {
        tabHeaders.forEach(h => h.classList.remove('active'));
        tabContents.forEach(c => {
          c.classList.remove('active');
          c.querySelectorAll('.child__menu-inner').forEach(childMenu => {
            childMenu.classList.remove('active');
            // Reset the content
            const content = childMenu.querySelector('.grandchild__menu-wrapper');
            if (content) content.style.maxHeight = null;
          });
        });

        this.classList.add('active');
        const activeTabContent = document.querySelector(`.nav__tab-content-item[data-content="${tabName}"]`);
        activeTabContent?.classList.add('active');

        // Open all child menus inside the active tab content
        activeTabContent?.querySelectorAll('.child__menu-inner').forEach(childMenu => {
          openChildMenu(childMenu);
        });
      }
    });
  });

  // Submenu navigation
  document.querySelectorAll('[data-procced]').forEach(button => {
    button.addEventListener('click', function() {
      const grandItem = document.querySelector(`.nav__grand-item[data-grand="${this.dataset.procced}"]`);
      if (grandItem) {
        document.querySelectorAll('.nav__grand-item').forEach(item => item.classList.remove('active'));
        grandItem.classList.add('active');
        navTabContainer.style.transform = 'translateX(-120%)';
        navGrands.style.transform = 'translateX(0)';
      }
    });
  });

  // Back button functionality
  document.querySelectorAll('[data-back]').forEach(button => {
    button.addEventListener('click', function() {
      const grandItem = document.querySelector(`.nav__grand-item[data-grand="${this.dataset.back}"]`);
      if (grandItem) {
        grandItem.classList.remove('active');
        navTabContainer.style.transform = 'translateX(0)';
        navGrands.style.transform = 'translateX(120%)';
      }
    });
  });
}




function drawerDropdown() {
  const childMenuItems = document.querySelectorAll('.child__menu-inner');
  if (!childMenuItems.length) return;

  const openChildMenu = (menuItem) => {
    const content = menuItem.querySelector('.grandchild__menu-wrapper');
    if (!content) return;
    menuItem.classList.add('active');
    content.style.maxHeight = `${content.scrollHeight}px`;
  };

  childMenuItems.forEach((menuItem) => {
    const submenuBtn = menuItem.querySelector('.open-submenu');
    if (!submenuBtn) return;

    openChildMenu(menuItem);

    submenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const content = menuItem.querySelector('.grandchild__menu-wrapper');
      if (!content) return;
      const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';
      if (isOpen) {
        menuItem.classList.remove('active');
        content.style.maxHeight = null;
      } else {
        openChildMenu(menuItem);
      }
    });
  });
}


function initHeaderSections() {
  document.querySelectorAll('.section-header').forEach(section => {
    section.classList.add('loaded');
  });
}

function handleCartCounterDisplay() {
  const lgCounter = document.querySelector('.cart__counter-lg');
  const smCounter = document.querySelector('.cart__counter-sm');
  const screenWidth = window.innerWidth;

  if (screenWidth > 1249) {
    if (smCounter) smCounter.remove();
  } else if (screenWidth < 1250) {
    if (lgCounter) lgCounter.remove();
  }
}

// Handle Cart count display
handleCartCounterDisplay();
window.addEventListener('resize', handleCartCounterDisplay);
// Handle Cart count display

document.addEventListener("DOMContentLoaded", function () {
    const drawerLogo = document.querySelector(".drawer__logo");
    const drawerMenu = document.querySelector(".drawer-menu");
    const drawerUtensils = document.querySelector(".drawer__utensils");
    const submenus = document.querySelectorAll(".submenu");
    const siteHeader = document.querySelector(".site__header");
    if (siteHeader) {
      const templateName = siteHeader.dataset.template || "";
      const suffixName = siteHeader.dataset.suffix || "";
      const allowedTemplates = siteHeader.dataset.allowed || "";
      const isTransparent = siteHeader.dataset.transparent === "true";
      const isSticky = siteHeader.dataset.sticky === "true";
  
      setupMegaMenu();
      setupStickyHeader(
        allowedTemplates,
        templateName,
        suffixName,
        isTransparent,
        isSticky
      );
      setupFixedHeader(allowedTemplates, templateName, suffixName, isTransparent);
      // setupStickyMenuScroll();
      window.setupHeaderDrawer();
      // setupDrawer();
      // initSubmenuNavigation();
      drawerDropdown();
    }
    initNavigationDrawer();
    initHeaderSections();

  
    // Calculate heights (0 if element is null)
    const logoHeight = drawerLogo ? drawerLogo.offsetHeight : 0;
    const utensilsHeight = drawerUtensils ? drawerUtensils.offsetHeight : 0;
    
    // Set drawer menu height if it exists
    if (drawerMenu) {
      // drawerMenu.style.height = `calc(100% - ${logoHeight + utensilsHeight}px)`;
    }
    
    // Position submenus if they exist
    if (submenus.length > 0) {
      submenus.forEach((submenu) => {
        submenu.style.top = `${logoHeight}px`;
        submenu.style.height = `calc(100% - ${logoHeight}px)`;
      });
    }
});



class PredictiveSearchNew extends HTMLElement {
  constructor() {
    super();
    this.header =
      this.querySelector(".site__header")?.parentElement ||
      document.querySelector(".site__header").parentElement;
    this.searchInput = this.querySelector("#predictive-search");
    this.resultsContainer = this.querySelector("#predictive-results");
    this.closeButton = this.querySelector(".close-search");
    this.debounceTimer = null;
    this.body = document.body;
    this.searchPopular = this.querySelector(".search-popular");
    this.fetchPredictiveResults = this.fetchPredictiveResults.bind(this);
    this.debounce = this.debounce.bind(this);
    this.handleInput = this.debounce(this.fetchPredictiveResults, 300);
    this.triggers = document.querySelectorAll("[header-search]");
  }

  connectedCallback() {
    this.triggers.forEach(trigger => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        this.classList.toggle("open");

        if (this.classList.contains("open")) {
          if (this.body) this.body.style.overflow = 'hidden';
          if (this.searchInput) {
            setTimeout(() => this.searchInput.focus(), 50);
          }          
        } else {
          if (this.body) this.body.style.overflow = 'visible';
        }
      });
    });

    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => {
        this.handleInput(e.target.value.trim());
      });
    }

    if (this.closeButton) {
      this.closeButton.addEventListener("click", () => {
        this.classList.remove("open");
        this.resultsContainer.classList.remove("show");
        this.searchInput.value = "";
        if (this.body) this.body.style.overflow = 'visible';
      });
    }
  }

  async fetchPredictiveResults(query) {
    if (!query) {
      this.resultsContainer.innerHTML = "";
      this.resultsContainer.classList.remove("show");
      if (this.searchPopular) this.searchPopular.classList.remove("hidden");
      return;
    }

    try {
      const response = await fetch(
        `/search/suggest?q=${encodeURIComponent(
          query
        )}&section_id=predictive-search-new&resources[type]=product,collection,page,article&resources[limit]=5`
      );
      const text = await response.text();
      this.resultsContainer.innerHTML = text;
      this.resultsContainer.classList.add("show");
      if (this.searchPopular) this.searchPopular.classList.add("hidden");
      window.cardProductFunc();
    } catch (error) {
      console.error("Error fetching predictive search:", error);
      this.resultsContainer.innerHTML = "<p>Error loading results</p>";
      this.resultsContainer.classList.add("show");
      if (this.searchPopular) this.searchPopular.classList.add("hidden");
      window.cardProductFunc();
    }
  }

  debounce(func, wait) {
    return (...args) => {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => func.apply(this, args), wait);
    };
  }

  disconnectedCallback() {
    this.triggers.forEach(trigger => {
      trigger.removeEventListener("click", this.toggleSearch);
    });
  }
}

customElements.define("predictive-search-new", PredictiveSearchNew);
