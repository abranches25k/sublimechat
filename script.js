
let chatBox = document.getElementById("chatBox");
let userInput = document.getElementById("userInput");
let sheet = document.getElementById("sheet");

let state = {
  step: 0,
  nome: "",
  renda: 0,
  divida: 0,
  tempo: "",
  objetivo: "",
  planoGerado: false
};

function appendMessage(sender, text) {
  let div = document.createElement("div");
  div.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
  let msg = userInput.value.trim();
  if (!msg) return;
  appendMessage("Você", msg);
  userInput.value = "";
  setTimeout(() => respond(msg), 600);
}

function respond(msg) {
  if (state.step === 0) {
    appendMessage("SublimeChat", "Qual seu nome?");
    state.step++;
  } else if (state.step === 1) {
    state.nome = msg;
    appendMessage("SublimeChat", `Olá ${msg}! Qual sua renda mensal atual?`);
    state.step++;
  } else if (state.step === 2) {
    state.renda = parseFloat(msg.replace(",", "."));
    appendMessage("SublimeChat", "E qual o valor total das suas dívidas?");
    state.step++;
  } else if (state.step === 3) {
    state.divida = parseFloat(msg.replace(",", "."));
    appendMessage("SublimeChat", "Quanto tempo livre você tem por dia?");
    state.step++;
  } else if (state.step === 4) {
    state.tempo = msg;
    appendMessage("SublimeChat", "Qual seu objetivo principal?");
    state.step++;
  } else if (state.step === 5) {
    state.objetivo = msg;
    gerarPlano();
  } else {
    appendMessage("SublimeChat", "Se quiser reiniciar, atualize a página.");
  }
}

function gerarPlano() {
  let meses = Math.ceil(state.divida / (state.renda * 0.3));
  let plano = `Nome: ${state.nome}
- Renda mensal: R$${state.renda.toFixed(2)}
- Dívida total: R$${state.divida.toFixed(2)}
- Tempo livre: ${state.tempo}
- Objetivo: ${state.objetivo}

Sugestão:
- Use até 30% da sua renda (R$${(state.renda * 0.3).toFixed(2)}) para pagar dívidas.
- Levará cerca de ${meses} mês(es) para quitar tudo.
- Use seu tempo livre para buscar renda extra como:
  - Freelance online (design, texto, social media)
  - Vendas por WhatsApp/Instagram
  - Serviços na sua região

Depois de quitar, comece a juntar para: ${state.objetivo}.
Você consegue!`;

  appendMessage("SublimeChat", plano.replaceAll("\n", "<br>"));
  state.planoGerado = true;
  atualizarPlanilha();
}

function atualizarPlanilha() {
  sheet.innerHTML = `
<h3>📊 Planilha de Progresso</h3>
<p><strong>Dívida:</strong> R$${state.divida.toFixed(2)}</p>
<p><strong>Meta:</strong> ${state.objetivo}</p>
<p><strong>Já pago:</strong> R$0.00</p>
<p><strong>Falta pagar:</strong> R$${state.divida.toFixed(2)}</p>
`;
}

function toggleSheet() {
  sheet.style.display = sheet.style.display === "none" ? "block" : "none";
}

function downloadPDF() {
  let text = chatBox.innerText;
  let blob = new Blob([text], { type: "application/pdf" });
  let link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = "plano_sublimechat.pdf";
  link.click();
}
