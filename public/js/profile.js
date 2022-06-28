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

  const profileOptionsMenuInvoker = document.querySelector(
    "#profileOptionsMenuInvoker"
  );
  const profileOptionsMenu = document.querySelector("#profileOptionsMenu");

  makeDropdown(profileOptionsMenuInvoker, profileOptionsMenu);
});
