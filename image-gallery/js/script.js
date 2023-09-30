"use strict"

const apiKey = 'ePstrItpauWzD-3NqOIzll4sgdRIquFL87yKGX99uI4';
const imageContainer = document.querySelector('.image-gallery');
const searchInput = document.querySelector('.search-input');
const buttonSearch = document.querySelector('.button-search');
const buttonClose = document.querySelector('.button-close');
const modal = document.querySelector('.modal');
const modalImage = document.querySelector('.modal-content img');
let query = 'spring';


async function getData(query) {
  const responce = await fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=18&client_id=${apiKey}`);
  let data = await responce.json();
  data = data.results;
  //console.log(data);

  showData(data);
}


function showData (data) {
  imageContainer.innerHTML = '';
  data.map((photo) => {
    const divElement = document.createElement('div');
    divElement.classList.add('image-item');

    const imgElement = document.createElement('img');
    imgElement.src = photo.urls.small;
    imgElement.alt = photo.alt_description;
    imgElement.classList.add('image');
    // обработчик клика на картинку
    imgElement.addEventListener('click', () => {
      openModal(photo.urls.regular);
    });
    divElement.append(imgElement);
    imageContainer.appendChild(divElement);
  });
}



searchInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    const query = searchInput.value;
    getData(query);
  }
});

buttonSearch.addEventListener('click', () => {
  const query = searchInput.value;
  getData(query);
});

searchInput.addEventListener('input', () => {
  buttonClose.style.visibility = searchInput.value ? 'visible' : 'hidden';
});

buttonClose.addEventListener('click', () => {
  searchInput.value = '';
  buttonClose.style.visibility = 'hidden';
});

document.addEventListener('DOMContentLoaded', async () => {
  await getData(query);
});

function openModal(imageUrl) {
  modal.style.opacity = '1';
  modal.style.visibility = 'visible';
  modalImage.src = imageUrl;
}

function closeModal() {
  //modal.style.display = 'none';
  modal.style.opacity = '0';
  modal.style.visibility = 'hidden';
}

modal.addEventListener('click', function (e) {
  if (!e.target.closest('.modal-content')) {
    modal.style.opacity = '0';
    modal.style.visibility = 'hidden';
  }
});