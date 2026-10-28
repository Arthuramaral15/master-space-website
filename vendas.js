const $ = (id) => document.getElementById(id);
const brl = (v) => "R$ " + Math.round(v).toLocaleString("pt-BR");
const PRICE = 6000, INITIAL = 7, TOTAL = 12;

/* Calculadora: pedidos por dia para pagar o aluguel */
function calc() {
  const ticket = Number($("ticket").value), days = Number($("days").value);
  $("ticket-out").textContent = brl(ticket);
  $("days-out").textContent = days + " dias";
  $("per-day").textContent = brl(PRICE / days);
  $("need").textContent = Math.ceil(PRICE / days / ticket);
}
["ticket", "days"].forEach((id) => $(id).addEventListener("input", calc));
calc();

/* Escolha do box */
const yard = $("yard");
const COLORS = ["#2f5bff","#ff8a1f","#e5484d","#14b8a6","#8b5cf6","#f5b301"];
const boxes = Array.from({ length: TOTAL }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  const later = i >= INITIAL;
  const b = document.createElement("button");
  b.type = "button";
  b.className = "unit" + (later ? " later" : "");
  b.style.setProperty("--c", COLORS[i % COLORS.length]);
  b.innerHTML = `<span class="u-shadow"></span><span class="u-top"><b class="mk">M</b></span><span class="u-side"><b class="mk">M</b></span><span class="u-front"><i class="u-win"></i><b>${n}</b>${later ? `<em>mês ${i - INITIAL + 2}</em>` : ""}</span>`;
  b.addEventListener("click", () => pick(i));
  yard.appendChild(b);
  return b;
});

function pick(i) {
  const month = i < INITIAL ? 1 : i - INITIAL + 2;
  boxes.forEach((b, j) => {
    b.setAttribute("aria-pressed", j === i);
    b.setAttribute("aria-label", `Box ${j + 1}${j === i ? ", selecionado" : ""}`);
  });
  $("b-name").textContent = `Box ${String(i + 1).padStart(2, "0")}`;
  $("b-when").textContent = month === 1 ? "Disponível desde a abertura do pátio" : `Entra em operação no ${month}º mês`;
  $("b-year").textContent = brl((13 - month) * PRICE);
  $("lead-ok").hidden = true;
}
pick(0);

/* Envio do formulário para o WhatsApp */
const WA_NUMBER = "5511933761264";
$("lead").addEventListener("submit", (e) => {
  e.preventDefault();
  const nome = $("nome").value.trim(), food = $("food").value.trim();
  const box = $("b-name").textContent;
  const msg = `Olá! Meu nome é ${nome}. Vim pelo site do Master Space e quero conversar sobre o ${box}. Eu vendo: ${food}.`;
  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  const ok = $("lead-ok");
  ok.textContent = `Pronto, ${nome}! Abrindo o WhatsApp com sua mensagem sobre o ${box}. Se não abrir, toque no botão de novo.`;
  ok.hidden = false;
  const whatsappWindow = window.open(url, "_blank");
  if (whatsappWindow) {
    whatsappWindow.opener = null;
  } else {
    window.location.assign(url);
  }
});