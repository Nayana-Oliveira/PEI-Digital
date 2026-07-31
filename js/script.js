const professor = document.getElementById("professor");
const especializado = document.getElementById("especializado");
const colaborativo = document.getElementById("colaborativo");
const aluno = document.getElementById("aluno");
const disciplina = document.getElementById("disciplina");

const peiForm = document.getElementById("peiForm");
const botaoEnviar = peiForm.querySelector('button[type="submit"]');

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const infoNome = document.getElementById("infoNome");
const infoTurma = document.getElementById("infoTurma");
const infoAEE = document.getElementById("infoAEE");
const infoColab = document.getElementById("infoColab");

const warningCard = document.getElementById("warningCard");
const motivoCorrecaoTexto = document.getElementById("motivoCorrecaoTexto");

const usuario = obterUsuario();

if (!usuario) {
  location.href = "../index.html";
}

professor.value = usuario.nome;
professor.readOnly = true;

let alunos = [];
let uuidPEI = null;
let modoEdicao = false;

document.addEventListener("DOMContentLoaded", iniciar);

async function iniciar() {

  configurarAtualizacaoProgresso();
  atualizarProgresso();

  try {
    await carregarSelects();
    await verificarModoEdicao();

  } catch (erro) {

    console.error(erro);

    mostrarToast(
      erro.message || "Erro ao carregar o formulário.",
      "erro"
    );
  }
}

async function carregarSelects() {

  professor.value = usuario.nome;

  alunos = await carregarAlunos();

  preencherSelect(
    aluno,
    alunos,
    "Selecione um estudante"
  );

  const disciplinas = await carregarDisciplinas();

  preencherSelect(
    disciplina,
    disciplinas,
    "Selecione uma disciplina"
  );
}

function preencherSelect(select, lista, placeholder) {
  select.innerHTML = "";

  const option = document.createElement("option");

  option.value = "";
  option.textContent = placeholder;

  select.appendChild(option);

  lista.forEach((item) => {

    const o = document.createElement("option");

    o.value = item.nome;
    o.textContent = item.nome;

    select.appendChild(o);

  });
}

aluno.addEventListener("change", selecionarAluno);

function selecionarAluno() {
  const estudante = alunos.find(
    (a) => a.nome === aluno.value
  );

  if (!estudante) {

    especializado.value = "";
    colaborativo.value = "";

    infoNome.textContent = "Selecione um estudante";
    infoTurma.textContent = "—";
    infoAEE.textContent = "—";
    infoColab.textContent = "—";

    atualizarProgresso();

    return;
  }

  especializado.value = estudante.professorAEE;
  colaborativo.value = estudante.professorColaborativo;

  infoNome.textContent = estudante.nome;
  infoTurma.textContent = estudante.turma;
  infoAEE.textContent = estudante.professorAEE;
  infoColab.textContent = estudante.professorColaborativo;

  atualizarProgresso();
}

async function verificarModoEdicao() {
  const params =
    new URLSearchParams(window.location.search);

  uuidPEI = params.get("uuid");

  if (!uuidPEI) return;

  modoEdicao = true;

  const pei = await carregarPEI(uuidPEI);

  preencherFormulario(pei);

  if (pei.MotivoCorrecao && warningCard) {

    warningCard.style.display = "block";

    motivoCorrecaoTexto.textContent =
      pei.MotivoCorrecao;
  }

  botaoEnviar.textContent = "Salvar Alterações";
}

function preencherFormulario(pei) {
  professor.value = usuario.nome;

  aluno.value = pei.Aluno;

  selecionarAluno();

  disciplina.value = pei.Disciplina;

  document.getElementById("bimestre").value =
    pei.Bimestre;

  document.getElementById("conteudos").value =
    pei.Conteudos || "";

  document.getElementById("estrategias").value =
    pei.Estrategias || "";

  document.getElementById("avaliacao").value =
    pei.Avaliacao || "";

  document.getElementById("recursos").value =
    pei.Recursos || "";

  atualizarProgresso();
}

function configurarAtualizacaoProgresso() {
  const campos = [
    "disciplina",
    "bimestre",
    "conteudos",
    "estrategias",
    "avaliacao",
    "recursos"
  ];

  campos.forEach((id) => {

    const campo = document.getElementById(id);

    if (!campo) return;

    campo.addEventListener(
      "input",
      atualizarProgresso
    );

    campo.addEventListener(
      "change",
      atualizarProgresso
    );

  });
}

function atualizarProgresso() {
  const campos = [
    "aluno",
    "disciplina",
    "bimestre",
    "conteudos",
    "estrategias",
    "avaliacao",
    "recursos"
  ];

  let preenchidos = 0;

  campos.forEach((id) => {

    const campo = document.getElementById(id);

    if (
      campo &&
      campo.value.trim() !== ""
    ) {
      preenchidos++;
    }

  });

  const porcentagem =
    Math.round(
      (preenchidos / campos.length) * 100
    );

  progressFill.style.width =
    porcentagem + "%";

  progressText.textContent =
    porcentagem + "%";
}

peiForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validarFormulario()) {
    return;
  }

  botaoEnviar.disabled = true;

  botaoEnviar.textContent =
    modoEdicao
      ? "Salvando..."
      : "Enviando...";

  try {

    const dados =
      obterDadosFormulario();

    let resposta;

    if (modoEdicao) {
      resposta =
        await atualizarPEI(dados);

    } else {

      resposta =
        await enviarFormulario(dados);

    }

    mostrarToast(
      modoEdicao
        ? "Correção enviada com sucesso!"
        : resposta.mensagem || "PEI enviado com sucesso!"
    );

    setTimeout(() => {

      window.location.href =
        "index.html";

    }, 1000);
  } catch (erro) {
  console.error(erro);

  mostrarToast(
    erro.message || "Erro ao enviar o PEI.",
    "erro"
  );

  botaoEnviar.disabled = false;

  botaoEnviar.textContent =
    modoEdicao
      ? "Salvar Alterações"
      : "Enviar PEI";
}
});

function limparFormulario() {
  peiForm.reset();

  professor.value = usuario.nome;

  especializado.value = "";
  colaborativo.value = "";

  infoNome.textContent =
    "Selecione um estudante";

  infoTurma.textContent = "—";
  infoAEE.textContent = "—";
  infoColab.textContent = "—";

  atualizarProgresso();
}