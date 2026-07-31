const API_URL =
  "https://script.google.com/macros/s/AKfycbyczuyRyCER8LFCO_KwEZrpi9YgVn2X6WXefyq__AoWxwGBzb15DtLCNUfmbRF0FdOf/exec";

async function get(action) {
  const response = await fetch(`${API_URL}?action=${action}`, {
    method: "GET",
    redirect: "follow"
  });

  if (!response.ok) {
    throw new Error("Erro ao acessar a API.");
  }

  const json = await response.json();

  if (!json.sucesso) {
    throw new Error(json.mensagem);
  }

  return json.dados;
}

async function post(action, dados) {
  const response = await fetch(`${API_URL}?action=${action}`, {
    method: "POST",
    body: JSON.stringify(dados)
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error("Erro ao acessar a API.");
  }

  if (!json.sucesso) {
    throw new Error(json.mensagem);
  }

  return json;
}

async function carregarProfessores() {
  return get("professores");
}

async function carregarProfessoresEspecializados() {
  return get("especializados");
}

async function carregarProfessoresColaborativos() {
  return get("colaborativos");
}

async function carregarCoordenadores() {
  return get("coordenadores");
}

async function carregarVices() {
  return get("vices");
}

async function carregarAlunos() {
  return get("alunos");
}

async function carregarDisciplinas() {
  return get("disciplinas");
}

async function enviarFormulario(dados) {
  return post("criarPEI", dados);
}

async function atualizarPEI(dados) {
  return post("atualizarPEI", dados);
}

async function carregarPEI(uuid) {
  return get(
    `pei&uuid=${encodeURIComponent(uuid)}`
  );
}

async function carregarPEIsProfessor(professor) {
  return get(
    `peisProfessor&professor=${encodeURIComponent(professor)}`
  );
}

async function carregarPEIsResponsavel(responsavel) {
  return get(
    `peisResponsavel&responsavel=${encodeURIComponent(responsavel)}`
  );
}

async function carregarHistoricoAEE(responsavel) {
  return get(
    `historicoAEE&responsavel=${encodeURIComponent(responsavel)}`
  );
}

async function carregarPEIsVice() {
  return get("peisVice");
}

async function aprovarAEE(uuid, responsavel) {
  return post("aprovarAEE", {
    uuid,
    responsavel
  });
}

async function aprovarCoordenacao(uuid, responsavel) {
  return post("aprovarCoordenacao", {
    uuid,
    responsavel
  });
}

async function aprovarVice(uuid, responsavel) {
  return post("aprovarVice", {
    uuid,
    responsavel
  });
}

async function solicitarCorrecao(uuid, responsavel, motivo) {
  return post("solicitarCorrecao", {
    uuid,
    responsavel,
    motivo
  });
}

async function carregarHistoricoCoordenacao(responsavel) {
  return get(
    `historicoCoordenacao&responsavel=${encodeURIComponent(responsavel)}`
  );
}

async function carregarHistoricoVice(responsavel) {
  return get(
    `historicoVice&responsavel=${encodeURIComponent(responsavel)}`
  );
}