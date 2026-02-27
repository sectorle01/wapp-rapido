const phoneEl = document.getElementById("phone");
const msgEl = document.getElementById("msg");
const sendBtn = document.getElementById("send");
const clearBtn = document.getElementById("clear");
const statusEl = document.getElementById("status");

function setStatus(t) { statusEl.textContent = t || ""; }

function normalizaTelefono(raw) {
  const digits = (raw || "").replace(/\D/g, "");
  // Si meten 9 dígitos, asumimos España (+34)
  if (digits.length === 9) return "34" + digits;
  return digits;
}

function abrirWhatsApp() {
  const phone = normalizaTelefono(phoneEl.value);
  const msg = msgEl.value.trim();

  if (!phone || phone.length < 9) {
    alert("Pon un teléfono válido (con prefijo o 9 dígitos si es España).");
    phoneEl.focus();
    return;
  }

  const base = `https://wa.me/${phone}`;
  const url = msg ? `${base}?text=${encodeURIComponent(msg)}` : base;

  sendBtn.disabled = true;
  setStatus("Abriendo WhatsApp…");

  window.location.href = url;

  // Por si vuelve atrás o el navegador bloquea
  setTimeout(() => {
    sendBtn.disabled = false;
    setStatus("");
  }, 1500);
}

sendBtn.addEventListener("click", abrirWhatsApp);

clearBtn.addEventListener("click", () => {
  phoneEl.value = "";
  msgEl.value = "";
  phoneEl.focus();
  setStatus("");
});

phoneEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    abrirWhatsApp();
  }
});

msgEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    abrirWhatsApp();
  }
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("./sw.js", { scope: "./" });
    } catch (e) {
      // si falla, la web sigue funcionando
    }
  });
}
