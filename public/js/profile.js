import makeDropdown from "./utils/dropdown.js";
import setupSearchBar from "./utils/searchBar.js";
import setupHeaderMenus from "./utils/headerMenus.js";
import setupPinGrid from "./utils/pinGrid.js";
import serializeForm from "./utils/serializeForm.js";

import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js";
import {
  doc,
  query,
  where,
  getDoc,
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

const profileId = new URL(window.location.href).searchParams.get("id");
const actionsContainer = document.querySelector(".profile > .actions");

if (profileId) {
  actionsContainer.innerHTML = `
    <button class="btn btn-secondary">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              d="M21 14c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2v-6c0-1.1.9-2 2-2s2 .9 2 2v4h14v-4c0-1.1.9-2 2-2zM8.82 8.84c-.78.78-2.05.79-2.83 0-.78-.78-.79-2.04-.01-2.82L11.99 0l6.02 6.01c.78.78.79 2.05.01 2.83-.78.78-2.05.79-2.83 0l-1.2-1.19v6.18a2 2 0 1 1-4 0V7.66L8.82 8.84z"
            />
          </svg>
        </button>
        <button class="btn btn-primary" id="followButton">Follow</button>

        <div class="dropdown">
          <button class="btn btn-secondary" id="profileOptionsMenuInvoker">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path
                d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3M3 9c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm18 0c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"
              />
            </svg>
          </button>

          <div
            class="dropdown-content"
            id="profileOptionsMenu"
            style="width: 150px"
          >
            <a href="#">Block</a>
            <a href="#">Report</a>
          </div>
        </div>
    `;

  const profileOptionsMenuInvoker = document.querySelector(
    "#profileOptionsMenuInvoker"
  );
  const profileOptionsMenu = document.querySelector("#profileOptionsMenu");

  makeDropdown(profileOptionsMenuInvoker, profileOptionsMenu);

  const followButton = document.querySelector("#followButton");

  followButton.addEventListener("click", () => {
    if (!window.currentUserId) {
      return;
    }

    followButton.textContent = "Following..";
    const db = getFirestore();
    addDoc(collection(db, "follows"), {
      follower: window.currentUserId,
      following: window.profileId,
    })
      .then(() => {
        followButton.textContent = "Followed 🎉";
        followButton.disabled = true;
        followButton.classList.add("btn-secondary");
        followButton.classList.remove("btn-primary");
      })
      .catch(() => (followButton.textContent = "Follow"));
  });

  window.addEventListener("creatorIdChanged", () => {
    if (window.profileId && window.currentUserId) {
      setupFollowStatus(window.profileId);

      const db = getFirestore();
      getDocs(
        query(
          collection(db, "follows"),
          where("follower", "==", window.currentUserId),
          where("following", "==", window.profileId)
        )
      ).then((querySnapshot) => {
        querySnapshot.forEach(() => {
          followButton.textContent = "Followed";
          followButton.disabled = true;
          followButton.classList.remove("btn-primary");
          followButton.classList.add("btn-secondary");
        });
      });
    }
  });
}

function setupFollowStatus(id) {
  const followers = document.querySelector("#followers");
  const following = document.querySelector("#following");
  const db = getFirestore();

  let followerCount = 0;
  getDocs(query(collection(db, "follows"), where("following", "==", id)))
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        console.log(doc);
        followerCount += 1;
      });
    })
    .finally(() => {
      followers.textContent = `${followerCount} follower${
        followerCount === 1 ? "" : "s"
      }`;
    });

  let followingCount = 0;
  getDocs(query(collection(db, "follows"), where("follower", "==", id)))
    .then((snapshot) => {
      snapshot.forEach(() => (followingCount += 1));
    })
    .finally(() => {
      following.textContent = `${followingCount} following`;
    });
}

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
      if (profileId === null) {
        avatarImageFull.style.backgroundImage = `url(${url})`;
      }
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

      if (data.username && profileId === null) {
        updateUsername(data.username);
      }

      if (data.firstname && profileId === null) {
        updateDisplayName(data.firstname);
        firstnameInput.value = data.firstname;
      }

      if (data.lastname && profileId === null) {
        updateDisplayName(data.lastname);
        lastnameInput.value = data.lastname;
      }

      if (data.firstname && data.lastname && profileId === null) {
        updateDisplayName(data.firstname + " " + data.lastname);
      }

      if (data.bio && profileId === null) {
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
  if (!user) {
    window.location.href = "/#form";
  }

  window.currentUserId = user.uid;
  window.dispatchEvent(new Event("creatorIdChanged"));
  if (!profileId) {
    console.log("nothing");
    setupFollowStatus(user.uid);
  }

  if (profileId) {
    const db = getFirestore();
    const docSnap = await getDoc(doc(db, "users", profileId));
    if (docSnap.exists()) {
      const data = docSnap.data();

      window.profileId = data.userId;

      window.dispatchEvent(new Event("creatorIdChanged"));

      if (data.username) {
        updateUsername(data.username);
      }

      if (data.firstname) {
        updateDisplayName(data.firstname);
      }

      if (data.lastname) {
        updateDisplayName(data.lastname);
      }

      if (data.firstname && data.lastname) {
        updateDisplayName(data.firstname + " " + data.lastname);
      }

      if (data.bio) {
        updateBio(data.bio);
      }

      if (data.avatarURL) {
        const storage = getStorage();
        const gsReference = ref(storage, data.avatarURL);
        getDownloadURL(gsReference)
          .then((url) => {
            avatarImageFull.style.backgroundImage = `url(${url})`;
          })
          .catch((err) => console.log({ ...err }));
      }

      setupPinGrid({
        name: "CREATED",
        uid: data.userId,
      });
      updateUserProfile(user.uid);
    } else {
      window.location.href = "/profile.html";
    }
  } else {
    updateUserProfile(user.uid);
    setupPinGrid({ name: "CREATED", uid: user.uid });
  }
});

const backdrop = document.querySelector("#backdrop");
const editProfileModal = document.querySelector("#editProfileModal");
const editProfileButton = document.querySelector("#editProfileButton");
const cancelEditProfileButton = document.querySelector(
  "#cancelEditProfileButton"
);

if (!profileId) {
  editProfileButton.addEventListener("click", () => {
    openModal();
  });
}

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

        const db = getFirestore();
        const q = query(
          collection(db, "users"),
          where("userId", "==", user.uid)
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (d) => {
          const obj = {
            firstname: data.firstname,
            lastname: data.lastname,
            username: data.username,
            bio: data.bio,
            avatarURL: snapshot.metadata.fullPath,
          };

          await updateDoc(doc(db, "users", d.id), obj);

          updateUserProfile(user.uid);

          saveButton.textContent = "Saved 🎉";
          cancelEditProfileButton.textContent = "Close";
          confetti();
        });
      } catch (error) {
        saveButton.textContent = "Save";
        editProfileFormError.style.display = "block";
      }
    };
    reader.onerror = () => {
      saveButton.textContent = "Save";
      editProfileFormError.style.display = "block";
    };
  } else {
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

      await updateDoc(doc(db, "users", d.id), obj);

      updateUserProfile(user.uid);

      saveButton.textContent = "Saved 🎉";
      cancelEditProfileButton.textContent = "Close";
      confetti();
    });
  }
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

const createdButton = document.querySelector("#createdButton");
const savedButton = document.querySelector("#savedButton");
const pinGrid = document.querySelector("#pinGrid");

createdButton.addEventListener("click", () => {
  createdButton.className = "active";
  savedButton.className = "";
  const auth = getAuth();
  pinGrid.innerHTML = "";
  setupPinGrid({
    name: "CREATED",
    uid: profileId || auth.currentUser.uid,
  });
});

savedButton.addEventListener("click", () => {
  savedButton.className = "active";
  createdButton.className = "";
  const auth = getAuth();
  pinGrid.innerHTML = "";
  setupPinGrid({
    name: "SAVED",
    uid: profileId || auth.currentUser.uid,
  });
});
