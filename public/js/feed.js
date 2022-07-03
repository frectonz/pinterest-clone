import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js";
import {
  ref,
  getStorage,
  uploadString,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";
import {
  query,
  where,
  addDoc,
  getDocs,
  collection,
  getFirestore,
} from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
import { v4 as uuid } from "https://cdn.skypack.dev/uuid";
import confetti from "https://cdn.skypack.dev/canvas-confetti";

import setupSearchBar from "./utils/searchBar.js";
import setupHeaderMenus from "./utils/headerMenus.js";
import setupPinGrid from "./utils/pinGrid.js";
import serializeForm from "./utils/serializeForm.js";

const tags = [
  "bathroom",
  "bottle",
  "deck",
  "fern",
  "scandinavian",
  "astronaut",
  "flowers",
  "green",
  "mirrors",
  "desert",
  "design",
  "nature",
  "water",
  "waterfall",
  "dancing",
  "bed",
  "laptop",
  "computer",
  "sunlight",
  "sun",
  "sunset",
  "sunrise",
];

setupSearchBar();
setupHeaderMenus();
setupPinGrid();

const chips = document.querySelector("#chips");

const chipButtons = tags.map((tag) => {
  const button = document.createElement("button");
  button.innerText = tag;
  return button;
});

chips.append(...chipButtons);

// firebase stuff

const auth = getAuth();
const avatarImage = document.querySelector("#avatarImage");

function updateAvatar(a) {
  const storage = getStorage();
  const gsReference = ref(storage, a);
  getDownloadURL(gsReference)
    .then((url) => {
      avatarImage.src = url;
    })
    .catch((err) => console.error(err));
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "/#form";
    return;
  }

  const db = getFirestore();
  const q = query(collection(db, "users"), where("userId", "==", user.uid));
  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();

      if (data.avatarURL) {
        updateAvatar(data.avatarURL);
      }
    });
  } catch (error) {
    console.error(error);
  }
});

const backdrop = document.querySelector("#backdrop");
const newPinModal = document.querySelector("#newPinModal");
const createNewPinButton = document.querySelector("#createNewPinButton");
const closeNewPinModalButton = document.querySelector(
  "#closeNewPinModalButton"
);

createNewPinButton.addEventListener("click", () => {
  openModal();
});

backdrop.addEventListener("click", () => {
  closeModal();
});

closeNewPinModalButton.addEventListener("click", () => {
  closeModal();
});

function openModal() {
  backdrop.style.display = "block";
  newPinModal.style.display = "block";
  newPinModal
    .animate(
      {
        top: "50%",
      },
      {
        duration: 500,
        iterations: 1,
      }
    )
    .addEventListener("finish", () => (newPinModal.style.top = "50%"));
}

function closeModal() {
  newPinModal.style.top = "200%";
  newPinModal.style.display = "none";
  backdrop.style.display = "none";
  newPinForm.reset();
  pinFileInput.style.display = "block";
  closeNewPinModalButton.textContent = "Cancel";
  imagePreview.style.backgroundImage = "";
  saveNewPinForm.textContent = "Save";
}

const newPinForm = document.querySelector("#newPinForm");
const saveNewPinForm = document.querySelector("#saveNewPinForm");
const pinGrid = document.querySelector("#pinGrid");

newPinForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = serializeForm(e.target);
  saveNewPinForm.textContent = "Saving...";

  try {
    data.pin = await uploadPinImage(data.pin);
    if (data.pin && data.title && data.description) {
      const db = getFirestore();
      const auth = getAuth();
      await addDoc(collection(db, "pins"), {
        pin: data.pin,
        title: data.title,
        description: data.description,
        creator: auth.currentUser.uid,
      });
      saveNewPinForm.textContent = "Saved 🎉";
      closeNewPinModalButton.textContent = "Close";
      pinGrid.innerHTML = "";
      setupPinGrid();
      confetti();
    }
  } catch (error) {
    console.error(error);
    saveNewPinForm.textContent = "Save";
  }
});

const imagePreview = document.querySelector("#newPinForm > div:nth-child(1)");

function uploadPinImage(file) {
  return new Promise(async (resolve, reject) => {
    if (file.size === 0 || file.type.split("/")[0] !== "image") {
      return reject();
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (e) => {
      try {
        const base64 = e.target.result;
        const storage = getStorage();
        const storageRef = ref(storage, `pins/${uuid()}-${file.name}`);
        const snapshot = await uploadString(storageRef, base64, "data_url");
        const imageURL = snapshot.metadata.fullPath;
        resolve(imageURL);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => {
      reject();
    };
  });
}

const pinInput = document.querySelector("input#pin");
const pinFileInput = document.querySelector("#pinFileInput");

pinInput.addEventListener("change", () => {
  const file = pinInput.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (e) => {
    const base64 = e.target.result;
    pinFileInput.style.display = "none";
    imagePreview.style.backgroundImage = `url(${base64})`;
  };
});
