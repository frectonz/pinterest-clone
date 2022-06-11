import PanelSnap from "https://cdn.skypack.dev/panelsnap";

const instance = new PanelSnap();
const subtitle = document.querySelector(".subtitle");
const slideBtns = document.querySelectorAll(".slider > div");

const colors = ["#c28b00", "#618c7b", "#0076d3", "#407a57"];
const labels = [
  "weeknight dinner idea",
  "home decor idea",
  "new look outfit",
  "green thumb idea",
];

let i = 0;
animateSubtitle();

setInterval(() => {
  animateSubtitle();
}, 7000);

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