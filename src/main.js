// Pure Vanilla JavaScript for Extreme Electronics AC Repair & Service

// Business constants
const BUSINESS_NAME = "EXTREME ELECTRONICS";
const PHONE_NUMBER = "098677 44341";
const PHONE_NUMBER_RAW = "+919867744341";
const WHATSAPP_NUMBER = "919867744341";

// State
let selectedServiceForModal = "Split AC Jet Wash Servicing (₹499)";

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initEstimator();
  initFaqAccordion();
  initHeroForm();
  initLeadForm();
  initModal();
  initSmoothScroll();
  initBeforeAfterToggle();
});

// Interactive Before / After Service Comparison
function initBeforeAfterToggle() {
  const toggleButtons = document.querySelectorAll("[data-comparison-toggle]");
  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-comparison-toggle");
      const mode = btn.getAttribute("data-mode"); // 'before' or 'after'
      const container = document.getElementById(targetId);
      if (!container) return;

      // Update button styles in this group
      const parentNav = btn.parentElement;
      if (parentNav) {
        parentNav.querySelectorAll("button").forEach((b) => {
          b.classList.remove("bg-blue-600", "text-white", "shadow-sm");
          b.classList.add("bg-slate-100", "text-slate-600");
        });
        btn.classList.add("bg-blue-600", "text-white", "shadow-sm");
        btn.classList.remove("bg-slate-100", "text-slate-600");
      }

      // Show/hide before and after layers
      const beforeView = container.querySelector(".view-before");
      const afterView = container.querySelector(".view-after");

      if (mode === "after") {
        if (beforeView) beforeView.classList.add("hidden");
        if (afterView) afterView.classList.remove("hidden");
      } else {
        if (beforeView) beforeView.classList.remove("hidden");
        if (afterView) afterView.classList.add("hidden");
      }
    });
  });
}

// Mobile Drawer Menu
function initMobileMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const mobileDrawer = document.getElementById("mobileDrawer");
  const closeDrawer = document.getElementById("closeDrawer");
  const drawerBackdrop = document.getElementById("drawerBackdrop");
  const drawerLinks = document.querySelectorAll(".drawer-link");

  function openMenu() {
    mobileDrawer.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    mobileDrawer.classList.add("hidden");
    document.body.style.overflow = "";
  }

  if (menuToggle) menuToggle.addEventListener("click", openMenu);
  if (closeDrawer) closeDrawer.addEventListener("click", closeMenu);
  if (drawerBackdrop) drawerBackdrop.addEventListener("click", closeMenu);
  drawerLinks.forEach((link) => link.addEventListener("click", closeMenu));
}

// Cost Estimator Logic (Pure JS)
function initEstimator() {
  const acTypeInputs = document.querySelectorAll('input[name="estimator-ac-type"]');
  const serviceInputs = document.querySelectorAll('input[name="estimator-service"]');
  const tonnageInputs = document.querySelectorAll('input[name="estimator-tonnage"]');

  const priceDisplay = document.getElementById("estimatorPrice");
  const origPriceDisplay = document.getElementById("estimatorOrigPrice");
  const discountDisplay = document.getElementById("estimatorDiscount");
  const durationDisplay = document.getElementById("estimatorDuration");
  const summaryService = document.getElementById("estimatorSummaryService");
  const summaryDetails = document.getElementById("estimatorSummaryDetails");
  const bookEstimateBtn = document.getElementById("bookEstimateBtn");

  const serviceBasePrices = {
    jet: { base: 499, orig: 799, duration: "45 mins", name: "High Pressure Jet Wash" },
    gas: { base: 1499, orig: 2199, duration: "60 mins", name: "Gas Refill & Leak Fix" },
    foam: { base: 799, orig: 1199, duration: "60 mins", name: "Deep Foam Chemical Wash" },
    install: { base: 999, orig: 1499, duration: "90 mins", name: "AC Installation & Setup" },
    uninstall: { base: 499, orig: 799, duration: "45 mins", name: "Safe AC Uninstallation" },
    repair: { base: 399, orig: 699, duration: "45 mins", name: "Complete Diagnostic Inspection" }
  };

  const acTypeMultiplier = {
    split: 1.0,
    window: 0.85,
    cassette: 1.5
  };

  const tonnageMultiplier = {
    "1": 1.0,
    "1.5": 1.0,
    "2": 1.2
  };

  function calculate() {
    const selectedType = document.querySelector('input[name="estimator-ac-type"]:checked')?.value || "split";
    const selectedService = document.querySelector('input[name="estimator-service"]:checked')?.value || "jet";
    const selectedTonnage = document.querySelector('input[name="estimator-tonnage"]:checked')?.value || "1.5";

    const sData = serviceBasePrices[selectedService] || serviceBasePrices.jet;
    const typeMult = acTypeMultiplier[selectedType] || 1.0;
    const tonMult = tonnageMultiplier[selectedTonnage] || 1.0;

    let finalPrice = Math.round((sData.base * typeMult * tonMult) / 10) * 10;
    let finalOrig = Math.round((sData.orig * typeMult * tonMult) / 10) * 10;

    if (finalPrice < 299) finalPrice = 299;
    if (finalOrig <= finalPrice) finalOrig = finalPrice + 300;

    const discount = Math.round(((finalOrig - finalPrice) / finalOrig) * 100);

    if (priceDisplay) priceDisplay.textContent = `₹${finalPrice.toLocaleString()}`;
    if (origPriceDisplay) origPriceDisplay.textContent = `₹${finalOrig.toLocaleString()}`;
    if (discountDisplay) discountDisplay.textContent = `Save ${discount}%`;
    if (durationDisplay) durationDisplay.textContent = sData.duration;
    if (summaryService) summaryService.textContent = sData.name;

    const typeLabel = selectedType === "split" ? "Split AC" : selectedType === "window" ? "Window AC" : "Cassette / Tower AC";
    if (summaryDetails) summaryDetails.textContent = `${typeLabel} (${selectedTonnage} Ton) • Seven Bungalows & Mumbai Wide`;

    if (bookEstimateBtn) {
      bookEstimateBtn.onclick = () => {
        openBookingModal(`${sData.name} - ${typeLabel} ${selectedTonnage} Ton (₹${finalPrice})`);
      };
    }
  }

  acTypeInputs.forEach((input) => input.addEventListener("change", calculate));
  serviceInputs.forEach((input) => input.addEventListener("change", calculate));
  tonnageInputs.forEach((input) => input.addEventListener("change", calculate));

  calculate();
}

// FAQ Accordion
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const btn = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    const icon = item.querySelector(".faq-icon");

    if (!btn || !answer) return;

    btn.addEventListener("click", () => {
      const isOpen = !answer.classList.contains("hidden");

      // Close all others
      faqItems.forEach((other) => {
        const otherAnswer = other.querySelector(".faq-answer");
        const otherIcon = other.querySelector(".faq-icon");
        if (otherAnswer) otherAnswer.classList.add("hidden");
        if (otherIcon) otherIcon.style.transform = "rotate(0deg)";
      });

      if (!isOpen) {
        answer.classList.remove("hidden");
        if (icon) icon.style.transform = "rotate(180deg)";
      }
    });
  });
}

// Hero Fast Booking Form
function initHeroForm() {
  const form = document.getElementById("heroBookingForm");
  const successBox = document.getElementById("heroSuccessBox");
  const confirmedLocality = document.getElementById("heroConfirmedLocality");
  const confirmedPhone = document.getElementById("heroConfirmedPhone");
  const confirmedWhatsappBtn = document.getElementById("heroConfirmedWhatsapp");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const phoneInput = document.getElementById("heroPhone");
    const nameInput = document.getElementById("heroName");
    const localitySelect = document.getElementById("heroLocality");
    const serviceSelect = document.getElementById("heroService");
    const errorEl = document.getElementById("heroPhoneError");

    const phone = phoneInput ? phoneInput.value.trim().replace(/\D/g, "") : "";

    if (phone.length !== 10) {
      if (errorEl) {
        errorEl.textContent = "Please enter a valid 10-digit mobile number";
        errorEl.classList.remove("hidden");
      }
      return;
    }

    if (errorEl) errorEl.classList.add("hidden");

    const locality = localitySelect ? localitySelect.value : "Andheri West";
    const service = serviceSelect ? serviceSelect.value : "AC Service";
    const name = nameInput ? nameInput.value.trim() : "Customer";

    if (confirmedLocality) confirmedLocality.textContent = locality;
    if (confirmedPhone) confirmedPhone.textContent = `+91 ${phone}`;

    if (confirmedWhatsappBtn) {
      const msg = `Hi Extreme Electronics, I just booked ${service} for ${locality}. Name: ${name}, Phone: ${phone}. Please confirm technician arrival.`;
      confirmedWhatsappBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    }

    form.classList.add("hidden");
    if (successBox) successBox.classList.remove("hidden");
  });
}

// Lead Capture Section Form
function initLeadForm() {
  const form = document.getElementById("leadCaptureForm");
  const successBox = document.getElementById("leadSuccessBox");
  const leadRefId = document.getElementById("leadRefId");
  const leadWhatsappSync = document.getElementById("leadWhatsappSync");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const phone = (document.getElementById("leadPhone")?.value || "").replace(/\D/g, "");
    const name = document.getElementById("leadName")?.value || "Customer";
    const locality = document.getElementById("leadLocality")?.value || "Seven Bungalows, Andheri West";
    const service = document.getElementById("leadService")?.value || "AC Service";
    const time = document.getElementById("leadTime")?.value || "Immediately (Within 60 Mins)";
    const errorEl = document.getElementById("leadPhoneError");

    if (phone.length !== 10) {
      if (errorEl) {
        errorEl.textContent = "Please enter a 10-digit mobile number";
        errorEl.classList.remove("hidden");
      }
      return;
    }

    if (errorEl) errorEl.classList.add("hidden");

    const randomId = "EE-" + Math.floor(100000 + Math.random() * 900000);
    if (leadRefId) leadRefId.textContent = randomId;

    if (leadWhatsappSync) {
      const msg = `Hello Extreme Electronics, I booked an AC service [Ref: ${randomId}].\nName: ${name}\nPhone: ${phone}\nLocality: ${locality}\nService: ${service}\nPreferred Time: ${time}`;
      leadWhatsappSync.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    }

    form.classList.add("hidden");
    if (successBox) successBox.classList.remove("hidden");
  });
}

// Modal Dialog (Accessible pure JS modal)
function initModal() {
  const modal = document.getElementById("bookingModal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalForm = document.getElementById("modalBookingForm");
  const modalSuccess = document.getElementById("modalSuccessBox");

  window.openBookingModal = function (serviceName) {
    if (serviceName) {
      selectedServiceForModal = serviceName;
      const modalServiceInput = document.getElementById("modalService");
      if (modalServiceInput) modalServiceInput.value = serviceName;
    }

    if (modalForm) modalForm.classList.remove("hidden");
    if (modalSuccess) modalSuccess.classList.add("hidden");

    if (modal) {
      modal.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    }
  };

  function closeModal() {
    if (modal) {
      modal.classList.add("hidden");
      document.body.style.overflow = "";
    }
  }

  if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);

  // Esc key listener
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });

  // Modal form submit
  if (modalForm) {
    modalForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const phoneInput = document.getElementById("modalPhone");
      const nameInput = document.getElementById("modalName");
      const localityInput = document.getElementById("modalLocality");
      const serviceInput = document.getElementById("modalService");
      const timeInput = document.getElementById("modalTime");
      const errorEl = document.getElementById("modalPhoneError");

      const phone = phoneInput ? phoneInput.value.trim().replace(/\D/g, "") : "";

      if (phone.length !== 10) {
        if (errorEl) {
          errorEl.textContent = "Please enter a valid 10-digit mobile number";
          errorEl.classList.remove("hidden");
        }
        return;
      }

      if (errorEl) errorEl.classList.add("hidden");

      const name = nameInput ? nameInput.value.trim() : "Customer";
      const locality = localityInput ? localityInput.value : "Seven Bungalows, Andheri West";
      const service = serviceInput ? serviceInput.value : selectedServiceForModal;
      const time = timeInput ? timeInput.value : "Immediately (Within 60 Mins)";

      const bookingId = "EE-" + Math.floor(100000 + Math.random() * 900000);

      const modalRefEl = document.getElementById("modalSuccessRef");
      const modalPhoneEl = document.getElementById("modalSuccessPhone");
      const modalWhatsappEl = document.getElementById("modalSuccessWhatsapp");

      if (modalRefEl) modalRefEl.textContent = bookingId;
      if (modalPhoneEl) modalPhoneEl.textContent = `+91 ${phone}`;

      if (modalWhatsappEl) {
        const msg = `Hi Extreme Electronics, I booked service with ID ${bookingId}.\nName: ${name}\nPhone: ${phone}\nLocality: ${locality}\nService: ${service}\nPreferred Time: ${time}`;
        modalWhatsappEl.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      }

      modalForm.classList.add("hidden");
      if (modalSuccess) modalSuccess.classList.remove("hidden");
    });
  }

  // Hook all data-book-service buttons
  document.querySelectorAll("[data-book-service]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const service = btn.getAttribute("data-book-service");
      openBookingModal(service || undefined);
    });
  });
}

// Smooth scrolling for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}
