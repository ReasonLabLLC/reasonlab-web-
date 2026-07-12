const serviceDetails = {
  cleaning: ["Cleanings & Exams", "Routine cleanings, digital imaging, oral cancer screening and personalized prevention recommendations."],
  whitening: ["Teeth Whitening", "In-office and take-home whitening options are discussed based on sensitivity, goals and current dental health."],
  braces: ["Braces & Aligners", "An orthodontic consultation reviews bite, alignment and treatment options including clear aligners or traditional braces."],
  implants: ["Dental Implants", "Implant planning may include imaging, restoration options and coordination with surgical specialists when appropriate."],
  cosmetic: ["Cosmetic Dentistry", "Smile design can include bonding, veneers, contouring and whitening based on the patient’s individual goals."],
  emergency: ["Emergency Dentistry", "Urgent visits can evaluate severe pain, swelling, broken teeth, lost restorations and dental injuries."]
};

const detail = document.getElementById("serviceDetail");

document.querySelectorAll("[data-service] button").forEach(button => {
  button.addEventListener("click", () => {
    const key = button.closest("[data-service]").dataset.service;
    const item = serviceDetails[key];
    detail.innerHTML = `<div><h3>${item[0]}</h3><p>${item[1]}</p></div><a href="#appointment">Request appointment</a>`;
    detail.classList.add("show");
    detail.scrollIntoView({behavior:"smooth", block:"nearest"});
  });
});

document.querySelectorAll("[data-reason]").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-reason]").forEach(item => item.classList.remove("selected"));
    button.classList.add("selected");
  });
});

document.getElementById("dentalForm").addEventListener("submit", event => {
  event.preventDefault();
  document.getElementById("dentalMessage").classList.add("show");
});