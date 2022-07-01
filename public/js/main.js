import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js";
import {
  addDoc,
  collection,
  getFirestore,
} from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";

const colors = ["#c28b00", "#618c7b", "#0076d3", "#407a57"];
const labels = [
  "weeknight dinner idea",
  "home decor idea",
  "new look outfit",
  "green thumb idea",
];
let i = 0;

const subtitle = document.querySelector(".subtitle");
const slideBtns = document.querySelectorAll(".slider > div");

function animateSubtitle() {
  subtitle.style.color = colors[i % colors.length];

  slideBtns.forEach((btn) => (btn.style.backgroundColor = " #e1e1e1"));

  slideBtns.item(i % slideBtns.length).style.backgroundColor =
    colors[i % colors.length];

  const animation = subtitle.animate(
    [
      {
        transform: "translateY(0)",
        opacity: 1,
      },
      {
        transform: "translateY(-100%)",
        opacity: 0,
      },
    ],
    {
      duration: 1000,
      iterations: 1,
    }
  );

  animation.addEventListener("finish", () => {
    subtitle.textContent = labels[i % labels.length];
    subtitle.animate(
      [
        {
          transform: "translateY(-100%)",
          opacity: 0,
        },
        {
          transform: "translateY(0)",
          opacity: 1,
        },
      ],
      {
        duration: 1000,
        iterations: 1,
      }
    );
  });

  i++;
}

animateSubtitle();

setInterval(() => {
  animateSubtitle();
}, 7000);

const signInForm = document.querySelector("#signInForm");
// SIGN_UP | LOG_IN
let signInState = "SIGN_UP";

const logInTabButton = document.querySelector("#logInTabButton");
const signUpTabButton = document.querySelector("#signUpTabButton");

const usernameField = document.querySelector("#usernameField");
const ageField = signInForm.querySelector("#ageField");

const formError = signInForm.querySelector("#form-error");
const errorMessage = signInForm.querySelector("#form-error > p");

const usernameElement = signInForm.querySelector("#username");
const emailElement = signInForm.querySelector("#email");
const passwordElement = signInForm.querySelector("#password");
const ageElement = signInForm.querySelector("#age");

const submitButton = document.querySelector("#submitButton");

logInTabButton.addEventListener("click", () => {
  signInState = "LOG_IN";

  ageField.style.display = "none";
  ageElement.disabled = true;

  usernameField.style.display = "none";
  usernameElement.disabled = true;

  logInTabButton.classList.add("active");
  signUpTabButton.classList.remove("active");
});

signUpTabButton.addEventListener("click", () => {
  signInState = "SIGN_UP";

  ageField.style.display = "block";
  ageElement.disabled = false;

  usernameField.style.display = "block";
  usernameElement.disabled = false;

  signUpTabButton.classList.add("active");
  logInTabButton.classList.remove("active");
});

signInForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = usernameElement.value;
  const email = emailElement.value;
  const password = passwordElement.value;
  const age = ageElement.valueAsNumber;

  if (signInState === "SIGN_UP" && username && email && password && age) {
    submitButton.textContent = "Submitting...";
    signUp(email, password, username, age);
  } else if (signInState === "LOG_IN" && email && password) {
    submitButton.textContent = "Submitting...";
    logIn(email, password);
  }
});

const signUp = async (email, password, username, age) => {
  const auth = getAuth();
  const db = getFirestore();

  try {
    const userResult = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const uid = userResult.user.uid;
    const docResult = await addDoc(collection(db, "users"), {
      age,
      bio: "",
      username,
      userId: uid,
      avatarURL: "",
      firstname: "",
      lastname: "",
    });

    handleEmailAndPasswordSuccess();
  } catch (error) {
    handleError(error);
  }
};

const logIn = (email, password) => {
  const auth = getAuth();

  signInWithEmailAndPassword(auth, email, password)
    .then(handleEmailAndPasswordSuccess)
    .catch(handleError);
};

const handleEmailAndPasswordSuccess = () => {
  submitButton.textContent = "Submitted 🎉";
  window.location.href = "/feed.html";
};

const handleError = (error) => {
  const errorCode = error.code;

  if (errorCode === "auth/email-already-in-use") {
    errorMessage.textContent = "Email already in use!";
  } else if (errorCode === "auth/invalid-email") {
    errorMessage.textContent = "Invalid email!";
  } else {
    errorMessage.textContent = "Something went wrong!";
  }

  formError.style.display = "block";
  submitButton.textContent = "Continue";
};

const googleSignInButton = document.querySelector("#google");

googleSignInButton.addEventListener("click", () => {
  const buttonContent = googleSignInButton.querySelector("span");
  buttonContent.textContent = "Continuing...";

  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      if (user) {
        window.location.href = "/feed.html";
      }
    })
    .catch((error) => {
      handleError(error);
      buttonContent.textContent = "Continue with Google";
    });
});
