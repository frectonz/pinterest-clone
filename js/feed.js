import makeDropdown from "./utils/dropdown.js";
import setupSearchBar from "./utils/searchBar.js";
import setupHeaderMenus from "./utils/headerMenus.js";

window.addEventListener("load", () => {
  setupSearchBar();
  setupHeaderMenus();

  const pinMenus = document.querySelectorAll(".pin-menu");
  const pinMenuDropdowns = document.querySelectorAll(".pin-menu-dropdown");

  pinMenus.forEach((pinMenu, i) => makeDropdown(pinMenu, pinMenuDropdowns[i]));
});
