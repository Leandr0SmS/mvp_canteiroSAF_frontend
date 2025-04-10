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

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(canteiro)
    });

    if (!response.ok) {
        throw new Error(`Erro ao criar canteiro: ${response.status}`);
    }

    const canteiroData = await response.json();
    return canteiroData;
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
    const frames = [];
    const fig = {
        data: [],
        layout: {
            xaxis: { range: [0, dados.x_canteiro], constrain: 'domain' },
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
            }]
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

    const scalingFactor = 5;
    const maxRange = Math.max(dados.x_canteiro, dados.y_canteiro);
    const sizeref = (maxRange / maxDiameter) / scalingFactor;

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
                const tamanhoAtual = dia >= tempo
                    ? diametro
                    : (diametro * dia / tempo);

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
                name: estrato,
                marker: {
                    size: sizes,
                    sizemode: 'diameter',
                    sizeref: sizeref,
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


export { todasPlantas, criarCanteiro, inserirLista, criarGrafico };