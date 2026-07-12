const beautyData = {
  hair: {
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1000&q=76",
    items: [
      ["Signature haircut", "Consultation, wash, cut and finish", "from $85"],
      ["Blowout", "Smooth, volume or soft waves", "from $55"],
      ["Event styling", "Updos and special-event finishing", "from $110"],
      ["Treatment ritual", "Repair, hydration and scalp care", "from $45"]
    ]
  },
  color: {
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1000&q=76",
    items: [
      ["Gloss color", "Tone, shine and subtle refresh", "from $75"],
      ["Dimensional color", "Custom highlights and lowlights", "from $180"],
      ["Balayage", "Hand-painted brightness and movement", "from $225"],
      ["Color correction", "Consultation required", "by quote"]
    ]
  },
  beauty: {
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=76",
    items: [
      ["Brow shaping", "Shape, detail and finish", "from $35"],
      ["Soft glam makeup", "Polished makeup for events", "from $120"],
      ["Bridal preview", "Consultation and trial appointment", "from $165"],
      ["Lash lift", "Lift, tint and conditioning", "from $95"]
    ]
  }
};

const serviceList = document.getElementById("serviceList");
const serviceImage = document.getElementById("serviceImage");
const beautyTabs = document.querySelectorAll("[data-beauty]");

function renderBeauty(category){
  const data = beautyData[category];
  serviceImage.src = data.image;
  serviceList.innerHTML = data.items.map(item => `
    <article class="beauty-item">
      <div><h3>${item[0]}</h3><p>${item[1]}</p></div><strong>${item[2]}</strong>
    </article>`).join("");
}

beautyTabs.forEach(tab => tab.addEventListener("click", () => {
  beautyTabs.forEach(item => item.classList.remove("active"));
  tab.classList.add("active");
  renderBeauty(tab.dataset.beauty);
}));

const bookingSteps = [...document.querySelectorAll(".booking-step")];
const progressLabels = [...document.querySelectorAll(".booking-progress span")];
let bookingStep = 0;

document.querySelectorAll(".booking-options button").forEach(button => {
  button.addEventListener("click", () => {
    button.parentElement.querySelectorAll("button").forEach(item => item.classList.remove("selected"));
    button.classList.add("selected");
    bookingStep += 1;
    bookingSteps.forEach((step, index) => step.classList.toggle("active", index === bookingStep));
    progressLabels.forEach((label, index) => label.classList.toggle("active", index <= bookingStep));
  });
});

document.getElementById("beautyForm").addEventListener("submit", event => {
  event.preventDefault();
  event.currentTarget.style.display = "none";
  document.getElementById("beautySuccess").classList.add("show");
});

renderBeauty("hair");