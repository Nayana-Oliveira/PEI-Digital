const CAMPOS_OBRIGATORIOS = [
  "professor",
  "especializado",
  "colaborativo",
  "aluno",
  "disciplina",
  "bimestre",
  "conteudos",
  "estrategias",
  "avaliacao",
  "recursos",
];

function limparErros() {
  document.querySelectorAll(".error-message").forEach((erro) => {
    erro.textContent = "";
  });

  document.querySelectorAll(".error").forEach((campo) => {
    campo.classList.remove("error");
  });
}

function mostrarErro(id, mensagem) {
  const campo = document.getElementById(id);

  if (!campo) return;

  campo.classList.add("error");

  const grupo = campo.closest(".form-group");

  if (!grupo) return;

  const erro = grupo.querySelector(".error-message");

  if (erro) {
    erro.textContent = mensagem;
  }
}

function validarCampoObrigatorio(id) {
  const campo = document.getElementById(id);

  if (!campo) return false;

  return String(campo.value).trim() !== "";
}

function validarFormulario() {
  limparErros();

  let valido = true;

  CAMPOS_OBRIGATORIOS.forEach((id) => {
    if (!validarCampoObrigatorio(id)) {
      mostrarErro(id, "Campo obrigatório.");
      valido = false;
    }
  });

  return valido;
}

function obterDadosFormulario() {
  const estudante = alunos.find(
    (a) => a.nome === aluno.value
  );

  if (!estudante) {
    throw new Error("Selecione um estudante.");
  }

  return {
    uuid: uuidPEI,

    professor: usuario.nome,

    especializado: especializado.value,

    colaborativo: colaborativo.value,

    aluno: estudante.nome,

    turma: estudante.turma,

    disciplina: disciplina.value,

    bimestre: document.getElementById("bimestre").value,

    conteudos: document
      .getElementById("conteudos")
      .value
      .trim(),

    estrategias: document
      .getElementById("estrategias")
      .value
      .trim(),

    avaliacao: document
      .getElementById("avaliacao")
      .value
      .trim(),

    recursos: document
      .getElementById("recursos")
      .value
      .trim(),
  };
}