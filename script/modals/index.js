export default class Modals {
  constructor() {
    this.body = document.body;
    this.modals = document.querySelectorAll("[data-modal]");
    this.openButtons = document.querySelectorAll("[data-modal-open]");
    this.closeButtons = document.querySelectorAll("[data-modal-close]");
    this.breakpoint = 1024;

    this.init();
    this.setupResizeListener();
  }

  setupResizeListener() {
    window.addEventListener("resize", () => {
      this.modals.forEach((modal) => {
        const modalDevice = modal.dataset.modalDevice;
        const isMobile = window.innerWidth < this.breakpoint;

        if (
          modalDevice === "mobile" &&
          !isMobile &&
          modal.hasAttribute("open")
        ) {
          this.close(modal.dataset.modal);
        }
      });
    });
  }

  canOpenOnCurrentDevice(modal) {
    const modalDevice = modal.dataset.modalDevice;
    const isMobile = window.innerWidth < this.breakpoint;

    if (!modalDevice || modalDevice === "all") return true;
    if (modalDevice === "mobile" && isMobile) return true;

    return false;
  }

  // Новый метод для сбора данных из data-атрибутов
  collectButtonData(button) {
    const data = {};

    // Собираем все data-атрибуты, начинающиеся с data-modal-
    for (const [key, value] of Object.entries(button.dataset)) {
      if (key.startsWith("modal")) {
        // Преобразуем modalSrc в src и т.д.
        const cleanKey = key.replace(/^modal/, "");
        const formattedKey =
          cleanKey.charAt(0).toLowerCase() + cleanKey.slice(1);
        data[formattedKey] = value;
      }
    }

    return data;
  }

  init() {
    this.openButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const modalName = button.dataset.modalOpen;
        const buttonData = this.collectButtonData(button);
        this.open(modalName, buttonData);
      });
    });

    this.closeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const modalName = button.dataset.modalClose;
        this.close(modalName);
      });
    });
  }

  open(modalName, buttonData = {}) {
    const modal = document.querySelector(`[data-modal="${modalName}"]`);
    if (modal && this.canOpenOnCurrentDevice(modal)) {
      // Сохраняем данные в модальном окне для использования другими классами
      modal._modalData = buttonData;

      modal.setAttribute("open", "");
      this.body.style.overflow = "hidden";

      setTimeout(() => {
        modal.classList.add("is-active");
      }, 10);
    }
  }

  close(modalName) {
    const modal = document.querySelector(`[data-modal="${modalName}"]`);
    if (modal) {
      modal.classList.remove("is-active");

      setTimeout(() => {
        modal.removeAttribute("open");
        this.body.style.overflow = "";
        // Очищаем данные при закрытии
        delete modal._modalData;
      }, 300);
    }
  }

  // Метод для получения данных модального окна (может быть полезен другим классам)
  getModalData(modalName) {
    const modal = document.querySelector(`[data-modal="${modalName}"]`);
    return modal ? modal._modalData || {} : {};
  }
}
