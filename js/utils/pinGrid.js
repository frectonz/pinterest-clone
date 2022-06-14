const pinHTML = `
  <button class="save btn btn-primary">Save</button>
  <div class="dropdown">
    <button class="btn btn-secondary pin-menu">
      <svg width="16" height="16" viewBox="0 0 24 24">
        <path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3M3 9c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm18 0c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" />
      </svg>
    </button>
    <div class="dropdown-content pin-menu-dropdown">
      <a href="#">Hide Pin</a>
      <a href="#">Download image</a>
      <a href="#">Report Pin</a>
    </div>
  </div>
`;

export default function setupPinGrid() {
  const pinGrid = document.querySelector("#pinGrid");

  const images = [
    "./images/carousel/1.jpg",
    "./images/carousel/2.jpg",
    "./images/carousel/3.jpg",
    "./images/carousel/4.jpg",
    "./images/carousel/5.jpg",
    "./images/carousel/6.jpg",
    "./images/carousel/7.jpg",
    "./images/bathroom.jpg",
    "./images/bottle.jpg",
    "./images/deck.jpg",
    "./images/fern.jpg",
    "./images/scandinavian.jpg",
    "./images/side-image.png",
    "./images/beach.jpg",
    "./images/cake.jpg",
    "./images/mom-and-baby.jpg",
    "./images/night.jpg",
    "./images/building.jpg",
    "./images/dog.jpg",
    "./images/desert-night.jpg",
    "./images/rocks.jpg",
    "./images/cookies.jpg",
    "./images/flower.jpg",
    "./images/galaxy.jpg",
  ];

  const imagePins = images.map((image) => {
    const div = document.createElement("div");
    div.classList.add("pin");
    div.innerHTML = pinHTML;
    div.style.backgroundImage = `url(${image})`;

    div.addEventListener("click", () => {
      location.href = `/pin.html?id=${image}`;
    });

    return div;
  });

  pinGrid.append(...imagePins);
}
