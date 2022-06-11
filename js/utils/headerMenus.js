import makeDropdown from "./dropdown.js";

export default function setupHeaderMenus() {
  const menu = document.querySelector("#menuBtn");
  const menuDropdown = document.querySelector("#menuDropdown");
  makeDropdown(menu, menuDropdown);

  const avatar = document.querySelector("#avatarBtn");
  const avatarDropdown = document.querySelector("#avatarDropdown");
  makeDropdown(avatar, avatarDropdown);
}
