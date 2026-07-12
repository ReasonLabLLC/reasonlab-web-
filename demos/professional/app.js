const caseData = {
  growth: {
    label: "Consumer services · Growth strategy",
    title: "From regional strength to a focused multi-market expansion plan.",
    text: "Sterling helped the leadership team prioritize markets, define operating requirements and sequence investment around a clear set of decision gates.",
    metric: "3.2×",
    metricLabel: "projected addressable revenue across prioritized markets"
  },
  transformation: {
    label: "Business services · Operating transformation",
    title: "A clearer operating model for a business that had outgrown its structure.",
    text: "The engagement aligned accountabilities, redesigned decision rights and created a practical 18-month transformation roadmap.",
    metric: "18%",
    metricLabel: "reduction in duplicated operating cost identified"
  },
  succession: {
    label: "Family enterprise · Leadership succession",
    title: "A structured transition plan that protected both continuity and relationships.",
    text: "Sterling facilitated governance decisions, role clarity and a staged handover between generations.",
    metric: "24",
    metricLabel: "month transition roadmap agreed by the ownership group"
  }
};

const casePanel = document.getElementById("casePanel");
const caseButtons = document.querySelectorAll("[data-case]");

function renderCase(key){
  const item = caseData[key];
  casePanel.innerHTML = `
    <div class="case-content">
      <small>${item.label}</small>
      <h3>${item.title}</h3>
      <p>${item.text}</p>
    </div>
    <div class="case-metric">
      <strong>${item.metric}</strong>
      <span>${item.metricLabel}</span>
    </div>`;
}

caseButtons.forEach(button => button.addEventListener("click", () => {
  caseButtons.forEach(item => item.classList.remove("active"));
  button.classList.add("active");
  renderCase(button.dataset.case);
}));

document.getElementById("professionalForm").addEventListener("submit", event => {
  event.preventDefault();
  document.getElementById("professionalMessage").classList.add("show");
});

renderCase("growth");