import {
  doc,
  query,
  where,
  addDoc,
  getDoc,
  getDocs,
  collection,
  getFirestore,
} from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
import {
  ref,
  getStorage,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js";

import setupPinMenus from "./pinMenus.js";

const pinHTML = (id, saved) => `
  <button class="save btn ${
    saved ? "btn-secondary" : "btn-primary"
  }" id="savePinButton-${id}" data-pin="${id}">${
  saved ? "Saved" : "Save"
}</button>
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

export default async function setupPinGrid(option = {}) {
  const pinGrid = document.querySelector("#pinGrid");

  const viewPin = async (doc, itIsStarred = false) => {
    const pin = doc.data();

    let saved = false;
    if (!itIsStarred) {
      const db = getFirestore();
      const auth = getAuth();
      const savedQuery = query(
        collection(db, "stars"),
        where("user", "==", auth.currentUser.uid),
        where("pin", "==", doc.id)
      );
      const snapshot = await getDocs(savedQuery);
      snapshot.forEach(() => {
        saved = true;
      });
    }

    const div = document.createElement("div");
    div.classList.add("pin");
    div.innerHTML = pinHTML(doc.id, itIsStarred ? true : saved);

    const storage = getStorage();
    const gsReference = ref(storage, pin.pin);
    getDownloadURL(gsReference)
      .then((url) => {
        div.style.backgroundImage = `url(${url})`;
      })
      .catch((err) => console.error(err));

    div.addEventListener("click", (e) => {
      location.href = `/pin.html?id=${doc.id}`;
    });

    pinGrid.appendChild(div);

    setupSaveButton(doc.id);
    setupPinMenus();
  };

  const db = getFirestore();

  if (option.name === "CREATED") {
    const querySnapshot = await getDocs(
      query(collection(db, "pins"), where("creator", "==", option.uid))
    );
    querySnapshot.forEach(viewPin);
  } else if (option.name === "SAVED") {
    const stars = await getDocs(
      query(collection(db, "stars"), where("user", "==", option.uid))
    );
    stars.forEach((star) => {
      const starData = star.data();
      getDoc(doc(db, "pins", starData.pin)).then((pin) => {
        viewPin(pin, true);
      });
    });
  } else {
    const querySnapshot = await getDocs(collection(db, "pins"));
    await querySnapshot.forEach(viewPin);
  }
}

function setupSaveButton(id) {
  const savePinButton = document.querySelector(`#savePinButton-${id}`);
  savePinButton.addEventListener("click", (e) => {
    e.stopPropagation();
    savePinButton.textContent = "Saving..";
    const pinId = e.target.dataset.pin;
    const db = getFirestore();
    const auth = getAuth();
    addDoc(collection(db, "stars"), {
      pin: pinId,
      user: auth.currentUser.uid,
    })
      .then(() => {
        savePinButton.textContent = "Saved";
        savePinButton.disabled = true;
        savePinButton.classList.remove("btn-primary");
        savePinButton.classList.add("btn-secondary");
      })
      .catch(() => (savePinButton.textContent = "Save"));
  });
}
