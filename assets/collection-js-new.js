function sortOpenerFunc() {
  const sortOpener = document.querySelector("[sort-opener]");
  const sortBody = document.querySelector("[sort-body]");
  // const sortClose = document.querySelector("[sort-close]");

  function openSortBody() {
    sortBody.classList.add("open");
    sortOpener.classList.add("active"); // Add active class when opening
  }

  function closeSortBody() {
    sortBody.classList.remove("open");
    sortOpener.classList.remove("active"); // Remove active class when closing
  }

  sortOpener.addEventListener("click", function (event) {
    event.stopPropagation();
    if (sortBody.classList.contains("open")) {
      closeSortBody();
    } else {
      openSortBody();
    }
  });

  // sortClose.addEventListener("click", function (event) {
  //   event.stopPropagation();
  //   closeSortBody();
  // });

  // document.addEventListener("click", function (event) {
  //   if (
  //     !sortBody.contains(event.target) &&
  //     sortBody.classList.contains("open")
  //   ) {
  //     closeSortBody();
  //   }
  // });
  const custom__sort_wrapper = document.querySelector(".custom__sort");
  if (custom__sort_wrapper) {
    custom__sort_wrapper.addEventListener("click", function (event) {
      // let custom__sort_wrapper = event.target.closest('.custom__sort');

      let sortOpener_new = custom__sort_wrapper.querySelector("[sort-opener]");
      let sortBody_new = custom__sort_wrapper.querySelector("[sort-body]");

      sortOpener_new.classList.remove("active");
      sortBody_new.classList.remove("open");

      console.log("clicked", event.target);
      console.log("custom__sort_wrapper", custom__sort_wrapper);
    });
  }
}

function filterOpenFunc() {
  const filterOpener = document.querySelector("[filter-opener]");
  const filters = document.querySelector(
    "#main-collection-filters, #main-search-filters"
  );
  const hideFilters = document.querySelectorAll("[hide-filter]");

  const toggleBodyScroll = () => {
    if (filters.classList.contains("open")) {
      document.body.classList.add("filter__open");
    } else {
      document.body.classList.remove("filter__open");
    }
    if (window.innerWidth < 750) {
      if (filters.classList.contains("open")) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    } else {
      document.body.style.overflow = "";
    }
  };

  if (filterOpener) {
    filterOpener.addEventListener("click", function () {
      if (filters) {
        filters.classList.toggle("open");
        filterOpener.classList.toggle(
          "active",
          filters.classList.contains("open")
        );
        toggleBodyScroll();
      }
    });
  }

  hideFilters.forEach((hideBtn) => {
    hideBtn.addEventListener("click", function () {
      if (filters && filters.classList.contains("open")) {
        filters.classList.remove("open");
        filterOpener.classList.remove("active");
        toggleBodyScroll();
      }
    });
  });

  window.addEventListener("resize", toggleBodyScroll);
}

window.layoutSwitcherFunc = function () {
  const productGrid = document.querySelector(".product-grid");
  const layoutButtons = document.querySelectorAll(
    ".column__switch-lg-wrapper button"
  );

  if (!productGrid || !layoutButtons.length) return;

  // Constants
  const DESKTOP_CLASSES = ["grid--3-col-desktop", "grid--4-col-desktop"];
  const MOBILE_CLASSES = ["grid--1-col-tablet-down", "grid--2-col-tablet-down"];
  const ALL_CLASSES = [...DESKTOP_CLASSES, ...MOBILE_CLASSES];
  const STORAGE_KEY = "columnLayoutPreference";
  const EXPIRY_DAYS = 3;

  // Clear all layout classes
  function cleanUpGridClasses() {
    productGrid.classList.remove(...ALL_CLASSES);
  }

  // Set grid class and update button state
  function setGridClass(columnCount) {
    cleanUpGridClasses();

    const isDesktop = window.innerWidth >= 990;
    const classToAdd = isDesktop
      ? `grid--${columnCount}-col-desktop`
      : `grid--${columnCount}-col-tablet-down`;

    productGrid.classList.add(classToAdd);
    updateActiveButton(columnCount);
  }

  // Update active button based on column count
  function updateActiveButton(columnCount) {
    layoutButtons.forEach((button) => {
      const buttonColumn = parseInt(button.getAttribute("data-column"), 10);
      button.classList.toggle("active__column", buttonColumn === columnCount);
    });
  }

  // Save preference to localStorage
  function saveColumnPreference(columnCount) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + EXPIRY_DAYS);

    const preference = {
      columnCount: columnCount,
      expiry: expiryDate.getTime(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(preference));
  }

  // Get current active column count based on screen size
  function getCurrentColumnCount() {
    const isDesktop = window.innerWidth >= 990;
    const activeClasses = isDesktop ? DESKTOP_CLASSES : MOBILE_CLASSES;

    // Find which class is currently active
    const activeClass = activeClasses.find((cls) =>
      productGrid.classList.contains(cls)
    );

    if (activeClass) {
      return parseInt(activeClass.match(/\d+/)[0], 10);
    }
    return null;
  }

  // Load preference or sync with current classes
  function loadColumnPreference() {
    const savedPreference = localStorage.getItem(STORAGE_KEY);

    if (savedPreference) {
      const preference = JSON.parse(savedPreference);

      // Check if preference is expired
      if (new Date().getTime() > preference.expiry) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        // Apply saved preference
        setGridClass(preference.columnCount);
        return;
      }
    }

    // No valid preference - use current classes
    const currentColumnCount = getCurrentColumnCount();
    if (currentColumnCount !== null) {
      updateActiveButton(currentColumnCount);
    }
  }

  // Handle button click
  function handleButtonClick(button, columnCount) {
    setGridClass(columnCount);
    saveColumnPreference(columnCount);
  }

  // Initialize
  function init() {
    // Set up button click handlers
    layoutButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const columnCount = parseInt(button.getAttribute("data-column"), 10);
        handleButtonClick(button, columnCount);
      });
    });

    // Handle resize
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        loadColumnPreference();
      }, 100);
    });

    // Initial load
    loadColumnPreference();
  }

  init();
};

window.hideActiveFilter = function () {
  const removeAll = document.querySelector(
    ".active-facets facet-remove:only-child"
  );
  const activeFilters = document.querySelectorAll(".active__filter");
  const mainFilters = document.querySelector(
    "#main-collection-filters, #main-search-filters"
  );

  if (removeAll) {
    const activeFilter = removeAll.closest(".active__filter");
    if (activeFilter) activeFilter.style.display = "none";
    if (mainFilters) mainFilters.classList.remove("manipulate");
  } else {
    activeFilters.forEach((filter) => (filter.style.display = "block"));
    if (mainFilters) mainFilters.classList.add("manipulate");
  }
};

window.filterAccordion = function () {
  const faqAccordions = document.querySelectorAll(".accordion-item");

  const openFaqAccordion = (accordion) => {
    const content = accordion.querySelector(".accordion-body");
    accordion.classList.add("active");
    content.style.maxHeight = content.scrollHeight + "px";
  };

  const closeFaqAccordion = (accordion) => {
    const content = accordion.querySelector(".accordion-body");
    accordion.classList.remove("active");
    content.style.maxHeight = null;
  };

  // Check if URL contains "filter" or "sort"
  const url = window.location.href.toLowerCase();
  const shouldOpenAccordion = !url.includes("filter") && !url.includes("sort");

  if (faqAccordions.length > 0) {
    faqAccordions.forEach((accordion) => {
      const header = accordion.querySelector(".accordion-header");
      const content = accordion.querySelector(".accordion-body");

      // Only open accordion if URL doesn't contain "filter" or "sort"
      if (shouldOpenAccordion) {
        openFaqAccordion(accordion);
      }

      header.addEventListener("click", (e) => {
        e.stopPropagation();
        if (content.style.maxHeight) {
          closeFaqAccordion(accordion);
        } else {
          openFaqAccordion(accordion);
        }
      });
    });
  }
};

window.clearFilter = function () {
  const clearAllBtn = document.querySelector("[clear-all-filter]");
  const removeAllEl = document.querySelector(".remove__all-filter");
  const filtersPanel = document.querySelector(
    "#main-collection-filters, #main-search-filters"
  );

  if (clearAllBtn && removeAllEl && filtersPanel) {
    clearAllBtn.addEventListener("click", function () {
      // Trigger the remove all click
      removeAllEl.click();

      // Check and remove overflow: hidden from body if present
      if (document.body.style.overflow === "hidden") {
        document.body.style.overflow = "";
      }

      // Close filters panel if open
      if (filtersPanel.classList.contains("open")) {
        setTimeout(() => {
          filtersPanel.classList.remove("open");
        }, 0);
      }
    });
  }
};

function scrollCollectionListsFunc() {
  const collectionsLists = document.querySelectorAll(".collections__list");

  if (collectionsLists.length > 0) {
    collectionsLists.forEach((container) => {
      const activeLink = container.querySelector("a.active");

      if (activeLink) {
        const scrollPosition =
          activeLink.offsetLeft -
          container.offsetWidth / 2 +
          activeLink.offsetWidth / 2;

        container.scrollTo({ left: scrollPosition, behavior: "smooth" });
      }
    });
  }
}

window.initWrapperHeightSync = function () {
  const image = document.querySelector(".card__media img");
  const wrappers = document.querySelectorAll(
    ".--collection-promotion-card-wrapper"
  );
  const switchButtons = document.querySelectorAll(
    ".column__switch-lg-wrapper button"
  );

  if (!image) return;

  window.setAllWrapperHeights = function () {
    const imgHeight = image.offsetHeight;
    wrappers.forEach((wrapper) => {
      wrapper.style.height = `${imgHeight}px`;
    });
  };

  if (image.complete) {
    window.setAllWrapperHeights();
  } else {
    image.addEventListener("load", window.setAllWrapperHeights);
  }

  window.addEventListener("resize", window.setAllWrapperHeights);

  switchButtons.forEach((button) => {
    button.addEventListener("click", window.setAllWrapperHeights);
  });
};

window.loadMore = () => {
  const loadMoreButton = document.getElementById("load-more-button");
  const productGrid = document.getElementById("product-grid");
  const showingCount = document.getElementById("showing-count");

  if (!loadMoreButton || !productGrid) return;

  let isLoading = false;
  let currentPage = parseInt(loadMoreButton.dataset.currentPage);
  const totalPages = parseInt(loadMoreButton.dataset.totalPages);
  const totalItems = parseInt(loadMoreButton.dataset.totalItems);
  const itemsPerPage = parseInt(loadMoreButton.dataset.itemsPerPage);
  const collectionHandle =
    window.location.pathname.split("/collections/")[1]?.split("/")[0] || "";

  loadMoreButton.addEventListener("click", function () {
    if (isLoading || currentPage >= totalPages) return;

    isLoading = true;
    loadMoreButton.textContent = "Loading...";

    currentPage++;
    const url = buildUrl();

    fetch(url)
      .then((response) => response.text())
      .then((text) => {
        const parser = new DOMParser();
        const html = parser.parseFromString(text, "text/html");
        const newItems = html.getElementById("product-grid")?.innerHTML || "";

        if (newItems) {
          productGrid.insertAdjacentHTML("beforeend", newItems);

          const newShowingCount = Math.min(
            currentPage * itemsPerPage,
            totalItems
          );
          showingCount.textContent = newShowingCount;

          if (currentPage >= totalPages) {
            loadMoreButton.style.display = "none";
          } else {
            loadMoreButton.textContent = "Load More";
          }
        }
      })
      .catch((error) => {
        console.error("Error loading more products:", error);
        loadMoreButton.textContent = "Error - Try Again";
      })
      .finally(() => {
        isLoading = false;
        window.cardProductFunc();
        window.initWrapperHeightSync();
        
      });
  });

  function buildUrl() {
    const baseUrl = `/collections/${collectionHandle}`;
    const params = new URLSearchParams(window.location.search);
    params.set("page", currentPage);
    params.set("view", "ajax");
    return `${baseUrl}?${params.toString()}`;
  }
};


function makeUtilitiesFixed() {
  const collectionsList = document.querySelector(".collection__utilities-wrapper");
  const headerSection = document.querySelector(".site__header");
  const shopifySection = headerSection?.closest(".shopify-section");

  if (!collectionsList || !headerSection || !shopifySection) {
    console.log("Missing collectionsList, headerSection, or shopifySection");
    return;
  }

  let headerHeight = headerSection.offsetHeight;
  let initialOffset = collectionsList.getBoundingClientRect().top + window.scrollY;
  let isSticky = false;
  let isHeaderFixed = false;
  let lastScroll = window.scrollY;
  const buffer = 50; // Buffer to prevent rapid toggling

  // Debounce function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  // Update offsets dynamically
  function updateOffsets() {
    headerHeight = headerSection.offsetHeight;
    if (!isSticky) {
      initialOffset = collectionsList.getBoundingClientRect().top + window.scrollY;
    }
    if (isSticky) {
      collectionsList.style.top = isHeaderFixed ? `${headerHeight}px` : "0px";
    }
    // console.log("Offsets updated:", { headerHeight, initialOffset, isSticky, isHeaderFixed });
  }

  // Handle scroll event
  const handleScroll = debounce(() => {
    if (document.body.style.overflow === "hidden") {
      console.log("Scroll skipped: overflow hidden");
      return;
    }

    const currentScroll = window.scrollY;
    const scrollDirection = currentScroll > lastScroll ? "down" : "up";
    lastScroll = currentScroll;
    /*
    console.log({
      currentScroll,
      initialOffset,
      isSticky,
      isHeaderFixed,
      scrollDirection,
      headerHeight,
    });
    */
    

    // Determine if header is fixed (based on setupFixedHeader logic)
    isHeaderFixed = currentScroll > 300 && window.innerWidth > 1249;

    // Handle sticky navigation with buffer
    if (!isSticky && currentScroll >= initialOffset + buffer && scrollDirection === "down") {
      collectionsList.classList.add("sticky__nav");
      collectionsList.style.top = isHeaderFixed ? `${headerHeight}px` : "0px";
      isSticky = true;
    } else if (isSticky && currentScroll <= initialOffset - buffer && scrollDirection === "up") {
      collectionsList.classList.remove("sticky__nav");
      collectionsList.style.top = "";
      isSticky = false;
    } else if (isSticky) {
      // Update top position when header fixed state changes
      collectionsList.style.top = isHeaderFixed ? `${headerHeight}px` : "0px";
    }
  }, 50);

  // Attach scroll event listener
  window.addEventListener("scroll", handleScroll);

  // Handle resize and DOM changes
  const updateOffsetsDebounced = debounce(updateOffsets, 100);
  window.addEventListener("resize", updateOffsetsDebounced);

  // Observe DOM changes
  const observer = new MutationObserver(() => {
    updateOffsetsDebounced();
    // console.log("Mutation detected, offsets updated");
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
  });

  // Initial offset calculation
  updateOffsets();

  // Cleanup on page unload
  window.addEventListener("unload", () => {
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("resize", updateOffsetsDebounced);
    observer.disconnect();
  });
}

/*
function makeUtilitiesFixed() {
  const collectionsList = document.querySelector(
    ".collection__utilities-wrapper"
  );
  const headerSection = document.querySelector(".header-section");

  if (!collectionsList || !headerSection) return;

  const headerHeight = headerSection.offsetHeight;
  const initialOffset = collectionsList.offsetTop;
  let isSticky = false;
  let lastScroll = window.scrollY;

  const spacer = document.createElement("div");
  spacer.style.height = `${collectionsList.offsetHeight}px`;
  spacer.style.display = "none";
  collectionsList.parentNode.insertBefore(spacer, collectionsList);

  window.addEventListener("scroll", function () {
    const currentScroll = window.scrollY;
    const scrollDirection = currentScroll > lastScroll ? "down" : "up";
    lastScroll = currentScroll;

    if (scrollDirection === "down" && currentScroll >= 150 && !isSticky) {
      spacer.style.display = "block";
      collectionsList.classList.add("sticky__nav");
      collectionsList.style.top = `${headerHeight}px`;
      isSticky = true;
    } else if (scrollDirection === "up" && currentScroll <= 150 && isSticky) {
      collectionsList.classList.remove("sticky__nav");
      collectionsList.style.top = "";
      spacer.style.display = "none";
      isSticky = false;
    }
  });
}

*/

document.addEventListener("DOMContentLoaded", function () {
  sortOpenerFunc();
  filterOpenFunc();
  window.layoutSwitcherFunc();
  window.hideActiveFilter();
  window.filterAccordion();
  window.clearFilter();
  // scrollCollectionListsFunc();
  window.initWrapperHeightSync();
  // window.loadMore();
  makeUtilitiesFixed();
});
