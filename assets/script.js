"use strict";
// smooth-scroll js start--
(() => {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const canHover = window.matchMedia("(pointer: fine)").matches;

  if (reduceMotion || !canHover) return;

  const ease = 0.1;
  const LINE_HEIGHT = 34;

  let current = window.scrollY;
  let target = window.scrollY;
  let rafId = null;

  const maxScroll = () =>
    document.documentElement.scrollHeight - window.innerHeight;

  const jumpTo = (y) =>
    window.scrollTo({
      top: y,
      left: 0,
      behavior: "instant",
    });

  const normalizeDelta = (e) => {
    if (e.deltaMode === 1) return e.deltaY * LINE_HEIGHT;
    if (e.deltaMode === 2) return e.deltaY * window.innerHeight;
    return e.deltaY;
  };

  /*
   * Check whether an element can handle this wheel movement
   */
  const canElementScroll = (element, deltaY) => {
    if (!(element instanceof HTMLElement)) return false;

    const style = window.getComputedStyle(element);

    const overflowY = style.overflowY;

    if (
      overflowY !== "auto" &&
      overflowY !== "scroll" &&
      overflowY !== "overlay"
    ) {
      return false;
    }

    const hasVerticalOverflow =
      element.scrollHeight > element.clientHeight;

    if (!hasVerticalOverflow) return false;

    const atTop = element.scrollTop <= 0;
    const atBottom =
      element.scrollTop + element.clientHeight >=
      element.scrollHeight - 1;

    // Scrolling UP
    if (deltaY < 0 && !atTop) {
      return true;
    }

    // Scrolling DOWN
    if (deltaY > 0 && !atBottom) {
      return true;
    }

    return false;
  };

  /*
   * Find the closest scrollable parent
   */
  const isInsideScrollableElement = (target, deltaY) => {
    let element = target;

    while (element && element !== document.body) {
      if (canElementScroll(element, deltaY)) {
        return true;
      }

      element = element.parentElement;
    }

    return false;
  };

  const tick = () => {
    current += (target - current) * ease;

    if (Math.abs(target - current) < 0.5) {
      current = target;
      jumpTo(current);
      rafId = null;
      return;
    }

    jumpTo(current);
    rafId = requestAnimationFrame(tick);
  };

  const start = () => {
    if (rafId === null) {
      rafId = requestAnimationFrame(tick);
    }
  };

  window.addEventListener(
    "wheel",
    (e) => {
      if (e.ctrlKey) return;

      const deltaY = normalizeDelta(e);

      /*
       * IMPORTANT:
       * If the mouse is over any internal scrollable element
       * that can actually scroll in this direction,
       * let the browser handle it naturally.
       */
      if (isInsideScrollableElement(e.target, deltaY)) {
        return;
      }

      /*
       * Otherwise use custom smooth page scrolling.
       */
      e.preventDefault();

      target += deltaY;

      target = Math.max(
        0,
        Math.min(target, maxScroll())
      );

      start();
    },
    { passive: false }
  );

  /*
   * Keep custom scroll synchronized with native scrolling.
   */
  window.addEventListener(
    "scroll",
    () => {
      if (rafId !== null) return;

      current = window.scrollY;
      target = window.scrollY;
    },
    { passive: true }
  );

  window.addEventListener("resize", () => {
    target = Math.min(target, maxScroll());
  });
})();
// smooth-scroll js end--

// navbar search roller js start ----
document.querySelectorAll(".search-roller").forEach((roller) => {
  const track = roller.querySelector(".search-roller-track");
  const items = [...track.children];

  if (items.length <= 1) return;

  // Duplicate first item
  track.appendChild(items[0].cloneNode(true));

  const itemHeight = items[0].offsetHeight;

  let index = 0;
  let total = items.length;

  function next() {
    index++;

    track.style.transition = "transform .9s ease";
    track.style.transform = `translateY(-${index * itemHeight}px)`;

    // Reset when duplicate reached
    if (index === total) {
      track.addEventListener("transitionend", function reset() {
        track.removeEventListener("transitionend", reset);

        track.style.transition = "none";
        track.style.transform = "translateY(0)";

        index = 0;

        // Force reflow
        track.offsetHeight;
      });
    }
  }

  setInterval(next, 2000);
});
// navbar search roller js end --

// navbar search open js start ---
document.addEventListener("click", function (e) {
  // Close Search
  if (
    e.target.closest(".search-bar-close") ||
    e.target.closest(".search-bar-window-cls-btn")
  ) {
    document.querySelector(".search-bar-wrap")?.classList.remove("active");
    return;
  }

  // Open Search
  if (e.target.closest(".navbar-search-open-btn")) {
    document.querySelector(".search-bar-wrap")?.classList.add("active");
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    // Remove active from search wrap
    document.querySelectorAll(".search-bar-wrap.active").forEach((el) => {
      el.classList.remove("active");
    });

    // Remove active from body
    document.body.classList.remove("active");
  }
});
// navbar search open js end ---

// slider js start (theme-editor safe init) --
(function () {
  const swiperConfigs = [
    {
      selector: ".search-recommended-slider",
      options: {
        slidesPerView: 2.3,
        spaceBetween: 12,
        grabCursor: true,
        loop: false,
        navigation: {
          nextEl: ".search-recommended-slider-btn-next",
          prevEl: ".search-recommended-slider-btn-prev",
        },
        breakpoints: {
          576: { slidesPerView: 3.3, spaceBetween: 14 },
          768: { slidesPerView: 4.2, spaceBetween: 16 },
        },
      },
    },
    {
      selector: ".co-branded-gift-box-slider",
      options: {
        slidesPerView: 2.1,
        spaceBetween: 10,
        grabCursor: true,
        loop: false,
        breakpoints: {
          576: { slidesPerView: 2.1, spaceBetween: 20 },
          768: { slidesPerView: 2.3, spaceBetween: 20 },
          992: { slidesPerView: 4, spaceBetween: 24 },
        },
      },
    },
    {
      selector: ".cart-drawer-slider",
      options: {
        slidesPerView: 2.1,
        spaceBetween: 5,
        grabCursor: true,
        loop: true,
        speed: 500,
        navigation: {
          nextEl: ".cart-drawer-slider-btn-next",
          prevEl: ".cart-drawer-slider-btn-prev",
        },
      },
    },
    {
      selector: ".hero-slider",
      options: {
        slidesPerView: 1,
        grabCursor: true,
        spaceBetween: 0,
        loop: true,
        speed: 1000,
        autoplay: { delay: 3500, disableOnInteraction: false },
        pagination: { el: ".hero-pagination", clickable: true },
        navigation: {
          nextEl: ".hero-button-next",
          prevEl: ".hero-button-prev",
        },
        breakpoints: {
          1: { spaceBetween: 0 },
          993: { spaceBetween: 0 },
        },
      },
    },
    {
      selector: ".category-slider",
      options: {
        slidesPerView: "auto",
        spaceBetween: 10,
        grabCursor: true,
        loop: true,
        navigation: {
          nextEl: ".category-button-next",
          prevEl: ".category-button-prev",
        },
      },
    },
    {
      selector: ".category-grid-slider",
      options: {
        slidesPerView: 1.8,
        spaceBetween: 12,
        grabCursor: true,
        loop: false,
        navigation: {
          nextEl: ".category-grid-slider-btn-next",
          prevEl: ".category-grid-slider-btn-prev",
        },
        breakpoints: {
          576: { slidesPerView: 2.3, spaceBetween: 14 },
          768: { slidesPerView: 3.3, spaceBetween: 16 },
          993: { slidesPerView: 4.3, spaceBetween: 18 },
          1200: { slidesPerView: 6, spaceBetween: 20 },
        },
      },
    },
    {
      selector: ".card-slider",
      options: {
        slidesPerView: 6,
        grabCursor: true,
        spaceBetween: 16,
        loop: true,
        speed: 500,
        breakpoints: {
          1: { slidesPerView: 2.1, spaceBetween: 10 },
          576: { slidesPerView: 3.2, spaceBetween: 10 },
          768: { slidesPerView: 4.2, spaceBetween: 16 },
          993: { slidesPerView: 5, spaceBetween: 16 },
          1200: { slidesPerView: 6, spaceBetween: 16 },
        },
      },
    },
    {
      selector: ".image-category-slider",
      options: {
        slidesPerView: 4,
        spaceBetween: 20,
        grabCursor: true,
        loop: false,
        breakpoints: {
          1: { spaceBetween: 10, slidesPerView: 1.7 },
          576: { spaceBetween: 10, slidesPerView: 2.2 },
          768: { spaceBetween: 16, slidesPerView: 3.3 },
          993: { spaceBetween: 20, slidesPerView: 4 },
        },
      },
    },
    {
      selector: ".featured-collection-slider",
      options: {
        slidesPerView: 1.15,
        spaceBetween: 16,
        grabCursor: true,
        loop: false,
        navigation: {
          nextEl: ".featured-collection-slider-btn-next",
          prevEl: ".featured-collection-slider-btn-prev",
        },
        breakpoints: {
          576: { slidesPerView: 1.6, spaceBetween: 16 },
          768: { slidesPerView: 2.2, spaceBetween: 20 },
          993: { slidesPerView: 3, spaceBetween: 24 },
        },
      },
    },
    {
      selector: ".community-review-slider",
      options: {
        slidesPerView: 5.2,
        spaceBetween: 20,
        grabCursor: true,
        loop: false,
        navigation: {
          nextEl: ".community-review-slider-btn-next",
          prevEl: ".community-review-slider-btn-prev",
        },
        breakpoints: {
          1: { slidesPerView: 1.7, spaceBetween: 10 },
          576: { slidesPerView: 2.3, spaceBetween: 12 },
          768: { slidesPerView: 3.3, spaceBetween: 16 },
          993: { slidesPerView: 4.3, spaceBetween: 20 },
          1200: { slidesPerView: 5.2, spaceBetween: 20 },
        },
      },
    },
    {
      selector: ".customer-review-slider",
      options: {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        rewind: true,
        speed: 700,
        direction: "vertical",
        grabCursor: true,
        autoplay: { delay: 4000, disableOnInteraction: false },
        pagination: { el: ".customer-review-pagination", clickable: true },
      },
    },
  ];

  const initSwipers = (root) => {
    swiperConfigs.forEach(({ selector, options }) => {
      root.querySelectorAll(selector).forEach((el) => {
        // Re-creating an already-initialized slider (e.g. after the theme
        // editor re-renders its section) would otherwise stack duplicate
        // Swiper instances on the same element.
        if (el.swiper) el.swiper.destroy(true, true);
        new Swiper(el, options);
      });
    });
  };

  initSwipers(document);

  // The theme editor swaps a section's markup back in via AJAX on every
  // settings/content change instead of a full page reload, so sliders in
  // that markup never get a Swiper instance unless we re-init here. Also
  // exposed on window so other AJAX-refreshed markup (e.g. the cart drawer)
  // can re-init sliders it injects without duplicating this config.
  window.initThemeSwipers = initSwipers;

  document.addEventListener("shopify:section:load", (event) => {
    initSwipers(event.target);
  });
})();
// slider js end (theme-editor safe init) --

// mobile-menu sidebar js start---
const mobileMenu = document.querySelector(".mobile-menu-wrap");
const mobileMenuContainer = document.querySelector(".mobile-menu-container");

function openMobileMenu(event) {
  event.stopPropagation();
  mobileMenu?.classList.add("active");
  mobileMenuContainer?.classList.add("active");
  document.body.classList.add("active");
  if (mobileMenuContainer) mobileMenuContainer.scrollLeft = 0;
}

function closeMobileMenu(event) {
  event.stopPropagation();
  mobileMenu?.classList.remove("active");
  mobileMenuContainer?.classList.remove("active");
  document.body.classList.remove("active");

  // Collapse any open category drill-down so the menu reopens at the root list
  document
    .querySelectorAll(".mobile-nav-item-content.active")
    .forEach((el) => el.classList.remove("active"));
}

document.querySelectorAll(".app-menu-open").forEach((btn) => {
  btn.addEventListener("click", openMobileMenu);
});

document
  .querySelectorAll(
    ".mobile-menu-close-window-btn, .mobile-menu-container-top .mobile-menu-close-btn",
  )
  .forEach((btn) => {
    btn.addEventListener("click", closeMobileMenu);
  });

// mobile-menu sidebar js end---

// mobile-nav category drill-down js start---
document.querySelectorAll(".mobile-nav-item-heading").forEach((heading) => {
  heading.addEventListener("click", () => {
    heading
      .closest(".mobile-nav-item")
      ?.querySelector(".mobile-nav-item-content")
      ?.classList.add("active");
  });
});

document
  .querySelectorAll(".mobile-nav-item-content .mobile-menu-close-btn")
  .forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      btn.closest(".mobile-nav-item-content")?.classList.remove("active");
    });
  });
// mobile-nav category drill-down js end---

// mobile-menu-tab js start--
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".mobile-menu-tabs-contents");
  const tabs = [...document.querySelectorAll(".mobile-menu-tab")];
  const contents = [...document.querySelectorAll(".mobile-menu-tabs-content")];

  if (!container || !tabs.length || !contents.length) return;

  let isClickScroll = false;
  let scrollTimer;

  const setActive = (id, scroll = true) => {
    const tab = tabs.find((el) => el.hash === `#${id}`);
    if (!tab) return;

    tabs.forEach((el) => el.classList.toggle("active", el === tab));

    if (scroll) {
      tab.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };

  // Tab click
  tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();

      const target = document.getElementById(tab.hash.slice(1));
      if (!target) return;

      isClickScroll = true;
      setActive(target.id);

      container.scrollTo({
        top: target.offsetTop - container.offsetTop - 12,
        behavior: "smooth",
      });

      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        isClickScroll = false;
      }, 2000);
    });
  });

  // Content scroll
  const observer = new IntersectionObserver(
    (entries) => {
      if (isClickScroll) return;

      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      const panelOpen = visible.target
        .closest(".mobile-nav-item-content")
        ?.classList.contains("active");

      setActive(visible.target.id, !!panelOpen);
    },
    {
      root: container,
      rootMargin: "-10% 0px -55% 0px",
      threshold: [0.15, 0.3, 0.5, 0.75],
    },
  );

  contents.forEach((content) => observer.observe(content));

  // Initial state
  setActive(
    tabs.find((tab) => tab.classList.contains("active"))?.hash.slice(1) ||
      tabs[0].hash.slice(1),
    false,
  );
});
// mobile-menu-tab js end--

// cart-drawer js start---
(function () {
  function initCountdowns(root) {
    root.querySelectorAll(".cart-drawer-progress-countdown").forEach((el) => {
      if (el.dataset.countdownInit) return;
      el.dataset.countdownInit = "true";

      const hrsEl = el.querySelector(".hrs");
      const minsEl = el.querySelector(".mins");
      const secsEl = el.querySelector(".secs");
      let remaining =
        (Number(el.dataset.countdownHours) || 0) * 3600 +
        (Number(el.dataset.countdownMinutes) || 5) * 60;

      const render = () => {
        const hrs = Math.floor(remaining / 3600);
        const mins = Math.floor((remaining % 3600) / 60);
        const secs = remaining % 60;
        if (hrsEl) hrsEl.textContent = hrs;
        if (minsEl) minsEl.textContent = String(mins).padStart(2, "0");
        if (secsEl) secsEl.textContent = String(secs).padStart(2, "0");
      };

      render();

      const timer = setInterval(() => {
        remaining--;
        if (remaining <= 0) {
          remaining = 0;
          render();
          clearInterval(timer);
          return;
        }
        render();
      }, 1000);
    });
  }

  function getCartDrawerSectionId() {
    // Sections rendered inside a section group get a runtime-generated
    // composite id (e.g. "sections--21323858788481__cart_drawer"), not the
    // plain key from the group JSON — read the real {{ section.id }} that
    // the section prints into its own root element.
    return document.querySelector(".cart-drawer")?.dataset.sectionId || "";
  }

  function refreshCartDrawer({ open = false } = {}) {
    const inner = document.querySelector(".cart-drawer-inner");
    const sectionId = getCartDrawerSectionId();
    if (!inner || !sectionId) return Promise.resolve();

    const url = new URL(window.location.href);
    url.searchParams.set("section_id", sectionId);

    return fetch(url.toString())
      .then((res) => res.text())
      .then((html) => {
        const newInner = new DOMParser()
          .parseFromString(html, "text/html")
          .querySelector(".cart-drawer-inner");
        if (!newInner) return;

        const wasActive = inner.classList.contains("active");
        const newOuterBlank = newInner
          .closest(".cart-drawer")
          ?.classList.contains("blank");

        inner.innerHTML = newInner.innerHTML;
        inner.classList.toggle("active", wasActive || open);
        document
          .querySelector(".cart-drawer")
          ?.classList.toggle("active", wasActive || open);
        document
          .querySelector(".cart-drawer")
          ?.classList.toggle("blank", !!newOuterBlank);

        initCountdowns(inner);
        window.initThemeSwipers?.(inner);
      })
      .catch(() => {});
  }

  window.refreshCartDrawer = refreshCartDrawer;

  document.addEventListener("click", (e) => {
    if (e.target.closest(".cart-drawer-open")) {
      e.stopPropagation();
      document.querySelector(".cart-drawer")?.classList.add("active");
      document.querySelector(".cart-drawer-inner")?.classList.add("active");
      return;
    }

    if (
      e.target.closest(".cart-drawer-close-window-btn, .cart-drawer-close-btn")
    ) {
      e.stopPropagation();
      document.querySelector(".cart-drawer")?.classList.remove("active");
      document
        .querySelector(".cart-drawer-inner")
        ?.classList.remove("active");
      return;
    }

    const qtyBtn = e.target.closest(".cart-drawer-item-qty-btn");
    if (qtyBtn) {
      const item = qtyBtn.closest(".cart-drawer-item");
      const key = item?.dataset.lineKey;
      const input = item?.querySelector(".cart-drawer-item-qty-input");
      if (!key || !input) return;

      const delta = qtyBtn.dataset.action === "decrease" ? -1 : 1;
      const newQuantity = Math.max(0, Number(input.value) + delta);

      fetch("/cart/change.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: key, quantity: newQuantity }),
      })
        .then(() => refreshCartDrawer())
        .catch(() => {});
      return;
    }

    const removeBtn = e.target.closest(".cart-drawer-item-remove-btn");
    if (removeBtn) {
      const key = removeBtn.closest(".cart-drawer-item")?.dataset.lineKey;
      if (!key) return;

      fetch("/cart/change.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: key, quantity: 0 }),
      })
        .then(() => refreshCartDrawer())
        .catch(() => {});
      return;
    }

    const upsellAddBtn = e.target.closest(".cart-drawer-upsell-add");
    if (upsellAddBtn) {
      const variantId = Number(upsellAddBtn.dataset.variantId);
      if (!variantId) return;

      upsellAddBtn.disabled = true;
      fetch("/cart/add.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [{ id: variantId, quantity: 1 }] }),
      })
        .then(() => refreshCartDrawer({ open: true }))
        .catch(() => {})
        .finally(() => {
          upsellAddBtn.disabled = false;
        });
    }
  });

  initCountdowns(document);
})();
// cart-drawer js end---

// customer-review-slider also change on horizontal mouse/touch swipe
(function () {
  // Delegated (rather than bound to a single captured element) so this
  // keeps working after the theme editor replaces the slider's markup.
  let startX = 0;
  let startY = 0;
  let dragging = false;
  let activeEl = null;

  document.addEventListener("pointerdown", (e) => {
    const el = e.target.closest(".customer-review-slider");
    if (!el) return;
    activeEl = el;
    startX = e.clientX;
    startY = e.clientY;
    dragging = true;
  });

  document.addEventListener("pointerup", (e) => {
    if (!dragging || !activeEl) return;
    dragging = false;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) {
        activeEl.swiper?.slideNext();
      } else {
        activeEl.swiper?.slidePrev();
      }
    }

    activeEl = null;
  });

  document.addEventListener("pointercancel", () => {
    dragging = false;
    activeEl = null;
  });
})();
// customer-review-slider js end--

// community-review popup js start--
(function () {
  const popup = document.querySelector(".community-review-popup");
  if (!popup) return;

  const progressWrap = popup.querySelector(".community-review-popup-progress");
  const video = popup.querySelector(".community-review-popup-video");
  const captionEl = popup.querySelector(".community-review-popup-caption p");
  const prevBtn = popup.querySelector(".community-review-popup-nav-btn.prev");
  const nextBtn = popup.querySelector(".community-review-popup-nav-btn.next");
  const muteBtn = popup.querySelector(".community-review-popup-mute-btn");
  const productWrap = popup.querySelector(".community-review-popup-product");
  const productImg = popup.querySelector(".community-review-popup-product-img img");
  const productTitle = popup.querySelector(".community-review-popup-product-title");
  const productPrice = popup.querySelector(".community-review-popup-product-price .curr");
  const productPrevPrice = popup.querySelector(".community-review-popup-product-price .prev");
  const btnWrap = popup.querySelector(".community-review-popup-btn-wrap");
  const addToCartBtn = btnWrap?.querySelector("a");

  // Items and progress bars aren't captured once at load: the theme editor
  // can re-render the review grid (add/remove/reorder blocks), so both are
  // looked up fresh every time the popup opens.
  let items = [];
  let progressBars = [];
  let current = 0;
  let muted = true;

  function buildProgressBars() {
    progressWrap.innerHTML = items
      .map(() => '<span class="community-review-popup-progress-bar"><i></i></span>')
      .join("");
    progressBars = [
      ...progressWrap.querySelectorAll(".community-review-popup-progress-bar"),
    ];
  }

  function goTo(index) {
    if (!items.length || index < 0 || index >= items.length) return;

    video.pause();
    current = index;

    const item = items[index];

    progressBars.forEach((bar, i) => {
      bar.classList.toggle("completed", i < index);
      bar.querySelector("i").style.width = i < index ? "100%" : "0%";
    });

    if (item.dataset.videoSrc) {
      video.src = item.dataset.videoSrc;
    } else {
      video.removeAttribute("src");
    }
    video.poster = item.dataset.poster || "";
    captionEl.innerHTML = item.dataset.caption || "";

    const hasProduct = !!item.dataset.productUrl;
    productWrap.hidden = !hasProduct;
    if (btnWrap) btnWrap.hidden = !hasProduct;
    if (hasProduct) {
      productImg.src = item.dataset.productImage || "";
      productTitle.textContent = item.dataset.productTitle || "";
      productPrice.textContent = item.dataset.productPrice || "";
      productPrevPrice.hidden = !item.dataset.productComparePrice;
      productPrevPrice.textContent = item.dataset.productComparePrice || "";
      if (addToCartBtn) addToCartBtn.href = item.dataset.productUrl;
    }

    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === items.length - 1;

    if (item.dataset.videoSrc) {
      video.muted = muted;
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  }

  function openPopup(index) {
    items = [...document.querySelectorAll(".community-review-item")];
    if (!items.length) return;

    buildProgressBars();
    document.body.classList.add("active");
    popup.classList.add("active");
    goTo(index);
  }

  function closePopup() {
    popup.classList.remove("active");
    document.body.classList.remove("active");
    video.pause();
  }

  // Delegated so newly added/reordered review items (via the theme editor,
  // or any future dynamic re-render) open the popup without re-binding.
  document.addEventListener("click", (e) => {
    const item = e.target.closest(".community-review-item");
    if (!item) return;

    const allItems = [...document.querySelectorAll(".community-review-item")];
    openPopup(allItems.indexOf(item));
  });

  popup
    .querySelector(".community-review-popup-close-window-btn")
    .addEventListener("click", closePopup);
  popup
    .querySelector(".community-review-popup-close-btn")
    .addEventListener("click", closePopup);

  prevBtn.addEventListener("click", () => goTo(current - 1));
  nextBtn.addEventListener("click", () => goTo(current + 1));

  muteBtn.addEventListener("click", () => {
    muted = !muted;
    video.muted = muted;
    muteBtn.classList.toggle("unmuted", !muted);
  });

  popup.querySelectorAll(".community-review-popup-share-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (navigator.share) {
        navigator.share({ title: document.title, url: window.location.href });
      }
    });
  });

  video.addEventListener("timeupdate", () => {
    if (!video.duration || !progressBars[current]) return;
    progressBars[current].querySelector("i").style.width =
      (video.currentTime / video.duration) * 100 + "%";
  });

  video.addEventListener("ended", () => {
    if (current < items.length - 1) goTo(current + 1);
  });

  document.addEventListener("keydown", (e) => {
    if (!popup.classList.contains("active")) return;
    if (e.key === "Escape") closePopup();
    if (e.key === "ArrowRight") goTo(current + 1);
    if (e.key === "ArrowLeft") goTo(current - 1);
  });
})();
// community-review popup js end--

// collection filter js start---
(function () {
  // Sets up the price-range slider's fill bar + live value labels for every
  // ".price-range-wrap" under `root`. Only needs to run once on page load —
  // the sidebar that contains it is never replaced by the AJAX filtering
  // below, so these bindings stay valid.
  function initPriceRangeSliders(root) {
    root.querySelectorAll(".price-range-wrap").forEach((wrap) => {
      const minInput = wrap.querySelector(".price-range-input-min");
      const maxInput = wrap.querySelector(".price-range-input-max");
      const fill = wrap.querySelector(".price-range-track-fill");
      const minValueEl = wrap.querySelector(".price-range-value-min");
      const maxValueEl = wrap.querySelector(".price-range-value-max");

      if (!minInput || !maxInput) return;

      const sliderMin = Number(minInput.min);
      const sliderRange = Number(minInput.max) - sliderMin || 1;

      const render = () => {
        const minVal = Number(minInput.value);
        const maxVal = Number(maxInput.value);

        const minPercent = ((minVal - sliderMin) / sliderRange) * 100;
        const maxPercent = ((maxVal - sliderMin) / sliderRange) * 100;

        fill.style.left = `${minPercent}%`;
        fill.style.width = `${maxPercent - minPercent}%`;

        minValueEl.textContent = minVal;
        maxValueEl.textContent = maxVal;
      };

      minInput.addEventListener("input", () => {
        if (Number(minInput.value) > Number(maxInput.value)) {
          minInput.value = maxInput.value;
        }
        render();
      });

      maxInput.addEventListener("input", () => {
        if (Number(maxInput.value) < Number(minInput.value)) {
          maxInput.value = minInput.value;
        }
        render();
      });

      render();
    });
  }

  function getSectionId() {
    return document.querySelector(".collection-section")?.dataset.sectionId;
  }

  // Fetches the collection section via the Section Rendering API
  // (?section_id=...) and swaps in only the freshly rendered
  // ".collection-content" (grid, count, sort, pagination). The
  // ".collection-filter" sidebar itself is never touched, so its open/closed
  // state, expanded accordions, scroll position, and checked inputs stay
  // exactly as the user left them — filtering never visibly "closes" it.
  async function fetchAndRenderCollection(url, { pushState = true, scrollToTop = true } = {}) {
    const sectionId = getSectionId();
    const content = document.querySelector(".collection-content");

    if (!sectionId || !content) {
      window.location.href = url;
      return;
    }

    content.classList.add("loading");

    const fetchUrl = new URL(url, window.location.origin);
    fetchUrl.searchParams.set("section_id", sectionId);

    try {
      const response = await fetch(fetchUrl.toString());
      if (!response.ok) throw new Error("collection section fetch failed");

      const html = await response.text();
      const newContent = new DOMParser()
        .parseFromString(html, "text/html")
        .querySelector(".collection-content");

      if (!newContent) throw new Error("collection content not found in response");

      content.replaceWith(newContent);

      if (pushState) {
        history.pushState({ collectionAjax: true }, "", url);
      }

      if (scrollToTop) {
        newContent.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch (err) {
      window.location.href = url;
    }
  }

  function submitCollectionFilters(form) {
    const params = new URLSearchParams(new FormData(form));
    fetchAndRenderCollection(`${form.getAttribute("action")}?${params.toString()}`, {
      scrollToTop: false,
    });
  }

  // Sidebar open/close + accordion toggle: delegated so they keep working
  // on markup swapped in after a filter/sort/pagination fetch.
  document.addEventListener("click", (e) => {
    const sidebarToggle = e.target.closest(
      ".filter-open-btn, .filter-window-close-btn, .filter-close-btn",
    );
    if (sidebarToggle) {
      e.stopPropagation();
      const open = sidebarToggle.classList.contains("filter-open-btn");
      document.querySelector(".collection-filter")?.classList.toggle("active", open);
      return;
    }

    const accordionBtn = e.target.closest(".accordion-toggle-btn");
    if (accordionBtn) {
      const content = accordionBtn.nextElementSibling;
      if (!content) return;
      accordionBtn.parentElement.classList.toggle("active");
      content.style.maxHeight = content.style.maxHeight ? null : `${content.scrollHeight}px`;
      return;
    }

    // Pagination links inside the collection grid go through the same
    // AJAX path instead of navigating.
    const pageLink = e.target.closest(".collection-content .pagination__link[href]");
    if (pageLink) {
      e.preventDefault();
      fetchAndRenderCollection(pageLink.href);
    }
  });

  // Filters/sort apply automatically (no submit button) via the same
  // AJAX path.
  document.addEventListener("change", (e) => {
    if (!e.target.matches(".filter-option-input, .price-range-input, #sort_by")) return;
    const form = e.target.closest("#CollectionFiltersForm");
    if (form) submitCollectionFilters(form);
  });

  // Back/forward through AJAX-applied filter states.
  window.addEventListener("popstate", () => {
    if (document.querySelector(".collection-wrapper")) {
      fetchAndRenderCollection(window.location.href, { pushState: false });
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    const wrapper = document.querySelector(".collection-wrapper");
    if (wrapper) initPriceRangeSliders(wrapper);
  });
})();
// collection filter js end---

// product-slider js start---
(() => {
  const thumbs = [...document.querySelectorAll(".product-slider-thumb-item")];
  const items = [...document.querySelectorAll(".product-slider-image-item")];
  const container = document.querySelector(".product-slider-images");

  if (!thumbs.length || !items.length) return;

  let isClickScroll = false;
  let scrollTimer;

  const isMobileLayout = () => window.matchMedia("(max-width: 992px)").matches;

  const positionMobileItems = (id, animate) => {
    if (!isMobileLayout()) return;
    const activeIndex = items.findIndex((item) => item.id === id);
    if (activeIndex < 0) return;
    items.forEach((item, i) => {
      item.style.transition = animate ? "transform .3s ease" : "none";
      item.style.transform = `translateX(${(i - activeIndex) * 100}%)`;
    });
  };

  const setActive = (id, animateMobile = true) => {
    let activeThumb = null;

    thumbs.forEach((thumb) => {
      const isActive = thumb.getAttribute("href") === `#${id}`;
      thumb.classList.toggle("active", isActive);
      if (isActive) activeThumb = thumb;
    });

    items.forEach((item) => item.classList.toggle("active", item.id === id));
    positionMobileItems(id, animateMobile);

    if (isMobileLayout()) {
      activeThumb?.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
    }
  };

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = thumb.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;

      isClickScroll = true;
      setActive(targetId);
      window.scrollTo({
        top: target.offsetTop + (isMobileLayout() ? 0 : 10),
        behavior: "smooth",
      });

      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        isClickScroll = false;
      }, 1000);
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      if (isClickScroll || isMobileLayout()) return;
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    },
    { rootMargin: "-20% 0px -60% 0px", threshold: [0.15, 0.3, 0.5, 0.75] }
  );

  items.forEach((item) => observer.observe(item));

  // initial mobile position (no animation on first paint)
  const initialActive = items.find((item) => item.classList.contains("active")) || items[0];
  positionMobileItems(initialActive.id, false);

  // mobile swipe/drag to move between images
  if (container) {
    let dragging = false;
    let startX = 0;
    let deltaX = 0;
    let containerWidth = 0;

    const getActiveIndex = () => items.findIndex((item) => item.classList.contains("active"));

    container.addEventListener(
      "touchstart",
      (e) => {
        if (!isMobileLayout()) return;
        dragging = true;
        startX = e.touches[0].clientX;
        deltaX = 0;
        containerWidth = container.clientWidth || 1;
      },
      { passive: true }
    );

    container.addEventListener(
      "touchmove",
      (e) => {
        if (!dragging) return;
        deltaX = e.touches[0].clientX - startX;
        const activeIndex = getActiveIndex();
        items.forEach((item, i) => {
          item.style.transition = "none";
          const basePercent = (i - activeIndex) * 100;
          const dragPercent = (deltaX / containerWidth) * 100;
          item.style.transform = `translateX(${basePercent + dragPercent}%)`;
        });
      },
      { passive: true }
    );

    container.addEventListener("touchend", () => {
      if (!dragging) return;
      dragging = false;

      const activeIndex = getActiveIndex();
      const threshold = containerWidth * 0.18;
      let nextIndex = activeIndex;

      if (deltaX < -threshold && activeIndex < items.length - 1) nextIndex = activeIndex + 1;
      else if (deltaX > threshold && activeIndex > 0) nextIndex = activeIndex - 1;

      setActive(items[nextIndex].id);
    });

    window.addEventListener("resize", () => {
      const activeIndex = getActiveIndex();
      if (activeIndex >= 0) positionMobileItems(items[activeIndex].id, false);
    });
  }
})();
// product-slider js end---

// product-slider zoom-btn follow cursor js start--
(() => {
  const area = document.querySelector(".product-slider-images");
  const zoomBtn = document.querySelector(".product-slider-zoom-btn");
  if (!area || !zoomBtn) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  area.addEventListener("mousemove", (e) => {
    if (!e.target.closest(".product-slider-image-item")) {
      zoomBtn.classList.remove("is-following");
      return;
    }

    zoomBtn.classList.add("is-following");
    zoomBtn.style.left = `${e.clientX}px`;
    zoomBtn.style.top = `${e.clientY}px`;
  });

  area.addEventListener("mouseleave", () => {
    zoomBtn.classList.remove("is-following");
    zoomBtn.style.left = "";
    zoomBtn.style.top = "";
  });
})();
// product-slider zoom-btn follow cursor js end--

// product-zoom-popup js start--
(() => {
  const popup = document.querySelector(".product-zoom-popup");
  const fullview = popup?.querySelector(".product-zoom-popup-fullview");
  const fullviewImg = fullview?.querySelector("img");

  if (!popup) return;

  const closeFullview = () => {
    fullview?.classList.remove("active", "is-dragging");
    if (fullviewImg) {
      fullviewImg.style.transform = "";
      fullviewImg.style.transformOrigin = "";
    }
    if (zoomSwiper) zoomSwiper.allowTouchMove = true;
  };

  var zoomSwiper = new Swiper(".product-zoom-popup-slider", {
    slidesPerView: 1,
    speed: 300,
    on: {
      slideChange: closeFullview,
    },
  });

  const open = (index) => {
    zoomSwiper.slideTo(index, 0);
    popup.classList.add("active");
  };

  const close = () => {
    popup.classList.remove("active");
    closeFullview();
  };

  document.querySelectorAll(".product-slider-image-item").forEach((item, index) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      open(index);
    });
  });

  popup.querySelector(".product-zoom-popup-close")?.addEventListener("click", (e) => {
    e.stopPropagation();
    close();
  });

  popup.querySelector(".product-zoom-popup-prev")?.addEventListener("click", (e) => {
    e.stopPropagation();
    zoomSwiper.slidePrev();
  });

  popup.querySelector(".product-zoom-popup-next")?.addEventListener("click", (e) => {
    e.stopPropagation();
    zoomSwiper.slideNext();
  });

  // click any slide image to zoom in full-screen, drag to pan while zoomed
  const ZOOM_SCALE = 2.2;

  if (fullview && fullviewImg) {
    let panX = 0;
    let panY = 0;
    let panXMin = 0;
    let panXMax = 0;
    let panYMin = 0;
    let panYMax = 0;
    let dragging = false;
    let moved = false;
    let startX = 0;
    let startY = 0;
    let startPanX = 0;
    let startPanY = 0;

    const applyPan = () => {
      fullviewImg.style.transform = `scale(${ZOOM_SCALE}) translate(${panX}px, ${panY}px)`;
    };

    const openFullview = (src, clientX, clientY) => {
      const rect = fullview.getBoundingClientRect();
      const originXPx = clientX - rect.left;
      const originYPx = clientY - rect.top;

      fullviewImg.src = src;
      fullviewImg.style.transformOrigin = `${(originXPx / rect.width) * 100}% ${(originYPx / rect.height) * 100}%`;
      panX = 0;
      panY = 0;

      // clamp pan so the scaled image can never be dragged past its own edges
      const k = (ZOOM_SCALE - 1) / ZOOM_SCALE;
      panXMax = originXPx * k;
      panXMin = -(rect.width - originXPx) * k;
      panYMax = originYPx * k;
      panYMin = -(rect.height - originYPx) * k;

      applyPan();
      fullview.classList.add("active");
      zoomSwiper.allowTouchMove = false;
    };

    popup.querySelectorAll(".product-zoom-popup-image").forEach((wrap) => {
      wrap.addEventListener("click", (e) => {
        e.stopPropagation();
        openFullview(wrap.querySelector("img").src, e.clientX, e.clientY);
      });
    });

    fullview.addEventListener("mousedown", (e) => {
      dragging = true;
      moved = false;
      startX = e.clientX;
      startY = e.clientY;
      startPanX = panX;
      startPanY = panY;
      fullview.classList.add("is-dragging");
      e.preventDefault();
    });

    window.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;
      panX = Math.min(panXMax, Math.max(panXMin, startPanX + dx));
      panY = Math.min(panYMax, Math.max(panYMin, startPanY + dy));
      applyPan();
    });

    window.addEventListener("mouseup", () => {
      if (!dragging) return;
      dragging = false;
      fullview.classList.remove("is-dragging");
    });

    fullview.addEventListener("click", (e) => {
      e.stopPropagation();
      if (moved) {
        moved = false;
        return;
      }
      closeFullview();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (!popup.classList.contains("active")) return;
    if (e.key === "Escape") {
      if (fullview?.classList.contains("active")) closeFullview();
      else close();
    }
    if (e.key === "ArrowLeft") zoomSwiper.slidePrev();
    if (e.key === "ArrowRight") zoomSwiper.slideNext();
  });
})();
// product-zoom-popup js end--

// Size Chart Sidebar
const sizeSidebar = document.querySelector(".size-chart-sidebar");
const sizeSidebarInner = document.querySelector(".size-chart-sidebar-inner");

const toggleSizeChart = (open, e) => {
  e?.stopPropagation();

  sizeSidebar?.classList.toggle("active", open);
  sizeSidebarInner?.classList.toggle("active", open);
  document.body.classList.toggle("active", open);
};

document
  .querySelector(".size-sidebar-btn")
  ?.addEventListener("click", (e) => toggleSizeChart(true, e));

document
  .querySelector(".size-chart-sidebar-close-window-btn")
  ?.addEventListener("click", (e) => toggleSizeChart(false, e));

document
  .querySelector(".size-chart-close-btn")
  ?.addEventListener("click", (e) => toggleSizeChart(false, e));

// product accordion--
document.addEventListener("click", ({ target }) => {
  const btn = target.closest(".product-accordion-toggle-btn");
  if (!btn) return;

  const item = btn.closest(".product-accordion-item");
  const content = btn.nextElementSibling;
  const isOpen = item.classList.contains("active");

  document.querySelectorAll(".product-accordion-item.active").forEach((el) => {
    el.classList.remove("active");
    el.querySelector(".product-accordion-item-content").style.maxHeight = null;
  });

  if (!isOpen) {
    item.classList.add("active");
    content.style.maxHeight = `${content.scrollHeight}px`;
  }
});

// open first product-accordion-item by default--
document.querySelectorAll(".product-accordion-items").forEach((group) => {
  const firstItem = group.querySelector(".product-accordion-item");
  if (!firstItem) return;

  firstItem.classList.add("active");
  const content = firstItem.querySelector(".product-accordion-item-content");
  content.style.maxHeight = `${content.scrollHeight}px`;
});

// make it short, dinamic and production ready

// review-tab-section js start--
document.addEventListener("click", ({ target }) => {
  const tab = target.closest(".review-tab-nav-item");
  if (!tab) return;

  const targetId = tab.dataset.reviewTab;

  document
    .querySelectorAll(".review-tab-nav-item, .review-tab-panel")
    .forEach((el) =>
      el.classList.toggle("active", el === tab || el.id === targetId),
    );
});
// review-tab-section js end--

// Sticky Add to Cart
(() => {
  const stickyCart = document.querySelector(".sticky-add-to-cart-section");
  if (!stickyCart) return;

  const updateStickyCart = () => {
    stickyCart.classList.toggle("fixed", window.scrollY > 300);
  };

  updateStickyCart();
  window.addEventListener("scroll", updateStickyCart, { passive: true });
})();

// Footer dropdown responsive accordion js start --
document.addEventListener("DOMContentLoaded", () => {
  const breakpoint = window.matchMedia("(max-width: 992px)");
  const items = document.querySelectorAll(".footer-item");

  const closeItem = (item) => {
    const content = item.querySelector(".footer-content");
    if (!content) return;

    item.classList.remove("active");
    content.style.maxHeight = "0px";
  };

  const openItem = (item) => {
    const content = item.querySelector(".footer-content");
    if (!content) return;

    item.classList.add("active");
    content.style.maxHeight = `${content.scrollHeight}px`;
  };

  const setupAccordion = () => {
    items.forEach((item) => {
      const title = item.querySelector(".footer-item-title");
      const content = item.querySelector(".footer-content");

      if (!title || !content) return;

      // Remove previous inline state
      title.onclick = null;

      if (!breakpoint.matches) {
        item.classList.remove("active");
        content.style.maxHeight = "";
        return;
      }

      // Mobile: close initially
      closeItem(item);

      title.onclick = () => {
        const isActive = item.classList.contains("active");

        // Close others
        items.forEach((otherItem) => {
          if (otherItem !== item) {
            closeItem(otherItem);
          }
        });

        // Toggle current
        isActive ? closeItem(item) : openItem(item);
      };
    });
  };

  setupAccordion();

  // Handle responsive resize
  breakpoint.addEventListener("change", setupAccordion);
});
// Footer dropdown responsive accordion js end --

// Header mega-menu placement js start --
document.addEventListener("DOMContentLoaded", () => {
  const source = document.querySelector(".megamenu-source");
  if (!source) return;

  source.querySelectorAll("[data-mega-menu]").forEach((panel) => {
    const handle = panel.dataset.megaMenu;
    if (!handle) return;

    const navItem = document.querySelector(
      `.navbar-link[data-nav-link="${handle}"]`
    );
    if (!navItem) return;

    const defaultDropdown = navItem.querySelector(".drpodown-nav1");
    if (defaultDropdown) defaultDropdown.remove();

    navItem.classList.remove("dropdown");
    navItem.classList.add("has-mega_menu");
    navItem.appendChild(panel);
  });

  source.remove();
});
// Header mega-menu placement js end --

// product variant options js start--
(function () {
  const wrap = document.querySelector(".product-variant-options");
  const dataScript = document.querySelector("script[data-product-variants]");
  if (!wrap || !dataScript) return;

  let variants = [];
  try {
    variants = JSON.parse(dataScript.textContent);
  } catch (err) {
    return;
  }

  const groups = [...wrap.querySelectorAll(".product-varient-field-wrap")];

  function getSelectedValues() {
    return groups.map((group) => {
      const checked = group.querySelector(".product-varient-input:checked");
      return checked ? checked.value : null;
    });
  }

  function findVariant(selectedValues) {
    return variants.find((variant) =>
      variant.options.every((value, i) => value === selectedValues[i]),
    );
  }

  function updateOptionLabels(selectedValues) {
    groups.forEach((group, i) => {
      const label = group
        .closest(".product-varient")
        ?.querySelector(".varient-count");
      if (label && selectedValues[i]) label.textContent = selectedValues[i];
    });
  }

  function updatePriceDisplay(variant) {
    const priceWrap = document.querySelector(".product-price-wrap");
    if (!priceWrap || !variant) return;

    const latest = priceWrap.querySelector(".latest-price");
    const previous = priceWrap.querySelector(".previous-price");
    const save = priceWrap.querySelector(".product-price-save");

    if (latest) latest.textContent = variant.price;

    if (variant.compareAtPrice) {
      if (previous) {
        previous.textContent = variant.compareAtPrice;
        previous.hidden = false;
      }
      if (save) {
        save.textContent = `${variant.discountPercent}% OFF`;
        save.hidden = false;
      }
    } else {
      if (previous) previous.hidden = true;
      if (save) save.hidden = true;
    }
  }

  function updateAddToCartState(variant) {
    const variantInput = document.querySelector(".product-form-variant-id");
    if (variantInput && variant) variantInput.value = variant.id;

    const available = !!variant && variant.available;
    document.querySelectorAll(".product-btn-wrap .btn").forEach((btn) => {
      btn.disabled = !available;
    });

    const atcText = document.querySelector(".atc-btn-text");
    if (atcText) atcText.textContent = available ? "Add to Cart" : "Sold Out";
  }

  function updateWhatsAppLink(variant) {
    const link = document.querySelector(".whatsapp-order-btn");
    if (!link || !variant) return;

    const base = link.dataset.whatsappBase;
    const title = link.dataset.productTitle;
    const productUrl = link.dataset.productUrl;
    if (!base || !title || !productUrl) return;

    const fullUrl = `${productUrl}?variant=${variant.id}`;
    let message = `Hi, I am interested in ${title}`;
    if (variant.title && variant.title !== "Default Title") {
      message += ` (${variant.title})`;
    }
    message += ` - ${fullUrl}`;

    link.href = `${base}?text=${encodeURIComponent(message)}`;
  }

  wrap.addEventListener("change", (e) => {
    if (!e.target.matches(".product-varient-input")) return;

    const selectedValues = getSelectedValues();
    const variant = findVariant(selectedValues);
    updateOptionLabels(selectedValues);
    updateAddToCartState(variant);
    updatePriceDisplay(variant);
    updateWhatsAppLink(variant);
  });
})();
// product variant options js end--

// product quantity js start--
(function () {
  const wrap = document.querySelector(".product-quantity-wrap");
  const input = wrap?.querySelector(".quantity-count");
  if (!wrap || !input) return;

  function setQuantity(value) {
    const min = Number(input.min) || 1;
    const max = input.max ? Number(input.max) : Infinity;
    input.value = Math.min(max, Math.max(min, value));
  }

  wrap.querySelector(".quantity-increase")?.addEventListener("click", () => {
    const step = Number(input.step) || 1;
    setQuantity(Number(input.value) + step);
  });

  wrap.querySelector(".quantity-decrease")?.addEventListener("click", () => {
    const step = Number(input.step) || 1;
    setQuantity(Number(input.value) - step);
  });

  input.addEventListener("change", () => setQuantity(Number(input.value)));
})();
// product quantity js end--

// product add to cart js start--
(function () {
  const form = document.querySelector(".product-add-to-cart-form");
  if (!form) return;

  const errorEl = form.querySelector(".atc-error");

  function showError(message) {
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  function hideError() {
    if (errorEl) errorEl.hidden = true;
  }

  function updateCartCount() {
    fetch("/cart.js")
      .then((res) => res.json())
      .then((cart) => {
        document.querySelectorAll(".cart-count").forEach((el) => {
          el.textContent = cart.item_count;
        });
      })
      .catch(() => {});
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    hideError();

    const variantInput = form.querySelector(".product-form-variant-id");
    const quantityInput = document.querySelector(".quantity-count");
    const variantId = Number(variantInput?.value);
    const quantity = Number(quantityInput?.value) || 1;

    if (!variantId) {
      showError("Please select all options.");
      return;
    }

    // Combine the main product with any checked "buy it with" items into
    // one atomic /cart/add.js request rather than separate calls.
    const items = [{ id: variantId, quantity }];
    const buyWithChecked = [
      ...document.querySelectorAll(".product-buy-with-checkbox:checked"),
    ];
    buyWithChecked.forEach((checkbox) => {
      items.push({ id: Number(checkbox.value), quantity: 1 });
    });

    const isBuyNow = e.submitter?.hasAttribute("data-buy-now");
    const submitButtons = [...form.querySelectorAll('button[type="submit"]')];
    const wasDisabled = submitButtons.map((btn) => btn.disabled);
    submitButtons.forEach((btn) => (btn.disabled = true));

    fetch("/cart/add.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.description || data.message || "Could not add to cart");
        }
        return data;
      })
      .then(() => {
        buyWithChecked.forEach((checkbox) => (checkbox.checked = false));

        if (isBuyNow) {
          window.location.href = "/checkout";
          return;
        }

        updateCartCount();
        window.refreshCartDrawer?.({ open: true });
      })
      .catch((err) => showError(err.message))
      .finally(() => {
        submitButtons.forEach((btn, i) => (btn.disabled = wasDisabled[i]));
      });
  });
})();
// product add to cart js end--
