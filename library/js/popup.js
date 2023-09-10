"use strict"

document.addEventListener("DOMContentLoaded", function() {  

  let savedButtonElement = null;
  //собираю коллекцию кнопок buy для покупки книг
  const openBuyCardAfterButtons = document.querySelectorAll('.open-card');
  //обновляем список книг в my profile
  restoreRentedBooksFromLocalStorage();

  function closeAllPopups() {
    const allPopups = document.querySelectorAll('.modal.popup-open');
    allPopups.forEach(popup => {
      popup.classList.remove('popup-open');
    });
  }
  
  //popup register---------------------------//
  const openRegisterButtons = document.querySelectorAll('.register.profile-action');
  const modalRegister = document.querySelector('#modal-register');  

  if (openRegisterButtons.length > 0) {
    openRegisterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const loggedInUserCardNumber = localStorage.getItem("loggedInUser");
        if (!loggedInUserCardNumber) {
          closeAllPopups();
          modalRegister.classList.add('popup-open');
          document.querySelector('.account').classList.remove('profile-active');
        }
      })
    })
  }
  //функция закрытия (удаления класса) popups по клику вне его
  function addCloseListener(modal, contentClass) {
    modal.addEventListener('click', function(e) {
      if (!e.target.closest(contentClass)) {
        modal.classList.remove('popup-open');
      }
    });
  }
  addCloseListener(modalRegister, '.modal-register__content');
  //закрытие popups по крестику
  const closeModalButtons = document.querySelectorAll('.popup-close');  
  //функция закрытия (удаления класса) popups по крестику
  function addCloseButtonListener(buttons, modal) {
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        modal.classList.remove('popup-open');
      });
    });
  }
  addCloseButtonListener(closeModalButtons, modalRegister);
  //popup login---------------------------//
  const openLoginButtons = document.querySelectorAll('.login.profile-action');
  const modalLogin = document.querySelector('#modal-login');
  
  if (openLoginButtons.length > 0) {
    openLoginButtons.forEach(button => {
      button.addEventListener('click', () => {
        const loggedInUserCardNumber = localStorage.getItem("loggedInUser");
        if (!loggedInUserCardNumber) {
          closeAllPopups();
          modalLogin.classList.add('popup-open');
          document.querySelector('.account').classList.remove('profile-active');
        }
      })
    });
  }
  addCloseButtonListener(closeModalButtons, modalLogin);
  addCloseListener(modalLogin, '.modal-login__content');
  //popup card---------------------------//
  const openBuyCardButtons = document.querySelectorAll('.open-card');
  const modalCard = document.querySelector('#modal-card');

  if (openBuyCardButtons.length > 0) {
    openBuyCardButtons.forEach(button => {
      button.addEventListener('click', () => {
        const loggedInUserCardNumber = localStorage.getItem("loggedInUser");
        const user = JSON.parse(localStorage.getItem(loggedInUserCardNumber));
        if (loggedInUserCardNumber) {
          if (!user.isBuy) {
            closeAllPopups();
            modalCard.classList.add('popup-open');
          }
        }
      })
    });
  }
  addCloseButtonListener(closeModalButtons, modalCard);
  addCloseListener(modalCard, '.modal-card__content');
  //LocalStorage---------------------------//
  //функция генерации cardNumber
  function generateCardNumber() {
    return Math.floor(Math.random() * (0xFFFFFFFFF)).toString(16).toUpperCase().padStart(9, '0');
  }
  //функция проверки есть ли у пользователя регистрация
  function isRegistered(cardNumber) {
    return localStorage.getItem(cardNumber) !== null;
  }
  //функция проверки почты пользователя
  function userMailRegistered(email) {
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      let user = JSON.parse(localStorage.getItem(key));
      if (user.email === email) {
        return true;
      }
    }
    return false;
  }
  //функция регистрации пользователя
  function register(firstName, lastName, email, password) {
    if (userMailRegistered(email)) {
      alert('User with such an email account exists');
      return null;
    }

    let cardNumber = generateCardNumber();

    while (isRegistered(cardNumber)) {
      cardNumber = generateCardNumber();
    }

    let user = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password, 
      cardNumber: cardNumber,
      visits: 1, // Поскольку пользователь уже посетил сайт при регистрации
      books: [],
      countBooks: 0,
      isBuy: false
    };
    localStorage.setItem(cardNumber, JSON.stringify(user));
    return cardNumber;
  }
  //слушатель submit на форму регистрации
  const registrationForm = document.querySelector("#modal-register");
  registrationForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const firstName = document.querySelector("[name='firstName']").value;
    const lastName = document.querySelector("[name='lastName']").value;
    const email = document.querySelector("[name='email']").value;
    const password = document.querySelector("[name='password']").value;

    let cardNumber = register(firstName, lastName, email, password);

    if (cardNumber) {
      alert('Registration successful! You card number: ' + cardNumber);
      //автоматически авторизуем пользователя после регистрации
      let user = JSON.parse(localStorage.getItem(cardNumber));
      localStorage.setItem('loggedInUser', user.cardNumber);
      updateProfileBlock(user);
      showVisitProfileBlock(user);
      showFormCardBlock(user);
    }
    closeAllPopups();
  });
  //функция авторизации
  function authenticateUser(identifier, password) {
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      let user = JSON.parse(localStorage.getItem(key));
      if ((user.email === identifier || user.cardNumber === identifier) && user.password === password) {
        // Увеличиваем счетчик визитов
        user.visits = (user.visits || 0) + 1; 
        // Сохраняем обновленный объект пользователя обратно в localStorage
        localStorage.setItem(key, JSON.stringify(user));
        //Возвращаем объект пользователя, если авторизация прошла успешно
        return user; 
      }
    }
    return false; //// Возвращаем null, если не нашли соответствующего пользователя
  }
  //слушатель submit на форму авторизации
  const loginForm = document.querySelector('#modal-login');
  loginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const identifier = document.querySelector("[name='identifier']").value;
    const password = document.querySelector("[name='password-login']").value; 

    let user = authenticateUser(identifier, password);

    if (user) {
      localStorage.setItem('loggedInUser', user.cardNumber);
      updateProfileBlock(user);
      showVisitProfileBlock(user);
      showFormCardBlock(user);
      updateButtonStatesBasedOnUserBooks();
    }
    closeAllPopups();
  });
  //функция получения инициалов
  function createUserInitialsElement(firstName, lastName) {
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    const initialsElement = document.createElement('div');
    initialsElement.classList.add('user-initials');
    initialsElement.textContent = initials;
    return initialsElement;
  }
  //функция обновления данных в modal profile
  function updateProfileModal() {
    // Получаем данные текущего пользователя из localStorage
    const loggedInUserCardNumber = localStorage.getItem("loggedInUser");
    const user = JSON.parse(localStorage.getItem(loggedInUserCardNumber));

    if (!user) return; // Если нет данных пользователя, выходим из функции

    // Находим элементы модального окна, которые нужно обновить
    const modalTotalBlock = document.querySelector('#modal-profile');
    const initialsElement = modalTotalBlock.querySelector('.modal-profile__initials');
    const nameElement = modalTotalBlock.querySelector('.modal-profile__name');
    const visitsElement = modalTotalBlock.querySelector('.count-visits');
    const booksElement = modalTotalBlock.querySelector('.count-books');
    const cardNumberProfileModalElement = modalTotalBlock.querySelector('.copy-number__card');

    // Обновляем инициалы
    const initials = createUserInitialsElement(user.firstName, user.lastName);
    initialsElement.textContent = initials.textContent;
    // Обновляем имя пользователя
    nameElement.textContent = `${user.firstName} ${user.lastName}`;
    // Обновляем количество посещений
    visitsElement.textContent = user.visits;
    //обновляем количество книг
    booksElement.textContent = user.countBooks;
    // Обновляем номер карты
    cardNumberProfileModalElement.textContent = user.cardNumber;    
}
  //функция обновления блока профиля
  function updateProfileBlock(user) {
    const profileBlock = document.querySelector('.account__front');
    const profileImageBlock = document.querySelector('.profile-header__image');
    // Удалить текущее содержимое блока
    while (profileImageBlock.firstChild) {
      profileImageBlock.removeChild(profileImageBlock.firstChild);
    }
    if (user) {
      profileBlock.querySelector('.account__title').textContent = user.cardNumber;
      profileBlock.querySelector('.account__title').style.fontSize = '12px';
      profileBlock.querySelector('.account__log-in').textContent = "My Profile";
      profileBlock.querySelector('.account__register').textContent = "Log Out";
      const userInitialsElement = createUserInitialsElement(user.firstName, user.lastName);
      profileImageBlock.appendChild(userInitialsElement);
      profileImageBlock.setAttribute('title', `${user.firstName} ${user.lastName}`)
    } else {
      profileBlock.querySelector('.account__title').textContent = "Profile";
      profileBlock.querySelector('.account__title').style.fontSize = '15px';
      profileBlock.querySelector('.account__log-in').textContent = "Log In";
      profileBlock.querySelector('.account__register').textContent = "Register";
      const defaultImage = document.createElement('img');
      defaultImage.src = "img/header/profile.svg";
      defaultImage.alt = "profile";
      profileImageBlock.appendChild(defaultImage);
    }
  }
  //обработка кнопки register и log out
  document.querySelector(".account__front").addEventListener("click", function(event) {
    const targetButton = event.target;
    if (targetButton.matches(".account__register")) {
        const buttonText = targetButton.textContent;
        if (buttonText === "Register") {
            closeAllPopups();
            document.querySelector('#modal-register').classList.add('popup-open');
        } else if (buttonText === "Log Out") {
          //выход из профиля
          localStorage.removeItem("loggedInUser");
          updateProfileBlock(null);
          document.querySelector('.account').classList.remove('profile-active');
          showVisitProfileBlock(null);
          showFormCardBlock(null);
          openBuyCardAfterButtons.forEach(resetButtonOwn);
        }
    }
  });
  //обработка кнопки log in и my profile
  document.querySelector(".account__log-in").addEventListener("click", function() {
    const buttonText = this.textContent;
    if (buttonText === "Log In") {
        closeAllPopups();
        document.querySelector('#modal-login').classList.add('popup-open');
    } else if (buttonText === "My Profile") {
      //код для перехода в профиль или отображения деталей профиля
      //popup profile---------------------------//
      const openMyProfile = document.querySelector('.open-profile');
      const modalProfile = document.querySelector('#modal-profile');
      if (openMyProfile) {
        closeAllPopups();
        updateProfileModal();
        modalProfile.classList.add('popup-open');
        document.querySelector('.account').classList.remove('profile-active');
        addCloseButtonListener(closeModalButtons, modalProfile);
        addCloseListener(modalProfile, '.modal-profile__content');
      }
    }
  });
  //сохранение авторизации после обновления страницы
  const loggedInUserCardNumber = localStorage.getItem("loggedInUser");
    console.log("Logged in User Card Number:", loggedInUserCardNumber);
    if (loggedInUserCardNumber) {
        const user = JSON.parse(localStorage.getItem(loggedInUserCardNumber));
        updateProfileBlock(user);
        showVisitProfileBlock(user);
        showFormCardBlock(user);
    } else {
        updateProfileBlock(null); // Если пользователь не авторизован
        showVisitProfileBlock(null);
        showFormCardBlock(null);
    }
  //LocalStorage---------------------------//
  //функция обновления library-cards => library-cards__account
  function showVisitProfileBlock(user) {
    const profileVisitBlock = document.querySelector('.library-cards__account');
    //для изменения кнопок
    const signUpButton = document.querySelector('.library-cards__button.register');
    const logInButton = document.querySelector('.library-cards__button.login');

    if (user) {
      profileVisitBlock.querySelector('.library-cards__get').textContent = 'Visit your profile';
      profileVisitBlock.querySelector('.library-cards__text').textContent = 'With a digital library card you get free access to the Library’s wide array of digital resources including e-books, databases, educational resources, and more.';
      if (signUpButton) {
        signUpButton.style.display = 'none'; // Скрываем кнопку Sign Up
      }
      if (logInButton) {
        logInButton.textContent = 'Profile'; // Изменить текст кнопки на Profile
      }
      const openProfileInCard = document.querySelector('.open-profile-card');
      openProfileInCard.addEventListener('click', function() {
        const buttonText = this.textContent;
        if (buttonText === 'Profile') {
          if (openProfileInCard) {
            closeAllPopups();
            const modalProfile = document.querySelector('#modal-profile');
            updateProfileModal();
            modalProfile.classList.add('popup-open');
            document.querySelector('.account').classList.remove('profile-active');
            addCloseButtonListener(closeModalButtons, modalProfile);
            addCloseListener(modalProfile, '.modal-profile__content');
          }
        }
      })
    } else {
      profileVisitBlock.querySelector('.library-cards__get').textContent = 'Get a reader card';
      profileVisitBlock.querySelector('.library-cards__text').textContent = 'You will be able to see a reader card after logging into account or you can register a new account';
      if (signUpButton) {
        signUpButton.style.display = ''; // Возвращаем кнопку обратно (делаем видимой)
      }
      if (logInButton) {
        logInButton.textContent = 'Log in'; // Восстановить первоначальный текст
      }
    }
  }
  //слушатель submit на форму card
  const checkCardForm = document.querySelector('.card__form');
  checkCardForm.addEventListener('submit', function(event) {
    event.preventDefault();

    // 1. Собираем данные с формы
    const inputNameValue = document.querySelector('.input-name').value;
    const inputCardValue = document.querySelector('.input-card').value;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const user = JSON.parse(localStorage.getItem(key));
      const fullName = `${user.firstName} ${user.lastName}`;
  
      if (inputNameValue === fullName && inputCardValue === user.cardNumber) {
        const loggedInUserCardNumber = localStorage.getItem("loggedInUser");
        if (!loggedInUserCardNumber) {
          // Пользователь зарегистрирован, но не авторизован
          replaceButtonWithStats(inputCardValue);
  
          setTimeout(() => {
            restoreButton();
            document.querySelector('.input-name').value = "";
            document.querySelector('.input-card').value = "";
          }, 10000);
  
          break;
        }
      }
    }
  });
  //функция обновления library-cards => library-cards__forms card
  function showFormCardBlock(user) {
    const formsCardBlock = document.querySelector('.library-cards__forms.card');    
    const inputNameElement = formsCardBlock.querySelector('.input-name');
    const inputCardNumberElement = formsCardBlock.querySelector('.input-card');

    if (user) {
      formsCardBlock.querySelector('.card__subtitle').textContent = 'Your Library card';
      replaceButtonWithStats(user.cardNumber);
      inputNameElement.placeholder = `${user.firstName} ${user.lastName}`;
      inputCardNumberElement.placeholder = user.cardNumber;
      inputNameElement.disabled = true;
      inputCardNumberElement.disabled = true;
    } else {
      formsCardBlock.querySelector('.card__subtitle').textContent = 'Find your Library card';
      restoreButton();
      inputNameElement.placeholder = 'Reader\'s name';
      inputCardNumberElement.placeholder = 'Card number';
      inputNameElement.disabled = false;
      inputCardNumberElement.disabled = false;
    }
  }
  ////функция генерации блока статистики
  function createStatsElement(cardNumber) {
    const user = JSON.parse(localStorage.getItem(cardNumber));
    const visits = user.visits; // Получаем количество визитов из объекта user
    const countBooks = user.countBooks; // Получаем количество книг из объекта user

    const statsList = document.createElement('ul');
    statsList.className = 'card__stats-list';

    const statsItems = [
      { title: 'Visits', icon: 'visit.svg', count: visits },
      { title: 'Bonuses', icon: 'bonus.svg', count: '1240' },
      { title: 'Books', icon: 'book.svg', count: countBooks }
    ];

    for (const item of statsItems) {
      const listItem = document.createElement('li');
      listItem.className = 'card__stats-item';

      const title = document.createElement('span');
      title.className = 'card__stats-title';
      title.textContent = item.title;

      const icon = document.createElement('img');
      icon.src = `img/library-card/icons/${item.icon}`;
      icon.alt = item.title.toLowerCase();

      // Если текущий элемент статистики это количество книг, добавляем дополнительный класс
      if (item.title === 'Books') {
        listItem.classList.add('count-books-card');
      }

      const count = document.createElement('span');
      count.className = 'card__stats-count';
      count.textContent = item.count;

      listItem.appendChild(title);
      listItem.appendChild(icon);
      listItem.appendChild(count);
      statsList.appendChild(listItem);
    }
    return statsList;
  }
  ////замена кнопки блоком статистики и назад
  function replaceButtonWithStats (cardNumber) {
    const buttonElement = document.querySelector('.card__button.card__button_big');
    if (buttonElement) {
      savedButtonElement = buttonElement.cloneNode(true);
      const statsElement = createStatsElement(cardNumber);
      buttonElement.parentNode.insertBefore(statsElement, buttonElement);
      buttonElement.parentNode.removeChild(buttonElement);
    }
  }
  function restoreButton() {
    const statsList = document.querySelector('.card__stats-list');
    if (statsList && savedButtonElement) {
        statsList.parentNode.insertBefore(savedButtonElement, statsList);
        statsList.parentNode.removeChild(statsList);
    }
  }
  //валидация modalCard
  const formCardReadBuy = document.querySelector('.form-login.form-card');
  const cardReaderNumber = formCardReadBuy.querySelector('.bank-card');
  const expirationCodes = formCardReadBuy.querySelectorAll('.form-login__two .form-login__input');
  const cvc = formCardReadBuy.querySelector('.form-login__input_cvc');
  const modalBuyButton = formCardReadBuy.querySelector('.button-buy-card'); 

  modalBuyButton.disabled = true;

  function validateFormBuyCard() {
    // Проверка длины номера карты
    const cardValid = (cardReaderNumber.value.replace(/\s/g, '').length === 16) && /^\d{12,19}$/.test(cardReaderNumber.value.replace(/\s/g, ''));
    cardValid ? cardReaderNumber.classList.remove('invalid-input') : cardReaderNumber.classList.add('invalid-input');
    // Проверка оба поля должны содержать 2 цифры.
    const expValid = Array.from(expirationCodes).every(input => input.value.length === 2 && /^\d{2}$/.test(input.value));
    expirationCodes.forEach(input => {
      const isTwoDigits = /^\d{2}$/.test(input.value);
      isTwoDigits ? input.classList.remove('invalid-input') : input.classList.add('invalid-input');
    });
    // Проверка CVC
    const cvcValid = cvc.value.length === 3 && /^\d{3}$/.test(cvc.value);
    cvcValid ? cvc.classList.remove('invalid-input') : cvc.classList.add('invalid-input');
    // Проверка, чтобы все поля были заполнены
    const allFilled = Array.from(formCardReadBuy.querySelectorAll('input[required]')).every(input => input.value.trim() !== '');

    // Активация кнопки Buy
    modalBuyButton.disabled = !(cardValid && expValid && cvcValid && allFilled);
  }
  // Установка слушателей событий
  formCardReadBuy.addEventListener('input', validateFormBuyCard);
  formCardReadBuy.addEventListener('submit', function(event) {
    event.preventDefault();
    closeAllPopups();
    const loggedInUserCardNumber = localStorage.getItem("loggedInUser");
    const user = JSON.parse(localStorage.getItem(loggedInUserCardNumber));
    //меняем значение флага и обновляем localStorage
    user.isBuy = true;
    localStorage.setItem(loggedInUserCardNumber, JSON.stringify(user));
  })
  //Buy books---------------------------//
  //функция обновления кнопки buy в library card
  function updateButtonOwn(button) {
    button.textContent = "Own";
    button.classList.add('button_own');
  }
  //функция возврата кнопки buy в library card
  function resetButtonOwn(button) {
    button.textContent = "Buy";
    button.classList.remove('button_own');
  }
  //добавление книг и количества в localStorage 
  if (openBuyCardAfterButtons.length > 0) {
    openBuyCardAfterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const loggedInUserCardNumber = localStorage.getItem("loggedInUser");
        const user = JSON.parse(localStorage.getItem(loggedInUserCardNumber));
        if (user.isBuy) {
        // Извлекаем название и автора напрямую из текущего блока
        const bookTitle = button.closest('.item-tabs__item').querySelector('.item-tabs__eaters').textContent;
        const bookAuthor = button.closest('.item-tabs__item').querySelector('.item-tabs__dean').textContent.replace('By ', '');
        // Добавляем книгу в список пользователя и обновляем localStorage
        const loggedInUserCardNumber = localStorage.getItem("loggedInUser");
        const user = JSON.parse(localStorage.getItem(loggedInUserCardNumber));
        user.countBooks += 1;
        user.books.push({ title: bookTitle, author: bookAuthor });
        localStorage.setItem(loggedInUserCardNumber, JSON.stringify(user));
        //меняем статус кнопки
        if (user) {
          updateButtonOwn(button);
        } else {
          resetButtonOwn(button)
        }
        //обновляем данные в счетчике книг в library card
        updateCountBooksInCard();
        // Добавляем книгу в список rented
        const rentedListElement = document.querySelector('.rented__list');
        console.log(rentedListElement);
        const listItem = document.createElement('li');
        listItem.classList.add('rented__item');
        listItem.textContent = `${bookTitle}, ${bookAuthor}`;
        rentedListElement.appendChild(listItem);
        }
      });
    });
  }
  //функция обновления данных в счетчике книг в library card
  function updateCountBooksInCard() {
    const loggedInUserCardNumber = localStorage.getItem("loggedInUser");
    const user = JSON.parse(localStorage.getItem(loggedInUserCardNumber));
    // Находим элемент, который нужно обновить
    const statsBlockCard = document.querySelector('.card__stats-list')
    const booksListItem = statsBlockCard.querySelector('.count-books-card');
    // Находим элемент счетчика внутри этого элемента списка
    const booksElement = booksListItem.querySelector('.card__stats-count');
    //обновляем количество книг
    booksElement.textContent = user.countBooks;
  }
  //функция обновления кнопок после авторизации
  function updateButtonStatesBasedOnUserBooks() {
    const loggedInUserCardNumber = localStorage.getItem("loggedInUser");
    if (loggedInUserCardNumber) {
        const user = JSON.parse(localStorage.getItem(loggedInUserCardNumber));
        openBuyCardAfterButtons.forEach(button => {
            const bookTitle = button.closest('.item-tabs__item').querySelector('.item-tabs__eaters').textContent;
            if (user.books && user.books.some(book => book.title === bookTitle)) {
                updateButtonOwn(button);
            } else {
                resetButtonOwn(button);
            }
        });
    }
  }
  //фукнция для загрузки и обновления списка книг
  function restoreRentedBooksFromLocalStorage() {
    const loggedInUserCardNumber = localStorage.getItem("loggedInUser");
    // Если пользователь не авторизован, прерываем функцию
    if (!loggedInUserCardNumber) return;
    const user = JSON.parse(localStorage.getItem(loggedInUserCardNumber));
    // Если нет данных о книгах пользователя, прерываем функцию
    if (!user || !user.books) return;

    const rentedListElement = document.querySelector('.rented__list');
    // Очищаем текущий список
    rentedListElement.innerHTML = '';

    // Восстанавливаем список из localStorage
    user.books.forEach(book => {
        const listItem = document.createElement('li');
        listItem.classList.add('rented__item');
        listItem.textContent = `${book.title}, ${book.author}`;
        rentedListElement.appendChild(listItem);
    });
  }
  //Buy books---------------------------//
  //копирование номера карты по клику на кнопку
  const copyButton = document.querySelector('.copy-number__buttom');
  const textElement = document.querySelector('.copy-number__card');
  copyButton.addEventListener('click', function() {
      // Копирование текста в буфер обмена
      const textarea = document.createElement('textarea');
      textarea.value = textElement.textContent;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      // Вывод сообщения пользователю
      alert('Number card is copy!');
  });
  //НЕ ТРОГАТЬ!!!!
});