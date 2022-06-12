import setupSearchBar from "./utils/searchBar.js";
import setupHeaderMenus from "./utils/headerMenus.js";
import makeDropdown from "./utils/dropdown.js";

window.addEventListener("load", () => {
  const singlePinMenuInvoker = document.querySelector("#singlePinMenuInvoker");
  const singlePinMenu = document.querySelector("#singlePinMenu");

  makeDropdown(singlePinMenuInvoker, singlePinMenu);

  setupSearchBar();
  setupHeaderMenus();
});
