document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById("y");
  if (y) {
    const year = String(new Date().getFullYear());
    y.textContent = year;
    y.setAttribute("datetime", year);
  }

  const navbar = document.getElementById("navbar");
  const toggle = document.getElementById("mobileMenuToggle");
  const navLinks = document.getElementById("navLinks");

  if (navbar && toggle && navLinks) {
    const onScroll = () =>
      navbar.classList.toggle("scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    function openMenu(isOpen) {
      navbar.classList.toggle("open", isOpen);
      toggle.classList.toggle("open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    }
    toggle.addEventListener("click", () =>
      openMenu(!navbar.classList.contains("open"))
    );
    navLinks.addEventListener("click", (e) => {
      if (e.target.closest("a")) openMenu(false);
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") openMenu(false);
    });
  }

  const revealEls = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
  );
  revealEls.forEach((el) => io.observe(el));

  window.addEventListener(
    "scroll",
    () => {
      const scrolled = window.pageYOffset;
      document.querySelectorAll(".parallax-bg").forEach((bg) => {
        const rate = scrolled * -0.5;
        bg.style.transform = `translateY(${rate}px)`;
      });
    },
    { passive: true }
  );

  const tiles = [
    {
      image: "./assets/img/hero/hero-1.jpg",
      thumb: "./assets/img/hero/hero-2.jpg",
      title: "Военный парад<br />в Китае",
      nextTitle: "",
    },
    {
      image: "./assets/img/hero/hero-2.jpg",
      thumb: "./assets/img/hero/hero-3.jpg",
      title: "Масштабное<br />представление",
      nextTitle: "",
    },
    {
      image: "./assets/img/hero/hero-3.jpg",
      thumb: "./assets/img/hero/hero-4.jpeg",
      title: "Новейшие<br />образцы вооружения",
      nextTitle: "",
    },
    {
      image: "./assets/img/hero/hero-4.jpeg",
      thumb: "./assets/img/hero/hero-5.jpg",
      title: "Передовые технологии",
      nextTitle: "",
    },
    {
      image: "./assets/img/hero/hero-5.jpg",
      thumb: "./assets/img/hero/hero-6.jpg",
      title: "Символы и<br />традиции",
      nextTitle: "",
    },
    {
      image: "./assets/img/hero/hero-6.jpg",
      thumb: "./assets/img/hero/hero-1.jpg",
      title: "Город и<br />люди",
      nextTitle: "",
    },
  ];
  let activeIndex = 0;
  const nextButton = document.querySelector(".next-tile");
  const tileImagesEls = document.querySelectorAll(".tile__img");
  const titleEls = document.querySelectorAll(".title__text");
  const previewImages = document.querySelectorAll(".next-tile__preview__img");
  const nextTitleEls = document.querySelectorAll(".next-tile__title__text");

  function getNextIndex(skipSteps = 0) {
    let newIndex = activeIndex;
    const inc = () => {
      newIndex = newIndex >= tiles.length - 1 ? 0 : newIndex + 1;
    };
    inc();
    for (let i = 0; i < skipSteps; i++) inc();
    return newIndex;
  }
  function populateInitialData() {
    if (tileImagesEls.length >= 2) {
      tileImagesEls[0].src = tiles[activeIndex].image;
      tileImagesEls[1].src = tiles[getNextIndex()].image;
    }
    if (titleEls.length >= 2) {
      titleEls[0].innerHTML = tiles[activeIndex].title;
      titleEls[1].innerHTML = tiles[getNextIndex()].title;
    }
    if (previewImages.length >= 2) {
      previewImages[0].src = tiles[getNextIndex()].thumb;
      previewImages[1].src = tiles[getNextIndex(1)].thumb;
    }
    if (nextTitleEls.length >= 2) {
      nextTitleEls[0].innerHTML = tiles[getNextIndex()].nextTitle;
      nextTitleEls[1].innerHTML = tiles[getNextIndex(1)].nextTitle;
    }
  }
  populateInitialData();

  if (
    window.gsap &&
    nextButton &&
    tileImagesEls.length >= 2 &&
    titleEls.length >= 2
  ) {
    gsap.set(".next-tile__preview img", {
      top: "50%",
      right: 0,
      yPercent: -50,
    });
    gsap.set(".tile__img--last", { scale: 1.2, opacity: 0 });

    const titleAnimation = gsap
      .timeline({ paused: true })
      .to(
        ".title__container",
        { duration: 0.8, ease: "power2.out", yPercent: -50 },
        "t"
      )
      .to(".title__text--first", { duration: 0.5, opacity: 0 }, "t");
    titleAnimation.eventCallback("onComplete", () => {
      titleEls[0].innerHTML = tiles[activeIndex].title;
      titleEls[1].innerHTML = tiles[getNextIndex()].title;
      gsap.set(".title__container", { yPercent: 0 });
      gsap.set(".title__text--first", { opacity: 1 });
      titleAnimation.pause(0);
    });

    const nextButtonAnimation = gsap
      .timeline({ paused: true })
      .to(
        ".next-tile__details",
        { duration: 0.6, ease: "power1.out", xPercent: 80 },
        0
      )
      .fromTo(
        ".tile__img--last",
        { opacity: 0, scale: 1.2 },
        { duration: 0.6, ease: "sine.out", opacity: 1, scale: 1 },
        0
      );
    nextButtonAnimation.eventCallback("onComplete", () => {
      const afterIdx = getNextIndex(1);
      tileImagesEls[0].src = tiles[activeIndex].image;
      tileImagesEls[1].src = tiles[afterIdx].image;
      if (previewImages.length >= 2) {
        previewImages[0].src = tiles[afterIdx].thumb;
        previewImages[1].src = tiles[getNextIndex(2)].thumb;
      }
      gsap.set(".next-tile__details", { xPercent: 0 });
      gsap.set(".tile__img--last", { opacity: 0, scale: 1.2 });
      nextButtonAnimation.pause(0);
    });

    function nextTile() {
      if (!titleAnimation.isActive() && !nextButtonAnimation.isActive()) {
        activeIndex = getNextIndex();
        titleAnimation.play();
        nextButtonAnimation.play();
      }
    }
    nextButton.addEventListener("click", nextTile);
  }

  if (window.Swiper) {
    new Swiper(".parade-slider", {
      effect: "coverflow",
      centeredSlides: true,     
      slidesPerView: 'auto', 
      spaceBetween: 16, 

      coverflowEffect: {
        rotate: 8,
        stretch: 0,
        depth: 120,
        modifier: 1,
        slideShadows: false,
      },
      loop: false,
      rewind: true,
      watchOverflow: true,
      pagination: {
        el: ".parade-slider .swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".parade-slider .swiper-button-next",
        prevEl: ".parade-slider .swiper-button-prev",
      },
      keyboard: { enabled: true },

      // шире экраны — можно показывать больше
      breakpoints: {
        640: { slidesPerView: 1.2, spaceBetween: 14 },
        960: { slidesPerView: 1.5, spaceBetween: 18 },
        1200: { slidesPerView: 2.0, spaceBetween: 22 },
      },
    });
  }

  const btnTop = document.getElementById("toTop");
  if (btnTop) {
    const fg = btnTop.querySelector(".fg");
    const CIRC = 119;
    const prm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onScrollTop = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop || document.body.scrollTop;
      const max = doc.scrollHeight - doc.clientHeight || 1;
      const p = Math.min(scrolled / max, 1);
      if (fg) fg.style.strokeDashoffset = String(CIRC - CIRC * p);
      btnTop.classList.toggle("show", scrolled > 300);
    };
    onScrollTop();
    document.addEventListener("scroll", onScrollTop, { passive: true });
    btnTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prm.matches ? "auto" : "smooth" });
    });
  }

  (function () {
    const root = document.getElementById("parade-fader");
    if (!root) return;
    const slides = Array.from(root.querySelectorAll(".ssbg__slide"));
    if (!slides.length) return;

    let i = 0,
      timer = null;
    const INTERVAL = 3500;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function show(n) {
      slides[i].classList.remove("is-active");
      i = (n + slides.length) % slides.length;
      slides[i].classList.add("is-active");
    }
    function next() {
      show(i + 1);
    }
    function start() {
      if (reduced) return;
      stop();
      timer = setInterval(next, INTERVAL);
    }
    function stop() {
      if (timer) clearInterval(timer), (timer = null);
    }

    slides[0].classList.add("is-active");
    start();

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("touchstart", stop, { passive: true });
    root.addEventListener("touchend", start, { passive: true });

    const io = new IntersectionObserver(
      (entries) => (entries[0].isIntersecting ? start() : stop()),
      { threshold: 0.25 }
    );
    io.observe(root);

    let sx = 0,
      down = false;
    root.addEventListener("pointerdown", (e) => {
      down = true;
      sx = e.clientX;
      root.setPointerCapture(e.pointerId);
    });
    root.addEventListener("pointerup", (e) => {
      if (!down) return;
      down = false;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 40) dx < 0 ? next() : show(i - 1);
      start();
    });
  })();

  (function () {
    const el = document.getElementById("preloader");
    if (!el) return;
    document.body.classList.add("pl-lock");
    setTimeout(() => {
      el.classList.add("preloader--hide");
      document.body.classList.remove("pl-lock");
      setTimeout(() => el.remove(), 600);
    }, 3000);
  })();

  (function () {
    const wrap = document.querySelector(".vp");
    if (!wrap) return;

    const v = wrap.querySelector(".vp__media");
    const play = wrap.querySelector(".vp__play");
    const mute = wrap.querySelector(".vp__mute");
    const vol = wrap.querySelector(".vp__vol");
    const fsBtn = wrap.querySelector(".vp__fs");
    const prog = wrap.querySelector(".vp__progress");
    const bar = wrap.querySelector(".vp__bar");
    const time = wrap.querySelector(".vp__time");

    // базовые атрибуты
    v.removeAttribute("controls");
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");

    // центральный Play
    if (!wrap.querySelector(".vp__centerplay")) {
      const ov = document.createElement("div");
      ov.className = "vp__centerplay";
      ov.innerHTML =
        '<button class="cp-btn" aria-label="Воспроизвести">▶</button>';
      wrap.appendChild(ov);
    }
    const cp = wrap.querySelector(".cp-btn");

    const fmt = (s) => {
      s = Math.max(0, Math.floor(s));
      const m = String(Math.floor(s / 60)).padStart(2, "0");
      const ss = String(s % 60).padStart(2, "0");
      return `${m}:${ss}`;
    };
    function update() {
      const d = v.duration || 0;
      const p = d ? (v.currentTime / d) * 100 : 0;
      bar.style.insetInlineEnd = `${100 - p}%`;
      time.textContent = `${fmt(v.currentTime)} / ${
        isFinite(d) ? fmt(d) : "00:00"
      }`;
      play.textContent = v.paused ? "▶" : "❚❚";
      wrap.classList.toggle("is-paused", v.paused);
    }

    // управление
    play.addEventListener("click", () => (v.paused ? v.play() : v.pause()));
    cp.addEventListener("click", () => v.play());
    mute.addEventListener("click", () => {
      v.muted = !v.muted;
      mute.textContent = v.muted ? "🔇" : "🔊";
    });
    vol?.addEventListener("input", (e) => {
      v.volume = +e.target.value;
      v.muted = v.volume === 0;
      mute.textContent = v.muted ? "🔇" : "🔊";
    });

    // прогресс
    const seek = (x) => {
      const r = prog.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (x - r.left) / r.width));
      v.currentTime = p * (v.duration || 0);
    };
    prog.addEventListener("pointerdown", (e) => {
      prog.setPointerCapture(e.pointerId);
      seek(e.clientX);
      const move = (ev) => seek(ev.clientX);
      const up = () => {
        prog.removeEventListener("pointermove", move);
        document.removeEventListener("pointerup", up);
      };
      prog.addEventListener("pointermove", move);
      document.addEventListener("pointerup", up);
    });

    // показ панели на мобилке
    let hideTimer = null;
    const mm = window.matchMedia("(max-width: 720px)");
    function showControlsTemp() {
      if (!mm.matches) return;
      wrap.classList.add("show-controls");
      clearTimeout(hideTimer);
      hideTimer = setTimeout(
        () => wrap.classList.remove("show-controls"),
        2500
      );
    }
    v.addEventListener("click", () => {
      if (v.paused) v.play();
      else showControlsTemp();
    });
    wrap.addEventListener("mousemove", showControlsTemp, { passive: true });

    // фуллскрин
    const isFs = () =>
      document.fullscreenElement || document.webkitFullscreenElement;
    fsBtn?.addEventListener("click", () => {
      if (!isFs()) {
        if (wrap.requestFullscreen) wrap.requestFullscreen();
        else if (wrap.webkitRequestFullscreen) wrap.webkitRequestFullscreen();
        else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen(); // iOS video
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      }
    });
    const setFsClass = () => wrap.classList.toggle("is-fullscreen", !!isFs());
    document.addEventListener("fullscreenchange", setFsClass);
    document.addEventListener("webkitfullscreenchange", setFsClass);

    v.addEventListener("play", update);
    v.addEventListener("pause", update);
    v.addEventListener("timeupdate", update);
    v.addEventListener("loadedmetadata", update);
    update();

    if (!("pointerdown" in window)) v.setAttribute("controls", "controls");
  })();
});
