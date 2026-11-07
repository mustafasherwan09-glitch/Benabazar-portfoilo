/* ==========================================================================
   Bena Bazar — site behaviour (vanilla JS, no dependencies)
   ========================================================================== */
(function () {
  "use strict";

  var C = window.CONFIG || {};
  var T = window.I18N || {};
  var LANGS = ["ku", "ar", "en"];
  var root = document.documentElement;
  var page = document.body.getAttribute("data-page") || "home";

  /* ---------- helpers ---------- */
  function $(s, ctx) { return (ctx || document).querySelector(s); }
  function $$(s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); }
  function get(obj, path) {
    return path.split(".").reduce(function (o, k) { return o == null ? undefined : o[k]; }, obj);
  }
  function lang() { return LANGS.indexOf(root.lang) > -1 ? root.lang : "ku"; }
  function t(path) { return get(T[lang()], path); }
  function fmt(n) { return Math.round(n).toLocaleString("en-US"); }
  function money(n) { return fmt(n) + " " + (t("currency") || "IQD"); }
  function waLink(text) {
    return "https://wa.me/" + C.phone.whatsapp + (text ? "?text=" + encodeURIComponent(text) : "");
  }
  function resolve(v) {
    if (v && typeof v === "object" && !Array.isArray(v)) return v[lang()] != null ? v[lang()] : v.en;
    return v;
  }
  function isEmpty(v) { return v == null || String(v).trim() === ""; }

  /* ---------- CONFIG hydration ---------- */
  var computed = {
    rate: function () { return fmt(C.rate); },
    rate100: function () { return fmt(C.rate * 100); },
    feeKurdistan: function () { return fmt(C.deliveryFee.kurdistan); },
    feeOther: function () { return fmt(C.deliveryFee.other); },
    threshold: function () { return fmt(C.prepayThresholdUSD); },
    prepayPercent: function () { return C.prepayPercent + "%"; },
    deliveryDays: function () { return C.deliveryDays; },
    attempts: function () { return C.deliveryAttempts; },
    retention: function () { return C.dataRetentionMonths; },
    year: function () { return C.copyrightYear || new Date().getFullYear(); }
  };
  var hrefs = {
    whatsapp: function () { return waLink(); },
    tel: function () { return "tel:" + C.phone.tel; },
    email: function () { return "mailto:" + C.email; },
    instagram: function () { return C.social.instagram; },
    facebook: function () { return C.social.facebook; },
    maps: function () { return C.mapsUrl; },
    website: function () { return C.website; }
  };

  function hydrate() {
    $$("[data-cfg]").forEach(function (el) {
      var key = el.getAttribute("data-cfg");
      var v = computed[key] ? computed[key]() : resolve(get(C, key));
      if (!isEmpty(v)) el.textContent = v;
    });
    $$("[data-cfg-href]").forEach(function (el) {
      var key = el.getAttribute("data-cfg-href");
      var v = hrefs[key] ? hrefs[key]() : get(C, key);
      if (!isEmpty(v)) el.setAttribute("href", v);
    });
    // Hide elements whose CONFIG value is empty
    $$("[data-cfg-hide]").forEach(function (el) {
      var v = resolve(get(C, el.getAttribute("data-cfg-hide")));
      el.hidden = isEmpty(v);
    });
    var mapFrame = $("[data-map]");
    if (mapFrame && C.mapsEmbed && !mapFrame.getAttribute("src")) mapFrame.setAttribute("src", C.mapsEmbed);
  }

  /* ---------- WhatsApp links (prefilled in current language) ---------- */
  function updateWhatsApp() {
    $$("[data-wa]").forEach(function (el) {
      var msg = t("wa." + el.getAttribute("data-wa"));
      el.setAttribute("href", waLink(msg));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    });
  }

  /* ---------- Language ---------- */
  function applyMeta() {
    var p = t("pages." + page);
    if (!p) return;
    document.title = p[0];
    var d = $('meta[name="description"]');
    if (d) d.setAttribute("content", p[1]);
  }
  function applyAttrs() {
    $$("[data-i18n-ph]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n-ph")); if (v) el.setAttribute("placeholder", v);
    });
    $$("[data-i18n-aria]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n-aria")); if (v) el.setAttribute("aria-label", v);
    });
  }
  function setLang(l, opts) {
    if (LANGS.indexOf(l) < 0) l = "ku";
    root.lang = l;
    root.dir = (T[l] && T[l].dir) || (l === "en" ? "ltr" : "rtl");
    try { localStorage.setItem("bb-lang", l); } catch (e) { /* storage unavailable */ }
    $$(".lang-switch button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("lang") === l ? "true" : "false");
    });
    if (opts && opts.updateUrl) {
      try {
        var u = new URL(window.location.href);
        if (u.searchParams.has("lang")) { u.searchParams.set("lang", l); history.replaceState(null, "", u.toString()); }
      } catch (e) { /* ignore */ }
    }
    applyMeta(); applyAttrs(); hydrate(); updateWhatsApp(); calc();
  }
  $$(".lang-switch button").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("lang"), { updateUrl: true }); });
  });

  /* ---------- Header: scroll state + mobile nav ---------- */
  var header = $(".site-header");
  var toggle = $(".nav-toggle");
  function onScroll() { if (header) header.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  function closeNav() {
    document.body.classList.remove("nav-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$(".nav a").forEach(function (a) { a.addEventListener("click", closeNav); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });
    window.addEventListener("resize", function () { if (window.innerWidth >= 960) closeNav(); });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Tabs (size guide) ---------- */
  $$("[role=tablist]").forEach(function (list) {
    var tabs = $$("[role=tab]", list);
    function select(tab, focus) {
      tabs.forEach(function (tb) {
        var on = tb === tab;
        tb.setAttribute("aria-selected", on ? "true" : "false");
        tb.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(tb.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(tab); });
      tab.addEventListener("keydown", function (e) {
        var rtl = root.dir === "rtl", n = null;
        if (e.key === "ArrowRight") n = rtl ? i - 1 : i + 1;
        if (e.key === "ArrowLeft") n = rtl ? i + 1 : i - 1;
        if (e.key === "Home") n = 0;
        if (e.key === "End") n = tabs.length - 1;
        if (n !== null) { e.preventDefault(); select(tabs[(n + tabs.length) % tabs.length], true); }
      });
    });
    select(tabs[0]);
  });

  /* ---------- Price calculator ---------- */
  var calcForm = $("#calc-form");
  var last = null;
  function calc() {
    if (!calcForm) return;
    var usd = parseFloat(String($("#calc-usd").value).replace(/,/g, "")) || 0;
    if (usd < 0) usd = 0;
    var area = (calcForm.querySelector("input[name=area]:checked") || {}).value || "kurdistan";
    var items = Math.round(usd * C.rate);
    var delivery = usd > 0 ? C.deliveryFee[area] : 0;
    var total = items + delivery;
    var over = usd > C.prepayThresholdUSD;
    var prepay = over ? Math.round(total * C.prepayPercent / 100) : 0;
    var rest = total - prepay;

    $("#out-items").textContent = money(items);
    $("#out-delivery").textContent = money(delivery);
    $("#out-total").textContent = money(total);
    var split = $("#out-split");
    split.hidden = !over;
    $("#out-prepay").textContent = money(prepay);
    $("#out-rest").textContent = money(rest);
    var np = $("#out-noprepay");
    if (np) np.hidden = over || usd <= 0;

    last = { usd: usd, area: area, items: items, delivery: delivery, total: total, over: over, prepay: prepay, rest: rest };
    var btn = $("#calc-wa");
    if (btn) btn.setAttribute("href", waLink(calcMessage(last)));
  }
  function calcMessage(r) {
    var c = t("calc");
    var lines = [
      c.waIntro,
      "• " + c.shein + ": $" + (Math.round(r.usd * 100) / 100).toLocaleString("en-US"),
      "• " + c.area + ": " + (r.area === "kurdistan" ? c.kurdistan : c.other),
      "• " + c.items + ": " + money(r.items) + "  (1$ = " + fmt(C.rate) + ")",
      "• " + c.delivery + ": " + money(r.delivery),
      "• " + c.total + ": " + money(r.total)
    ];
    if (r.over) {
      lines.push("• " + c.prepay + " " + C.prepayPercent + "%: " + money(r.prepay));
      lines.push("• " + c.onDelivery + ": " + money(r.rest));
    }
    lines.push("", c.waOutro);
    return lines.join("\n");
  }
  if (calcForm) {
    calcForm.addEventListener("input", calc);
    calcForm.addEventListener("change", calc);
    calcForm.addEventListener("submit", function (e) { e.preventDefault(); calc(); });
  }

  /* ---------- Contact form → WhatsApp (nothing stored) ---------- */
  var cf = $("#contact-form");
  if (cf) {
    cf.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = t("form");
      var name = cf.elements.name.value.trim();
      var phone = cf.elements.phone.value.trim();
      var city = cf.elements.city.value.trim();
      var msg = cf.elements.message.value.trim();
      if (!name || !msg) { (name ? cf.elements.message : cf.elements.name).focus(); return; }
      var text = [f.waIntro, "", msg, "", f.lName + ": " + name];
      if (phone) text.push(f.lPhone + ": " + phone);
      if (city) text.push(f.lCity + ": " + city);
      window.open(waLink(text.join("\n")), "_blank", "noopener");
    });
  }

  /* ---------- Init ---------- */
  setLang(lang());
  function loaded() { root.classList.add("is-loaded"); }
  if (document.readyState === "complete") loaded();
  else { window.addEventListener("load", loaded); setTimeout(loaded, 1200); }
})();

