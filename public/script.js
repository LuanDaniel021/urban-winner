const header = document.querySelector("#header");

let lastScroll = window.scrollY;

window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;

  if (currentScroll < 50) {
    header.classList.remove("hidden");
  }
  else if (currentScroll > lastScroll) {
    header.classList.add("hidden");
  }
  else if (currentScroll < lastScroll) {
    header.classList.remove("hidden");
  }

  lastScroll = currentScroll;
});