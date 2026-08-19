// src/scripts/home.js
(function(){
  "use strict";
  var noPref = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

  var hero = document.querySelector(".hero");
  if (hero && noPref){
    hero.classList.add("anim");
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){ hero.classList.add("loaded"); });
    });
  }

  if (noPref && "IntersectionObserver" in window){
    document.documentElement.classList.add("reveal-ready");
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold:.14, rootMargin:"0px 0px -6% 0px" });
    document.querySelectorAll(".reveal").forEach(function(el){ io.observe(el); });
  }

  var head = document.querySelector(".site-head");
  if (head && hero){
    var sync = function(){
      var past = window.scrollY > (hero.offsetHeight - 72);
      head.classList.toggle("over-hero", !past);
    };
    sync();
    window.addEventListener("scroll", sync, { passive:true });
    window.addEventListener("resize", sync);
  }

  // Menú móvil
  var navToggle = document.querySelector(".nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  var mobileClose = document.querySelector(".mobile-close");
  if (navToggle && mobileNav){
    var previousFocus = null;
    var focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    var setNav = function(open, restoreFocus){
      if (open){ previousFocus = document.activeElement; }
      mobileNav.classList.toggle("open", open);
      mobileNav.setAttribute("aria-hidden", open ? "false" : "true");
      mobileNav.inert = !open;
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      document.body.style.overflow = open ? "hidden" : "";
      if (open){
        requestAnimationFrame(function(){
          var first = mobileNav.querySelector(focusableSelector);
          if (first){ first.focus(); }
        });
      } else if (restoreFocus !== false && previousFocus && previousFocus.focus){
        previousFocus.focus();
      }
    };
    navToggle.addEventListener("click", function(){ setNav(true); });
    if (mobileClose){ mobileClose.addEventListener("click", function(){ setNav(false); }); }
    mobileNav.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){ setNav(false); });
    });
    var desktopNav = window.matchMedia("(min-width: 881px)");
    var closeOnDesktop = function(e){
      if (e.matches && mobileNav.classList.contains("open")){ setNav(false); }
    };
    if (desktopNav.addEventListener){ desktopNav.addEventListener("change", closeOnDesktop); }
    document.addEventListener("keydown", function(e){
      if (!mobileNav.classList.contains("open")){ return; }
      if (e.key === "Escape"){
        e.preventDefault();
        setNav(false);
        return;
      }
      if (e.key !== "Tab"){ return; }
      var items = Array.prototype.slice.call(mobileNav.querySelectorAll(focusableSelector));
      if (!items.length){ return; }
      var first = items[0];
      var last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first){
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last){
        e.preventDefault();
        first.focus();
      }
    });
  }

  // Banda del arancel. La home no consulta al Colegio: usa el último valor que
  // guardó /honorarios/ en este dispositivo y, si no hay, el valor base del estudio.
  var afUma = document.getElementById("af-uma");
  if (afUma){
    var ars = new Intl.NumberFormat("es-AR", { style:"currency", currency:"ARS", maximumFractionDigits:0 });
    var pintarArancel = function(valor, mes){
      var v = parseInt(String(valor).replace(/[^\d]/g, ""), 10);
      if (!v) return false;
      var put = function(id, n){
        var el = document.getElementById(id);
        if (el){ el.textContent = ars.format(n); }
      };
      put("af-uma", v); put("af-virtual", v * 4); put("af-oral", v * 5); put("af-escrita", v * 8);
      var elMes = document.getElementById("af-mes");
      if (elMes && mes){ elMes.textContent = "UMA de " + mes; }
      return true;
    };

    var cacheado = null;
    try { cacheado = JSON.parse(localStorage.getItem("hjf_cache") || "null"); } catch(e){}
    var listo = cacheado && cacheado.valor ? pintarArancel(cacheado.valor, cacheado.mes) : false;

    if (!listo && "fetch" in window){
      fetch("/honorarios/uma.json", { headers:{ "Accept":"application/json" } })
        .then(function(r){ return r.ok ? r.json() : null; })
        .then(function(d){ if (d){ pintarArancel(d.valor, d.mes); } })
        .catch(function(){});
    }
  }

  // Medición de los clics a WhatsApp. Si Plausible no está, no hace nada.
  document.addEventListener("click", function(e){
    var a = e.target.closest && e.target.closest('a[href*="wa.me"]');
    if (!a || typeof window.plausible !== "function"){ return; }
    var origen = a.classList.contains("wa-float") ? "flotante"
               : (a.closest(".site-foot") ? "pie" : "contacto");
    try { window.plausible("WhatsApp", { props:{ origen:origen, pagina:"home" } }); } catch(err){}
  });

  // Formulario de consulta (Netlify Forms vía AJAX, conserva el aviso en pantalla)
  var form = document.getElementById("consulta-form");
  if (form){
    var errBox = document.getElementById("consulta-error");
    var showOk = function(){
      var ok = document.getElementById("consulta-ok");
      form.hidden = true;
      if (ok){ ok.hidden = false; ok.focus(); }
    };
    var showErr = function(){
      if (errBox){ errBox.hidden = false; errBox.focus && errBox.focus(); }
    };
    form.addEventListener("submit", function(ev){
      ev.preventDefault();
      if (!form.checkValidity()){ form.reportValidity(); return; }
      if (errBox){ errBox.hidden = true; }
      var body = new URLSearchParams(new FormData(form)).toString();
      fetch("/", { method:"POST", headers:{ "Content-Type":"application/x-www-form-urlencoded" }, body:body })
        .then(function(res){ if (res.ok){ showOk(); } else { showErr(); } })
        .catch(showErr);
    });
  }
})();
