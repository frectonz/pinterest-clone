export default function makeDropdown(invokerBtn, dropdown) {
  let dropdownOpen = false;

  invokerBtn.addEventListener("click", (e) => {
    e.stopPropagation();

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
