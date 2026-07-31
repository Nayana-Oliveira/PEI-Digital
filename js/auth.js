const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");

if (form) {
    form.addEventListener("submit", realizarLogin);
}

async function realizarLogin(event) {
    event.preventDefault();

    const email = emailInput.value
        .trim()
        .toLowerCase();

    if (!email) {
        mostrarToast(
            "Informe seu e-mail institucional.",
            "aviso"
        );
        return;
    }

    const botaoEntrar = form.querySelector('button[type="submit"]');

    try {
        if (botaoEntrar) {
            botaoEntrar.disabled = true;
            botaoEntrar.textContent = "Entrando...";
        }

        const resposta = await post(
            "login",
            {
                email
            }
        );

        const usuario = {
            ...resposta.dados,

            perfis: (resposta.dados.tipo || "")
                .split(",")
                .map(perfil => perfil.trim())
                .filter(Boolean)
        };

        localStorage.setItem(
            "usuario",
            JSON.stringify(usuario)
        );

        sessionStorage.setItem(
            "toast",
            JSON.stringify({
                mensagem:
                    `Bem-vindo(a), ${usuario.nome}!`,
                tipo: "sucesso"
            })
        );

        redirecionarUsuario(
            usuario.perfis
        );
    }

    catch (erro) {
        console.error(
            "Erro ao realizar login:",
            erro
        );

        mostrarToast(
            erro.message ||
            "Não foi possível realizar o login.",
            "erro"
        );
    }

    finally {
        if (botaoEntrar) {

            botaoEntrar.disabled = false;

            botaoEntrar.textContent =
                "Entrar";
        }
    }
}

function redirecionarUsuario(perfis) {
    if (
        perfis.includes("Curricular") ||
        perfis.includes("AEE") ||
        perfis.includes("Colaborativo")
    ) {
        location.href =
            "professor/";

        return;
    }

    if (
        perfis.includes("Coordenação")
    ) {
        location.href =
            "coordenacao/";

        return;
    }

    if (
        perfis.includes("ViceDireção")
    ) {

        location.href =
            "direcao/";

        return;
    }

    localStorage.removeItem(
        "usuario"
    );

    sessionStorage.removeItem(
        "toast"
    );

    mostrarToast(
        "Perfil de usuário inválido.",
        "erro"
    );
}

function obterUsuario() {
    const dados =
        localStorage.getItem(
            "usuario"
        );

    if (!dados) {
        return null;
    }

    try {
        return JSON.parse(dados);
    }

    catch (erro) {
        console.error(
            "Erro ao carregar usuário:",
            erro
        );

        localStorage.removeItem(
            "usuario"
        );
        return null;
    }
}

function estaLogado() {
    return obterUsuario() !== null;
}


function possuiPerfil(perfil) {
    const usuario =
        obterUsuario();

    if (
        !usuario ||
        !usuario.perfis
    ) {

        return false;

    }

    return usuario.perfis.includes(
        perfil
    );
}

function logout() {
    sessionStorage.clear();

    sessionStorage.setItem(
        "toast",
        JSON.stringify({
            mensagem: "Você saiu da sua conta.",
            tipo: "sucesso"
        })
    );

    localStorage.removeItem("usuario");

    location.href = "../index.html";
}