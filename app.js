// Rok w stopce
document.getElementById("year").textContent = new Date().getFullYear();

// Opcjonalnie: po kliknięciu w link do sekcji, podświetl nagłówek
function flash(el){
  el.animate(
    [{ outline: "0px solid rgba(255,255,255,0)" },
     { outline: "6px solid rgba(255,255,255,.18)" },
     { outline: "0px solid rgba(255,255,255,0)" }],
    { duration: 700, easing: "ease-out" }
  );
}

window.addEventListener("hashchange", () => {
  const id = location.hash.replace("#", "");
  if(!id) return;
  const section = document.getElementById(id);
  if(section) flash(section);
});
