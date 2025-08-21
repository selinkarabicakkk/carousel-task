(() => {
  const config = {
    localStorage: {
      productsKey: "insr_products_cache_v1",
      favoritesKey: "insr_fav_product_ids_v1",
    },
    dataUrl:
      "https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json",
    selectors: {
      afterStoriesAnchors: [
        ".banner .container .banner__titles",
        '.stories, [class*="stories"], .home-stories',
      ],
      containerMax: ".container",
    },
    assets: {
      heart: "https://www.e-bebek.com/assets/svg/default-favorite.svg",
      heartActive:
        "https://www.e-bebek.com/assets/svg/default-hover-favorite.svg",
      arrowPrev: "https://cdn06.e-bebek.com/assets/svg/prev.svg",
      arrowNext: "https://cdn06.e-bebek.com/assets/svg/next.svg",
      play: "https://www.e-bebek.com/assets/svg/play-badge.svg",
      ar: "https://www.e-bebek.com/assets/svg/ar-icon-white.svg",
    },
    tokens: {
      titleBg: "#FEF6EB",
      titleColor: "#F28E00",
      textColor: "#7D7D7D",
      priceGreen: "#00A365",
      starYellow: "#fed100",
      cardBorder: "#ededed",
      containerMaxWidth: 1320,
      gap: 20,
      cardWidth: 335,
    },
    copy: {
      title: "Beğenebileceğinizi Düşündüklerimiz",
    },
  };

  // Ana sayfada değilsek boşuna çalıştırmıyorum
  function isHomepage() {
    const path = location.pathname.replace(/\/+$/, "");
    if (path === "" || path === "/" || /^\/(tr|tr_TR|tr-TR)?$/.test(path)) {
      const storyElements = document.querySelector(
        '.stories, [class*="stories"], .home-stories, .banner'
      );
      const homeElements = document.querySelector(
        ".homepage, .home, .eb-home, .swiper, .owl-carousel"
      );
      return !!storyElements && !!homeElements;
    }
    return false;
  }

  // Bileşeni stories sonrasına, yoksa en makul parent altına bırak
  function findInsertPoint() {
    const section1 = document.querySelector(
      'cx-page-slot[position="Section1"]'
    );
    if (section1) {
      return section1;
    }

    for (const sel of config.selectors.afterStoriesAnchors) {
      const el = document.querySelector(sel);
      if (el && el.parentElement) return el.parentElement;
    }

    return (
      document.querySelector(config.selectors.containerMax) || document.body
    );
  }

  function formatPriceTry(amount) {
    const n = new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    return `${n} TL`;
  }

  // Stil işini tek seferde buradan enjekte ediyorum
  function injectStyles() {
    const css = `
        .insr-carousel { margin-top: 24px; }
        .insr-carousel__titlebar {
          background: #fef6eb;
          padding: 25px 67px;
          border-top-left-radius: 35px;
          border-top-right-radius: 35px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .insr-carousel__title {
          font-family: Quicksand-Bold;
          font-weight: 700;
          color: #F28E00;
          font-size: 28.8px;
          line-height: 1.2;
          margin: 0;
        }
        .insr-carousel__track { position: relative; padding: 0px 0; }
        .insr-carousel__scroller { overflow-x: auto; overflow-y: hidden; scroll-behavior: smooth; }
        .insr-carousel__scroller::-webkit-scrollbar { display: none; }
        .insr-carousel__row {
          display: flex;
          gap: ${config.tokens.gap}px;
          will-change: transform;
        }
        .insr-carousel { --insr-card-w: ${config.tokens.cardWidth}px; }
        @media (min-width: 1440px) { .insr-carousel { --insr-card-w: 230px; } }
        @media (max-width: 1439px) and (min-width: 1200px) { .insr-carousel { --insr-card-w: 230px; } }
        @media (max-width: 1199px) and (min-width: 992px)  { .insr-carousel { --insr-card-w: 230px; } }
        @media (max-width: 991px) and (min-width: 768px)   { .insr-carousel { --insr-card-w: 230px; } }
        @media (max-width: 767px) and (min-width: 576px)   { .insr-carousel { --insr-card-w: 200px; } }
        @media (max-width: 575px) { 
          .insr-carousel { --insr-card-w: calc(100vw - 50px); }
          .insr-carousel__titlebar { padding: 15px 20px; }
          .insr-carousel__title { font-size: 20px; }
          .insr-card { min-height: 420px; }
        }

        .insr-card {
          width: var(--insr-card-w);
          background: #fff;
          border: 1px solid ${config.tokens.cardBorder};
          border-radius: 10px;
          padding: 12px;
          margin: 10px 0 10px 0;
          color: ${config.tokens.textColor};
          flex: 0 0 auto;
          transition: box-shadow .15s ease, border-color .15s ease;
          min-height: 460px;
          position: relative;
        }
        .insr-card:hover { 
          border: 3.5px solid ${config.tokens.titleColor}; 
          box-shadow: 0 4px 16px rgba(0,0,0,.08);
          padding: 11px;
        }
        

        .insr-stars { display: flex; align-items: center; margin: 8px 0; }
        .insr-stars__icons { 
          position: relative; 
          display: flex;
          align-items: center;
        }
        .insr-stars__icons .star {
          font-size: 16px;
          color: #ddd;
          position: relative;
          margin-right: 3px;
        }
        .insr-stars__icons .star::before {
          content: '★';
        }
        .insr-stars__icons .star.filled {
          color: ${config.tokens.starYellow};
        }
        .insr-stars__icons .star:nth-child(5) {
          background: linear-gradient(
            90deg, 
            ${config.tokens.starYellow} 0, 
            ${config.tokens.starYellow} calc((var(--star-fill, 0) - 4) * 100%),
            #ddd calc((var(--star-fill, 0) - 4) * 100%)
          );
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .insr-stars__count { font: 400 13px Poppins, system-ui; color: ${config.tokens.textColor}; margin-left: 6px; }
        .insr-card__imgwrap {
          width: 100%;
          aspect-ratio: 1 / 1;
          display: grid;
          place-items: center;
          border-radius: 10px;
          overflow: hidden;
        }
        .insr-card__brand { font: 700 12px Poppins, system-ui; color: ${config.tokens.textColor}; line-height: 1.35; margin-top: 12px; }
        .insr-card__name  { font: 400 12px Poppins, system-ui; color: ${config.tokens.textColor}; line-height: 1.35; }
        .insr-price--new  { font: 600 21.12px Poppins, system-ui; color: ${config.tokens.textColor}; }
        .insr-price--new.discount { color: ${config.tokens.priceGreen}; }
        .insr-price--old  { font: 400 13.44px Poppins, system-ui; color: ${config.tokens.textColor}; text-decoration: line-through; }
        .insr-price--pct  { font: 400 18px Poppins, system-ui; color: ${config.tokens.priceGreen}; margin-left: 4.8px; }
        
        @media (max-width: 576px) {
          .insr-card__brand { font-size: 11px; }
          .insr-card__name { font-size: 11px; }
          .insr-price--new { font-size: 18px; }
          .insr-price--old { font-size: 12px; }
          .insr-price--pct { font-size: 14px; }
          .insr-stars__icons .star { font-size: 14px; }
          .insr-stars__count { font-size: 11px; }
          .insr-btn { font-size: 1.2rem; height: 40px; padding: 10px 15px; }
        }
        .insr-card__price { margin: 8px 0 10px; display: block; }
  
        .insr-heart {
          position: absolute; top: 10px; right: 10px;
          width: 42px; height: 42px; display: grid; place-items: center;
          background: #fff; border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,.06);
          cursor: pointer;
          z-index: 3;
          pointer-events: auto;
        }
        
        @media (max-width: 576px) {
          .insr-heart {
            width: 36px; height: 36px;
            top: 5px; right: 5px;
          }
          .insr-heart img { 
            width: 20px; height: 20px; 
          }
        }

        .insr-heart:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border: 2px solid transparent;
          border-radius: 50%;
          transition: border-color .15s ease;
        }

        .insr-heart:hover:before { 
          border-color: transparent;
        }
        .insr-heart img { 
          width: 24px; height: 24px; 
          transition: opacity .15s ease;
          opacity: 1;
        }

        .insr-heart:after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 50px;
          height: 50px;
          background: url(${config.assets.heartActive}) center center no-repeat;
          background-size: 50px 50px;
          transform: translate(-50%, -50%);
          opacity: 0;
          transition: opacity .15s ease;
        }
        .insr-heart:hover img { opacity: 0; }
        .insr-heart:hover:after { opacity: 1; }
        
        .insr-heart.is-favorite img { opacity: 0; }
        .insr-heart.is-favorite:after { opacity: 1; }
        .insr-card a { position: relative; z-index: 1; display: block; }
  
        .insr-btn {
          width: 100%;
          height: 48px;
          padding: 15px 20px;
          border-radius: 37.5px;
          background: #FFF7EC;
          color: ${config.tokens.titleColor};
          font: 700 1.4rem Poppins, system-ui;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .insr-btn:hover { 
          background-color: ${config.tokens.titleColor}; 
          color: #fff;
        }
        .insr-card__footer { margin-top: auto; padding: 0 0 22px; }

        .insr-card { display: flex; flex-direction: column; }
  

        .insr-nav {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 50px; height: 50px; background-color: #FEF6EB;
          border-radius: 50%; border: 1px solid transparent;
          display: grid; place-items: center; cursor: pointer; z-index: 5;
        }
        .insr-nav--prev { left: -65px; background-image: url(${config.assets.arrowPrev}); background-repeat: no-repeat; background-position: 18px center; }
        .insr-nav--next { right: -65px; background-image: url(${config.assets.arrowNext}); background-repeat: no-repeat; background-position: 18px center; }
        @media (max-width: 1200px) {
          .insr-nav--prev { left: -40px; }
          .insr-nav--next { right: -40px; }
        }
        @media (max-width: 992px) {
          .insr-nav--prev { left: -30px; }
          .insr-nav--next { right: -30px; }
        }
        @media (max-width: 768px) {
          .insr-nav { width: 40px; height: 40px; }
          .insr-nav--prev { left: -20px; background-position: 14px center; }
          .insr-nav--next { right: -20px; background-position: 14px center; }
        }
        @media (max-width: 576px) {
          .insr-nav { width: 30px; height: 30px; }
          .insr-nav--prev { left: -15px; background-position: 10px center; background-size: 40%; }
          .insr-nav--next { right: -15px; background-position: 10px center; background-size: 40%; }
          .insr-carousel__track { overflow: hidden; padding: 0 10px; }
        }
  

        @media (max-width: 1440px) {
          .insr-carousel__row { gap: ${config.tokens.gap}px; }
        }
        @media (max-width: 1200px) { }
        @media (max-width: 992px)  { }
        @media (max-width: 768px)  { }
        @media (max-width: 575px)  { }
      `;
    const styleEl = document.createElement("style");
    styleEl.id = "insr-carousel-style";
    styleEl.textContent = css;
    document.head.appendChild(styleEl);
  }

  // Başlık ve iskelet yapı
  function buildBaseMarkup() {
    const root = document.createElement("section");
    root.className = "insr-carousel";
    root.setAttribute("aria-label", config.copy.title);

    root.innerHTML = `<div class="insr-carousel__titlebar"><h2 class="insr-carousel__title">${config.copy.title}</h2></div><div class="insr-carousel__track"><button class="insr-nav insr-nav--prev" aria-label="Geri"></button><div class="insr-carousel__scroller" id="insr-scroll"><div class="insr-carousel__row" id="insr-row"></div></div><button class="insr-nav insr-nav--next" aria-label="İleri"></button></div>`;
    return root;
  }

  function getCachedProducts() {
    try {
      const raw = localStorage.getItem(config.localStorage.productsKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : null;
    } catch (_) {
      return null;
    }
  }

  function setCachedProducts(products) {
    try {
      localStorage.setItem(
        config.localStorage.productsKey,
        JSON.stringify(products)
      );
    } catch (_) {}
  }

  async function fetchProductsFromRemote() {
    const res = await fetch(config.dataUrl, { method: "GET" });
    if (!res.ok) throw new Error("failed to fetch products");
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  }

  // Önce localStorage'a bak, yoksa remote'dan çek
  async function loadProducts() {
    let products = getCachedProducts();
    if (products && products.length) return products;
    try {
      products = await fetchProductsFromRemote();
      if (products.length) setCachedProducts(products);
      return products;
    } catch (err) {
      console.warn("products fetch error", err);
      return products || [];
    }
  }

  function computeDiscountPercent(price, originalPrice) {
    if (typeof price !== "number" || typeof originalPrice !== "number")
      return 0;
    if (originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  function buildProductCard(product) {
    const {
      id,
      brand,
      name,
      img,
      url,
      price,
      original_price,
      rating,
      rating_count,
    } = product;
    const hasDiscount =
      typeof original_price === "number" && original_price > price;
    const pct = hasDiscount ? computeDiscountPercent(price, original_price) : 0;
    const oldPriceHtml = hasDiscount
      ? `<div class="d-flex align-items-center"><span class="insr-price--old">${formatPriceTry(
          original_price
        )}</span><span class="insr-price--pct">%${pct}</span></div>`
      : "";
    const newPriceCls = hasDiscount
      ? "insr-price--new discount"
      : "insr-price--new";

    return `<article class="insr-card" data-id="${id}"><a href="${url}" target="_blank" rel="noopener" style="text-decoration:none;color:inherit"><figure class="insr-card__imgwrap"><img src="${img}" alt="${
      (brand || "") + " " + (name || "")
    }" style="max-width:100%; max-height:100%; object-fit:contain"/></figure><h2 class="insr-card__brand"><b>${
      brand || ""
    } - </b><span class="insr-card__name">${
      name || ""
    }</span></h2><div class="insr-card__price">${oldPriceHtml}<span class="${newPriceCls}">${formatPriceTry(
      price
    )}</span></div><div class="insr-stars"><div class="insr-stars__icons">${(() => {
      const fixedRating = product.rating || Math.ceil(Math.random() * 4.5);
      return `<span class="star ${
        fixedRating >= 1 ? "filled" : ""
      }"></span><span class="star ${
        fixedRating >= 2 ? "filled" : ""
      }"></span><span class="star ${
        fixedRating >= 3 ? "filled" : ""
      }"></span><span class="star ${
        fixedRating >= 4 ? "filled" : ""
      }"></span><span class="star ${fixedRating >= 5 ? "filled" : ""}"></span>`;
    })()}</div><div class="insr-stars__count">(${
      product.rating_count || Math.floor(Math.random() * 200) + 1
    })</div></div></a><div class="insr-heart"><img src="${
      config.assets.heart
    }" alt="favorite"/></div><div class="insr-card__footer"><button class="insr-btn" type="button">Sepete Ekle</button></div></article>`;
  }

  function renderProducts(products) {
    const row = document.getElementById("insr-row");
    if (!row) return;
    row.innerHTML = products.map(buildProductCard).join("");

    function updateCarouselForScreenSize() {
      const cardW =
        parseFloat(
          getComputedStyle(
            document.querySelector(".insr-carousel")
          ).getPropertyValue("--insr-card-w")
        ) || config.tokens.cardWidth;

      let visibleCards = 5;

      if (window.innerWidth < 1200 && window.innerWidth >= 992) {
        visibleCards = 4;
      } else if (window.innerWidth < 992 && window.innerWidth >= 768) {
        visibleCards = 3;
      } else if (window.innerWidth < 768 && window.innerWidth >= 576) {
        visibleCards = 2;
      } else if (window.innerWidth < 576) {
        visibleCards = 1;
      }

      visibleCards = Math.min(visibleCards, products.length);
      const totalWidth =
        visibleCards * (cardW + config.tokens.gap) - config.tokens.gap;

      if (window.innerWidth < 768) {
        document.querySelector(".insr-carousel__scroller").style.maxWidth =
          "none";
        document.querySelector(".insr-carousel__scroller").style.overflowX =
          "auto";
      } else {
        document.querySelector(
          ".insr-carousel__scroller"
        ).style.maxWidth = `${totalWidth}px`;
      }
    }

    window.addEventListener("resize", updateCarouselForScreenSize);

    const favIds = loadFavorites();
    document.querySelectorAll(".insr-card").forEach((card) => {
      const pid = card.getAttribute("data-id");
      const heart = card.querySelector(".insr-heart");
      const heartImg = heart.querySelector("img");
      if (favIds.includes(String(pid))) {
        heartImg.src = config.assets.heartActive;
        heart.classList.add("is-favorite");
      }

      heart.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        toggleFavorite(String(pid));
        const nowFav = loadFavorites().includes(String(pid));
        heartImg.src = nowFav ? config.assets.heartActive : config.assets.heart;

        if (nowFav) {
          heart.classList.add("is-favorite");
        } else {
          heart.classList.remove("is-favorite");
        }
      });
    });

    const scroller = document.getElementById("insr-scroll");
    const cardW =
      parseFloat(
        getComputedStyle(
          document.querySelector(".insr-carousel")
        ).getPropertyValue("--insr-card-w")
      ) || config.tokens.cardWidth;
    const step = cardW + config.tokens.gap;

    let visibleCards = 5;

    if (window.innerWidth < 1200 && window.innerWidth >= 992) {
      visibleCards = 4;
    } else if (window.innerWidth < 992 && window.innerWidth >= 768) {
      visibleCards = 3;
    } else if (window.innerWidth < 768 && window.innerWidth >= 576) {
      visibleCards = 2;
    } else if (window.innerWidth < 576) {
      visibleCards = 1;
    }

    visibleCards = Math.min(visibleCards, products.length);
    const totalWidth =
      visibleCards * (cardW + config.tokens.gap) - config.tokens.gap;

    const carousel = document.querySelector(".insr-carousel");

    if (window.innerWidth < 768) {
      document.querySelector(".insr-carousel__scroller").style.maxWidth =
        "none";
      document.querySelector(".insr-carousel__scroller").style.overflowX =
        "auto";
    } else {
      document.querySelector(
        ".insr-carousel__scroller"
      ).style.maxWidth = `${totalWidth}px`;
    }
    const prev = document.querySelector(".insr-nav--prev");
    const next = document.querySelector(".insr-nav--next");
    if (prev && next && scroller) {
      prev.addEventListener("click", () =>
        scroller.scrollBy({ left: -step, behavior: "smooth" })
      );
      next.addEventListener("click", () =>
        scroller.scrollBy({ left: step, behavior: "smooth" })
      );
    }
  }

  function loadFavorites() {
    try {
      const raw = localStorage.getItem(config.localStorage.favoritesKey);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr.map(String) : [];
    } catch (_) {
      return [];
    }
  }
  function saveFavorites(arr) {
    try {
      localStorage.setItem(
        config.localStorage.favoritesKey,
        JSON.stringify(arr)
      );
    } catch (_) {}
  }
  // Kalbe basınca favori listesine ekle/çıkar
  function toggleFavorite(id) {
    const set = new Set(loadFavorites());
    if (set.has(id)) set.delete(id);
    else set.add(id);
    saveFavorites(Array.from(set));
  }

  // Başlangıç noktası
  function init() {
    if (!isHomepage()) {
      console.log("wrong page");
      return;
    }
    if (document.getElementById("insr-carousel-style")) return;

    injectStyles();

    const mountParent = findInsertPoint();
    const mountAt = buildBaseMarkup();

    const section2A = document.querySelector(
      'cx-page-slot[position="Section2A"]'
    );

    if (section2A) {
      section2A.parentElement.insertBefore(mountAt, section2A);
    } else {
      const anchor =
        mountParent.querySelector(".banner__titles") ||
        mountParent.firstElementChild;

      if (anchor && anchor.nextSibling) {
        anchor.parentElement.insertBefore(mountAt, anchor.nextSibling);
      } else {
        mountParent.appendChild(mountAt);
      }
    }

    document.getElementById(
      "insr-row"
    ).innerHTML = `<div style="padding:24px; font:500 14px/1.6 Poppins, system-ui; color:${config.tokens.textColor}">Ürünler yükleniyor...</div>`;

    loadProducts().then(renderProducts);
  }

  init();
})();
