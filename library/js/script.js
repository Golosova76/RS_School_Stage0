"use strict"

document.addEventListener("DOMContentLoaded", function() {

  const iconMenu = document.querySelector('.menu__icon');
  const menuBody = document.querySelector('.menu__body');
    

  if (iconMenu) {
    iconMenu.addEventListener("click", function (e) {
      document.body.classList.toggle('lock');
      iconMenu.classList.toggle('menu-active');
      menuBody.classList.toggle('menu-active');
    });
  }

  document.addEventListener('click', function(event) {
    let isClickInsideMenu = menuBody.contains(event.target);
    let isClickOnButton = iconMenu.contains(event.target);

    if (!isClickInsideMenu && !isClickOnButton && menuBody.classList.contains('menu-active')) {
      document.body.classList.remove('lock');
      iconMenu.classList.remove('menu-active');
      menuBody.classList.remove('menu-active');
    }
  }); 

  //click scrolling

  const menuLinks = document.querySelectorAll('.menu__link[data-goto]');

  if (menuLinks.length > 0) {
    
    menuLinks.forEach(menulink => {
      menulink.addEventListener("click", onMenuLinkClick);
    });

    function onMenuLinkClick (e) {    
      const menuLink = e.target;     
      if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {     
        const gotoBlock = document.querySelector(menuLink.dataset.goto);
        
        const gotoBlockValue = gotoBlock.getBoundingClientRect().top + scrollY;      
  /*
        if (iconMenu.classList.contains('active')) {
          document.body.classList.remove('lock');
          iconMenu.classList.remove('active');
          menuBody.classList.remove('active');
        }
  */
        //кусок кода кот и заставит скролл прокрутится к нужному месту
        window.scrollTo({
          //прокручиваем сверху и до const gotoBlockValue
          top: gotoBlockValue,
          behavior: "smooth"
        });
        //обращаемся к окну браузера и с помощью функции прокрутки scrollTo()
        //отключаем работу ссылки
        e.preventDefault();
      }
    }
  }
});