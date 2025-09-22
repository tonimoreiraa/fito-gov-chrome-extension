async function carregarUsuarios() {
    const select = document.getElementById("userSelect");

    try {
        const response = await fetch("https://fito-form-gov.dpibrasil.com/users");

        if (!response.ok) {
            throw new Error("Erro ao carregar usuários");
        }

        const usuarios = await response.json();

        select.innerHTML = '<option value="">Selecione um usuário</option>';

        usuarios.forEach(usuario => {
            const option = document.createElement("option");
            option.value = usuario.id;
            option.textContent = usuario.name;
            select.appendChild(option);
        });
    } catch (erro) {
        select.innerHTML = '<option value="">Erro ao carregar usuários</option>';
        console.error("Erro:", erro);
    }
}

document.addEventListener("DOMContentLoaded", carregarUsuarios);

document.getElementById("ler").addEventListener("click", async () => {
    const mensagem = document.getElementById("mensagem");
    const userSelect = document.getElementById("userSelect");

    if (!userSelect.value) {
        mensagem.textContent = "Por favor, selecione um usuário";
        mensagem.className = "erro";
        return;
    }

    mensagem.textContent = "Enviando...";
    mensagem.className = "";

    try {
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });

        if (!tab || !tab.url) {
            throw new Error("Aba inválida");
        }

        const url = new URL(tab.url);
        const domain = url.hostname;

        chrome.cookies.getAll({ domain }, async (cookies) => {
        const body = {
            user_id: userSelect.value,
            cookies: cookies.map((cookie) => ({
            name: cookie.name,
            value: cookie.value,
            domain: cookie.domain.replace(/^\./, ""),
            path: "/",
            expires: -1,
            httpOnly: false,
            secure: true,
            sameSite: "Lax"
            }))
        };

        try {
            const response = await fetch(
            "https://fito-form-gov.dpibrasil.com/cookies",
            {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                "Content-Type": "application/json"
                }
            }
            );

            if (!response.ok) {
                throw new Error("Erro ao enviar dados");
            }

            mensagem.textContent = "Cookies enviados com sucesso!";
            mensagem.className = "sucesso";
        } catch (erro) {
            mensagem.textContent = "Erro: " + erro.message;
            mensagem.className = "erro";
        }
        });
    } catch (erro) {
        mensagem.textContent = "Erro: " + erro.message;
        mensagem.className = "erro";
    }
});