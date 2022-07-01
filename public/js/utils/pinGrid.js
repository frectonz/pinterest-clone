import {
  getDocs,
  collection,
  getFirestore,
} from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
import {
  ref,
  getStorage,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";

const pinHTML = `
  <button class="save btn btn-primary">Save</button>
  <div class="dropdown">
    <button class="btn btn-secondary pin-menu">
      <svg width="16" height="16" viewBox="0 0 24 24">
        <path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3M3 9c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm18 0c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" />
      </svg>
    </button>
    <div class="dropdown-content pin-menu-dropdown">
      <a href="#">Hide Pin</a>
      <a href="#">Download image</a>
      <a href="#">Report Pin</a>
    </div>
  </div>
`;

export default async function setupPinGrid() {
  const pinGrid = document.querySelector("#pinGrid");

  const db = getFirestore();
  const querySnapshot = await getDocs(collection(db, "pins"));
  const imagePins = [];

  querySnapshot.forEach((doc) => {
    const pin = doc.data();

    const div = document.createElement("div");
    div.classList.add("pin");
    div.innerHTML = pinHTML;

    const storage = getStorage();
    const gsReference = ref(storage, pin.pin);
    getDownloadURL(gsReference)
      .then((url) => {
        div.style.backgroundImage = `url(${url})`;
      })
      .catch((err) => console.log({ ...err }));

    div.addEventListener("click", (e) => {
      location.href = `/pin.html?id=${doc.id}`;
    });

    imagePins.push(div);
  });

  pinGrid.append(...imagePins);
}
