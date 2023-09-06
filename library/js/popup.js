"use strict"

document.addEventListener("DOMContentLoaded", function() {

  const closeModalButtons = document.querySelectorAll('.popup-close');

  function closeAllPopups() {
    const allPopups = document.querySelectorAll('.modal.popup-open');
    allPopups.forEach(popup => {
      popup.classList.remove('popup-open');
    });
  }
  
  //popup register---------------------------//
  const openRegisterButtons = document.querySelectorAll('.register');
  const modalRegister = document.querySelector('#modal-register');  

  if (openRegisterButtons.length > 0) {
    openRegisterButtons.forEach(button => {
      button.addEventListener('click', () => {
        closeAllPopups();
        modalRegister.classList.add('popup-open');
        document.querySelector('.account').classList.remove('profile-active');
      })
    })
  }

  const popupActive = document.querySelector('.modal.popup-open');
  if (popupActive) {
    popupActive.classList.remove('popup-open');
  }

  if (modalRegister) {
    modalRegister.addEventListener('click', function(e) {
      if (!e.target.closest('.modal-register__content')) {
        modalRegister.classList.remove('popup-open');
      }
    });
  }
  

  if (closeModalButtons.length > 0) {
    closeModalButtons.forEach(button => {
      button.addEventListener('click', () => {
        modalRegister.classList.remove('popup-open');
      })
    });
  }

  //popup login---------------------------//
  const openLoginButtons = document.querySelectorAll('.login');
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

  if (modalLogin) {
    modalLogin.addEventListener('click', function(e) {
      if (!e.target.closest('.modal-login__content')) {
        modalLogin.classList.remove('popup-open');
      }
    });
  }

  if (closeModalButtons.length > 0) {
    closeModalButtons.forEach(button => {
      button.addEventListener('click', () => {
        modalLogin.classList.remove('popup-open');
      })
    });
  }

  //popup profile---------------------------//

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
  //функция обновления блока профиля
  function updateProfileBlock(user) {
    const profileBlock = document.querySelector('.account__front');
    if (user) {
      profileBlock.querySelector('.account__title').textContent = user.cardNumber;
      profileBlock.querySelector('.account__log-in').textContent = "My Profile";
      profileBlock.querySelector('.account__register').textContent = "Log Out";
    } else {
      profileBlock.querySelector('.account__title').textContent = "Profile";
      profileBlock.querySelector('.account__log-in').textContent = "Log In";
      profileBlock.querySelector('.account__register').textContent = "Register";
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
    } else if (buttonText === "My Profile") {
        // Здесь может быть ваш код для перехода в профиль или отображения деталей профиля
    }
  });
  //сохранение авторизации после обновления страницы
  document.addEventListener("DOMContentLoaded", function() {
    const loggedInUserCardNumber = localStorage.getItem("loggedInUser");
    if (loggedInUserCardNumber) {
        const user = JSON.parse(localStorage.getItem(loggedInUserCardNumber));
        updateProfileBlock(user);
    } else {
        updateProfileBlock(null); // Если пользователь не авторизован
    }
});


  //СТАРОЕ
  /*
  const registrationForm = document.querySelector("#modal-register");
  registrationForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const firstName = document.querySelector("[name='firstName']").value;
    const lastName = document.querySelector("[name='lastName']").value;
    const email = document.querySelector("[name='email']").value;
    const password = document.querySelector("[name='password']").value;
    //const cardNumber = (Math.floor(Math.random() * (0xFFFFFFFFF - 0x100000000 + 1)) + 0x100000000).toString(16).toUpperCase();
    const cardNumber = Math.floor(Math.random() * (0xFFFFFFFFF)).toString(16).toUpperCase().padStart(9, '0');
    // Сборка объекта user
    let user = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password, 
      cardNumber: cardNumber,
      visits: 1, // Поскольку пользователь уже посетил сайт при регистрации
      books: [],
      isAuthorized: true,
      isRegistered: true,
      isBuy: false
    };
    // Сохранение объекта user в localStorage
    localStorage.setItem('user', JSON.stringify(user));
        
    // Вывод сообщения об успешной регистрации или другие действия
    alert("Registration successful!");
    closeAllPopups();
  });
  window.onload = function() {
    let user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        user.visits += 1;
        localStorage.setItem('user', JSON.stringify(user));
    }
  };
  */
  //СТАРОЕ
  //LocalStorage---------------------------//

  //НЕ ТРОГАТЬ!!!!
});