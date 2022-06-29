import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js";

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

const auth = getAuth();

const user = auth.currentUser;
if (user) {
  console.log("user", user);
} else {
  console.log("no user");
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("USER", user);
  } else {
    console.log("NO USER");
  }
});
