/*
  --------------------------------------------------------------------------------------
  Função para inserir planta no formulário do canteiro
  --------------------------------------------------------------------------------------
*/
const inserirSelectionForm = (planta, form) => {

    let select;
    if (form == "canteiro") {
      select = document.getElementById(`${form}_${planta.estrato}`);
    } else {
      select = document.getElementById(`${form}`);
    }
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
const todasPlantas = async (func, form) => {
    const urlPlantas = 'http://127.0.0.1:5000/plantas';
    fetch(urlPlantas, {
      method: 'get',
    })
        .then((response) => response.json())
        .then((data) => {
            data.plantas.forEach(planta => func(planta, form))
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
todasPlantas(inserirSelectionForm, 'canteiro')
/*
  --------------------------------------------------------------------------------------
  Função para obter a lista das plantas selecionada no servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const criarCanteiro = async () => {

    const emergente = document.getElementById("canteiro_emergente").value;
    const alto = document.getElementById("canteiro_alto").value;
    const medio = document.getElementById("canteiro_medio").value;
    const baixo = document.getElementById("canteiro_baixo").value;

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
  Função para inserir plantas na lista
  --------------------------------------------------------------------------------------
*/
const inserirLista = (planta) => {

    const table = document.getElementById('tabela_resultado');
    const tbody = table.createTBody();
    const linha = tbody.insertRow()

    for (prop in planta) {
        const cel = linha.insertCell();
        cel.innerHTML = planta[prop];
    }
}
/*
  --------------------------------------------------------------------------------------
  Método para ouvir evento de clicar no botão #canteiroBtn (criar canteiro) 
  --------------------------------------------------------------------------------------
*/
document.getElementById("canteiroBtn").addEventListener("click", function(event){
    event.preventDefault()
    criarCanteiro()
    document.getElementById('tabela_resultado').style.display ='block';
}); 
/*
  --------------------------------------------------------------------------------------
  Função para colocar uma planta servidor via requisição POST
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
  Função para adicionar uma nova planta 
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
/*
  --------------------------------------------------------------------------------------
  Função para deletar uma planta do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  let url = `http://127.0.0.1:5000/planta?nome_planta=${item}`;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}
/*
  --------------------------------------------------------------------------------------
  Função para deletar uma planta
  --------------------------------------------------------------------------------------
*/
const removerPlanta = () => {

  const inputNomePlanta = document.getElementById("delete_select").value;

  if (inputNomePlanta === '') {
      alert("O nome da planta deve ser preenchido");
  } else {
    deleteItem(inputNomePlanta)
      console.log(inputNomePlanta)
      alert("Item deletado!")
      document.getElementById('deleteForm').reset();
  }
}
/*
  --------------------------------------------------------------------------------------
  Método para ouvir evento de clicar no botão #delBtn 
  --------------------------------------------------------------------------------------
*/
document.getElementById("delBtn").addEventListener("click", function(event){
  event.preventDefault()
  removerPlanta()
});
/*
  --------------------------------------------------------------------------------------
  Método para ouvir eventos de clicar no botôs .toggleFormBtn
  --------------------------------------------------------------------------------------
*/
const togglesBtns = document.querySelectorAll(".toggleFormBtn")

togglesBtns.forEach(button => {

  button.addEventListener("click", function(event){
    event.preventDefault();
 
    let btnId;
    const btnClass = event.target.className;
    btnClass == "toggleBtnImg"
      ? btnId = event.target.parentNode.id
      : btnId = event.target.id

    const btn = document.getElementById(`${btnId}`);
    
    const icon = document.getElementById(`${btn.children[0].id}`);
    const formId = btnId.substring(0, btnId.indexOf("_"));
    const form = document.getElementById(`${formId}`);
    const table = document.getElementById('tabela_resultado');
    
    if (form.style.display == 'flex') {
      form.style.display='none';
      icon.src = './resources/images/expand_more.svg'
    } else {
      form.style.display='flex';
      table.style.display='none';
      icon.src = './resources/images/expand_less.svg';
      if (formId == "deleteForm") {
        todasPlantas(inserirSelectionForm, 'delete_select')
      }
    }
  }); 
});
