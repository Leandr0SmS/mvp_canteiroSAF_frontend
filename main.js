/*
  --------------------------------------------------------------------------------------
  Função para inserir planta no formulário do canteiro
  --------------------------------------------------------------------------------------
*/
const inserirCanteiroForm = (planta) => {
    const select = document.getElementById(`select_${planta.estrato}`);
    const option = document.createElement("option");
    option.text = `${planta.nome_planta}`;
    option.value = `${planta.nome_planta}`;
    select.add(option);
}
/*
  --------------------------------------------------------------------------------------
  Função para obter a lista de todas as plantas no servidor via requisição GET 
  e inserir <option> no formulário do canteiro.
  --------------------------------------------------------------------------------------
*/
const todasPlantas = async () => {
    const urlPlantas = 'http://127.0.0.1:5000/plantas';
    fetch(urlPlantas, {
      method: 'get',
    })
        .then((response) => response.json())
        .then((data) => {
            data.plantas.forEach(planta => inserirCanteiroForm(planta))
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
todasPlantas()
/*
  --------------------------------------------------------------------------------------
  Função para obter a lista das plantas selecionada no servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const criarCanteiro = async () => {

    const emergente = document.getElementById("select_emergente").value;
    const alto = document.getElementById("select_alto").value;
    const medio = document.getElementById("select_medio").value;
    const baixo = document.getElementById("select_baixo").value;

    const urlPlantas = `http://127.0.0.1:5000/canteiro?nome_planta_emergente=${emergente}&nome_planta_alto=${alto}&nome_planta_medio=${medio}&nome_planta_baixo=${baixo}`;
    fetch(urlPlantas, {
      method: 'get',
    })
        .then((response) => response.json())
        .then((data) => {
            data.plantas.forEach(planta => {
                inserirLista(planta)
            })
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
/*
  --------------------------------------------------------------------------------------
  Função para inserir plantas na lista apresentada
  --------------------------------------------------------------------------------------
*/
const inserirLista = (planta) => {
    const linha = document.getElementById(`${planta.estrato}`)
    for (prop in planta) {
        const cel = linha.insertCell(-1);
        cel.innerHTML = planta[prop];
    }
}
/*
  --------------------------------------------------------------------------------------
  Método para ouvir evento de clicar no botão #addBtn 
  --------------------------------------------------------------------------------------
*/
document.getElementById("canteiroBtn").addEventListener("click", function(event){
    event.preventDefault()
    criarCanteiro()
    document.getElementById('tabela_resultado').style.visibility='visible';
}); 
/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (
                            inputNomePlanta, 
                            inputNovoEstrato, 
                            inputTempoColheita,
                            inputEspacamento,
                        ) => {
    const formData = new FormData();
    formData.append('nome_planta', inputNomePlanta);
    formData.append('estrato', inputNovoEstrato);
    formData.append('tempo_colheita', inputTempoColheita);
    formData.append('espacamento', inputEspacamento);
  
    let url = 'http://127.0.0.1:5000/planta';
    fetch(url, {
        method: 'post',
        body: formData
    })
        .then((response) => response.json())
        .catch((error) => {
            console.error('Error:', error);
        });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, quantidade e valor 
  --------------------------------------------------------------------------------------
*/
const adicionarPlanta = () => {
    const inputNomePlanta = document.getElementById("nomePlanta").value;
    const inputNovoEstrato = document.getElementById("novoEstrato").value;
    const inputTempoColheita = document.getElementById("tempoColheita").value;
    const inputEspacamento = document.getElementById("espacamento").value;
  
    if (inputNomePlanta === '' || inputNovoEstrato === '') {
        alert("O nome da planta e o estrato devem ser preenchidos");
    } else if (isNaN(inputEspacamento)  || isNaN(inputTempoColheita)) {
        alert("Tempo para colheita e espaçamento convencional precisam ser números!");
    } else {
        postItem(
            inputNomePlanta, 
            inputNovoEstrato, 
            inputTempoColheita,
            inputEspacamento,
        )
        alert("Item adicionado!")
        document.getElementById('addForm').reset();
    }
}
/*
  --------------------------------------------------------------------------------------
  Método para ouvir evento de clicar no botão #addBtn 
  --------------------------------------------------------------------------------------
*/
document.getElementById("addBtn").addEventListener("click", function(event){
    event.preventDefault()
    adicionarPlanta()
}); 