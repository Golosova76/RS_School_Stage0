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
  //const closeModalRegister = document.querySelector('.modal-register');  

  //console.log(openRegisterButtons);
  //console.log(modalRegister);
  //console.log(closeModalButtons);

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

  //НЕ ТРОГАТЬ!!!!
});