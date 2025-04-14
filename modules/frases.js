import { config } from '../config.js';

const { quotesAPI, MyMemorytranlateAPI } = config;

/*
  --------------------------------------------------------------------------------------
  Buscar frase da API
  --------------------------------------------------------------------------------------
*/
async function buscarFrase() {
  const response = await fetch(quotesAPI);
  if (!response.ok) {
    throw new Error('Erro ao buscar frase');
  }
  const frase = await response.json();
  return frase;
}

/*
  --------------------------------------------------------------------------------------
  Traduzir usando API MyMemory
  --------------------------------------------------------------------------------------
*/
async function traduzirTexto(texto, destino = 'pt') {
  const url = `${MyMemorytranlateAPI}get?q=${encodeURIComponent(texto)}&langpair=en|${destino}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Erro ao traduzir texto');
  }

  const data = await response.json();
  return data.responseData.translatedText;
}

/*
  --------------------------------------------------------------------------------------
  Mostrar frase com tradução
  --------------------------------------------------------------------------------------
*/
async function mostrarFrase(frase, fraseDiv, idioma = 'pt') {
  // Mostra "Carregando..."
  fraseDiv.innerHTML = `
    <div class='frase-div-frase' id='frase'>
      <p class='frase-div-frase--frase'><em>Traduzindo frase...</em></p>
    </div>
    <div class='frase-div-autor' id='autor'>
      <p class='frase-div-autor--label'>Autor: </p>
      <p class='frase-div-autor--autor'>${frase.author}</p>
    </div>
  `;

  try {
    const fraseTraduzida = await traduzirTexto(frase.quote, idioma);

    fraseDiv.innerHTML = `
      <div class='frase-div-frase' id='frase'>
          <p class='frase-div-frase--frase'>${fraseTraduzida}</p>
      </div>
      <div class='frase-div-autor' id='autor'>
          <p class='frase-div-autor--label'>Autor: </p>
          <p class='frase-div-autor--autor'>${frase.author}</p>
      </div>
    `;
  } catch (error) {
    fraseDiv.innerHTML = `
      <div class='frase-div-frase' id='frase'>
          <p class='frase-div-frase--frase'><em>Erro ao traduzir frase.</em></p>
      </div>
    `;
    console.error('Erro ao traduzir:', error);
  }

  return frase;
}

export { buscarFrase, mostrarFrase, traduzirTexto };
