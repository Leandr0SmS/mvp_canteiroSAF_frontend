import { config } from './config.js';
import { procurarIdCidade, buscarPrevisao, mostrarPrevisao } from './modules/previsao-tempo.mjs'
import { adicionarPlanta, editarPlanta, removerPlanta } from './modules/plantas.mjs'

const { meuCanteiroApi } = config;

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

const deleteSelect = document.getElementById('delete_select');
const editSelect = document.getElementById('nomePlantaEdit');
const canteiroForm = document.getElementById('canteiro--form');
const weatherForm = document.getElementById('weatherForm');
const weatherForcastDiv = document.getElementById('weatherForcastDiv');
const grafDiv = document.getElementById('graphDiv');
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
    Método para ouvir evento de clicar no botão #canteiroBtn (criar canteiro) 
    --------------------------------------------------------------------------------------
  */
  canteiroBtn.addEventListener('click', function(event){
    event.preventDefault();

    const canteiro = {
      'nome_canteiro': document.getElementById('canteiro_nome').value,
      'x_canteiro': document.getElementById('canteiro_x').value,
      'y_canteiro': document.getElementById('canteiro_y').value,
      'emergente': document.getElementById('canteiro_emergente').value,
      'alto': document.getElementById('canteiro_alto').value,
      'medio': document.getElementById('canteiro_medio').value,
      'baixo': document.getElementById('canteiro_baixo').value
    };

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
            inserirLista(planta, length)
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
  Função para inserir <option> nos <selects> do formulário do canteiro.
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
}
/*
  --------------------------------------------------------------------------------------
  Função para obter a lista de todas as plantas no servidor via requisição GET 
  e inserir no formulário do canteiro.
  --------------------------------------------------------------------------------------
*/
async function todasPlantas() {
  const urlPlantas = meuCanteiroApi + '/plantas';
  const response = await fetch(urlPlantas);
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  const plantasData = await response.json();
  return plantasData;
}
/*
  --------------------------------------------------------------------------------------
  Função para obter a lista das plantas do canteiro no servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
async function criarCanteiro(canteiro) {

  const params = new URLSearchParams();
  
  for (key in canteiro) {
  	params.append(key, canteiro[key]);
  }
  
  const queryString = params.toString();
  let url = config.meuCanteiroApi + '/canteiro?'
  const urlPlantas = url + queryString;

  const response = await fetch(urlPlantas);
  if (!response.ok) {
    throw new Error(`${response.status}`);
  }

  const canteiroData = await response.json();
  return canteiroData;
};
/*
  --------------------------------------------------------------------------------------
  Função para inserir plantas na tabela do canteiro
  --------------------------------------------------------------------------------------
*/
function inserirLista(planta, length) {
  const tbody = resultTabel.createTBody();
  const linha = tbody.insertRow();
  if (!planta) {
    for (len = length; len >= 0; len--) {
      const cel = linha.insertCell();
      cel.innerHTML = ';'
    }
  } else {
    const props = ['espacamento', 'estrato' , 'nome_planta' , 'sombra', 'tempo_colheita']
    for (const prop in planta) {
      if (props.includes(prop)) {
        const cel = linha.insertCell();
        cel.innerHTML = planta[prop];
      }
    }
  };
};

/*
  --------------------------------------------------------------------------------------
  Função para gerar grafico canteiro
  --------------------------------------------------------------------------------------
*/
function criarGrafico(dados) {
  const fig = {
    data: [],
    layout: {
        xaxis: { range: [0, dados.x_canteiro], constrain: 'domain' },
        yaxis: { range: [0, dados.y_canteiro], constrain: 'domain' },
        autosize: false,
        title: {
          text: dados.nome_canteiro, 
          x: 0.5,                  
          xanchor: 'center',
          font: { size: 15 }      
      }
    }
  };
  // Calcular maximo diametro
  let maxDiameter = 0;
  Object.values(dados.dados_grafico.plantas_canteiro).forEach(plantas => {
      plantas.forEach(planta => {
          maxDiameter = Math.max(maxDiameter, planta.diametro);
      });
  });
  // Calcular refenrencia de tamanho
  const scalingFactor = 5;
  const maxRange = Math.max(dados.x_canteiro, dados.y_canteiro);
  const sizeref = (maxRange / maxDiameter) / scalingFactor;
  // Gerar cores aleatorias
  const numEstratos = Object.keys(dados.dados_grafico.plantas_canteiro).length;
  const colors = Array.from({ length: numEstratos }, () => Math.random());
  // Create traces for each estrato
  Object.entries(dados.dados_grafico.plantas_canteiro).forEach(([estrato, plantas]) => {
    const x = [];
    const y = [];
    const sizes = [];
    const customData = [];

    plantas.forEach(planta => {
        x.push(parseInt(planta.posicao[0], 10));
        y.push(parseInt(planta.posicao[1], 10));
        sizes.push(planta.diametro);
        customData.push([
            planta.nome_planta,
            planta.estrato,
            planta.posicao,
            planta.diametro
        ]);
    });

    fig.data.push({
        type: 'scatter',
        mode: 'markers',
        x: x,
        y: y,
        name: estrato,
        marker: {
            size: sizes,
            sizemode: 'diameter',
            sizeref: sizeref,
            color: colors[0],
            opacity: 0.4,

            colorscale: 'Earth'
        },
        customdata: customData,
        hovertemplate: 
            `<b>Nome</b>: %{customdata[0]}<br>` +
            `<b>Estrato</b>: %{customdata[1]}<br>` +
            `<b>Posicao</b>: %{customdata[2]}<br>` +
            `<b>Diâmetro</b>: %{customdata[3]}` +
            `<extra></extra>` 
    });

    // Gerar plot
    Plotly.newPlot('graphDiv', fig.data, fig.layout);
  });
};