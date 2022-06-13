import setupSearchBar from "./utils/searchBar.js";
import setupHeaderMenus from "./utils/headerMenus.js";
import setupPinGrid from "./utils/pinGrid.js";
import setupPinMenus from "./utils/pinMenus.js";

const tags = [
  "bathroom",
  "bottle",
  "deck",
  "fern",
  "scandinavian",
  "astronaut",
  "flowers",
  "green",
  "mirrors",
  "desert",
  "design",
  "nature",
  "water",
  "waterfall",
  "dancing",
  "bed",
  "laptop",
  "computer",
  "sunlight",
  "sun",
  "sunset",
  "sunrise",
];

window.addEventListener("load", () => {
  setupSearchBar();
  setupHeaderMenus();
  setupPinGrid();
  setupPinMenus();

  const chips = document.querySelector("#chips");

  const chipButtons = tags.map((tag) => {
    const button = document.createElement("button");
    button.innerText = tag;
    return button;
  });

  chips.append(...chipButtons);
});
