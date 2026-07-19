/* 共通ヘッダ・フッタの読み込み + カルーセル */
(function () {
  function inject(id, url, done) {
    var el = document.getElementById(id);
    if (!el) { if (done) done(); return; }
    fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error(url + " : " + r.status);
        return r.text();
      })
      .then(function (html) {
        el.innerHTML = html;
        if (done) done();
      })
      .catch(function (e) {
        console.error("include failed:", e);
        if (done) done();
      });
  }

  function highlightNav() {
    var path = location.pathname.split("/").pop() || "index.html";
    var links = document.querySelectorAll("nav a");
    links.forEach(function (a) {
      var href = (a.getAttribute("href") || "").split("#")[0].split("/").pop();
      if (href === path) a.classList.add("active");
    });
  }

  function initCarousels() {
    document.querySelectorAll(".carousel").forEach(function (root) {
      var track = root.querySelector(".carousel-track");
      if (!track) return;
      var slides = track.children.length;
      var idx = 0;
      var playing = true;
      var timer = null;
      var btnPause = root.querySelector(".btn-pause");

      function go(i) {
        idx = (i + slides) % slides;
        track.style.transform = "translateX(-" + idx * 100 + "%)";
      }
      function start() {
        stop();
        timer = setInterval(function () { go(idx + 1); }, 4000);
        playing = true;
        if (btnPause) btnPause.innerHTML = "&#10074;&#10074;";
      }
      function stop() {
        if (timer) { clearInterval(timer); timer = null; }
      }
      var prev = root.querySelector(".btn-prev");
      var next = root.querySelector(".btn-next");
      if (prev) prev.addEventListener("click", function () { go(idx - 1); if (playing) start(); });
      if (next) next.addEventListener("click", function () { go(idx + 1); if (playing) start(); });
      if (btnPause) btnPause.addEventListener("click", function () {
        if (playing) { stop(); playing = false; this.innerHTML = "&#9654;"; }
        else { start(); }
      });
      start();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    inject("site-header", "/includes/header.html", highlightNav);
    inject("site-footer", "/includes/footer.html");
    initCarousels();
  });
})();
