import { config } from '../config.js';

const { quotesAPI } = config;

/*
  --------------------------------------------------------------------------------------
  Função para buscar frase
  --------------------------------------------------------------------------------------
*/
async function buscarFrase() {
  const response = await fetch(quotesAPI);
  if (!response.ok) {
    const message = `Ocorreu um erro para buscar uma frase`;
    throw new Error(message);
  };
  const frase = await response.json();
  return frase;
}

/*
  --------------------------------------------------------------------------------------
  Função para mostrar frase
  --------------------------------------------------------------------------------------
*/
function mostrarFrase(frase, fraseDiv) {
    console.log(frase)
    fraseDiv.innerHTML = '';
    fraseDiv.innerHTML += `
      <div class='frase-div-frase' id='frase'>
          <p class='frase-div-frase--frase'>${frase.quote}</p>
      </div>
      <div class='frase-div-autor' id='autor'>
          <p class='frase-div-autor--label'>Autor: </p>
          <p class='frase-div-autor--autor'>${frase.author}</p>
      </div>
    `;
    return frase
};

export { buscarFrase, mostrarFrase };