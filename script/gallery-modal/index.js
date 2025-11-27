import Modals from "../modals/index.js";

export default class GalleryModal extends Modals {
  constructor() {
    super();
    this.galleryModalElement = document.querySelector('[data-modal="gallery"]');
    this.initGallery();
  }

  initGallery() {
    const originalOpen = this.open.bind(this);

    this.open = (modalName, buttonData = {}) => {
      if (modalName === "gallery") {
        this.updateGalleryContent(buttonData);
      }
      originalOpen(modalName, buttonData);
    };
  }

  updateGalleryContent(data) {
    if (!this.galleryModalElement) return;

    const image = this.galleryModalElement.querySelector("img");
    if (image && data.src) {
      image.src = data.src;
    }
  }
}
