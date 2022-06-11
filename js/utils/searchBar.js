export default function setupSearchBar() {
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
}
