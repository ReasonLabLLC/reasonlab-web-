const steps = [...document.querySelectorAll(".quote-step")];
const progress = [...document.querySelectorAll(".quote-progress i")];
const optionButtons = [...document.querySelectorAll(".service-options button")];
let selectedService = "";
let currentStep = 0;

function showStep(index){
  steps.forEach((step, i) => step.classList.toggle("active", i === index));
  progress.forEach((item, i) => item.classList.toggle("active", i <= index));
  currentStep = index;
}

optionButtons.forEach(button => {
  button.addEventListener("click", () => {
    selectedService = button.dataset.value;
    optionButtons.forEach(item => item.classList.remove("selected"));
    button.classList.add("selected");
  });
});

document.querySelectorAll(".next-button").forEach(button => {
  button.addEventListener("click", () => {
    if (currentStep === 0 && !selectedService) {
      optionButtons[0].focus();
      return;
    }
    if (currentStep === 1 && document.getElementById("zipInput").value.length < 5) {
      document.getElementById("zipInput").focus();
      return;
    }
    showStep(Math.min(currentStep + 1, steps.length - 1));
  });
});

document.getElementById("quoteForm").addEventListener("submit", event => {
  event.preventDefault();
  event.currentTarget.style.display = "none";
  document.getElementById("quoteSuccess").classList.add("show");
});