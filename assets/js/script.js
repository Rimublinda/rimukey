const validateForm = document.querySelector(".key-check-form");
const resultDiv = document.querySelector(".result");
const textarea = document.querySelector("#key");

validateForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const keys = textarea.value
    .split("\n")
    .map((k) => k.trim())
    .filter((k) => k.length > 0);

  if (keys.length == 0) {
    alert("Por favor, insira pelo menos uma chave.");
    return;
  }

  resultDiv.innerHTML = "";
  resultDiv.scrollTop = 0;
  const titleValidate = document.createElement("h2");
  titleValidate.classList.add("result__title");
  titleValidate.textContent = "Validando chaves...";
  resultDiv.appendChild(titleValidate);

  for (const key of keys) {
    resultDiv.innerHTML += `
          <div class="result__chave__key">
            <div class="left">
              <i class="fa-solid fa-spinner fa-spin-pulse" style="--color: #e5eb7;"></i>
              <p class="result__chave__key-key">${key.substring(0, 9)}</p>
            </div>
            <div class="right">
              <button class="copy" data-key="${key}">
                <i class="fa-solid fa-copy"></i>
                <span>Copiar</span>
              </button>
            </div>
          </div>
        `;
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const response = await fetch("https://api.openai.com/v1/models", {
        headers: {
          Authorization: `Bearer ${key}`,
        },
      });
      if (response.ok) {
        resultDiv.innerHTML += `
          <div class="result__chave__key">
            <div class="left">
              <i class="fa-solid fa-circle-check" style="--color: #10a37f;"></i>
              <p class="result__chave__key-key">${key.substring(0, 9)}</p>
            </div>
            <div class="right">
              <button class="copy" data-key="${key}">
                <i class="fa-solid fa-copy"></i>
                <span>Copiar</span>
              </button>
            </div>
          </div>
        `;
      } else {
        const errorData = await response.json();
        const msg =
          errorData.error?.message || "Chave inválida ou erro desconhecido";
        console.error(msg);
        resultDiv.innerHTML += `
          <div class="result__chave__key">
            <div class="left">
              <i class="fa-solid fa-xmark" style="--color:#9b111e"></i>
              <p class="result__chave__key-key">${key.substring(0, 9)}</p>
            </div>
            <div class="right">
              <button class="copy" data-key="${key}">
                <i class="fa-solid fa-copy"></i>
                <span>Copiar</span>
              </button>
            </div>
          </div>
        `;
        resultDiv.scrollTop = resultDiv.scrollHeight;
      }
    } catch (error) {
      console.error("Erro ao validar a chave:", error);
    }
  }
});

resultDiv.addEventListener("click", (event) => {
  if (event.target.classList.contains("copy")) {
    const key = event.target.getAttribute("data-key");
    navigator.clipboard
      .writeText(key)
      .then(() => {
        alert("Chave copiada para a área de transferência!");
      })
      .catch((err) => {
        console.error("Erro ao copiar a chave:", err);
      });
  }
});
