import { procurarIdCidade, buscarPrevisao, mostrarPrevisao } from './modules/previsao-tempo.js'
import { adicionarPlanta, editarPlanta, removerPlanta } from './modules/plantas.js'
import { todasPlantas, criarCanteiro, inserirLista, criarGrafico } from './modules/canteiro.js'
import { buscarFrase, mostrarFrase } from './modules/frases.js';

/*
  --------------------------------------------------------------------------------------
  Variaveis
  --------------------------------------------------------------------------------------
*/
const forcastBtn = document.getElementById('searchCityBtn');
const canteiroBtn = document.getElementById('canteiroBtn');
const resultTabel = document.getElementById('tabela_resultado');
const addBtn = document.getElementById('addBtn');
const delBtn = document.getElementById('delBtn');
const editBtn = document.getElementById('editBtn');

const toggleBtnSection = document.getElementById('toggleBtnSection');
const toggleBtns = toggleBtnSection.childNodes;

const canteiroForm = document.getElementById('canteiro--form');
const weatherForm = document.getElementById('weatherForm');
const weatherForcastDiv = document.getElementById('weatherForcastDiv');
const grafDiv = document.getElementById('graphDiv');


const fraseDiv = document.getElementById('frase-container');
const idiomaSelect = document.getElementById('idiomaSelect');

const resultTableRaw = `
                        <thead>
                          <tr>
                              <th>Espaçamento (cm)</th>
                              <th>Estrato</th>
                              <th>Nome</th>
                              <th>Sombra (%)</th>
                              <th>Dias Colheita</th>
                          </tr>
                        </thead>
                      `;

/*
  --------------------------------------------------------------------------------------
  Função para iniciar o ambiente e os eventos
  --------------------------------------------------------------------------------------
*/
start();

function start() {
 // Adiciona plantas ao formulário do canteiro
  todasPlantas()
    .then((data) => {
      data.plantas.forEach(planta => inserirSelectionForm(planta, 'canteiro'))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
/*
  --------------------------------------------------------------------------------------
  Carregar nova frase
  --------------------------------------------------------------------------------------
*/
async function carregarFrase() {
  try {
    const idioma = idiomaSelect.value;
    const frase = await buscarFrase();
    await mostrarFrase(frase, fraseDiv, idioma);
  } catch (error) {
    console.error('Erro ao carregar frase:', error);
  }
}

// Carrega ao iniciar
carregarFrase();

// Atualiza ao trocar idioma
idiomaSelect.addEventListener('change', carregarFrase);
  
  /*
    --------------------------------------------------------------------------------------
    Método para ouvir evento de clicar no botão #canteiroBtn (criar canteiro) 
    --------------------------------------------------------------------------------------
  */
  canteiroBtn.addEventListener('click', function(event){
    event.preventDefault();

    const canteiro = {
      'nome_canteiro': document.getElementById('canteiro_nome').value,
      'x_canteiro': document.getElementById('canteiro_x').value,
      'y_canteiro': document.getElementById('canteiro_y').value,
      'id_planta_emergente': document.getElementById('canteiro_emergente').value,
      'id_planta_alto': document.getElementById('canteiro_alto').value,
      'id_planta_medio': document.getElementById('canteiro_medio').value,
      'id_planta_baixo': document.getElementById('canteiro_baixo').value
    };

    console.log(canteiro)

    if (!Object.values(canteiro).every(v => Boolean(v))) {
      alert('Todos os campos devem ser preenchidos!')
      resultTabel.innerHTML = resultTableRaw;
      resultTabel.style.display = 'none';
      grafDiv.innerHTML = '';
      return
    }

    if (canteiroBtn.textContent === 'Criar Canteiro') {
      resultTabel.innerHTML = resultTableRaw;
      criarCanteiro(canteiro)      
        .then((data) => {
          const length = data.plantas.length;
          data.plantas.forEach(planta => {
            inserirLista(planta, length, resultTabel)
          })
          criarGrafico(data)
        })
        .catch((error) => {
          console.error('Error:' + error);
        });
      resultTabel.style.display ='block';
      canteiroBtn.innerText = 'Refazer Canteiro';
    } else if (canteiroBtn.textContent === 'Refazer Canteiro') {
      resultTabel.innerHTML = resultTableRaw;
      resultTabel.style.display = 'none';
      grafDiv.innerHTML = '';
      canteiroForm.reset();
      canteiroBtn.innerText = 'Criar Canteiro';
    }
  }); 

  /*
    --------------------------------------------------------------------------------------
    Método para ouvir evento de clicar no botão #addBtn (Adicionar)
    --------------------------------------------------------------------------------------
  */
  addBtn.addEventListener('click', function(event){
      event.preventDefault();
      adicionarPlanta();
  }); 

  /*
    --------------------------------------------------------------------------------------
    Método para ouvir evento de clicar no botão #editBtn (Editar)
    --------------------------------------------------------------------------------------
  */
    editBtn.addEventListener('click', function(event){
      event.preventDefault();
      editarPlanta();
  });

  /*
    --------------------------------------------------------------------------------------
    Método para ouvir evento de clicar no botão #delBtn (deletar)
    --------------------------------------------------------------------------------------
  */
  delBtn.addEventListener('click', function(event){
    event.preventDefault();
    removerPlanta();
  });
    /*
    --------------------------------------------------------------------------------------
    Método para eventos de clicar nos .searchCityBtn 
    --------------------------------------------------------------------------------------
  */
  forcastBtn.addEventListener('click', async function () {
    const cityName = document.getElementById('cityWeather').value;
    const forcastDaysInput = document.getElementById('forcastDays').value;

    if (forcastBtn.textContent === 'Retornar') {
      weatherForm.reset();
      weatherForcastDiv.innerHTML = '';
      forcastBtn.innerText = 'Previsão';
      weatherForm.style.display = 'flex';
    } else if (forcastBtn.textContent === 'Previsão') {
      if (cityName === '') {
        alert('O nome da cidade deve ser preenchido.');
      } else if (forcastDaysInput > 6) {
        alert('O número máximo de dias é 6.');
      } else {
        const cityId = await procurarIdCidade(cityName);
        const data = await buscarPrevisao(cityId, forcastDaysInput);
        mostrarPrevisao(data);
        forcastBtn.innerText = 'Retornar';
      }
    } else {
      throw new Error('No button value');
    }
  });
  /*
    --------------------------------------------------------------------------------------
    Método para ouvir eventos de clicar nos .toggleFormBtn 
    --------------------------------------------------------------------------------------
  */
  toggleBtns.forEach(button => {
    button.addEventListener('click', function toggleBtnLogic(event){
      event.preventDefault();
    
      const btnClass = event.target.className;
      //propagar click para icone
      let btnId;
      btnClass == 'toggleBtnImg'
        ? btnId = event.target.parentNode.id
        : btnId = event.target.id;
      
      // Seleionar botão e icone
      const btn = document.getElementById(`${btnId}`);
      const icon = document.getElementById(`${btn.children[0].id}`);
      // Selecionar formulário 
      const formId = btnId.substring(0, btnId.indexOf('_'));
      const form = document.getElementById(`${formId}`);
      // Pegar o primeiro <select> no form
      const firstSelect = form.querySelectorAll("select")[0];
    
      // Mudar icone no click
      if (btn.value == 'true') {
        form.style.display='none';
        icon.src = './resources/images/expand_more.svg';
        btn.value = 'false'
      } else if (btn.value == 'false') {
        // Esconder fomrularios não usados
        toggleBtns.forEach(b => {
          if (b.value == 'true') {
            b.value = 'false'
            // Selecionar e esconder formulários.
            const fId = b.id.substring(0, b.id.indexOf('_'));
            const f = document.getElementById(`${fId}`);
            f.style.display='none';
            // Seleionar e trocar icones
            const i = document.getElementById(`${b.children[0].id}`);
            i.src = './resources/images/expand_more.svg';
          };
        });
        form.style.display='flex';
        icon.src = './resources/images/expand_less.svg';
        btn.value = 'true'
        // Inserir nome das plantas no primeiro option do formulário
        if (firstSelect && firstSelect.childElementCount == 0) {
          todasPlantas()
            .then((data) => {
              data.plantas.forEach(planta => inserirSelectionForm(planta, firstSelect.id))
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        }
      } else {
        throw new Error('No button value');
      }
    }); 
  });

}

/*
  --------------------------------------------------------------------------------------
  Função para inserir <option> nos <selects> dos formulários.
  --------------------------------------------------------------------------------------
*/
function inserirSelectionForm(planta, formId) {

  let select;
  if (formId == 'canteiro') {
    select = document.getElementById(`${formId}_${planta.estrato}`);
    const option = document.createElement('option');
    option.text = `${planta.nome_planta}`;
    option.value = `${planta.id_planta}`;
    select.add(option);
  } else {
    select = document.getElementById(`${formId}`);
    const option = document.createElement('option');
    option.text = `${planta.nome_planta}`;
    option.value = `${planta.nome_planta}`;
    select.add(option);
  }
};