const menu = document.querySelector(".menu");
const avatar = document.querySelector(".avatar");
const menuDropdown = document.querySelector("#menuDropdown");
const avatarDropdown = document.querySelector("#avatarDropdown");

const pinMenus = document.querySelectorAll(".pin-menu");
const pinMenuDropdowns = document.querySelectorAll(".pin-menu-dropdown");

pinMenus.forEach((pinMenu, i) => makeDropdown(pinMenu, pinMenuDropdowns[i]));

makeDropdown(menu, menuDropdown);
makeDropdown(avatar, avatarDropdown);

function makeDropdown(invokerBtn, dropdown) {
  let dropdownOpen = false;

  invokerBtn.addEventListener("click", () => {
    if (dropdownOpen) {
      dropdownOpen = false;
      dropdown.style.display = "none";
      dropdown.style.opacity = 0;
    } else {
      dropdownOpen = true;
      dropdown.style.display = "block";
      dropdown.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 100,
        fill: "forwards",
      });
    }
  });

  window.addEventListener("click", (e) => {
    if (
      !dropdown.contains(e.target) &&
      !invokerBtn.contains(e.target) &&
      dropdownOpen
    ) {
      dropdownOpen = false;
      dropdown.style.display = "none";
      dropdown.style.opacity = 0;
    }
  });
}

const searchBar = document.querySelector("#searchBar");
const logo = document.querySelector("#logo");
const pageDropdown = document.querySelector("#pageDropdown");
const profileDropdown = document.querySelector("#profileDropdown");

searchBar.addEventListener("focus", () => {
  if (window.innerWidth < 700) {
    logo.style.display = "none";
    pageDropdown.style.display = "none";
    profileDropdown.style.display = "none";
  }
});

searchBar.addEventListener("blur", () => {
  logo.style.display = "block";
  pageDropdown.style.display = "block";
  profileDropdown.style.display = "block";
});
