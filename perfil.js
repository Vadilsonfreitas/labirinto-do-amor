document.addEventListener("DOMContentLoaded", () => {
  const nomeInput = document.getElementById("nomeJogador");
  const salvarBtn = document.getElementById("salvarNome");
  const resetarBtn = document.getElementById("resetarProgresso");

  // Preenche o nome salvo
  const nomeSalvo = localStorage.getItem("nomeJogador") || "";
  nomeInput.value = nomeSalvo;
  document.getElementById("boasVindas").textContent = `Olá, ${nomeSalvo || "Jogador(a)"}!`;

  // Mostrar estatísticas
  document.getElementById("recorde").textContent = localStorage.getItem("recorde") || "0";
  document.getElementById("ultimaPontuacao").textContent = localStorage.getItem("ultimaPontuacao") || "0";
  document.getElementById("ultimoNivel").textContent = localStorage.getItem("ultimoNivel") || "1";
  document.getElementById("ultimaData").textContent = localStorage.getItem("ultimaData") || "—";

  // Salvar nome
  salvarBtn.addEventListener("click", () => {
    const nome = nomeInput.value.trim();
    if (nome) {
      localStorage.setItem("nomeJogador", nome);
      alert("Nome salvo com sucesso!");
      location.reload(); // recarrega para atualizar saudação
    } else {
      alert("Digite um nome válido.");
    }
  });

  // Resetar progresso
  resetarBtn.addEventListener("click", () => {
    if (confirm("Tem certeza que deseja apagar todo o progresso?")) {
      localStorage.clear();
      alert("Progresso resetado!");
      location.reload();
    }
  });
});
