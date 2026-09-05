// modal js start---
class VanillaModal {
  constructor(selector) {
    this.modal = document.querySelector(selector);
    this.closeEls = this.modal.querySelectorAll("[data-close]");
    this.closeEls.forEach((el) =>
      el.addEventListener("click", () => this.close()),
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.close();
    });
  }
  open() {
    this.modal.classList.add("active");
    document.body.style.overflow = "hidden";
    this.modal.setAttribute("aria-hidden", "false");
  }
  close() {
    this.modal.classList.remove("active");
    document.body.style.overflow = "";
    this.modal.setAttribute("aria-hidden", "true");
  }
  toggle() {
    this.modal.classList.contains("active") ? this.close() : this.open();
  }
}

const modal = new VanillaModal("#newsletterModal");
setTimeout(() => modal.open(), 700);

// document.getElementById("openBtn").onclick = () => modal.open();
// modal js end---