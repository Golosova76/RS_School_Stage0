"use strict"

const apiKey = 'ePstrItpauWzD-3NqOIzll4sgdRIquFL87yKGX99uI4';
const imageContainer = document.querySelector('.image-gallery');

/*

async function getData() {
  const responce = await fetch(`https://api.unsplash.com/search/photos?query=spring&per_page=18&client_id=${apiKey}`);
  let data = await responce.json();
  data = data.results;
  //console.log(data);

  showData (data);
}
getData();



function showData (data) {
  data.map((photo) => {
    const divElement = document.createElement('div');
    divElement.classList.add('image-item');

    const imgElement = document.createElement('img');
    imgElement.src = photo.urls.small;
    imgElement.alt = photo.alt_description;
    imgElement.classList.add('image');
    divElement.append(imgElement);
    imageContainer.appendChild(divElement);
  });
}

*/
