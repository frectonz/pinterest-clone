import makeDropdown from "./utils/dropdown.js";
import setupSearchBar from "./utils/searchBar.js";
import setupHeaderMenus from "./utils/headerMenus.js";
import setupPinGrid from "./utils/pinGrid.js";
import setupPinMenus from "./utils/pinMenus.js";
import serializeForm from "./utils/serializeForm.js";
import {
  getAuth,
  updateProfile,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js";
import {
  doc,
  query,
  where,
  getDocs,
  updateDoc,
  collection,
  getFirestore,
} from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
import {
  ref,
  getStorage,
  uploadString,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";
import { v4 as uuid } from "https://cdn.skypack.dev/uuid";
import confetti from "https://cdn.skypack.dev/canvas-confetti";

setupSearchBar();
setupHeaderMenus();
// setupPinGrid();
// setupPinMenus();

const profileOptionsMenuInvoker = document.querySelector(
  "#profileOptionsMenuInvoker"
);
const profileOptionsMenu = document.querySelector("#profileOptionsMenu");

makeDropdown(profileOptionsMenuInvoker, profileOptionsMenu);

const auth = getAuth();
const avatarImage = document.querySelector("#avatarImage");
const avatarImageFull = document.querySelector("#avatarImageFull");
const displayName = document.querySelector("#displayName");
const username = document.querySelector("#username");
const bio = document.querySelector("#bio");
const avatarImagePreview = document.querySelector("#avatarImagePreview");

const firstnameInput = document.querySelector("input#firstname");
const lastnameInput = document.querySelector("input#lastname");
const bioTextarea = document.querySelector("textarea#bio");
const usernameInput = document.querySelector("input#username");
const avatarImageInput = document.querySelector("input#avatar");

function updateDisplayName(d) {
  document.title = d;
  displayName.textContent = d;
}

function updateUsername(u) {
  usernameInput.value = u;
  username.textContent = `@${u}`;
}

function updateAvatar(a) {
  const storage = getStorage();
  const gsReference = ref(storage, a);
  getDownloadURL(gsReference)
    .then((url) => {
      avatarImage.src = url;
      avatarImagePreview.src = url;
      avatarImageFull.style.backgroundImage = `url(${url})`;
    })
    .catch((err) => console.log({ ...err }));
}

function updateBio(b) {
  bio.textContent = b;
  bioTextarea.textContent = b;
}

async function updateUserProfile(userId) {
  const db = getFirestore();
  const q = query(collection(db, "users"), where("userId", "==", userId));

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();

      if (data.username) {
        updateUsername(data.username);
      }

      if (data.firstname) {
        updateDisplayName(data.firstname);
        firstnameInput.value = data.firstname;
      }

      if (data.lastname) {
        updateDisplayName(data.lastname);
        lastnameInput.value = data.lastname;
      }

      if (data.firstname && data.lastname) {
        updateDisplayName(data.firstname + " " + data.lastname);
      }

      if (data.bio) {
        updateBio(data.bio);
      }

      if (data.avatarURL) {
        updateAvatar(data.avatarURL);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    updateUserProfile(user.uid);
  } else {
    window.location.href = "/#form";
  }
});

const backdrop = document.querySelector("#backdrop");
const editProfileModal = document.querySelector("#editProfileModal");
const editProfileButton = document.querySelector("#editProfileButton");
const cancelEditProfileButton = document.querySelector(
  "#cancelEditProfileButton"
);

editProfileButton.addEventListener("click", () => {
  openModal();
});

backdrop.addEventListener("click", () => closeModal());
cancelEditProfileButton.addEventListener("click", () => closeModal());

function openModal() {
  backdrop.style.display = "block";
  editProfileModal.style.display = "block";
  editProfileModal
    .animate(
      {
        top: "50%",
      },
      {
        duration: 500,
        iterations: 1,
      }
    )
    .addEventListener("finish", () => (editProfileModal.style.top = "50%"));
}

function closeModal() {
  editProfileModal.style.top = "200%";
  editProfileModal.style.display = "none";
  backdrop.style.display = "none";
  saveButton.textContent = "Save";
  cancelEditProfileButton.textContent = "Cancel";
}

const editProfileForm = document.querySelector("#edit-profile");
const saveButton = document.querySelector("#saveButton");
const fileLabel = document.querySelector("#fileLabel");
const editProfileFormError = document.querySelector("#editProfileFormError");

editProfileForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = serializeForm(e.target);
  const auth = getAuth();
  const user = auth.currentUser;

  saveButton.textContent = "Saving...";

  if (data.avatar.size !== 0 && data.avatar.type.split("/")[0] === "image") {
    const reader = new FileReader();
    reader.readAsDataURL(data.avatar);
    reader.onload = async (e) => {
      try {
        const base64 = e.target.result;
        const storage = getStorage();
        const storageRef = ref(storage, `images/${uuid()}-${data.avatar.name}`);
        const snapshot = await uploadString(storageRef, base64, "data_url");
        data.avatarURl = snapshot.metadata.fullPath;
      } catch (error) {
        saveButton.textContent = "Save";
        editProfileFormError.style.display = "block";
      }
    };
    reader.onerror = () => {
      saveButton.textContent = "Save";
      editProfileFormError.style.display = "block";
    };
  }

  const db = getFirestore();
  const q = query(collection(db, "users"), where("userId", "==", user.uid));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (d) => {
    const obj = {
      firstname: data.firstname,
      lastname: data.lastname,
      username: data.username,
      bio: data.bio,
    };

    if (data.avatarURL) {
      obj.avatarURL = data.avatarURL;
    }

    await updateDoc(doc(db, "users", d.id), obj);

    updateUserProfile(user.uid);

    saveButton.textContent = "Saved 🎉";
    cancelEditProfileButton.textContent = "Close";
    confetti();
  });
});

avatarImageInput.addEventListener("change", () => {
  const file = avatarImageInput.files[0];
  const reader = new FileReader();
  fileLabel.textContent = "Changing...";
  reader.readAsDataURL(file);
  reader.onload = (e) => {
    avatarImagePreview.src = e.target.result;
    fileLabel.textContent = "Change";
  };
  reader.onerror = (e) => {
    fileLabel.textContent = "Change";
  };
});
