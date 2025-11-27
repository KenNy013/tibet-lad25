export default class SwitcherImgAnimation {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.links = this.container.querySelectorAll("[data-position]");

    this.init();
  }

  init() {
    this.links.forEach((link, index) => {
      if (index === 0) {
        link.setAttribute("data-position", "bottom-right");
      } else {
        link.setAttribute("data-position", "top-left");
      }

      link.addEventListener("click", (e) => {
        if (link.getAttribute("data-active") === "true") {
          return;
        }

        e.preventDefault();
        this.switchAllPositions();
        this.setActiveLink(link);
      });
    });
  }

  switchAllPositions() {
    this.links.forEach((link) => {
      const currentPosition = link.getAttribute("data-position");

      if (currentPosition === "top-left") {
        link.setAttribute("data-position", "bottom-right");
      } else {
        link.setAttribute("data-position", "top-left");
      }
    });
  }

  setActiveLink(activeLink) {
    this.links.forEach((link) => {
      link.setAttribute("data-active", "false");
    });

    activeLink.setAttribute("data-active", "true");
  }
}
