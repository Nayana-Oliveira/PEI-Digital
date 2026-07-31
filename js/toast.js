function mostrarToast(mensagem, tipo = "sucesso", duracao = 3000) {
    let container = document.getElementById("toastContainer");
    
    if (!container) {

        container = document.createElement("div");

        container.id = "toastContainer";
        container.className = "toast-container";

        document.body.appendChild(container);

    }

    const toast = document.createElement("div");

    toast.className = `toast toast-${tipo}`;

    const icones = {
        sucesso: "fa-circle-check",
        erro: "fa-circle-xmark",
        aviso: "fa-triangle-exclamation",
        info: "fa-circle-info"
    };

    toast.innerHTML = `
        <i class="fa-solid ${icones[tipo] || icones.info}"></i>

        <span></span>

        <button
            type="button"
            class="toast-close"
            aria-label="Fechar">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;

    toast.querySelector("span").textContent = mensagem;

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    let removido = false;

    const removerToast = () => {

        if (removido) {
            return;
        }

        removido = true;

        toast.classList.remove("show");

        setTimeout(() => {
            toast.remove();
        }, 300);

    };

    const timeout = setTimeout(
        removerToast,
        duracao
    );

    toast
        .querySelector(".toast-close")
        .addEventListener("click", () => {

            clearTimeout(timeout);

            removerToast();
        });
}

document.addEventListener("DOMContentLoaded", () => {
    const toastPendente =
        sessionStorage.getItem("toast");

    if (!toastPendente) {
        return;
    }

    try {
        const dados =
            JSON.parse(toastPendente);

        sessionStorage.removeItem("toast");

        mostrarToast(
            dados.mensagem,
            dados.tipo
        );
    } catch (erro) {
        console.error(
            "Erro ao carregar toast:",
            erro
        );

        sessionStorage.removeItem("toast");
    }
});