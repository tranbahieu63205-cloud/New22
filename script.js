/* ==================================================
   HieuDev Portfolio v2.1
   script.js
================================================== */

"use strict";

const CONFIG = {
  name: "Trần Bá Hiếu",
  role: "Student & Developer",
  bio: "Yêu thích lập trình và thiết kế website.",
  socials: {
    facebook: "https://www.facebook.com/HjeuDepZaiii",
    tiktok: "https://www.tiktok.com/@hieudepzaii_63",
    telegram: "https://t.me/HjeuDepZaii63",
    instagram: "https://www.instagram.com/hjeudepzaiii"
  },
  gallery: [
    { src: "gallery-1.jpg", title: "Album 01", caption: "Ảnh đầu tiên trong album." },
    { src: "gallery-2.jpg", title: "Album 02", caption: "Ảnh thứ hai trong album." },
    { src: "gallery-3.jpg", title: "Album 03", caption: "Ảnh thứ ba trong album." },
    { src: "gallery-4.jpg", title: "Album 04", caption: "Ảnh thứ tư trong album." }
  ],
  music: {
    title: "China Pipa x Gong Xi Thazh",
    artist: "Trần Bá Hiếu",
    file: "music.mp3",
    cover: "albums.jpg"
  },
  donate: {
    bank: "MB Bank",
    owner: "TRAN BA HIEU",
    account: "123456789990",
    content: "HieuDev",
    qr: "qr-bank.jpg"
  }
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const html = document.documentElement;

  const loader = $("#loader");
  const nav = $("#siteNav");
  const menuButton = $("#menuButton");
  const themeButton = $("#themeButton");
  const year = $("#year");
  const backToTop = $("#backToTop");
  const toast = $("#toast");
  const heroCopyButton = $("#heroCopyButton");

  const musicCover = $("#musicCover");
  const trackTitle = $("#trackTitle");
  const trackArtist = $("#trackArtist");
  const audio = $("#audio");
  const playBtn = $("#playBtn");
  const loopBtn = $("#loopBtn");
  const muteBtn = $("#muteBtn");
  const progress = $("#progress");
  const currentTime = $("#currentTime");
  const duration = $("#duration");
  const volume = $("#volume");
  const copyAccount = $("#copyAccount");
  const bankOwner = $("#bankOwner");
  const accountNumber = $("#accountNumber");

  const lightbox = $("#lightbox");
  const lightboxImage = $("#lightboxImage");
  const lightboxCaption = $("#lightboxCaption");
  const lightboxCounter = $("#lightboxCounter");
  const lightboxClose = $("#lightboxClose");
  const lightboxPrev = $("#lightboxPrev");
  const lightboxNext = $("#lightboxNext");
  const galleryGrid = $("#galleryGrid");

  // Apply config
  $$(".social-pill[data-social]").forEach((link) => {
    const key = link.dataset.social;
    if (CONFIG.socials[key]) link.href = CONFIG.socials[key];
  });

  $("#heroName").textContent = CONFIG.name;
  $(".eyebrow").textContent = CONFIG.role;
  $(".hero-desc").textContent = CONFIG.bio;

  if (musicCover) musicCover.src = CONFIG.music.cover;
  if (trackTitle) trackTitle.textContent = CONFIG.music.title;
  if (trackArtist) trackArtist.textContent = CONFIG.music.artist;
  if (audio) {
    audio.src = CONFIG.music.file;
    audio.load();
    audio.volume = Number(localStorage.getItem("hievdev-volume") || 0.82);
  }

  if (bankOwner) bankOwner.textContent = CONFIG.donate.owner;
  if (accountNumber) accountNumber.textContent = CONFIG.donate.account;
  const qrImg = $(".donate-qr img");
  if (qrImg) qrImg.src = CONFIG.donate.qr;
  if (year) year.textContent = String(new Date().getFullYear());

  // Gallery
  if (galleryGrid) {
    galleryGrid.innerHTML = CONFIG.gallery.map((item, index) => `
      <button class="gallery-item reveal" type="button" data-index="${index}" aria-label="${item.title}">
        <img src="${item.src}" alt="${item.title}">
        <span class="gallery-label">
          <strong>${item.title}</strong>
          <small>${item.caption}</small>
        </span>
      </button>
    `).join("");
  }

  const galleryItems = $$(".gallery-item");
  let currentGalleryIndex = 0;

  // Reveals
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach((el) => revealObserver.observe(el));

  function openLightbox(index) {
    currentGalleryIndex = index;
    const item = CONFIG.gallery[index];
    if (!item) return;
    lightboxImage.src = item.src;
    lightboxImage.alt = item.title;
    lightboxCaption.textContent = item.caption;
    lightboxCounter.textContent = `${index + 1} / ${CONFIG.gallery.length}`;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  }

  function nextImage() {
    currentGalleryIndex = (currentGalleryIndex + 1) % CONFIG.gallery.length;
    openLightbox(currentGalleryIndex);
  }

  function prevImage() {
    currentGalleryIndex = (currentGalleryIndex - 1 + CONFIG.gallery.length) % CONFIG.gallery.length;
    openLightbox(currentGalleryIndex);
  }

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => openLightbox(Number(item.dataset.index)));
  });

  $("#heroCopyButton").addEventListener("click", () => copyToClipboard(CONFIG.donate.account, "Đã sao chép số tài khoản"));
  copyAccount.addEventListener("click", () => copyToClipboard(CONFIG.donate.account, "Đã sao chép số tài khoản"));

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", prevImage);
  lightboxNext.addEventListener("click", nextImage);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  let touchStartX = 0;
  lightbox.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener("touchend", (e) => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) delta > 0 ? nextImage() : prevImage();
  }, { passive: true });

  document.addEventListener("keydown", (e) => {
    const activeTag = document.activeElement?.tagName;
    if (lightbox.classList.contains("is-open")) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    }
    if (e.key === " " && !["INPUT", "TEXTAREA", "BUTTON"].includes(activeTag)) {
      e.preventDefault();
      togglePlay();
    }
  });

  // Theme
  const savedTheme = localStorage.getItem("hievdev-theme") || "dark";
  applyTheme(savedTheme);
  themeButton.addEventListener("click", () => {
    const nextTheme = body.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(nextTheme);
    showToast(nextTheme === "light" ? "Đã chuyển sang giao diện sáng" : "Đã chuyển sang giao diện tối");
  });

  function applyTheme(theme) {
    body.setAttribute("data-theme", theme);
    localStorage.setItem("hievdev-theme", theme);
    themeButton.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    html.style.colorScheme = theme;
  }

  // Menu
  function closeMenu() {
    nav.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
  }
  menuButton.addEventListener("click", () => {
    const opened = nav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", opened ? "true" : "false");
  });
  $$("#siteNav a").forEach((link) => link.addEventListener("click", () => {
    if (window.innerWidth <= 880) closeMenu();
  }));
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 880 && nav.classList.contains("is-open")) {
      if (!nav.contains(e.target) && !menuButton.contains(e.target)) closeMenu();
    }
  });

  // Scroll UI
  function handleScrollUi() {
    const y = window.scrollY;
    backToTop.classList.toggle("is-visible", y > 500);
  }
  window.addEventListener("scroll", handleScrollUi, { passive: true });
  handleScrollUi();
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Loader
  function hideLoader() {
    if (!loader || loader.classList.contains("is-hidden")) return;
    loader.classList.add("is-hidden");
    setTimeout(() => loader.remove(), 500);
  }
  window.addEventListener("load", () => setTimeout(hideLoader, 500));
  setTimeout(hideLoader, 2600);

  // Audio
  function formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  function syncPlayUi(isPlaying) {
    playBtn.classList.toggle("is-playing", isPlaying);
    musicCover.classList.toggle("is-playing", isPlaying);
    playBtn.setAttribute("aria-label", isPlaying ? "Tạm dừng nhạc" : "Phát nhạc");
  }

  function togglePlay() {
    if (audio.paused) {
      audio.play().catch(() => showToast("Trình duyệt đã chặn phát nhạc"));
    } else {
      audio.pause();
    }
  }
  playBtn.addEventListener("click", togglePlay);

  loopBtn.addEventListener("click", () => {
    audio.loop = !audio.loop;
    loopBtn.classList.toggle("is-active", audio.loop);
    loopBtn.setAttribute("aria-pressed", audio.loop ? "true" : "false");
    showToast(audio.loop ? "Đã bật chế độ lặp" : "Đã tắt chế độ lặp");
  });

  muteBtn.addEventListener("click", () => {
    audio.muted = !audio.muted;
    muteBtn.classList.toggle("is-active", audio.muted);
    muteBtn.setAttribute("aria-pressed", audio.muted ? "true" : "false");
    muteBtn.setAttribute("aria-label", audio.muted ? "Bật tiếng" : "Tắt tiếng");
    showToast(audio.muted ? "Đã tắt tiếng" : "Đã bật tiếng");
  });

  audio.addEventListener("play", () => syncPlayUi(true));
  audio.addEventListener("pause", () => syncPlayUi(false));
  audio.addEventListener("loadedmetadata", () => {
    duration.textContent = formatTime(audio.duration);
  });
  audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.value = String(percent);
    currentTime.textContent = formatTime(audio.currentTime);
    duration.textContent = formatTime(audio.duration);
  });
  progress.addEventListener("input", () => {
    if (!audio.duration) return;
    audio.currentTime = (Number(progress.value) / 100) * audio.duration;
  });

  volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);
    audio.muted = audio.volume === 0;
    muteBtn.classList.toggle("is-active", audio.muted);
    muteBtn.setAttribute("aria-pressed", audio.muted ? "true" : "false");
    muteBtn.setAttribute("aria-label", audio.muted ? "Bật tiếng" : "Tắt tiếng");
    localStorage.setItem("hievdev-volume", String(audio.volume));
  });
  const storedVolume = localStorage.getItem("hievdev-volume");
  if (storedVolume !== null) audio.volume = Number(storedVolume);
  volume.value = String(audio.volume);
  if (audio.volume === 0) {
    audio.muted = true;
    muteBtn.classList.add("is-active");
    muteBtn.setAttribute("aria-pressed", "true");
    muteBtn.setAttribute("aria-label", "Bật tiếng");
  }

  // Clipboard / toast
  async function copyToClipboard(text, successMessage) {
    try {
      await navigator.clipboard.writeText(text);
      showToast(successMessage);
    } catch {
      const temp = document.createElement("textarea");
      temp.value = text;
      temp.style.position = "fixed";
      temp.style.left = "-9999px";
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      temp.remove();
      showToast(successMessage);
    }
  }

  let toastTimer = 0;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-show"), 2200);
  }

  // Initial sync
  syncPlayUi(false);
  if (audio.duration) duration.textContent = formatTime(audio.duration);
});
