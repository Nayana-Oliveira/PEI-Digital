const usuario = obterUsuario();

if (!usuario || !possuiPerfil("ViceDireção")) {
    location.href = "../index.html";
}

const RESPONSAVEL = usuario.nome;

const lista = document.getElementById("listaPEIs");

const modal = document.getElementById("modal");
const fecharModal = document.getElementById("fecharModal");
const btnFechar = document.getElementById("btnFechar");

const btnAprovar = document.getElementById("btnAprovar");
const btnCorrecao = document.getElementById("btnCorrecao");
const btnDocumento = document.getElementById("btnDocumento");
const btnPDF = document.getElementById("btnPDF");

const modalCorrecao = document.getElementById("modalCorrecao");
const confirmarCorrecao = document.getElementById("confirmarCorrecao");
const cancelarCorrecao = document.getElementById("cancelarCorrecao");
const fecharModalCorrecao = document.getElementById("fecharModalCorrecao");

const btnPendentes = document.getElementById("btnPendentes");
const btnHistorico = document.getElementById("btnHistorico");
const btnSair = document.getElementById("btnSair");

const tituloLista = document.getElementById("tituloLista");
const subtituloLista = document.getElementById("subtituloLista");

document.getElementById("nomeVice").textContent = usuario.nome;

document.getElementById("perfisUsuario").textContent =
    "Perfis: " + usuario.perfis.join(" • ");

btnSair.onclick = logout;

let uuidSelecionado = null;
let peiAtual = null;

let peis = [];
let moduloAtual = "pendentes";

document.addEventListener("DOMContentLoaded", () => {
    abrirPendentes();
});

btnPendentes.addEventListener("click", abrirPendentes);
btnHistorico.addEventListener("click", abrirHistorico);

async function abrirPendentes() {
    moduloAtual = "pendentes";

    btnPendentes.classList.remove("btn-secondary");
    btnPendentes.classList.add("btn-primary");

    btnHistorico.classList.remove("btn-primary");
    btnHistorico.classList.add("btn-secondary");

    tituloLista.textContent = "PEIs Pendentes";

    subtituloLista.textContent =
        "Planos aguardando aprovação da Vice-Direção.";

    await carregarPendentes();
}

async function abrirHistorico() {
    moduloAtual = "historico";

    btnHistorico.classList.remove("btn-secondary");
    btnHistorico.classList.add("btn-primary");

    btnPendentes.classList.remove("btn-primary");
    btnPendentes.classList.add("btn-secondary");

    tituloLista.textContent = "Histórico";

    subtituloLista.textContent =
        "PEIs finalizados pela Vice-Direção.";

    await carregarHistorico();
}

async function carregarPendentes() {
    try {
        lista.innerHTML = `
            <div class="loading">
                Carregando PEIs...
            </div>
        `;

        peis = await carregarPEIsResponsavel("Vice-Direção");

        renderizarLista();
    } catch (erro) {
        console.error("Erro ao carregar pendentes:", erro);

        lista.innerHTML = `
            <div class="empty">
                <h3>Erro ao carregar os PEIs.</h3>
            </div>
        `;

        mostrarToast(
            erro.message || "Não foi possível carregar os PEIs.",
            "erro"
        );
    }
}

async function carregarHistorico() {
    try {

        lista.innerHTML = `
            <div class="loading">
                Carregando histórico...
            </div>
        `;

        peis = await carregarHistoricoVice(
            RESPONSAVEL
        );

        renderizarLista();
    } catch (erro) {
        console.error(
            "Erro ao carregar histórico:",
            erro
        );

        lista.innerHTML = `
            <div class="empty">
                <h3>Erro ao carregar o histórico.</h3>
            </div>
        `;

        mostrarToast(
            erro.message ||
            "Não foi possível carregar o histórico.",
            "erro"
        );
    }
}

function renderizarLista() {
    lista.innerHTML = "";
    if (!peis || !peis.length) {

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
    const card = document.createElement("article");

    card.className = "pei-card";

    const textoBotao =
        moduloAtual === "pendentes"
            ? "Analisar"
            : "Visualizar";

    card.innerHTML = `
        <h2>${pei.Aluno || "-"}</h2>

        <div class="pei-info">

            <div>
                <span>Turma</span>
                <strong>${pei.Turma || "-"}</strong>
            </div>

            <div>
                <span>Disciplina</span>
                <strong>${pei.Disciplina || "-"}</strong>
            </div>

            <div>
                <span>Professor</span>
                <strong>${pei.Professor || "-"}</strong>
            </div>

            <div>
                <span>Bimestre</span>
                <strong>${pei.Bimestre || "-"}</strong>
            </div>

        </div>

        <div class="status">
            <strong>Status:</strong>
            ${pei.Status || "-"}
        </div>

        ${moduloAtual === "historico"
            ? `
        <div class="status">
            <strong>Assinado por:</strong>
            ${pei.ViceResponsavel || "-"}
            <br>
        </div>
    `
            : ""
        }

        <div class="card-actions">

            <button
                class="btn-primary visualizar-pei"
                type="button"
            >
                ${textoBotao}
            </button>

        </div>
    `;

    card
        .querySelector(".visualizar-pei")
        .addEventListener("click", () => {
            abrirModal(pei.UUID);
        });
    lista.appendChild(card);
}

async function abrirModal(uuid) {
    try {
        const pei = await carregarPEI(uuid);
        uuidSelecionado = uuid;
        peiAtual = pei;

        document.getElementById("modalAluno").textContent =
            pei.Aluno || "-";

        document.getElementById("modalTurma").textContent =
            pei.Turma || "-";

        document.getElementById("modalProfessor").textContent =
            pei.Professor || "-";

        document.getElementById("modalDisciplina").textContent =
            pei.Disciplina || "-";

        document.getElementById("modalBimestre").textContent =
            pei.Bimestre || "-";

        document.getElementById("modalStatus").textContent =
            pei.Status || "-";

        document.getElementById("modalConteudos").textContent =
            pei.Conteudos || "-";

        document.getElementById("modalEstrategias").textContent =
            pei.Estrategias || "-";

        document.getElementById("modalAvaliacao").textContent =
            pei.Avaliacao || "-";

        document.getElementById("modalRecursos").textContent =
            pei.Recursos || "-";

        btnDocumento.style.display = "none";
        btnPDF.style.display = "none";

        if (pei.DocumentoID) {
            btnDocumento.style.display = "inline-flex";
        }

        if (pei.PDFID) {
            btnPDF.style.display = "inline-flex";
        }

        if (moduloAtual === "pendentes") {

            btnAprovar.style.display = "inline-flex";
            btnCorrecao.style.display = "inline-flex";

        } else {

            btnAprovar.style.display = "none";
            btnCorrecao.style.display = "none";

        }

        modal.classList.add("show");
    } catch (erro) {
        console.error("Erro ao abrir modal:", erro);

        mostrarToast(
            erro.message || "Não foi possível carregar os dados do PEI.",
            "erro"
        );
    }
}

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

function fecharModalJanela() {
    modal.classList.remove("show");

    uuidSelecionado = null;
    peiAtual = null;
}

fecharModal.addEventListener(
    "click",
    fecharModalJanela
);

btnFechar.addEventListener(
    "click",
    fecharModalJanela
);

modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        fecharModalJanela();
    }
});

btnAprovar.addEventListener(
    "click",
    aprovarAtual
);

async function aprovarAtual() {
    if (!uuidSelecionado) {
        return;
    }

    try {
        btnAprovar.disabled = true;
        btnAprovar.textContent = "Finalizando...";

        await aprovarVice(
            uuidSelecionado,
            RESPONSAVEL
        );
        fecharModalJanela();

        await carregarPendentes();

        mostrarToast(
            `PEI finalizado com sucesso por ${RESPONSAVEL}.`,
            "sucesso"
        );

    } catch (erro) {
        console.error(
            "Erro ao finalizar PEI:",
            erro
        );

        mostrarToast(
            erro.message || "Erro ao finalizar o PEI.",
            "erro"
        );
    } finally {
        btnAprovar.disabled = false;
        btnAprovar.textContent =
            "Assinar e Finalizar";
    }
}

btnCorrecao.addEventListener("click", () => {
    if (!uuidSelecionado) {
        return;
    }

    modalCorrecao.classList.add("show");
});

async function solicitarCorrecaoAtual() {
    if (!uuidSelecionado) {
        return;
    }

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
            uuidSelecionado,
            RESPONSAVEL,
            motivo
        );

        fecharModalCorrecaoJanela();

        fecharModalJanela();

        await carregarPendentes();

        mostrarToast(
            "Correção solicitada ao Professor.",
            "sucesso"
        );

    } catch (erro) {
        console.error(
            "Erro ao solicitar correção:",
            erro
        );

        mostrarToast(
            erro.message || "Erro ao solicitar correção.",
            "erro"
        );

    } finally {
        confirmarCorrecao.disabled = false;
        confirmarCorrecao.textContent =
            "Solicitar Correção";
    }
}

function fecharModalCorrecaoJanela() {
    modalCorrecao.classList.remove("show");

    document.getElementById(
        "motivoCorrecao"
    ).value = "";
}

cancelarCorrecao.addEventListener(
    "click",
    fecharModalCorrecaoJanela
);

fecharModalCorrecao.addEventListener(
    "click",
    fecharModalCorrecaoJanela
);

modalCorrecao.addEventListener("click", (e) => {
    if (e.target === modalCorrecao) {
        fecharModalCorrecaoJanela();
    }
});

confirmarCorrecao.addEventListener(
    "click",
    solicitarCorrecaoAtual
);