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

  function isHomepage() {
    const path = location.pathname.replace(/\/+$/, "");
    if (path === "" || path === "/" || /^\/(tr|tr_TR|tr-TR)?$/.test(path))
      return true;

    const hero = document.querySelector(
      ".homepage, .home, .eb-home, .swiper, .owl-carousel"
    );
    return !!hero && !!document.querySelector(".banner");
  }

  function findInsertPoint() {
    for (const sel of config.selectors.afterStoriesAnchors) {
      const el = document.querySelector(sel);
      if (el && el.parentElement) return el.parentElement;
    }

    return (
      document.querySelector(config.selectors.containerMax) || document.body
    );
  }

  function formatPriceTry(amount) {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(amount);
  }

  function injectStyles() {
    const css = `
        /* Kapsayıcı */
        .insr-carousel { margin-top: 24px; }
        .insr-carousel__titlebar {
          background: ${config.tokens.titleBg};
          padding: 25px 67px;
          border-radius: 16px;
        }
        .insr-carousel__title {
          font-family: Quicksand, 'Quicksand-Bold', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          font-weight: 700;
          color: ${config.tokens.titleColor};
          font-size: 28.8px;
          line-height: 1.2;
          margin: 0;
        }
        .insr-carousel__track { position: relative; padding: 24px 0; }
        .insr-carousel__scroller { overflow-x: auto; overflow-y: hidden; scroll-behavior: smooth; }
        .insr-carousel__scroller::-webkit-scrollbar { display: none; }
        .insr-carousel__row {
          display: flex;
          gap: ${config.tokens.gap}px;
          will-change: transform;
        }
        .insr-card {
          width: ${config.tokens.cardWidth}px;
          background: #fff;
          border: 1px solid ${config.tokens.cardBorder};
          border-radius: 10px;
          padding: 5px;
          color: ${config.tokens.textColor};
          flex: 0 0 auto;
        }
        .insr-card__imgwrap {
          width: 100%;
          aspect-ratio: 1 / 1;
          display: grid;
          place-items: center;
          border-radius: 10px;
          overflow: hidden;
        }
        .insr-card__brand { font: 700 11.52px Poppins, system-ui; color: ${config.tokens.textColor}; }
        .insr-card__name  { font: 400 11.52px Poppins, system-ui; color: ${config.tokens.textColor}; }
        .insr-price--new  { font: 600 21.12px Poppins, system-ui; color: ${config.tokens.textColor}; }
        .insr-price--new.discount { color: ${config.tokens.priceGreen}; }
        .insr-price--old  { font: 400 13.44px Poppins, system-ui; color: ${config.tokens.textColor}; text-decoration: line-through; }
        .insr-price--pct  { font: 400 18px Poppins, system-ui; color: ${config.tokens.priceGreen}; margin-left: 4.8px; }
  
        .insr-heart {
          position: absolute; top: 10px; right: 10px;
          width: 42px; height: 42px; display: grid; place-items: center;
          background: #fff; border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,.06);
          cursor: pointer;
        }
        .insr-heart img { width: 24px; height: 24px; }
  
        .insr-btn {
          width: 100%;
          height: 48px;
          padding: 15px 20px;
          border-radius: 37.5px; /* buton görseli */
          background: #FFF7EC;
          color: ${config.tokens.titleColor};
          font: 700 1.4rem Poppins, system-ui;
          border: none;
          cursor: pointer;
        }
  
        /* Oklar */
        .insr-nav {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 50px; height: 50px; background-color: #FEF6EB;
          border-radius: 50%; border: 1px solid transparent;
          display: grid; place-items: center; cursor: pointer; z-index: 5;
        }
        .insr-nav--prev { left: -65px; background-image: url(${config.assets.arrowPrev}); background-repeat: no-repeat; background-position: 18px center; }
        .insr-nav--next { right: -65px; background-image: url(${config.assets.arrowNext}); background-repeat: no-repeat; background-position: 18px center; }
  
        /* Basit responsive görünürlük – gerçek kaydırma bir sonraki adımda */
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

  function buildBaseMarkup() {
    const root = document.createElement("section");
    root.className = "insr-carousel";
    root.setAttribute("aria-label", "Beğenebileceğinizi düşündüklerimiz");

    root.innerHTML = `
        <div class="insr-carousel__titlebar">
          <h2 class="insr-carousel__title">${config.copy.title}</h2>
        </div>
        <div class="insr-carousel__track">
          <button class="insr-nav insr-nav--prev" aria-label="Geri"></button>
          <div class="insr-carousel__scroller" id="insr-scroll">
            <div class="insr-carousel__row" id="insr-row">
              <!-- Step 2’de ürün kartlarını basacağız -->
            </div>
          </div>
          <button class="insr-nav insr-nav--next" aria-label="İleri"></button>
        </div>
      `;
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
    const { id, brand, name, img, url, price, original_price } = product;
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

    return `
      <article class="insr-card" data-id="${id}">
        <a href="${url}" target="_blank" rel="noopener" style="text-decoration:none;color:inherit">
          <figure class="insr-card__imgwrap"><img src="${img}" alt="${
      (brand || "") + " " + (name || "")
    }" style="max-width:100%; max-height:100%; object-fit:contain"/></figure>
          <h2 class="insr-card__brand"><b>${
            brand || ""
          } - </b><span class="insr-card__name">${name || ""}</span></h2>
          <div class="insr-card__price">${oldPriceHtml}<span class="${newPriceCls}">${formatPriceTry(
      price
    )}</span></div>
        </a>
        <div class="insr-heart"><img src="${
          config.assets.heart
        }" alt="favorite"/></div>
        <div style="padding: 0 5px 10px 5px"><button class="insr-btn" type="button">Sepete Ekle</button></div>
      </article>
    `;
  }

  function renderProducts(products) {
    const row = document.getElementById("insr-row");
    if (!row) return;
    row.innerHTML = products.map(buildProductCard).join("");

    // Favori görünümü ve toggle
    const favIds = loadFavorites();
    document.querySelectorAll(".insr-card").forEach((card) => {
      const pid = card.getAttribute("data-id");
      const heartImg = card.querySelector(".insr-heart img");
      if (favIds.includes(String(pid)))
        heartImg.src = config.assets.heartActive;
      card.querySelector(".insr-heart").addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        toggleFavorite(String(pid));
        const nowFav = loadFavorites().includes(String(pid));
        heartImg.src = nowFav ? config.assets.heartActive : config.assets.heart;
      });
    });

    const scroller = document.getElementById("insr-scroll");
    const step = config.tokens.cardWidth + config.tokens.gap;
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

  // Favoriler yardımcıları
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
  function toggleFavorite(id) {
    const set = new Set(loadFavorites());
    if (set.has(id)) set.delete(id);
    else set.add(id);
    saveFavorites(Array.from(set));
  }

  function init() {
    if (!isHomepage()) {
      console.log("wrong page");
      return;
    }
    if (document.getElementById("insr-carousel-style")) return;

    injectStyles();

    const mountParent = findInsertPoint();
    const mountAt = buildBaseMarkup();

    const anchor =
      mountParent.querySelector(".banner__titles") ||
      mountParent.firstElementChild;
    if (anchor && anchor.nextSibling) {
      anchor.parentElement.insertBefore(mountAt, anchor.nextSibling);
    } else {
      mountParent.appendChild(mountAt);
    }

    document.getElementById("insr-row").innerHTML = `
        <div style="padding:24px; font:500 14px/1.6 Poppins, system-ui; color:${config.tokens.textColor}">
          Ürünler yükleniyor...
        </div>
      `;

    loadProducts().then(renderProducts);
  }

  window.__insrCarousel = { config, formatPriceTry, init };
  init();
})();
