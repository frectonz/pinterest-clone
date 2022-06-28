import makeDropdown from "./utils/dropdown.js";
import setupSearchBar from "./utils/searchBar.js";
import setupHeaderMenus from "./utils/headerMenus.js";
import setupPinGrid from "./utils/pinGrid.js";
import setupPinMenus from "./utils/pinMenus.js";

window.addEventListener("load", () => {
  setupSearchBar();
  setupHeaderMenus();
  setupPinGrid();
  setupPinMenus();

  const singlePinMenuInvoker = document.querySelector("#singlePinMenuInvoker");
  const singlePinMenu = document.querySelector("#singlePinMenu");

  makeDropdown(singlePinMenuInvoker, singlePinMenu);

  const pinImage = document.querySelector("#pinImage");
  const pinImageSrc = new URL(window.location.href).searchParams.get("id");

  if (pinImageSrc) {
    pinImage.style.backgroundImage = `url(${pinImageSrc})`;
  }
});
