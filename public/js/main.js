const colors = ["#c28b00", "#618c7b", "#0076d3", "#407a57"];
const labels = [
  "weeknight dinner idea",
  "home decor idea",
  "new look outfit",
  "green thumb idea",
];
let i = 0;

window.addEventListener("load", () => {
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

  const loginForm = document.querySelector("#loginForm");

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = loginForm.querySelector("#username").value;
    const email = loginForm.querySelector("#email").value;
    const password = loginForm.querySelector("#password").value;
    const age = loginForm.querySelector("#age").valueAsNumber;
    const formError = document.querySelector(".form-errors");

    if (username && email && password && age) {
      const user = {
        username,
        email,
        password,
        age,
      };

      const auth = firebase.auth();
      firebase
        .auth()
        .createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          formError.style.display = "block";
        });
    }
  });
});
