async function fetchAccountData() {
  const response = await fetch('/data/account.json');
  const data = await response.json();
  return data;
}

async function fetchData(view) {
  const file = view === 'tiles' ? '/data/data-tablet.json' : '/data/data-mobile.json';
  const response = await fetch(file);
  const data = await response.json();
  return data;
}

function renderHeaderInfo(data) {
  const headerInfo = document.getElementById('header-info');
  headerInfo.innerHTML = `
    <div class="header-container">
      <div class="title-container">
        <h2>${data.title}</h2>
        <p>Start on ${data.startDate}</p>
      </div>
      <div class="about-account">
        <p class="about-posts"><span>${data.posts}</span> posts</p>
        <p class="about-followers"><span>${data.followers}</span> followers</p>
        <p class="about-following"><span>${data.following}</span> following</p>
      </div>
      <div class="date-container">
        <p>Date</p>
        <div class="inputs">
          <input type="text" class="date-input" placeholder="from" id="dateFrom">
          <input type="text" class="date-input" placeholder="to" id="dateTo">
        </div>
      </div>
    </div>
  `;
  flatpickr('#dateFrom', {});
  flatpickr('#dateTo', {});
}

function handleLikeButtonClick(event) {
  const likeButton = event.currentTarget;
  const likeCountElement = likeButton.querySelector('p');
  const likeIcon = likeButton.querySelector('svg');

  let likeCount = parseInt(likeCountElement.textContent, 10);
  if (likeIcon.classList.contains('liked')) {
    likeIcon.classList.remove('liked');
    likeCountElement.textContent = --likeCount;
  } else {
    likeIcon.classList.add('liked');
    likeCountElement.textContent = ++likeCount;
  }
}

function addLikeButtonListeners() {
  const likeButtons = document.querySelectorAll('.like-wrapper');
  likeButtons.forEach(button => {
    button.addEventListener('click', handleLikeButtonClick);
  });
}

function renderCardView(data) {
  const gallery = document.getElementById('gallery');
  gallery.className = 'card-gallery';
  gallery.innerHTML = '';

  const cards = data.map(item => {
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
      <img class="pic" src="${item.imgSrc}" alt="picture">
      <div class="card_info">
        <div class="item_wrapper">
          <h2>${item.title}</h2>
          <div class="like_and_coment">
            <div class="like-wrapper">
              <button class="btn-like">
                  <svg class="icon-cards" width="16px" height="16px">
                    <use href="./icons.svg#icon-like"></use>
                  </svg>
              </button>
              <p>${item.likesToday}</p>
            </div>
            <div class="comments-wrapper">
                  <svg class="icon-cards" width="16px" height="16px">
                    <use href="./icons.svg#icon-comment"></use>
                  </svg>
              <p>${item.commentsToday}</p>
            </div>
          </div>
        </div>
        <div class="item_wrapper">
          <h2>${item.dateCreate}</h2>
          <div class="like_and_coment">
            <div class="like-wrapper">
              <svg class="icon-cards" width="16px" height="16px">
                <use href="./icons.svg#icon-like"></use>
              </svg>
              <p>${item.likesOnPost}</p>
            </div>
            <div class="comments-wrapper">
              <svg class="icon-cards" width="16px" height="16px">
                <use href="./icons.svg#icon-comment"></use>
              </svg>
              <p>${item.commentsOnPost}</p>
            </div>
          </div>
        </div>
        <div class="item_wrapper">
          <h2>Image Upload</h2>
          <div class="like_and_coment">
            <p>${item.uploadDate}</p>
          </div>
        </div>
      </div>
    `;
    return card;
  });

  gallery.append(...cards);
  addLikeButtonListeners();
}

function renderTileView(data) {
  const gallery = document.getElementById('gallery');
  gallery.className = 'tiles-gallery';
  gallery.innerHTML = '';

  const tiles = data.map(item => {
    const tile = document.createElement('div');
    tile.classList.add('tile');

    tile.innerHTML = `
      <img class="pic" src="${item.imgSrc}" alt="picture">
      <div class="card_info">
        <div class="info-cols">
          <div class="col-left">
            <h2>${item.title}</h2>
            <div class="like_and_comment">
              <div class="like-wrapper">
              <button class="btn-like">
                    <svg class="icon-cards" width="16px" height="16px">
                      <use href="./icons.svg#icon-like"></use>
                    </svg>
                </button>
                <p>${item.likesToday}</p>
              </div>
              <div class="comments-wrapper">
                <svg class="icon-cards" width="16px" height="16px">
                  <use href="./icons.svg#icon-comment"></use>
                </svg>
                <p>${item.commentsToday}</p>
              </div>
            </div>
          </div>
          <div class="col-right">
            <h2>${item.dateCreate}</h2>
            <div class="like_and_comment">
              <div class="like-wrapper">
                <svg class="icon-cards" width="16px" height="16px">
                  <use href="./icons.svg#icon-like"></use>
                </svg>
                <p>${item.likesOnPost}</p>
              </div>
              <div class="comments-wrapper">
                <svg class="icon-cards" width="16px" height="16px">
                  <use href="./icons.svg#icon-comment"></use>
                </svg>
                <p>${item.commentsOnPost}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="item_wrapper upload-wrapper">
          <h2>Image Upload</h2>
          <div class="like_and_coment">
            <p>${item.uploadDate}</p>
          </div>
        </div>
      </div>
    `;
    return tile;
  });

  gallery.append(...tiles);
  addLikeButtonListeners();
}

function updateGalleryView(view, data) {
  if (view === 'tiles') {
    renderTileView(data);
  } else {
    renderCardView(data);
  }
}

function setActiveButton(activeButtonId) {
  const buttons = document.querySelectorAll('.change-page button');
  buttons.forEach(button => {
    button.classList.remove('active');
  });

  const activeButton = document.getElementById(activeButtonId);
  activeButton.classList.add('active');
}

document.getElementById('loadMore').addEventListener('click', async () => {
  const activeButton = document.querySelector('.change-page button.active');
  const view = activeButton.id === 'tilesViewButton' ? 'tiles' : 'rows';
  const data = await fetchData(view);
  updateGalleryView(view, data.concat(data));
});

document.addEventListener('DOMContentLoaded', async () => {
  const accountData = await fetchAccountData();
  renderHeaderInfo(accountData);

  const galleryData = await fetchData('rows');
  renderCardView(galleryData);

  document.getElementById('tilesViewButton').addEventListener('click', async () => {
    const data = await fetchData('tiles');
    updateGalleryView('tiles', data);
    setActiveButton('tilesViewButton');
  });

  document.getElementById('listViewButton').addEventListener('click', async () => {
    const data = await fetchData('rows');
    updateGalleryView('rows', data);
    setActiveButton('listViewButton');
  });

  setActiveButton('listViewButton');
  updateGalleryView('rows', galleryData);
});
