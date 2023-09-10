"use strict"

document.addEventListener("DOMContentLoaded", function() {  
  // Функция для проверки и обновления состояния кнопки при загрузке страницы
  function updateButtonState(button) {
    const loggedInUserCardNumber = localStorage.getItem("loggedInUser");
    const user = JSON.parse(localStorage.getItem(loggedInUserCardNumber) || '{}');

    const bookTitle = button.closest('.item-tabs__item').querySelector('.item-tabs__eaters').textContent;

    if (user.books && user.books.some(book => book.title === bookTitle)) {
        button.textContent = "Own";
        button.classList.add('button_own');
    }
  }

  // Обновление состояния каждой кнопки при загрузке страницы
  const openBuyCardAfterButtons = document.querySelectorAll('.open-card');
  openBuyCardAfterButtons.forEach(updateButtonState);

  //const openBuyCardAfterButtons = document.querySelectorAll('.open-card');
  console.log(openBuyCardAfterButtons);
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

        // Меняем статус кнопки
        button.textContent = "Own";
        button.classList.add('button_own');

        updateStatsDisplay(loggedInUserCardNumber);

        // Добавляем книгу в список rented
        //const rentedList = document.querySelector('.rented__list');
        //const listItem = document.createElement('li');
        //listItem.classList.add('rented__item');
        //listItem.textContent = `${bookTitle}, ${bookAuthor}`;
        //rentedList.appendChild(listItem);
        }
      });
      
    });
  }

  ///НЕ ТРОГАТЬ!!!
});