import GalleryModal from "./gallery-modal/index.js";
import Loader from "./loader/index.js";
import Modals from "./modals/index.js";
import SwitcherImgAnimation from "./switcher-img/index.js";

const loader = new Loader(document.getElementById("loader"))
  .init()
  .then((status) => {
    console.log(status);
  })
  .catch((err) => {
    console.err(err);
  })
  .finally(() => {
    const modals = new Modals();
    const gallery = new GalleryModal(modals);

    // Для первой формы
    const locationSelect = document.querySelector("[name='location']");
    const peopleSelect = document.querySelector("[name='people']");
    const dateInput = document.getElementById("date");

    const choicesLocation = new Choices(locationSelect, {
      searchEnabled: false,
      itemSelectText: "",
      classNames: {
        containerOuter: ["choices", "select-type-1"],
      },
    });

    const choicesPeople = new Choices(peopleSelect, {
      searchEnabled: false,
      itemSelectText: "",
      classNames: {
        containerOuter: ["choices", "select-type-1"],
      },
    });

    const maskDate = IMask(dateInput, {
      mask: Date,
      min: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() - 1
      ),
      max: new Date(
        new Date().getFullYear() + 3,
        new Date().getMonth(),
        new Date().getDate() - 1
      ),
      autofix: true,
      lazy: true,
      overwrite: true,

      pattern: "d{.}`m{.}`Y",
      blocks: {
        d: {
          mask: IMask.MaskedRange,
          from: 1,
          to: 31,
          maxLength: 2,
        },
        m: {
          mask: IMask.MaskedRange,
          from: 1,
          to: 12,
          maxLength: 2,
        },
        Y: {
          mask: IMask.MaskedRange,
          from: new Date().getFullYear(),
          to: new Date().getFullYear() + 3,
        },
      },
      // Форматирование даты с полным годом
      format: function (date) {
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        if (day < 10) day = "0" + day;
        if (month < 10) month = "0" + month;

        return [day, month, year].join(".");
      },
      // Парсинг даты
      parse: function (str) {
        const [day, month, year] = str.split(".");
        return new Date(year, month - 1, day);
      },
    });

    // Получаем первую форму
    const form = document.forms[0];

    // Функции валидации
    function isValidDate() {
      return maskDate.masked.isComplete;
    }

    function isValidLocation() {
      return choicesLocation.getValue(true) !== "";
    }

    function isValidPeople() {
      return choicesPeople.getValue(true) !== "";
    }

    // Функция подсветки ошибок
    function highlightErrors() {
      if (!isValidLocation()) {
        locationSelect.parentElement.style.borderColor = "red";
      } else {
        locationSelect.parentElement.style.borderColor = "";
      }

      if (!isValidPeople()) {
        peopleSelect.parentElement.style.borderColor = "red";
      } else {
        peopleSelect.parentElement.style.borderColor = "";
      }

      if (!isValidDate()) {
        dateInput.style.borderColor = "red";
      } else {
        dateInput.style.borderColor = "";
      }
    }

    // Функция создания URL с параметрами
    function createRedirectURL() {
      const location = choicesLocation.getValue(true);
      const people = choicesPeople.getValue(true);
      const date = maskDate.unmaskedValue;

      // Форматируем дату для URL
      const formattedDate = maskDate.value;

      const params = new URLSearchParams({
        location: location,
        people: people,
        date: formattedDate,
      });

      return `https://example.com/booking?${params.toString()}`;
    }

    // Обработчик отправки формы
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const isFormValid = isValidLocation() && isValidPeople() && isValidDate();

      if (isFormValid) {
        console.log("Форма отправлена");
        console.log("Локация:", choicesLocation.getValue(true));
        console.log("Количество людей:", choicesPeople.getValue(true));
        console.log("Дата:", maskDate.value);

        // Переход на другой сайт с параметрами
        const redirectURL = createRedirectURL();
        window.location.href = redirectURL;
      } else {
        alert("Заполните все поля корректно");
        highlightErrors();

        // Фокусировка на первом невалидном поле
        if (!isValidLocation()) {
          locationSelect.focus();
        } else if (!isValidPeople()) {
          peopleSelect.focus();
        } else if (!isValidDate()) {
          dateInput.focus();
        }
      }
    });

    // Сбрасываем подсветку при изменении значений
    locationSelect.addEventListener("change", function () {
      if (isValidLocation()) {
        locationSelect.parentElement.style.borderColor = "";
      }
    });

    peopleSelect.addEventListener("change", function () {
      if (isValidPeople()) {
        peopleSelect.parentElement.style.borderColor = "";
      }
    });

    dateInput.addEventListener("input", function () {
      if (isValidDate()) {
        dateInput.style.borderColor = "";
      }
    });

    /// Для второй формы
    const formDistribution = document.forms["distribution"];
    const emailDistribution = formDistribution.querySelector(
      "#distribution_email"
    );
    // Создаем маску для email
    const emailMask = IMask(emailDistribution, {
      mask: /^\S*@?\S*$/,
      dispatch: function (appended, dynamicMasked) {
        const cursor = dynamicMasked.compiledMasks.length;
        const value = dynamicMasked.value + appended;

        // Поэтапная валидация
        if (!value.includes("@")) {
          // До символа @ - разрешаем локальную часть email
          dynamicMasked.mask = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]*$/;
        } else if (
          value.includes("@") &&
          !value.includes(".", value.indexOf("@"))
        ) {
          // После @ но до точки - разрешаем доменное имя
          dynamicMasked.mask =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]*$/;
        } else {
          // После точки - разрешаем доменную зону
          dynamicMasked.mask =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z]*$/;
        }

        return dynamicMasked.compiledMask;
      },
      autofix: false,
      overwrite: false,
    });

    function isValidEmail(email) {
      const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      return (
        emailRegex.test(email) &&
        email.length <= 254 &&
        email.split("@")[0].length <= 64
      );
    }

    emailMask.on("accept", function () {
      const email = emailMask.value;

      if (email === "") {
        emailDistribution.style.borderColor = "";
      } else if (isValidEmail(email)) {
        emailDistribution.style.borderColor = "green";
      } else {
        emailDistribution.style.borderColor = "red";
      }
    });

    formDistribution.addEventListener("submit", function (event) {
      event.preventDefault();
      const email = emailMask.value;

      if (isValidEmail(email)) {
        console.log("Отправка email:", email);
        alert("Email отправлен!");
        formDistribution.reset();
        emailMask.updateValue();
      } else {
        alert("Введите корректный email в формате example@domain.com");
        emailDistribution.focus();
      }
    });

    /// Логика для шапки
    const headerElem = document.getElementById("header");
    function changeHeaderColor(header) {
      const headerHight = header.getBoundingClientRect().height;
      const scrollCurrent = window.scrollY - headerHight;

      if (scrollCurrent > 0) {
        header.classList.add("is-scroll");
      }

      if (!header) {
        return null;
      }

      return (event) => {
        const scrollNow = window.scrollY - headerHight;
        if (scrollNow > 0) {
          header.classList.add("is-scroll");
        } else {
          header.classList.remove("is-scroll");
        }
      };
    }
    document.addEventListener("scroll", changeHeaderColor(headerElem));

    //// Для анимации переключение

    new SwitcherImgAnimation(".about__imgs-links");

    /// Для переключения карточки

    const cards = document.querySelectorAll(".card");

    cards.forEach((card) => {
      card.addEventListener("click", function () {
        // Закрываем другие открытые карточки
        cards.forEach((otherCard) => {
          if (otherCard !== this) {
            otherCard.classList.remove("active");
          }
        });

        // Переключаем текущую карточку
        this.classList.toggle("active");
      });

      // Закрываем карточку при клике вне ее
      document.addEventListener("click", function (e) {
        if (!card.contains(e.target)) {
          card.classList.remove("active");
        }
      });
    });
  });
