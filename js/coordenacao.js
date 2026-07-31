const usuario = obterUsuario();

if (!usuario || !possuiPerfil("Coordenação")) {
    window.location.href = "../index.html";
}

const COORDENACAO = usuario.nome;

const listaPEIs = document.getElementById("listaPEIs");

const tituloLista = document.getElementById("tituloLista");
const subtituloLista = document.getElementById("subtituloLista");

const btnPendentes = document.getElementById("btnPendentes");
const btnHistorico = document.getElementById("btnHistorico");

const modal = document.getElementById("modal");
const fecharModal = document.getElementById("fecharModal");

const modalCorrecao = document.getElementById("modalCorrecao");
const fecharModalCorrecao = document.getElementById("fecharModalCorrecao");
const cancelarCorrecao = document.getElementById("cancelarCorrecao");
const confirmarCorrecao = document.getElementById("confirmarCorrecao");
document.getElementById("nomeProfessor").textContent = usuario.nome;
const btnAprovar = document.getElementById("btnAprovar");
const btnCorrecao = document.getElementById("btnCorrecao");

const btnDocumento = document.getElementById("btnDocumento");
const btnPDF = document.getElementById("btnPDF");

const btnSair = document.getElementById("btnSair");

let peis = [];
let peiAtual = null;
let moduloAtual = "pendentes";

btnSair.onclick = logout;

document.addEventListener("DOMContentLoaded", () => {
    abrirPendentes();
});

btnPendentes.addEventListener("click", abrirPendentes);
btnHistorico.addEventListener("click", abrirHistorico);

function abrirPendentes() {
    moduloAtual = "pendentes";

    btnPendentes.classList.remove("btn-secondary");
    btnPendentes.classList.add("btn-primary");

    btnHistorico.classList.remove("btn-primary");
    btnHistorico.classList.add("btn-secondary");

    tituloLista.textContent = "PEIs Pendentes";

    subtituloLista.textContent =
        "Planos aguardando aprovação da Coordenação.";

    carregarPEIs();
}

function abrirHistorico() {
    moduloAtual = "historico";

    btnHistorico.classList.remove("btn-secondary");
    btnHistorico.classList.add("btn-primary");

    btnPendentes.classList.remove("btn-primary");
    btnPendentes.classList.add("btn-secondary");

    tituloLista.textContent = "Histórico";

    subtituloLista.textContent =
        "PEIs já analisados pela Coordenação.";

    carregarPEIs();
}

async function carregarPEIs() {
    try {
        listaPEIs.innerHTML = `
            <div class="loading">
                Carregando PEIs...
            </div>
        `;

        if (moduloAtual === "pendentes") {

            peis = await carregarPEIsResponsavel(
                COORDENACAO
            );

        } else {

            peis = await carregarHistoricoCoordenacao(
                COORDENACAO
            );
        }
        renderizarLista();
    }

    catch (erro) {
        console.error(erro);

        listaPEIs.innerHTML = `
        <div class="empty">
            Erro ao carregar os PEIs.
        </div>
    `;

        mostrarToast(
            erro.message || "Erro ao carregar os PEIs.",
            "erro"
        );
    }
}
function renderizarLista() {
    listaPEIs.innerHTML = "";

    let lista = [];

    if (moduloAtual === "pendentes") {

        lista = peis.filter(pei =>
            !pei.CoordenacaoAssinatura ||
            pei.CoordenacaoAssinatura === ""
        );

    } else {

        lista = peis.filter(pei =>
            pei.CoordenacaoAssinatura &&
            pei.CoordenacaoAssinatura !== ""
        );

    }

    if (lista.length === 0) {

        listaPEIs.innerHTML = `
            <div class="empty">
                <h3>Nenhum PEI encontrado.</h3>
            </div>
        `;

        return;
    }
    lista.forEach(criarCard);
}

function criarCard(pei) {
    const card = document.createElement("article");
    card.className = "pei-card";
    card.innerHTML = `

        <h2>${pei.Aluno}</h2>

        <div class="pei-info">

            <div>
                <span>Turma</span>
                <strong>${pei.Turma}</strong>
            </div>

            <div>
                <span>Professor</span>
                <strong>${pei.Professor}</strong>
            </div>

            <div>
                <span>Disciplina</span>
                <strong>${pei.Disciplina}</strong>
            </div>

            <div>
                <span>Bimestre</span>
                <strong>${pei.Bimestre}</strong>
            </div>

        </div>

        <div class="status">

            <strong>Status:</strong>

            ${pei.Status}

        </div>

        <div class="card-actions">

            <button
                class="btn-primary visualizar-pei"
                data-uuid="${pei.UUID}">

                ${moduloAtual === "pendentes"
            ? "Analisar"
            : "Visualizar"}

            </button>

        </div>

    `;

    card
        .querySelector(".visualizar-pei")
        .addEventListener("click", () => abrirModal(pei.UUID));

    listaPEIs.appendChild(card);
}

async function abrirModal(uuid) {
    try {
        peiAtual = await carregarPEI(uuid);

        document.getElementById("modalAluno").textContent =
            peiAtual.Aluno || "-";

        document.getElementById("modalTurma").textContent =
            peiAtual.Turma || "-";

        document.getElementById("modalProfessor").textContent =
            peiAtual.Professor || "-";

        document.getElementById("modalDisciplina").textContent =
            peiAtual.Disciplina || "-";

        document.getElementById("modalBimestre").textContent =
            peiAtual.Bimestre || "-";

        document.getElementById("modalStatus").textContent =
            peiAtual.Status || "-";

        document.getElementById("modalConteudos").textContent =
            peiAtual.Conteudos || "-";

        document.getElementById("modalEstrategias").textContent =
            peiAtual.Estrategias || "-";

        document.getElementById("modalAvaliacao").textContent =
            peiAtual.Avaliacao || "-";

        document.getElementById("modalRecursos").textContent =
            peiAtual.Recursos || "-";


        btnDocumento.style.display = "none";
        btnPDF.style.display = "none";

        if (peiAtual.DocumentoID) {
            btnDocumento.style.display = "inline-flex";
        }

        if (peiAtual.PDFID) {
            btnPDF.style.display = "inline-flex";
        }


        if (moduloAtual === "historico") {

            btnAprovar.style.display = "none";
            btnCorrecao.style.display = "none";

        } else {

            btnAprovar.style.display = "inline-flex";
            btnCorrecao.style.display = "inline-flex";

        }
        modal.classList.add("show");
    }

    catch (erro) {
        console.error(erro);

        mostrarToast(
            erro.message || "Erro ao carregar o PEI.",
            "erro"
        );
    }
}

function fecharModalPrincipal() {
    modal.classList.remove("show");
    peiAtual = null;
}

fecharModal.addEventListener("click", fecharModalPrincipal);

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

modal.addEventListener("click", e => {
    if (e.target === modal) {

        fecharModalPrincipal();
    }
});

btnAprovar.addEventListener("click", async () => {
    if (!peiAtual) return;

    try {
        btnAprovar.disabled = true;
        btnAprovar.textContent = "Enviando...";

        await aprovarCoordenacao(
            peiAtual.UUID,
            COORDENACAO
        );

        fecharModalPrincipal();
        await carregarPEIs();

        mostrarToast(
            "PEI encaminhado para a Vice-Direção.",
            "sucesso"
        );
    }

    catch (erro) {
        console.error(erro);

        mostrarToast(
            erro.message || "Erro ao aprovar o PEI.",
            "erro"
        );
    }

    finally {
        btnAprovar.disabled = false;
        btnAprovar.textContent = "Assinar e encaminhar";
    }
});

btnCorrecao.addEventListener("click", () => {
    modalCorrecao.classList.add("show");
});

function fecharModalCorrecaoJanela() {
    modalCorrecao.classList.remove("show");
    document.getElementById("motivoCorrecao").value = "";
}

fecharModalCorrecao.addEventListener(
    "click",
    fecharModalCorrecaoJanela
);

cancelarCorrecao.addEventListener(
    "click",
    fecharModalCorrecaoJanela
);

modalCorrecao.addEventListener("click", e => {
    if (e.target === modalCorrecao) {

        fecharModalCorrecaoJanela();
    }
});

confirmarCorrecao.addEventListener("click", async () => {
    const motivo = document
        .getElementById("motivoCorrecao")
        .value
        .trim();

    if (!motivo) {

        mostrarToast(
            "Informe o motivo da correção.",
            "aviso"
        );
        return;
    }

    try {
        confirmarCorrecao.disabled = true;
        confirmarCorrecao.textContent = "Enviando...";

        await solicitarCorrecao(
            peiAtual.UUID,
            COORDENACAO,
            motivo
        );

        fecharModalCorrecaoJanela();

        fecharModalPrincipal();

        await carregarPEIs();

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
        confirmarCorrecao.textContent = "Solicitar Correção";

    }
});
