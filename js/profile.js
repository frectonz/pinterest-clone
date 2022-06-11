import makeDropdown from "./utils/dropdown.js";
import setupSearchBar from "./utils/searchBar.js";
import setupHeaderMenus from "./utils/headerMenus.js";

window.addEventListener("load", () => {
  setupSearchBar();
  setupHeaderMenus();

  const profileOptionsMenuInvoker = document.querySelector(
    "#profileOptionsMenuInvoker"
  );
  const profileOptionsMenu = document.querySelector("#profileOptionsMenu");

  makeDropdown(profileOptionsMenuInvoker, profileOptionsMenu);
});
