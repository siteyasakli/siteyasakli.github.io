(function () {
  function closeAll(except) {
    document.querySelectorAll(".nav-dropdown.is-open").forEach(function (dd) {
      if (dd === except) return;
      dd.classList.remove("is-open");
      if (dd.__trigger) dd.__trigger.setAttribute("aria-expanded", "false");
    });
  }

  document.querySelectorAll(".nav-item").forEach(function (item) {
    var trigger = item.querySelector(".nav-trigger");
    var dropdown = item.querySelector(".nav-dropdown");
    if (!trigger || !dropdown) return;

    // Menüyü kaydırılabilir/taşan nav satırından çıkarıp body'nin
    // sonuna taşı — böylece artık o satırın yüksekliğini etkilemiyor,
    // sayfanın üstünde bağımsız bir katman olarak duruyor.
    document.body.appendChild(dropdown);
    dropdown.__trigger = trigger;

    trigger.setAttribute("aria-haspopup", "true");
    trigger.setAttribute("aria-expanded", "false");

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = dropdown.classList.contains("is-open");
      closeAll(dropdown);
      if (isOpen) {
        dropdown.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
      } else {
        var rect = trigger.getBoundingClientRect();
        var w = 220; // style.css'teki min-width ile aynı
        var left = Math.min(rect.left, window.innerWidth - w - 12);
        left = Math.max(left, 12);
        dropdown.style.top = (rect.bottom + 6) + "px";
        dropdown.style.left = left + "px";
        dropdown.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  document.addEventListener("click", function () { closeAll(null); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(null); });
  window.addEventListener("scroll", function () { closeAll(null); }, true);
  window.addEventListener("resize", function () { closeAll(null); });
})();