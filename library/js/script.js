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
  
        if (iconMenu.classList.contains('menu-active')) {
          document.body.classList.remove('lock');
          iconMenu.classList.remove('menu-active');
          menuBody.classList.remove('menu-active');
        }

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

  //Slider

  const wrapper = document.querySelector('.slider-main-block__wrapper');
  const slides = wrapper.querySelectorAll('.swiper-slide');
  let slideWidthWithGap = slides[0].offsetWidth + 25;
  const paginationButtons = document.querySelectorAll('.slider-main-block__circle');
  const prevButton = document.querySelector('.swiper-button-prev');
  const nextButton = document.querySelector('.swiper-button-next');
  let currentSlide = 0;
  let isAnimating = false;

  //функции

  //расчет значения смещения на основе индекса
  function getSlideOffset(index) {
    return -(index * slideWidthWithGap);
  }

  //основная для движения слайдера
  function moveSliderToSlide(slideIndex) {
    if (isAnimating) return;

    const offset = getSlideOffset(slideIndex);
    wrapper.style.transform = `translateX(${offset}px)`;

    currentSlide = slideIndex;
    updateControls();
  }

  //движение стрелок
  function moveNext() {
    if (currentSlide < slides.length - 1) {
      moveSliderToSlide(currentSlide + 1);
    }
  }

  function movePrev() {
    if (currentSlide > 0) {
      moveSliderToSlide(currentSlide - 1);
    }
  }

  //обработчики событий
  paginationButtons.forEach((button, index) => {
    button.addEventListener('click', () => moveSliderToSlide(index));
  });

  nextButton.addEventListener('click', moveNext);
  prevButton.addEventListener('click', movePrev);

  //функция обновления кружков пагинации и стрелок
  function updateControls() {
    paginationButtons.forEach((button, index) => {
      if (index === currentSlide) {
        button.classList.add('slide-active');
      } else {
        button.classList.remove('slide-active');
      }

      if (window.innerWidth >= 1440 && index > 2) {
        button.setAttribute('disabled', true)
      } else if (index === currentSlide) {
        button.setAttribute('disabled', true)
      } else {
        button.removeAttribute('disabled')
      }
    });

    if (currentSlide === 0) {
      prevButton.classList.add('disabled');
    } else {
      prevButton.classList.remove('disabled');
    }
  
    if (currentSlide === slides.length - 1) {
      nextButton.classList.add('disabled');
    } else {
      nextButton.classList.remove('disabled');
    }
  }

  wrapper.addEventListener('transitionstart', () => {
    isAnimating = true;
  });

  wrapper.addEventListener('transitionend', () => {
    isAnimating = false;
  });

  window.addEventListener('resize', () => {
    // Обновляем значение ширины слайда с учетом отступа, т.к. при изменении размера окна ширина слайдов может измениться
    slideWidthWithGap = slides[0].offsetWidth + 25;

    // Обновляем позицию слайдера для текущего активного слайда
    const offset = getSlideOffset(currentSlide);
    wrapper.style.transform = `translateX(${offset}px)`;

    // Обновляем контролы (кружки пагинации и стрелки)
    updateControls();
  });


  //Tabs

  const tabButtons = document.querySelectorAll('.tabs__label');
  const tabItems = document.querySelectorAll('.item-tabs');

  document.addEventListener('click', (e) => {
    const targetElement = e.target.closest('.tabs__label');
    let currentActiveIndex = null;
    let newActiveIndex = null;

    if (targetElement) {
      if (targetElement.classList.contains('tab-active')) {
        return;
      }
      
      tabButtons.forEach((tabButton, index) => {
        if (tabButton.classList.contains('tab-active')) {
          currentActiveIndex = index;
          tabButton.classList.remove('tab-active');
        }
        if (tabButton === targetElement) {
          newActiveIndex = index;
        }
      });

      const currentActiveTab = tabItems[currentActiveIndex];
      const nextActiveTab = tabItems[newActiveIndex];

      if (currentActiveIndex !== null) {
        currentActiveTab.style.opacity = '0';  // Инициируем затухание текущей вкладки
        setTimeout(() => {
          currentActiveTab.style.visibility = 'hidden';
          currentActiveTab.classList.remove('tab-active'); // Удаляем класс у текущей вкладки
          
          nextActiveTab.style.visibility = 'visible';
          nextActiveTab.style.opacity = '1';  // Инициируем появление следующей вкладки
          nextActiveTab.classList.add('tab-active');  // Добавляем класс к следующей вкладке
        }, 800);  // Задержка равна времени анимации, установленной в CSS (1s)
      } else {
        nextActiveTab.style.visibility = 'visible';
        nextActiveTab.style.opacity = '1';  // Просто инициируем появление, если нет текущей активной вкладки
        nextActiveTab.classList.add('tab-active');  // Добавляем класс к следующей вкладке
      }

      targetElement.classList.add('tab-active');
    }
  });
  
});