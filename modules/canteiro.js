import { config } from '../config.js';
const { meuCanteiroApi } = config;

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
    const url = config.meuCanteiroApi + '/canteiro';

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(canteiro)
        });

        const data = await response.json();

        if (!response.ok) {
            switch (response.status) {
                case 400:
                    alert("Erro nos dados enviados. Verifique o formulário.");
                    break;
                case 404:
                    alert("Alguma das plantas selecionadas não foi encontrada.");
                    break;
                case 409:
                    alert("Já existe um canteiro com esse nome. Escolha outro nome.");
                    break;
                default:
                    alert(`Erro inesperado: ${data.message || response.statusText}`);
                    break;
            }
            throw new Error(`Erro ao criar canteiro: ${response.status}`);
        }

        return data;

    } catch (error) {
        console.error("Erro de rede ou na API:", error);
        alert("Erro de conexão com o servidor. Verifique sua internet ou tente mais tarde.");
        throw error;
    }
}
/*
  --------------------------------------------------------------------------------------
  Função para inserir plantas na tabela do canteiro
  --------------------------------------------------------------------------------------
*/
function inserirLista(planta, length, resultTabel) {

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
            xaxis: { 
                range: [0, dados.x_canteiro], 
                constrain: 'domain',
                scaleanchor: 'y' 
            },
            yaxis: { range: [0, dados.y_canteiro], constrain: 'domain' },
            autosize: false,
            dragmode: 'zoom',
            hovermode: 'closest',
            title: {
                text: dados.nome_canteiro,
                x: 0.5,
                xanchor: 'center',
                font: { size: 15 }
            },
            updatemenus: [{
                type: "buttons",
                showactive: false,
                y: 1.15,
                x: 1,
                xanchor: "right",
                yanchor: "top",
                direction: "left",
                buttons: [{
                    label: "Play",
                    method: "animate",
                    args: [null, {
                        fromcurrent: true,
                        frame: { duration: 0.5, redraw: true },
                        transition: { duration: 0.1 }
                    }]
                }, {
                    label: "Pause",
                    method: "animate",
                    args: [[null], {
                        mode: "immediate",
                        transition: { duration: 0 },
                        frame: { duration: 0 }
                    }]
                }]
            }],
            sliders: [{
                pad: { t: 30 },
                currentvalue: {
                    visible: true,
                    prefix: "Dia: ",
                    xanchor: "right",
                    font: { size: 14 }
                },
                steps: []
            }],
            legend: {  
                font: {
                    size: 10
                },
                orientation: 'h',
                x: 0.5,
                xanchor: 'center', 
                y: -0.1  
            }
        },
        frames: []
    };

    // Escala de cores
    const colorMap = {
        emergente: 'green',
        alto: 'darkorange',
        medio: 'royalblue',
        baixo: 'purple'
    };

    // Coletar todas as plantas
    const plantasPorEstrato = {};
    let maxDiameter = 0;
    let maxDias = 0;

    Object.entries(dados.dados_grafico).forEach(([estrato, plantas]) => {
        plantasPorEstrato[estrato] = [];
        plantas.forEach(planta => {
            maxDiameter = Math.max(maxDiameter, planta.diametro);
            maxDias = Math.max(maxDias, planta.tempo_colheita);
            plantasPorEstrato[estrato].push(planta);
        });
    });

    // Criar frames (um para cada dia)
    for (let dia = 0; dia <= maxDias; dia++) {
        const frameData = [];

        Object.entries(plantasPorEstrato).forEach(([estrato, plantas]) => {
            const x = [];
            const y = [];
            const sizes = [];
            const customData = [];

            plantas.forEach(planta => {
                x.push(parseInt(planta.posicao[0], 10));
                y.push(parseInt(planta.posicao[1], 10));

                // Tamanho cresce até o valor real
                const diametro = planta.diametro;
                const tempo = planta.tempo_colheita;
                const ciclo = dia % tempo;
                const tamanhoAtual = (diametro * ciclo / tempo);

                sizes.push(tamanhoAtual);
                customData.push([
                    planta.nome_planta,
                    planta.estrato,
                    planta.posicao,
                    planta.diametro,
                    planta.tempo_colheita
                ]);
            });
            frameData.push({
                type: 'scatter',
                mode: 'markers',
                x: x,
                y: y,
                name: `${estrato} > ${plantas[0].nome_planta}`,
                marker: {
                    size: sizes,
                    sizemode: 'diameter',
                    sizeref: 2,
                    color: colorMap[estrato] || 'gray',
                    opacity: 0.4,
                    line: { width: 1, color: '#000' }
                },
                customdata: customData,
                hovertemplate:
                    `<b>Nome</b>: %{customdata[0]}<br>` +
                    `<b>Estrato</b>: %{customdata[1]}<br>` +
                    `<b>Posição</b>: %{customdata[2]}<br>` +
                    `<b>Diâmetro</b>: %{customdata[3]}<br>` +
                    `<b>Colheita (dias)</b>: %{customdata[4]}` +
                    `<extra></extra>`
            });
        });

        fig.frames.push({
            name: dia.toString(),
            data: frameData
        });

        fig.layout.sliders[0].steps.push({
            label: dia.toString(),
            method: "animate",
            args: [[dia.toString()], {
                mode: "immediate",
                frame: { duration: 300, redraw: true },
                transition: { duration: 200 }
            }]
        });
    }

    // Adiciona os dados iniciais (dia 0)
    fig.data = fig.frames[0].data;

    Plotly.newPlot('graphDiv', fig.data, fig.layout).then(() => {
        Plotly.addFrames('graphDiv', fig.frames);
    });
};

/*
  --------------------------------------------------------------------------------------
  Função que solicita plantas destribuidas com informaçoes para visualizar o canteiro
  --------------------------------------------------------------------------------------
*/
async function visualizarCanteiro(nomeCanteiro) {
    try {
        const response = await fetch(`${config.meuCanteiroApi}/canteiro?nome_canteiro=${encodeURIComponent(nomeCanteiro)}`);

        if (!response.ok) {
            if (response.status === 404) {
                alert("Canteiro não encontrado!");
            } else {
                alert("Erro ao buscar o canteiro.");
            }
            return;
        }

        const dadosCanteiro = await response.json();
        dadosCanteiro.dados_grafico = dadosCanteiro.plantas_destribuidas;

        criarGrafico(dadosCanteiro);
    } catch (error) {
        console.error("Erro ao visualizar canteiro:", error);
        alert("Erro de conexão com a API.");
    }
}

/*
  --------------------------------------------------------------------------------------
  Função para buscar todos os canteiros
  --------------------------------------------------------------------------------------
*/
async function carregarCanteiros(select, actions, form) {
    try {
        const response = await fetch(`${config.meuCanteiroApi}/canteiros`);
        const data = await response.json();

        const dataCanteiros = data.canteiro;

        select.innerHTML = `<option value="">Selecione um canteiro</option>`;

        dataCanteiros.forEach(c => {
            const option = document.createElement('option');
            option.value = c.nome_canteiro;
            option.textContent = c.nome_canteiro;
            select.appendChild(option);
        });

        actions.style.display = dataCanteiros.length > 0 ? 'block' : 'none';
        form.style.display = 'none';
        return dataCanteiros

    } catch (err) {
        console.error("Erro ao carregar canteiros:", err);
        alert("Não foi possível carregar os canteiros existentes.");
    }
}

/*
  --------------------------------------------------------------------------------------
  Função para editar uma canteiro
  --------------------------------------------------------------------------------------
*/
async function editarCanteiro(canteiro) {
    const formData = new FormData();

    formData.append('nome_canteiro', canteiro.nome_canteiro);
    formData.append('x_canteiro', canteiro.x_canteiro);
    formData.append('y_canteiro', canteiro.y_canteiro);
    
    // Adiciona os IDs das plantas de cada estrato
    formData.append('id_planta_emergente', canteiro.id_planta_emergente);
    formData.append('id_planta_alto', canteiro.id_planta_alto);
    formData.append('id_planta_medio', canteiro.id_planta_medio);
    formData.append('id_planta_baixo', canteiro.id_planta_baixo);

    try {
        const response = await fetch(`${config.meuCanteiroApi}/canteiro`, {
            method: 'POST', 
            body: new URLSearchParams(formData)
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Erro ao editar canteiro.");
            throw new Error(data.message || "Erro ao editar canteiro.");
        }

        alert("Canteiro editado com sucesso!");
        return data;

    } catch (error) {
        console.error("Erro ao editar canteiro:", error);
        alert("Erro de conexão ao editar o canteiro.");
        throw error;
    }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um canteiro
  --------------------------------------------------------------------------------------
*/
async function deletarCanteiro(nomeCanteiro) {
    const url = `${meuCanteiroApi}/canteiros?nome_canteiro=${encodeURIComponent(nomeCanteiro)}`;

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Erro ao deletar canteiro.");
            throw new Error(data.message || "Erro ao deletar canteiro.");
        }

        alert(data.message || "Canteiro deletado com sucesso.");
        return data;

    } catch (error) {
        console.error("Erro ao deletar canteiro:", error);
        alert("Erro de conexão ao deletar o canteiro.");
        throw error;
    }
}

export { 
    todasPlantas, 
    criarCanteiro,
    carregarCanteiros,
    editarCanteiro,
    deletarCanteiro,
    inserirLista,
    criarGrafico,
    visualizarCanteiro
};
