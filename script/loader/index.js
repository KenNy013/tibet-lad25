export default class Loader {
  constructor(modal) {
    this.modal = modal;
  }

  init() {
    return new Promise((resolve) => {
      this.showModal();
      this.lockScroll();

      const images = [...document.images];
      let loaded = 0;

      if (!images.length) {
        this.complete(resolve);
        return;
      }

      images.forEach((img) => {
        if (img.complete) {
          loaded++;
        } else {
          img.addEventListener("load", () =>
            this.checkLoad(++loaded, images.length, resolve)
          );
          img.addEventListener("error", () =>
            this.checkLoad(++loaded, images.length, resolve)
          );
        }
      });

      this.checkLoad(loaded, images.length, resolve);
    });
  }

  checkLoad(loaded, total, resolve) {
    if (loaded === total) this.complete(resolve);
  }

  complete(resolve) {
    this.hideModal();
    this.unlockScroll();
    resolve();
  }

  showModal() {
    this.modal?.showModal?.() || (this.modal.style.display = "flex");
  }

  hideModal() {
    this.modal?.close?.() || (this.modal.style.display = "none");
  }

  lockScroll() {
    document.body.style.overflow = "hidden";
  }

  unlockScroll() {
    document.body.style.overflow = "";
  }
}
