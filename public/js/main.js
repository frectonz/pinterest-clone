import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

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
const emailField = signInForm.querySelector("#emailField");
const passwordField = signInForm.querySelector("#passwordField");
const ageField = signInForm.querySelector("#ageField");
const formError = signInForm.querySelector("#form-error");

logInTabButton.addEventListener("click", () => {
  signInState = "LOG_IN";

  ageField.style.display = "none";
  usernameField.style.display = "none";

  logInTabButton.classList.add("active");
  signUpTabButton.classList.remove("active");
});

signUpTabButton.addEventListener("click", () => {
  signInState = "SIGN_UP";

  ageField.style.display = "block";
  usernameField.style.display = "block";

  signUpTabButton.classList.add("active");
  logInTabButton.classList.remove("active");
});

signInForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = signInForm.querySelector("#username").value;
  const email = signInForm.querySelector("#email").value;
  const password = signInForm.querySelector("#password").value;
  const age = signInForm.querySelector("#age").valueAsNumber;
  const formError = signInForm.querySelector(".form-errors");

  if (username && email && password && age) {
    const user = {
      username,
      email,
      password,
      age,
    };

    if (signInState === "SIGN_UP") {
      signUp(user.email, user.password, formError);
    } else if (signInState === "LOG_IN") {
      logIn(user.email, user.password, formError);
    }
  }
});

const signUp = (email, password, formError) => {
  const auth = getAuth();

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      formError.style.display = "block";
    });
};

const logIn = (email, password, formError) => {
  const auth = getAuth();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      formError.style.display = "block";
    });
};
