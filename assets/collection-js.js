document.addEventListener("DOMContentLoaded", function () {
  const sortOpener = document.querySelector("[sort-opener]");
  const sortBody = document.querySelector("[sort-body]");
  const sortClose = document.querySelector("[sort-close]");
  const filterPopup = document.querySelector(".filter__popup");
  const body = document.body;
  function openSortBody() {
    sortBody.classList.add("open");
    if(filterPopup.classList.contains("open")){
      filterPopup.classList.remove("open");
    }
    body.classList.remove("overflow-hidden");
    // body.classList.add("overflow-hidden");
  }

  function closeSortBody() {
    sortBody.classList.remove("open");
    // body.classList.remove("overflow-hidden");
  }

  sortOpener.addEventListener("click", function (event) {
    event.stopPropagation();
    if (sortBody.classList.contains("open")) {
      closeSortBody();
    } else {
      openSortBody();
    }
  });

  sortClose.addEventListener("click", function (event) {
    event.stopPropagation();
    closeSortBody();
  });

  document.addEventListener("click", function (event) {
    if (
      !sortBody.contains(event.target) &&
      sortBody.classList.contains("open")
    ) {
      closeSortBody();
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const filterPopup = document.querySelector(".filter__popup");
  const filterPopupWrapper = document.querySelector(".filter__popup-wrapper");
  const filterOpeners = document.querySelectorAll("[filter-opener]");
  const filterPopupClose = document.querySelector("[filter-popup-close]");
  const body = document.body;
  
  function openFilterPopup(e) {
    // For screens greater than 989px
    if (window.innerWidth > 989) {
      // Find the closest filter__header to the clicked opener
      const filterHeader = e.currentTarget.closest('.filter__header');
      
      if (filterHeader) {
        // Scroll header to top
        filterHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Wait 500ms before opening the drawer
        setTimeout(() => {
          filterPopup.classList.add("open");
          body.classList.add("overflow-hidden");
        }, 500);
        return; // Exit to prevent immediate opening
      }
    }
    
    // Default behavior for smaller screens or if no header found
    filterPopup.classList.add("open");
    body.classList.add("overflow-hidden");
  }

  function closeFilterPopup() {
    filterPopup.classList.remove("open");
    body.classList.remove("overflow-hidden");
  }

  filterOpeners.forEach((opener) => {
    opener.addEventListener("click", openFilterPopup);
  });

  if (filterPopupClose) {
    filterPopupClose.addEventListener("click", closeFilterPopup);
  }

  document.addEventListener("click", function (event) {
    if (
      !filterPopupWrapper.contains(event.target) &&
      !event.target.hasAttribute("filter-opener")
    ) {
      closeFilterPopup();
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const accordionHeaders = document.querySelectorAll(".accordion-header");
  const accordionBodies = document.querySelectorAll(".accordion-body");
  const accordionIcons = document.querySelectorAll(".accordion-header-icon");

  function initializeAccordion() {
    if (window.innerWidth < 1200) {
      /*
        accordionBodies.forEach((body, index) => {
          if (index !== 0) {
            body.classList.add("hidden");
          }
        });

        if (accordionIcons[0]) {
          accordionIcons[0].classList.add("rotate");
        }
        */

      accordionHeaders.forEach((header, index) => {
        header.addEventListener("click", function () {
          const accordionBody = accordionBodies[index];
          const accordionIcon = accordionIcons[index];

          accordionBody.classList.toggle("hidden");
          accordionIcon.classList.toggle("rotate");
        });
      });
    } else {
      accordionBodies.forEach((body) => body.classList.remove("hidden"));
      accordionIcons.forEach((icon) => icon.classList.remove("rotate"));
    }
  }

  initializeAccordion();

  window.addEventListener("resize", initializeAccordion);
});

window.initWrapperHeightSync = function () {
  const image = document.querySelector('.card__product-media img');
  const wrappers = document.querySelectorAll('.--collection-promotion-card-wrapper');

  if (!image) return;

  window.setAllWrapperHeights = function () {
    const imgHeight = image.offsetHeight;
    wrappers.forEach(wrapper => {
      wrapper.style.height = `${imgHeight}px`;
    });
  };

  if (image.complete) {
    window.setAllWrapperHeights();
  } else {
    image.addEventListener('load', window.setAllWrapperHeights);
  }

  window.addEventListener('resize', window.setAllWrapperHeights);

};

document.addEventListener('DOMContentLoaded', function () {
  // window.initWrapperHeightSync();
});
/*
document.addEventListener("DOMContentLoaded", () => {
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
});



document.addEventListener("DOMContentLoaded", function () {
  const collectionsList = document.querySelector(".collections__list");

  if (!collectionsList) return;

  const initialOffsetTop = collectionsList.offsetTop;
  let isSticky = false;

  window.addEventListener("scroll", function () {
    const scrollPosition = window.scrollY;

    if (scrollPosition >= initialOffsetTop && !isSticky) {
      collectionsList.classList.add("sticky__nav");
      isSticky = true;
    } else if (scrollPosition < initialOffsetTop && isSticky) {
      collectionsList.classList.remove("sticky__nav");
      isSticky = false;
    }
  });
});
*/
