import makeDropdown from "./utils/dropdown.js";
import setupSearchBar from "./utils/searchBar.js";
import setupHeaderMenus from "./utils/headerMenus.js";
import setupPinGrid from "./utils/pinGrid.js";

import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js";
import {
  ref,
  getStorage,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";
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

setupSearchBar();
setupHeaderMenus();

const singlePinMenuInvoker = document.querySelector("#singlePinMenuInvoker");
const singlePinMenu = document.querySelector("#singlePinMenu");

makeDropdown(singlePinMenuInvoker, singlePinMenu);

const pinImage = document.querySelector("#pinImage");
const pinTitle = document.querySelector("#pinTitle");
const pinDescription = document.querySelector("#pinDescription");

const creatorName = document.querySelector("#creatorName");
const creatorAvatarImg = document.querySelector("#creatorAvatarImg");
const pinCreatorAvatarLink = document.querySelector("#pinCreatorAvatar");

const savePinButton = document.querySelector("#savePinButton");

const pinId = new URL(window.location.href).searchParams.get("id");

if (pinId) {
  const db = getFirestore();
  getDoc(doc(db, "pins", pinId)).then((d) => {
    if (d.exists()) {
      const data = d.data();

      document.title = data.title;
      pinTitle.textContent = data.title;
      pinDescription.textContent = data.description;

      const storage = getStorage();
      getDownloadURL(ref(storage, data.pin)).then((url) => {
        pinImage.style.backgroundImage = `url(${url})`;
      });

      const q = query(
        collection(db, "users"),
        where("userId", "==", data.creator)
      );

      getDocs(q).then((querySnapshot) =>
        querySnapshot.forEach((cd) => {
          if (cd.exists()) {
            const creatorData = cd.data();
            creatorName.textContent =
              creatorData.firstname + " " + creatorData.lastname ||
              creatorData.username;

            if (creatorData.avatarURL) {
              getDownloadURL(ref(storage, creatorData.avatarURL)).then(
                (url) => {
                  creatorAvatarImg.style.backgroundImage = `url(${url})`;
                }
              );
            }

            pinCreatorAvatarLink.href = `/profile.html?id=${cd.id}`;
          } else {
            location.href = "/feed.html";
          }
        })
      );

      setupPinGrid({ name: "CREATED", uid: data.creator });
    } else {
      location.href = "/feed.html";
    }
  });
} else {
  location.href = "/feed.html";
}

const auth = getAuth();
const avatarImage = document.querySelector("#avatarImage");
const commentAvatarImg = document.querySelector(".comment-avatar-img");

function updateAvatar(a) {
  const storage = getStorage();
  const gsReference = ref(storage, a);
  getDownloadURL(gsReference)
    .then((url) => {
      avatarImage.src = url;
      commentAvatarImg.style.backgroundImage = `url(${url})`;
    })
    .catch((err) => console.log({ ...err }));
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "/#form";
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
    console.log(error);
  }

  if (pinId) {
    const savedQuery = query(
      collection(db, "stars"),
      where("user", "==", user.uid),
      where("pin", "==", pinId)
    );

    savePinButton.style.display = "block";
    getDocs(savedQuery).then((snapshot) => {
      snapshot.forEach(() => {
        savePinButton.textContent = "Saved";
        savePinButton.disabled = true;
        savePinButton.classList.remove("btn-primary");
        savePinButton.classList.add("btn-secondary");
      });
    });

    savePinButton.addEventListener("click", () => {
      savePinButton.textContent = "Saving..";
      const auth = getAuth();
      addDoc(collection(db, "stars"), {
        pin: pinId,
        user: auth.currentUser.uid,
      })
        .then(() => {
          savePinButton.textContent = "Saved 🎉";
          savePinButton.disabled = true;
          savePinButton.classList.remove("btn-primary");
          savePinButton.classList.add("btn-secondary");
        })
        .catch(() => (savePinButton.textContent = "Save"));
    });
  }
});
