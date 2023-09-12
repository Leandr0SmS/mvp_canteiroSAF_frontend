/*
  --------------------------------------------------------------------------------------
  Função para inserir planta no formulário do canteiro
  --------------------------------------------------------------------------------------
*/
const inserirSelectionForm = (planta, form) => {

  let select;
  if (form == "canteiro") {
    select = document.getElementById(`${form}_${planta.estrato}`);
    const option = document.createElement("option");
    option.text = `${planta.nome_planta}`;
    option.value = `${planta.id_planta}`;
    select.add(option);
  } else {
    select = document.getElementById(`${form}`);
    const option = document.createElement("option");
    option.text = `${planta.nome_planta}`;
    option.value = `${planta.nome_planta}`;
    select.add(option);
  }
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
      .then((response) => {
        if (response.status == 200) {
          return response.json()
        } else {
          alert(`ERRO ${response.status}`)
        }
      })
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

  const canteiro = {
    "emergente": document.getElementById("canteiro_emergente").value,
    "alto": document.getElementById("canteiro_alto").value,
    "medio": document.getElementById("canteiro_medio").value,
    "baixo": document.getElementById("canteiro_baixo").value
  }
  const values = Object.entries(canteiro);
  console.log(values)
  const urlList = [];
  values.map(v => {
    if (urlList.length == 0 && v[1]) {
      urlList.push(`id_planta_${v[0]}=${v[1]}`)
    } else if (v[1]) {
      urlList.push(`&id_planta_${v[0]}=${v[1]}`)
    }
  })
  console.log(urlList)

  let url = 'http://127.0.0.1:5000/canteiro?'
  const urlPlantas = url + urlList.join('');
  //const urlPlantas = `http://127.0.0.1:5000/canteiro?id_planta_emergente=${emergente}&id_planta_alto=${alto}&id_planta_medio=${medio}&id_planta_baixo=${baixo}`;
  console.log(urlPlantas)
  fetch(urlPlantas, {
    method: 'get',
  })
      .then((response) => {
        if (response.status == 200) {
          return response.json()
        } else {
          alert(`ERRO ${response}`)
        }
      })
      .then((data) => {
          const length = data.plantas.length;
          data.plantas.forEach(planta => {
              console.log(planta, length)
              inserirLista(planta, length)
          })
      })
      .catch((error) => {
          console.log(error)
          console.error('Error:' + error);
      });
}
/*
  --------------------------------------------------------------------------------------
  Função para inserir plantas na lista
  --------------------------------------------------------------------------------------
*/
const inserirLista = (planta, length) => {
  const table = document.getElementById('tabela_resultado');
  const tbody = table.createTBody();
  const linha = tbody.insertRow();
  if (!planta) {
    for (len = length; len >= 0; len--) {
      const cel = linha.insertCell();
      cel.innerHTML = "";
    }
  } else {
    for (prop in planta) {
      const cel = linha.insertCell();
      cel.innerHTML = planta[prop];
    }
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
    .then((response) => {
      (response.status === 200)
        ? alert("Item adicionado!")
        : alert(`Erro: ${response.status}`)
    })
    .catch((error) => {
      console.error('Error:', error);
      alert("Erro: ")
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
    .then((response) => {
      response.status === 200
        ? alert("Item Deletado!")
        : alert(`Erro: ${response.status}`)
    })
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
