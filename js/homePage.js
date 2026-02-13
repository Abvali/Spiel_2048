const el = (css) => document.querySelector(css);

// Spiel starten
el("#startBtn").addEventListener("click", () => {
  window.location.href = "game.html";
});

// Modal öffnen
el("#howBtn").addEventListener("click", () => {
  el("#howModal").style.display = "flex";
});

// Modal schließen
el("#closeModal").addEventListener("click", () => {
  howModal.style.display = "none";
});
