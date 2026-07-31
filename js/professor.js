const usuario = obterUsuario();

if (!usuario) {
  location.href = "../index.html";
}

const PROFESSOR = usuario.nome;
const STATUS_CORRECAO = "Correção solicitada";

const lista = document.getElementById("listaPEIs");
const modal = document.getElementById("modal");

const fecharModal = document.getElementById("fecharModal");
const btnFechar = document.getElementById("btnFechar");

const tituloLista = document.getElementById("tituloLista");
const subtituloLista = document.getElementById("subtituloLista");

const btnEditar = document.getElementById("btnEditar");
const btnAssinar = document.getElementById("btnAssinar");
const btnCorrecao = document.getElementById("btnCorrecao");

const btnDocumento = document.getElementById("btnDocumento");
const btnPDF = document.getElementById("btnPDF");

const modalCorrecao = document.getElementById("modalCorrecao");

const fecharModalCorrecao = document.getElementById("fecharModalCorrecao");
const cancelarCorrecao = document.getElementById("cancelarCorrecao");
const confirmarCorrecao = document.getElementById("confirmarCorrecao");

const motivoCorrecao = document.getElementById("motivoCorrecao");

document.getElementById("btnMeusPEIs").onclick = carregarPEIs;

document.getElementById("nomeProfessor").textContent = usuario.nome;
document.getElementById("perfisUsuario").textContent =
  "Perfis: " + usuario.perfis.join(" • ");

document.getElementById("btnNovoPEI").onclick = () => {
  location.href = "formulario.html";
};

document.getElementById("btnSair").onclick = logout;

let peis = [];
let moduloAtual = "meus";
let peiAtual = null;

document.addEventListener("DOMContentLoaded", () => {
  carregarPEIs();

  if (possuiPerfil("AEE")) {
    document.getElementById("btnAEE").style.display = "inline-flex";
    document.getElementById("btnAEE").onclick = abrirAEE;
  }

  if (possuiPerfil("Colaborativo")) {
    document.getElementById("btnColaborativo").style.display = "inline-flex";
    document.getElementById("btnColaborativo").onclick = abrirColaborativo;
  }
});

async function carregarPEIs() {
  try {
    moduloAtual = "meus";

    tituloLista.textContent = "Meus PEIs";

    subtituloLista.textContent =
      "Planos cadastrados ou analisados por você.";

    let todosPEIs = [];

    if (possuiPerfil("Curricular")) {

      const peisProfessor =
        await carregarPEIsProfessor(PROFESSOR);

      todosPEIs.push(...peisProfessor);

    }

    if (
      possuiPerfil("AEE") ||
      possuiPerfil("Colaborativo")
    ) {

      const historicoAEE =
        await carregarHistoricoAEE(PROFESSOR);

      todosPEIs.push(...historicoAEE);

    }

    peis = Array.from(
      new Map(
        todosPEIs.map(pei => [
          pei.UUID,
          pei
        ])
      ).values()
    );

    renderizarLista();
  } catch (erro) {
    console.error(
      "Erro ao carregar Meus PEIs:",
      erro
    );

    mostrarToast(
      erro.message ||
      "Não foi possível carregar seus PEIs.",
      "erro"
    );
  }
}

async function abrirAEE() {
  try {
    moduloAtual = "aee";

    tituloLista.textContent = "Aprovação AEE";
    subtituloLista.textContent =
      "PEIs aguardando sua assinatura.";

    peis = await carregarPEIsResponsavel(PROFESSOR);

    renderizarLista();
  } catch (erro) {
    console.error(erro);
  }
}

async function abrirColaborativo() {
  try {
    moduloAtual = "colaborativo";
    tituloLista.textContent = "Aprovação Colaborativa";
    subtituloLista.textContent =
      "PEIs aguardando seu parecer.";
    peis = await carregarPEIsResponsavel(PROFESSOR);
    renderizarLista();
  } catch (erro) {
    console.error(erro);
  }
}

function renderizarLista() {
  lista.innerHTML = "";

  if (!peis.length) {
    lista.innerHTML = `
      <div class="empty">
        <h3>Nenhum PEI encontrado.</h3>
      </div>
    `;
    return;
  }
  peis.forEach(criarCard);
}

function criarCard(pei) {
  const status = String(pei.Status || "").trim();

  let botao = "";

  if (moduloAtual === "meus") {

    if (status === STATUS_CORRECAO) {

      botao = `
        <button
          class="btn-primary"
          onclick="editarPEI('${pei.UUID}')">
          Editar
        </button>
      `;

    } else {

      botao = `
        <button
          class="btn-primary"
          onclick="abrirModal('${pei.UUID}')">
          Visualizar
        </button>
      `;

    }

  }

  if (moduloAtual === "aee") {

    botao = `
      <button
        class="btn-primary"
        onclick="abrirModal('${pei.UUID}')">
        Avaliar
      </button>
    `;

  }

  if (moduloAtual === "colaborativo") {

    botao = `
      <button
        class="btn-primary"
        onclick="abrirModal('${pei.UUID}')">
        Avaliar
      </button>
    `;

  }

  lista.innerHTML += `
    <article class="pei-card">

      <h2>${pei.Aluno}</h2>

      <div class="pei-info">

        <div>
          <span>Turma</span>
          <strong>${pei.Turma}</strong>
        </div>

        <div>
          <span>Disciplina</span>
          <strong>${pei.Disciplina}</strong>
        </div>

      </div>

      <div class="status">
        <strong>Status:</strong> ${pei.Status}
      </div>

      ${status === STATUS_CORRECAO
      ? `
          <div class="motivo">
            <strong>Motivo:</strong><br>
            ${pei.MotivoCorrecao}
          </div>
        `
      : ""
    }
      <div class="card-actions">
        ${botao}
      </div>

    </article>
  `;
}

async function abrirModal(uuid) {
  try {
    peiAtual = await carregarPEI(uuid);
    const pei = peiAtual;
    document.getElementById("modalAluno").textContent = pei.Aluno;
    document.getElementById("modalTurma").textContent = pei.Turma;
    document.getElementById("modalProfessor").textContent = pei.Professor;
    document.getElementById("modalDisciplina").textContent = pei.Disciplina;
    document.getElementById("modalBimestre").textContent = pei.Bimestre;
    document.getElementById("modalStatus").textContent = pei.Status;

    document.getElementById("modalConteudos").textContent = pei.Conteudos;
    document.getElementById("modalEstrategias").textContent = pei.Estrategias;
    document.getElementById("modalAvaliacao").textContent = pei.Avaliacao;
    document.getElementById("modalRecursos").textContent = pei.Recursos;

    btnEditar.style.display = "none";
    btnAssinar.style.display = "none";
    btnCorrecao.style.display = "none";
    btnDocumento.style.display = "none";
    btnPDF.style.display = "none";

    if (pei.DocumentoID) {
      btnDocumento.style.display = "inline-flex";
    }

    if (pei.PDFID) {
      btnPDF.style.display = "inline-flex";
    }

    if (moduloAtual === "meus") {
      if (pei.Status === STATUS_CORRECAO) {
        btnEditar.style.display = "inline-flex";
      }
    }

    if (moduloAtual === "aee") {
      btnAssinar.style.display = "inline-flex";
      btnCorrecao.style.display = "inline-flex";
    }

    if (moduloAtual === "colaborativo") {
      btnAssinar.style.display = "inline-flex";
      btnCorrecao.style.display = "inline-flex";
    }
    modal.classList.add("show");
  } catch (erro) {
    console.error(erro);
    mostrarToast(
      erro.message || "Erro ao carregar o PEI.",
      "erro"
    );
  }
}

function editarPEI(uuid) {
  location.href =
    `formulario.html?uuid=${encodeURIComponent(uuid)}`;
}

function fechar() {
  modal.classList.remove("show");
}

function abrirModalCorrecao() {
  modalCorrecao.classList.add("show");
}

function fecharModalCorrecaoJanela() {
  modalCorrecao.classList.remove("show");
  motivoCorrecao.value = "";
}

fecharModal.addEventListener("click", fechar);
btnFechar.addEventListener("click", fechar);
btnAssinar.addEventListener("click", assinarPEI);
btnCorrecao.addEventListener("click", abrirModalCorrecao);

btnDocumento.addEventListener("click", () => {
  if (!peiAtual || !peiAtual.DocumentoID) {
    mostrarToast(
      "Documento não disponível.",
      "aviso"
    );
    return;
  }

  const url =
    `https://docs.google.com/document/d/${peiAtual.DocumentoID}/edit`;

  window.open(
    url,
    "_blank",
    "noopener,noreferrer"
  );
});

btnPDF.addEventListener("click", () => {
  if (!peiAtual || !peiAtual.PDFID) {
    mostrarToast(
      "PDF não disponível.",
      "aviso"
    );
    return;
  }

  const url =
    `https://drive.google.com/file/d/${peiAtual.PDFID}/view`;

  window.open(
    url,
    "_blank",
    "noopener,noreferrer"
  );
});

fecharModalCorrecao.addEventListener(
  "click",
  fecharModalCorrecaoJanela
);

cancelarCorrecao.addEventListener(
  "click",
  fecharModalCorrecaoJanela
);

modalCorrecao.addEventListener("click", (e) => {
  if (e.target === modalCorrecao) {
    fecharModalCorrecaoJanela();
  }
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {

    fechar();
  }
});

window.abrirModal = abrirModal;
window.editarPEI = editarPEI;

async function assinarPEI() {
  if (!peiAtual) return;
  try {
    btnAssinar.disabled = true;

    if (moduloAtual === "aee") {

      await aprovarAEE(
        peiAtual.UUID,
        PROFESSOR
      );

      mostrarToast(
        "PEI encaminhado para a Coordenação.",
        "sucesso"
      );

    }

    if (moduloAtual === "colaborativo") {

      await aprovarAEE(
        peiAtual.UUID,
        PROFESSOR
      );

      mostrarToast(
        "PEI encaminhado para a Coordenação.",
        "sucesso"
      );
    }
    fechar();
    await abrirAEE();
  }
  catch (erro) {
    console.error(erro);

    mostrarToast(
      erro.message || "Erro ao assinar o PEI.",
      "erro"
    );
  }
  finally {
    btnAssinar.disabled = false;
  }
}

confirmarCorrecao.addEventListener("click", async () => {
  const motivo = motivoCorrecao.value.trim();
  if (!motivo) {
    mostrarToast(
      "Informe o motivo da correção.",
      "aviso"
    );
    return;
  }
  try {
    confirmarCorrecao.disabled = true;

    await solicitarCorrecao(
      peiAtual.UUID,
      PROFESSOR,
      motivo
    );

    fecharModalCorrecaoJanela();

    fechar();

    await abrirAEE();

    mostrarToast(
      "Correção solicitada com sucesso.",
      "sucesso"
    );
  }

  catch (erro) {
    console.error(erro);

    mostrarToast(
      erro.message || "Erro ao solicitar correção.",
      "erro"
    );
  }
  finally {
    confirmarCorrecao.disabled = false;
  }
});