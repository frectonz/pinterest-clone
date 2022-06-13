import makeDropdown from "./dropdown.js";

export default function setupPinMenus() {
  const pinMenus = document.querySelectorAll(".pin-menu");
  const pinMenuDropdowns = document.querySelectorAll(".pin-menu-dropdown");

  pinMenus.forEach((pinMenu, i) => makeDropdown(pinMenu, pinMenuDropdowns[i]));
}
