import { config } from '../config.js';
const { meuCanteiroApi } = config;

/*
  --------------------------------------------------------------------------------------
  Função para adicionar uma planta no servidor via requisição PUT
  --------------------------------------------------------------------------------------
*/
async function putPlanta(
                          inputNomePlanta, 
                          inputNovoEstrato, 
                          inputTempoColheita,
                          inputEspacamento,
                        ) {

  const formData = new FormData();
  
  formData.append('nome_planta', inputNomePlanta);
  formData.append('estrato', inputNovoEstrato);
  formData.append('tempo_colheita', inputTempoColheita);
  formData.append('espacamento', inputEspacamento);

  let url = meuCanteiroApi + '/planta';
  const response = await fetch(url, {
    method: 'put',
    body: formData
  });
  if (!response.ok) {
    throw new Error(`${response.status}`);
  };
  return response
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar uma nova planta 
  --------------------------------------------------------------------------------------
*/
function adicionarPlanta() {
  const inputNomePlanta = document.getElementById('nomePlanta').value;
  const inputNovoEstrato = document.getElementById('novoEstrato').value;
  const inputTempoColheita = document.getElementById('tempoColheita').value;
  const inputEspacamento = document.getElementById('espacamento').value;
  if (inputNomePlanta === '' || inputNovoEstrato === '') {
      alert('O nome da planta e o estrato devem ser preenchidos');
  } else if (isNaN(inputEspacamento)  || isNaN(inputTempoColheita)) {
      alert('Tempo para colheita e espaçamento convencional precisam ser números!');
  } else {
    putPlanta(
          inputNomePlanta, 
          inputNovoEstrato, 
          inputTempoColheita,
          inputEspacamento,
      )
      .then((response) => {
        if (response.status === 200) {
          alert('Item adicionado!')
          window.location.reload();
        } else if (response.status === 409) {
          alert('ERRO: Planta de mesmo nome já salvo na base :/')
        } else {
          alert('ERRO: Não foi possível salvar nova planta :/')
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Erro: ')
      });
  };
};

/*
  --------------------------------------------------------------------------------------
  Função para editar uma planta no servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
async function postPlanta(
                inputEditNomePlanta, 
                inputEditEstrato, 
                inputEditTempoColheita,
                inputEditEspacamento,
              ) {

  const formDataEdit = new FormData();

  formDataEdit.append('nome_planta', inputEditNomePlanta);
  formDataEdit.append('estrato', inputEditEstrato);
  formDataEdit.append('tempo_colheita', inputEditTempoColheita);
  formDataEdit.append('espacamento', inputEditEspacamento);

  let url = meuCanteiroApi + '/planta';
  const response = await fetch(url, {
    method: 'post',
    body: formDataEdit
  });
  if (!response.ok) {
    throw new Error(`${response.status}`);
  };
  return response
}

/*
--------------------------------------------------------------------------------------
Função para editar uma nova planta 
--------------------------------------------------------------------------------------
*/
function editarPlanta() {
  const inputEditNomePlanta = document.getElementById('nomePlantaEdit').value;
  const inputEditEstrato = document.getElementById('editEstrato').value;
  const inputEditTempoColheita = document.getElementById('editTempoColheita').value;
  const inputEditEspacamento = document.getElementById('editEspacamento').value;

  if (inputEditNomePlanta === '') {
    alert('O nome da planta deve ser preenchido');
  } else {
    postPlanta(
      inputEditNomePlanta, 
      inputEditEstrato, 
      inputEditTempoColheita,
      inputEditEspacamento,
    )
    .then((response) => {
      if (response.status === 200) {
        console.log(response)
        alert('Item editado!')
        window.location.reload();
      } else {
        alert('ERRO: Não foi possível editar planta :/')
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Erro: ')
    });
  };
};

/*
  --------------------------------------------------------------------------------------
  Função para deletar uma planta do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
async function deleteItem(item) {
  let url = meuCanteiroApi + `/planta?nome_planta=${item}`;
  const response = await fetch(url, {
    method: 'delete'
  });
  if (!response.ok) {
    throw new Error(`${response.status}`);
  };
  return response;
}
/*
  --------------------------------------------------------------------------------------
  Função para deletar uma planta
  --------------------------------------------------------------------------------------
*/
function removerPlanta() {
  const inputNomeDelPlanta = document.getElementById('delete_select').value;
  if (inputNomeDelPlanta === '') {
    alert('O nome da planta deve ser preenchido');
  } else {
    deleteItem(inputNomeDelPlanta)
      .then((response) => {
        if (response.status == 200) {
          alert('Item Deletado!')
          window.location.reload();
        } else {
          alert(`Erro: ${response.status}`)
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
};

export { adicionarPlanta, editarPlanta, removerPlanta };