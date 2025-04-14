import { procurarIdCidade, buscarPrevisao, mostrarPrevisao } from './modules/previsao-tempo.js'
import { adicionarPlanta, editarPlanta, removerPlanta } from './modules/plantas.js'
import { 
  todasPlantas, 
  criarCanteiro,
  carregarCanteiros,
  editarCanteiro,
  deletarCanteiro,
  visualizarCanteiro
} from './modules/canteiro.js'
import { buscarFrase, mostrarFrase, traduzirTexto } from './modules/frases.js';

/*
  --------------------------------------------------------------------------------------
  Variaveis
  --------------------------------------------------------------------------------------
*/
const forcastBtn = document.getElementById('searchCityBtn');
const resultTabel = document.getElementById('tabela_resultado');
const addBtn = document.getElementById('addBtn');
const delBtn = document.getElementById('delBtn');
const editBtn = document.getElementById('editBtn');

const toggleBtnSection = document.getElementById('toggleBtnSection');
const toggleBtns = toggleBtnSection.childNodes;

const selectCanteiro = document.getElementById('select-canteiro');
const canteiroActions = document.getElementById('canteiro-actions');
const criarBtn = document.getElementById('criarCanteiroBtn');
const deletarBtn = document.getElementById('deleteCanteiroBtn');
const salvarBtn = document.getElementById('saveCanteiroBtn');
const form = document.getElementById('canteiro--form');
const visualizarBtn = document.getElementById('visualizarCanteiroBtn');
const limparBtn = document.getElementById('limparVisualizacaoBtn');

const canteiroForm = document.getElementById('canteiro--form');
const weatherForm = document.getElementById('weatherForm');
const weatherForcastDiv = document.getElementById('weatherForcastDiv');
const grafDiv = document.getElementById('graphDiv');


const fraseDiv = document.getElementById('frase-container');
const idiomaSelect = document.getElementById('idiomaSelect');

let fraseAtual = null; // Armazena a frase original
let idiomaAtual = 'pt'; // Padrão 

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

let todosCanteiros = [];

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
  
  //Carreando canteiros no selectCanteiros
  carregarCanteiros(selectCanteiro, canteiroActions, canteiroForm)
    .then((canteiros) => {
      todosCanteiros = canteiros;
    });

  /*
  --------------------------------------------------------------------------------------
    Evento para criar novo canteiro
  --------------------------------------------------------------------------------------
  */
  criarBtn.addEventListener('click', () => {
    Plotly.purge('graphDiv');
    limparFormulario();
    document.getElementById('canteiro_nome').readOnly = false;
    salvarBtn.textContent = 'Salvar Canteiro';
    deletarBtn.style.display = 'none';
    form.style.display = 'block';
    visualizarBtn.style.display = 'none';
    limparBtn.style.display = 'none';
  });

  /*
  --------------------------------------------------------------------------------------
    Evento para salvar canteiro
  --------------------------------------------------------------------------------------
  */
  salvarBtn.addEventListener('click', async () => {
    const nomeInput = document.getElementById('canteiro_nome');
    const nome = nomeInput.value;
    const x = parseInt(document.getElementById('canteiro_x').value);
    const y = parseInt(document.getElementById('canteiro_y').value);

    if (!nome || isNaN(x) || isNaN(y)) {
        alert('Nome, X e Y devem ser preenchidos corretamente!');
        return;
    }

    let canteiro;

    // Criação de canteiro com seleção de plantas
    const emergente = document.getElementById('canteiro_emergente').value;
    const alto = document.getElementById('canteiro_alto').value;
    const medio = document.getElementById('canteiro_medio').value;
    const baixo = document.getElementById('canteiro_baixo').value;
    
    if (![emergente, alto, medio, baixo].every(Boolean)) {
        alert('Todos os estratos devem ser selecionados!');
        return;
    }
    
    canteiro = {
        nome_canteiro: nome,
        x_canteiro: x,
        y_canteiro: y,
        id_planta_emergente: emergente,
        id_planta_alto: alto,
        id_planta_medio: medio,
        id_planta_baixo: baixo
    };

    try {
        if (salvarBtn.textContent.includes('Editar')) {
            nomeInput.readOnly = true;
            await editarCanteiro(canteiro);
        } else {
            nomeInput.readOnly = false;
            await criarCanteiro(canteiro);
        }

        alert('Canteiro salvo com sucesso!');
    } catch (e) {
        console.error(e);
        return;
    }

    await carregarCanteiros(
        document.getElementById('select-canteiro'),
        document.getElementById('canteiro-actions'),
        document.getElementById('canteiro--form')
    );

    document.getElementById('canteiro--form').style.display = 'none';
    nomeInput.readOnly = false;
    salvarBtn.textContent = 'Salvar Canteiro';
  });

  /*
  --------------------------------------------------------------------------------------
    Evento para mudanças no select dos canteiros e preencher formulários
  --------------------------------------------------------------------------------------
  */
  selectCanteiro.addEventListener('change', async function () {
    const nomeSelecionado = this.value;
    visualizarBtn.style.display = 'block';
    limparBtn.style.display = 'block';
    Plotly.purge('graphDiv');

    if (!nomeSelecionado) {
        limparFormulario();
        document.getElementById('canteiro_nome').readOnly = false;
        salvarBtn.textContent = 'Salvar Canteiro';
        deletarBtn.style.display = 'none';
        form.style.display = 'block';
        return;
    }

    todosCanteiros = await carregarCanteiros(
      document.getElementById('select-canteiro'),
      document.getElementById('canteiro-actions'),
      document.getElementById('canteiro--form')
    );
    const canteiroSelecionado = todosCanteiros.find(c => c.nome_canteiro === nomeSelecionado);

    if (!canteiroSelecionado) {
        alert("Canteiro não encontrado na lista.");
        return;
    }

    preencherFormulario(canteiroSelecionado);
    deletarBtn.style.display = 'inline-block';
    form.style.display = 'block';
  });


  /*
  --------------------------------------------------------------------------------------
    Função que preenche formulários
  --------------------------------------------------------------------------------------
  */
  function preencherFormulario(c) {

    // Preenche os campos
    const nomeInput = document.getElementById('canteiro_nome');
    nomeInput.value = c.nome_canteiro;
    nomeInput.readOnly = true; // impede alterações no nome

    document.getElementById('canteiro_x').value = c.x_canteiro;
    document.getElementById('canteiro_y').value = c.y_canteiro;

    // Define o modo de edição
    const salvarBtn = document.getElementById('saveCanteiroBtn');
    salvarBtn.textContent = 'Editar Canteiro';

    const plantas = c.plantas_canteiro?.plantas || [];
    const estratos = ['emergente', 'alto', 'medio', 'baixo'];

    estratos.forEach(estrato => {
        const select = document.getElementById(`canteiro_${estrato}`);
        const planta = plantas.find(p => p.estrato.toLowerCase() === estrato);

        if (planta && select) {
            for (let i = 0; i < select.options.length; i++) {
                const option = select.options[i];
                if (option.textContent.trim().toLowerCase() === planta.nome_planta.trim().toLowerCase()) {
                    select.selectedIndex = i;
                    break;
                }
            }
        }
    });
  }

  /*
  --------------------------------------------------------------------------------------
    Evento para deletar canteiro
  --------------------------------------------------------------------------------------
  */
  deletarBtn.addEventListener('click', async () => {
    const nomeInput = document.getElementById('canteiro_nome');
    const nomeCanteiro = nomeInput.value;

    if (!nomeCanteiro) {
        alert("Selecione um canteiro para deletar.");
        return;
    }

    const confirmar = confirm(`Tem certeza que deseja deletar o canteiro "${nomeCanteiro}"?`);

    if (!confirmar) return;

    try {
        await deletarCanteiro(nomeCanteiro);

        // Pós deleção
        Plotly.purge('graphDiv'); // limpa gráfico se houver
        deletarBtn.style.display = 'none';
        document.getElementById('limparVisualizacaoBtn').style.display = 'none';

        // Recarrega o select
        todosCanteiros = await carregarCanteiros(
            document.getElementById('select-canteiro'),
            document.getElementById('canteiro-actions'),
            document.getElementById('canteiro--form')
        );

        // Limpa seleção
        limparFormulario();

    } catch (err) {
        console.warn("Erro ao tentar deletar:", err);
    }
  });

  /*
    --------------------------------------------------------------------------------------
    Evento para Visualizar canteiro
    --------------------------------------------------------------------------------------
  */
  visualizarBtn.addEventListener('click', () => {
    const selectNome = document.getElementById('canteiro_nome');
    const nomeCanteiro = selectNome.value;

    if (!nomeCanteiro) {
        alert("Selecione um canteiro.");
        return;
    }

    visualizarCanteiro(nomeCanteiro);
    document.getElementById('limparVisualizacaoBtn').style.display = 'inline-block';
  });

  limparBtn.addEventListener('click', () => {
    const selectNome = document.getElementById('canteiro_nome');
    // Limpa o conteúdo do gráfico
    Plotly.purge('graphDiv');

    // Opcional: esconder o botão novamente
    limparBtn.style.display = 'none';
    // Resetar UI pós-salvamento
    document.getElementById('canteiro--form').style.display = 'none';
    selectNome.readOnly = false;
    salvarBtn.textContent = 'Salvar Canteiro';
    
    carregarCanteiros(
        document.getElementById('select-canteiro'),
        document.getElementById('canteiro-actions'),
        document.getElementById('canteiro--form')
    );
  });

  // Carrega ao iniciar
  carregarFrase();

  // Atualiza apenas tradução ao trocar idioma
  idiomaSelect.addEventListener('change', atualizarTraducao);

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

/*
  --------------------------------------------------------------------------------------
  Função para limpar formulário canteiro.
  --------------------------------------------------------------------------------------
*/
function limparFormulario() {
  document.getElementById('canteiro_nome').value = '';
  document.getElementById('canteiro_x').value = '';
  document.getElementById('canteiro_y').value = '';

  const estratos = ['baixo', 'medio', 'alto', 'emergente'];
  estratos.forEach(estrato => {
      const select = document.getElementById(`canteiro_${estrato}`);
      if (select) select.value = '';
  });
}
/*
  --------------------------------------------------------------------------------------
  Carregar nova frase
  --------------------------------------------------------------------------------------
*/
async function carregarFrase() {
  try {
    idiomaAtual = idiomaSelect.value;
    fraseAtual = await buscarFrase();
    await mostrarFrase(fraseAtual, fraseDiv, idiomaAtual);
  } catch (error) {
    console.error('Erro ao carregar frase:', error);
  }
}

/*
  --------------------------------------------------------------------------------------
  Traduzir frase existente ao mudar idioma
  --------------------------------------------------------------------------------------
*/
async function atualizarTraducao() {
  if (!fraseAtual) return;

  idiomaAtual = idiomaSelect.value;
  try {
    const fraseTraduzida = await traduzirTexto(fraseAtual.quote, idiomaAtual);

    fraseDiv.querySelector('.frase-div-frase--frase').innerText = fraseTraduzida;
  } catch (error) {
    console.error('Erro ao traduzir:', error);
    fraseDiv.querySelector('.frase-div-frase--frase').innerText = 'Erro ao traduzir frase.';
  }
}