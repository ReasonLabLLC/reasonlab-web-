(() => {
  const modal = document.getElementById("demoModal");
  const frame = document.getElementById("demoFrame");
  const device = document.getElementById("demoDevice");
  const loading = document.getElementById("demoLoading");
  const modalTitle = document.getElementById("demoModalTitle");
  const openButtons = document.querySelectorAll(".demo-open");
  const closeTargets = document.querySelectorAll("[data-close-demo]");
  const deviceButtons = document.querySelectorAll("[data-view]");

  if (!modal || !frame || !device) return;

  const openDemo = (button) => {
    loading?.classList.remove("hidden");
    modalTitle.textContent = button.dataset.title || "Website demo";
    frame.src = button.dataset.demo;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("demo-open");
  };

  const closeDemo = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    frame.src = "about:blank";
    loading?.classList.remove("hidden");
    document.body.classList.remove("demo-open");
  };

  const setDevice = (view) => {
    const mobile = view === "mobile";
    device.classList.toggle("mobile", mobile);
    device.classList.toggle("desktop", !mobile);

    deviceButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.view === view);
    });
  };

  openButtons.forEach((button) => button.addEventListener("click", () => openDemo(button)));
  closeTargets.forEach((target) => target.addEventListener("click", closeDemo));
  deviceButtons.forEach((button) => button.addEventListener("click", () => setDevice(button.dataset.view)));

  frame.addEventListener("load", () => loading?.classList.add("hidden"));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("open")) closeDemo();
  });
})();