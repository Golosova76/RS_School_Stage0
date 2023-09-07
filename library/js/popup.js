"use strict"

document.addEventListener("DOMContentLoaded", function() {  

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
  //функция акрытия (удаления класса) popups по клику вне его
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
        closeAllPopups();
        modalLogin.classList.add('popup-open');
        document.querySelector('.account').classList.remove('profile-active');
      })
    });
  }
  addCloseButtonListener(closeModalButtons, modalLogin);
  addCloseListener(modalLogin, '.modal-login__content');
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
  //выход из профиля
  document.querySelector(".account__register").addEventListener("click", function() {
    const buttonText = this.textContent;
    if (buttonText === "Log Out") {
        localStorage.removeItem("loggedInUser"); // Удаляем только ключ текущего пользователя, не данные пользователя
        updateProfileBlock(null); // Обновляем блок профиля после выхода из профиля
    }
  });
  //обработка кнопки register и log out
  document.querySelector(".account__front").addEventListener("click", function(event) {
    const targetButton = event.target;
    if (targetButton.matches(".account__register")) {
        const buttonText = targetButton.textContent;
        if (buttonText === "Register") {
            closeAllPopups();
            document.querySelector('#modal-register').classList.add('popup-open');
        } else if (buttonText === "Log Out") {
            localStorage.removeItem("loggedInUser");
            updateProfileBlock(null);
        }
    }
  });
  //обработка кнопки log in и my profile
  document.querySelector(".account__log-in").addEventListener("click", function() {
    const buttonText = this.textContent;
    if (buttonText === "Log In") {
        closeAllPopups();
        document.querySelector('#modal-login').classList.add('popup-open');
        //можно сюда добавить document.querySelector('.account').classList.remove('profile-active'); сверху
        //когда разберусь с заменой блока library card
    } else if (buttonText === "My Profile") {
      // Здесь может быть код для перехода в профиль или отображения деталей профиля
      const openMyProfile = document.querySelector('.open-profile');
      const modalProfile = document.querySelector('#modal-profile');
      if (openMyProfile) {
        closeAllPopups();
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
    } else {
        updateProfileBlock(null); // Если пользователь не авторизован
    }
  //LocalStorage---------------------------//

  //НЕ ТРОГАТЬ!!!!
});