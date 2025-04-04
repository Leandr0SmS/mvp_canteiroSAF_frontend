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

    const params = new URLSearchParams();
    for (let key in canteiro) {
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

    console.log(dados)

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

export { todasPlantas, criarCanteiro, inserirLista, criarGrafico };