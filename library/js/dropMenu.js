"use strict"

document.addEventListener("DOMContentLoaded", function() {
    //dropMenu before register
    const buttonRegister = document.querySelector('.profile-header__image');
    const openRegister = document.querySelector('.account');
  
    if (buttonRegister) {
      buttonRegister.addEventListener("click", function (e) {
        openRegister.classList.toggle('profile-active');
      });
    }
  
    document.addEventListener('click', function(event) {
      let isClickInsideProfile = buttonRegister.contains(event.target);
      let isClickOnProfile = openRegister.contains(event.target);
  
      if (!isClickInsideProfile && !isClickOnProfile && openRegister.classList.contains('profile-active')) {
        openRegister.classList.remove('profile-active');
      }
    }); 
});
