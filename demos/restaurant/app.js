const menuData = {
  starters: [
    ["Charred sourdough", "Cultured butter, smoked sea salt", "$9"],
    ["Citrus crudo", "Local snapper, orange, fennel, chile", "$18"],
    ["Roasted carrots", "Whipped feta, pistachio, herbs", "$15"],
    ["Market greens", "Pear, walnut, aged vinegar", "$14"]
  ],
  mains: [
    ["Coal-roasted chicken", "Pan jus, spring onion, crispy potato", "$32"],
    ["Day boat fish", "White beans, tomato, preserved lemon", "$38"],
    ["Short rib", "Soft polenta, mushroom, red wine", "$41"],
    ["Wild mushroom risotto", "Parmesan, thyme, roasted garlic", "$28"]
  ],
  desserts: [
    ["Olive oil cake", "Citrus cream, toasted almond", "$12"],
    ["Dark chocolate tart", "Sea salt, espresso cream", "$13"],
    ["Seasonal sorbet", "Three rotating flavors", "$10"],
    ["Cheese selection", "Local honey, fruit preserve", "$16"]
  ]
};

const menuList = document.getElementById("menuList");
const tabs = document.querySelectorAll("[data-menu]");

function renderMenu(category){
  menuList.innerHTML = menuData[category].map(item => `
    <article class="menu-item">
      <div><h3>${item[0]}</h3><p>${item[1]}</p></div>
      <strong>${item[2]}</strong>
    </article>`).join("");
}

tabs.forEach(tab => tab.addEventListener("click", () => {
  tabs.forEach(item => item.classList.remove("active"));
  tab.classList.add("active");
  renderMenu(tab.dataset.menu);
}));

document.getElementById("reservationForm").addEventListener("submit", event => {
  event.preventDefault();
  document.getElementById("reservationMessage").classList.add("show");
});

renderMenu("starters");