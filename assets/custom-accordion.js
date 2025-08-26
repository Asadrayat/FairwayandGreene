class Accordion {
  constructor(accordion = "", newOptions) {
    let options = {
      initOpenIndex: 1,
      closeAll: false,
      duration: 400,
      activeClass: "active",
    };
    this.options = { ...options, ...newOptions };
    this.handleValidAccordions(accordion);
  }

  handleValidAccordions(accordion) {
    if (accordion.length > 1)
      this.accordion = document.querySelector(accordion);
    else return;

    this.setIconsTransition();
    this.tabItemsArray = Array.from(this.accordion.children);

    if (this.tabItemsArray.length > 0) {
      if (this.options.initOpenIndex > this.tabItemsArray.length)
        this.options.initOpenIndex = this.tabItemsArray.length;
    }

    this.tabItemsArray?.forEach((tabElement, index, arr) => {
      let item = this.handleAccordionItems(tabElement);
      this.contentInitialHeight(item[1]);
      if (index === this.options.initOpenIndex - 1)
        this.InitialOpen(arr[index]);
      this.handleAccordion(item, index);
    });
  }

  setIconsTransition() {
    if (this.accordion?.querySelectorAll("svg")) {
      this.accordion
        ?.querySelectorAll("svg")
        .forEach(
          (svg) => (svg.style.transition = `${this.options.duration}ms`)
        );
    }
  }

  contentInitialHeight(content) {
    content.style.height = "0px";
    content.style.overflow = "hidden";
  }

  handleAccordion(item, index) {
    item[0].addEventListener("click", (e) => {
      this.toggle(item);
      this.currentIndex = index;
      if (this.options.closeAll) this.closeAll();
    });
  }

  handleAccordionItems(accordion) {
    if (accordion.children.length == 2) {
      let title = accordion.children[0];
      let content = accordion.children[1];
      return [title, content];
    }
  }

  InitialOpen(accordion) {
    let item = this.handleAccordionItems(accordion);
    this.setActiveClass(item);
    this.open(item);
  }

  open(item) {
    let content = item[1];
    this.transition(content);
    content.style.height = `${content.scrollHeight}px`;
  }

  close(item) {
    let content = item[1];
    content.style.height = `${0}px`;
  }

  toggle(item) {
    let content = item[1];
    let height = content.clientHeight;
    this.transition(content);
    height == 0
      ? (this.setActiveClass(item),
        (content.style.height = `${content.scrollHeight}px`))
      : (this.removeActiveClass(item), (content.style.height = "0px"));
  }

  transition(el) {
    el.style.transition = `all ${this.options.duration}ms ease`;
  }

  closeAll() {
    this.tabItemsArray?.forEach((accordion, index, arr) => {
      let item = this.handleAccordionItems(accordion);
      if (index !== this.currentIndex)
        this.close(item), this.removeActiveClass(item);
    });
  }

  setActiveClass(item) {
    item[1].parentElement.classList.add(this.options.activeClass);
  }
  removeActiveClass(item) {
    item[1].parentElement.classList.remove(this.options.activeClass);
  }
}
