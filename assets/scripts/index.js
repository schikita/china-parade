document.addEventListener("DOMContentLoaded", () => {
  // Год в футере
  const y = document.getElementById("y");
  if (y) {
    const year = String(new Date().getFullYear());
    y.textContent = year;
    y.setAttribute("datetime", year);
  }

  // Мобильное меню
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

  // Анимации появления
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

  // Параллакс эффект
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const parallaxBgs = document.querySelectorAll(".parallax-bg");

    parallaxBgs.forEach((bg) => {
      const rate = scrolled * -0.5;
      bg.style.transform = `translateY(${rate}px)`;
    });
  });

  // Hero данные
  const tiles = [
    {
      image: "./assets/img/hero/hero-1.jpg",
      thumb: "./assets/img/hero/hero-2.jpg",
      title: "Вторая мировая война<br />завершилась в Китае",
      nextTitle: "80 лет<br />Великой Победы",
    },
    {
      image: "./assets/img/hero/hero-2.jpg",
      thumb: "./assets/img/hero/hero-3.jpg",
      title: "80 лет<br />Великой Победы",
      nextTitle: "История с<br />географией",
    },
    {
      image: "./assets/img/hero/hero-3.jpg",
      thumb: "./assets/img/hero/hero-4.jpeg",
      title: "История с<br />географией",
      nextTitle: "Что значит быть<br />при параде",
    },
    {
      image: "./assets/img/hero/hero-4.jpeg",
      thumb: "./assets/img/hero/hero-5.jpg",
      title: "Что значит быть<br />при параде",
      nextTitle: "Символы и<br />традиции",
    },
    {
      image: "./assets/img/hero/hero-5.jpg",
      thumb: "./assets/img/hero/hero-6.jpg",
      title: "Символы и<br />традиции",
      nextTitle: "Город и<br />люди",
    },
    {
      image: "./assets/img/hero/hero-6.jpg",
      thumb: "./assets/img/hero/hero-1.jpg", // замыкаем цикл
      title: "Город и<br />люди",
      nextTitle: "Вторая мировая война<br />завершилась в Китае",
    },
  ];

  let activeIndex = 0;
  const heroTitleEls   = document.querySelectorAll('.title__text');
  const nextButton = document.querySelector(".next-tile");
  const tileImagesEls = document.querySelectorAll(".tile__img");
  const titleEls = document.querySelectorAll(".title__text");
  const previewImages = document.querySelectorAll(".next-tile__preview__img");
  const nextTitleEls = document.querySelectorAll(".next-tile__title__text");

  if (nextButton && tileImagesEls.length >= 2 && titleEls.length >= 2) {
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
      tileImagesEls[0].src = tiles[activeIndex].image;
      tileImagesEls[1].src = tiles[getNextIndex()].image;

      titleEls[0].innerHTML = tiles[activeIndex].title;
      titleEls[1].innerHTML = tiles[getNextIndex()].title;

      if (previewImages.length >= 2) {
        previewImages[0].src = tiles[getNextIndex()].thumb;
        previewImages[1].src = tiles[getNextIndex(1)].thumb;
      }

      if (nextTitleEls.length >= 2) {
        nextTitleEls[0].innerHTML = tiles[getNextIndex()].nextTitle;
        nextTitleEls[1].innerHTML = tiles[getNextIndex(1)].nextTitle;
      }
    }

    // GSAP анимации
    if (window.gsap) {
      gsap.set(".next-tile__preview img", {
        top: "50%",
        right: 0,
        yPercent: -50,
      });
      gsap.set(".tile__img", {
        top: "50%",
        left: "50%",
        xPercent: -50,
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
        .to(".title__text--first", { duration: 0.5, opacity: 0 }, "t")
        .add(() => {
          titleAnimation.progress(0).pause();
          titleEls[0].innerHTML = tiles[activeIndex].title;
          titleEls[1].innerHTML = tiles[getNextIndex()].title;
        });

      const nextButtonAnimation = gsap
        .timeline({ paused: true })
        .to(".next-tile__details", {
          duration: 0.6,
          ease: "power1.out",
          xPercent: 80,
        })
        .to(
          ".tile__img--last",
          { duration: 0.6, ease: "sine.out", opacity: 1, scale: 1 },
          0
        )
        .add(() => {
          nextButtonAnimation.progress(0).pause();
          tileImagesEls[0].src = tiles[activeIndex].image;
          tileImagesEls[1].src = tiles[getNextIndex()].image;
          if (previewImages.length >= 2) {
            previewImages[0].src = tiles[getNextIndex()].thumb;
            previewImages[1].src = tiles[getNextIndex(1)].thumb;
          }
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

    populateInitialData();
  }

  // Swiper инициализация
  if (window.Swiper) {
    new Swiper(".parade-slider", {
      effect: "coverflow",
      centeredSlides: true,
      slidesPerView: 1.15,
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
      keyboard: {
        enabled: true,
      },
      breakpoints: {
        640: { slidesPerView: 1.25, spaceBetween: 18 },
        960: { slidesPerView: 1.6, spaceBetween: 20 },
        1200: { slidesPerView: 2.0, spaceBetween: 22 },
      },
    });
  }
});
