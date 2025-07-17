// script.js

document.addEventListener("DOMContentLoaded", () => {
  const abrirMenu = document.getElementById("abrirMenu");
  const menuLateral = document.getElementById("menuLateral");
  const abrirPorta = document.getElementById("abrirPorta");
  const secInicio = document.getElementById("inicio");
  const secJogo = document.getElementById("jogo");
  const cartasContainer = document.getElementById("cartasContainer");
  const cronometro = document.getElementById("cronometro");
  const barraTempo = document.getElementById("barraTempo");
  const temaBtn = document.getElementById("temaBtn");
  const tituloNivel = document.getElementById("tituloNivel");
  const barraVida = document.getElementById("barraVida");
  const coracoesDiv = document.getElementById("coracoesFlutuantes");

  let tempo = 60;
  let intervaloTempo;
  let pontuacao = 0;
  let cartasViradas = [];
  let cartas = [];
  let nivelAtual = 1;
  const totalNiveis = 5;
  let tentativas = 3;
  let recorde = localStorage.getItem("recorde") || 0;

  abrirMenu.addEventListener("click", () => {
    menuLateral.classList.toggle("aberto");
  });

  temaBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
  });

  abrirPorta.addEventListener("click", () => {
    secInicio.style.display = "none";
    secJogo.style.display = "block";
    iniciarJogo();
    gerarCoraçoesFlutuantes();
  });

  function iniciarJogo() {
    atualizarTituloNivel();
    atualizarVida();
    gerarCartas();
    iniciarCronometro();
  }

  function atualizarTituloNivel() {
    tituloNivel.textContent = `Jogo de Memórias - Nível ${nivelAtual}`;
  }

  function gerarCartas() {
    const simbolosBase = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍍', '🥝', '🥥', '🍊', '🍋', '🍈'];
    const pares = nivelAtual + 2;
    const simbolos = simbolosBase.slice(0, pares);
    cartas = [...simbolos, ...simbolos];
    embaralhar(cartas);

    cartasContainer.innerHTML = "";
    cartas.forEach((simbolo, index) => {
      const carta = document.createElement("div");
      carta.classList.add("carta");
      carta.dataset.simbolo = simbolo;
      carta.dataset.index = index;
      carta.textContent = "?";
      carta.addEventListener("click", () => virarCarta(carta));
      cartasContainer.appendChild(carta);
    });
  }

  function virarCarta(carta) {
    if (cartasViradas.length < 2 && !carta.classList.contains("virada")) {
      carta.textContent = carta.dataset.simbolo;
      carta.classList.add("virada");
      cartasViradas.push(carta);
      tocarSom("virar");

      if (cartasViradas.length === 2) {
        verificarPar();
      }
    }
  }

  function verificarPar() {
    const [c1, c2] = cartasViradas;
    if (c1.dataset.simbolo === c2.dataset.simbolo) {
      pontuacao += 10;
      document.getElementById("pontuacao").textContent = `Pontuação: ${pontuacao}`;
      cartasViradas = [];
      tocarSom("acerto");

      if (document.querySelectorAll(".carta:not(.virada)").length === 0) {
        clearInterval(intervaloTempo);
        setTimeout(() => {
          if (nivelAtual < totalNiveis) {
            nivelAtual++;
            alert(`Parabéns! Nível ${nivelAtual} desbloqueado!`);
            iniciarJogo();
          } else {
            fimDeJogo(true);
          }
        }, 1000);
      }
    } else {
      setTimeout(() => {
        c1.textContent = "?";
        c2.textContent = "?";
        c1.classList.remove("virada");
        c2.classList.remove("virada");
        cartasViradas = [];

        tentativas--;
        atualizarVida();

        if (tentativas <= 0) {
          fimDeJogo(false);
        }
      }, 1000);
    }
  }


  function fimDeJogo(venceu) {
    clearInterval(intervaloTempo);

    if (pontuacao > recorde) {
      recorde = pontuacao;
      localStorage.setItem("recorde", recorde);
      alert(`Novo recorde: ${recorde} pontos!`);
    }

    // Salvar progresso
    localStorage.setItem("ultimaPontuacao", pontuacao);
    localStorage.setItem("ultimaData", new Date().toLocaleString());
    localStorage.setItem("ultimoNivel", nivelAtual);

    if (venceu) {
      tocarSom("vitoria");
      alert("💘 Você venceu o Labirinto do Amor!");
    } else {
      alert("😢 Fim de jogo! Você perdeu.");
    }

    reiniciarJogo();
  }

  function atualizarVida() {
    barraVida.innerHTML = "❤️".repeat(tentativas);
  }

  function reiniciarJogo() {
    pontuacao = 0;
    nivelAtual = 1;
    tentativas = 3;
    cartasViradas = [];
    document.getElementById("pontuacao").textContent = `Pontuação: 0`;
    iniciarJogo();
  }

  function embaralhar(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }


  function continuarCronometro() {
  if (intervaloTempo) return; // impede múltiplos intervalos

  intervaloTempo = setInterval(() => {
    tempo--;
    cronometro.textContent = `Tempo: ${tempo}s`;
    barraTempo.style.width = `${(tempo / 60) * 100}%`;

    if (tempo <= 0) {
      clearInterval(intervaloTempo);
      intervaloTempo = null;
      fimDeJogo(false);
    }
  }, 1000);
}


function iniciarCronometro() {
  tempo = 60;
  cronometro.textContent = `Tempo: ${tempo}s`;
  barraTempo.style.width = "100%";

  clearInterval(intervaloTempo);
  continuarCronometro(); // usar a nova função aqui
}


  // Menu lateral
  document.getElementById("pausarBtn").addEventListener("click", () => {
    clearInterval(intervaloTempo);
  });

document.getElementById("continuarBtn").addEventListener("click", continuarCronometro);
document.getElementById("continuarBtn").disabled = true;


  document.getElementById("reiniciarBtn").addEventListener("click", () => {
    reiniciarJogo();
  });

  // Sons
  function tocarSom(tipo) {
    let audio = new Audio();
    if (tipo === "virar") audio.src = "https://cdn.pixabay.com/download/audio/2023/03/20/audio_04fa8fbcdf.mp3";
    if (tipo === "acerto") audio.src = "https://cdn.pixabay.com/download/audio/2022/03/15/audio_47fcf3e14e.mp3";
    if (tipo === "vitoria") audio.src = "https://cdn.pixabay.com/download/audio/2022/01/12/audio_785c4a1312.mp3";
    audio.volume = 0.5;
    audio.play();
  }

  // Corações flutuantes
  function gerarCoraçoesFlutuantes() {
    setInterval(() => {
      const coracao = document.createElement("div");
      coracao.className = "coraçao";
      coracao.textContent = "❤️";
      coracao.style.left = Math.random() * 100 + "vw";
      coracoesDiv.appendChild(coracao);
      setTimeout(() => coracao.remove(), 5000);
    }, 800);
  }
});
