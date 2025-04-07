import { config } from '../config.js';

const { brasilApi } = config;

/*
  --------------------------------------------------------------------------------------
  Função para obter o id da cidade Via API brasilapi/cidade
  --------------------------------------------------------------------------------------
*/
async function procurarIdCidade(cityName) {
  const encoded = encodeURIComponent(cityName);
  const urlCity = `${brasilApi}cidade/${encoded}`;
  const response = await fetch(urlCity)
  if (!response.ok) {
    alert('Desculpe, não encontramos essa cidade, tente outra.')
    const message = `An error has occured to find city ${cityName}: ${response.status}`;
    throw new Error(message);
  };
  const cityData = await response.json();
  return cityData[0].id
}
  
/*
  --------------------------------------------------------------------------------------
  Função para buscar previsão
  --------------------------------------------------------------------------------------
*/
async function buscarPrevisao(id, forcastDaysInput) {
  const forcastDays = forcastDaysInput || 1;
  const urlWeather = `${brasilApi}clima/previsao/${id}/${forcastDays}`;
  const response = await fetch(urlWeather);
  if (!response.ok) {
    const message = `Ocorrreu um erro para buscar previsão ${id}: ${response.status}`;
    throw new Error(message);
  };
  const cityData = await response.json();
  return cityData;
}

/*
  --------------------------------------------------------------------------------------
  Função para mostrar resultado previsão
  --------------------------------------------------------------------------------------
*/
function mostrarPrevisao(weatherData) {
  weatherForcastDiv.innerHTML = '';
  for (let previsao of weatherData.clima) {
    const {condicao_desc, data, min, max} = previsao;
    weatherForcastDiv.innerHTML += `
    <div class='weatherForcastDiv--inner'>
      <div class='weatherInfo' id='data'>
          <p class='weatherInfo--label'>Data: </p>
          <p class='weatherInfo--data'>${data}</p>
      </div>
      <div class='weatherInfo' id='condicao'>
          <p class='weatherInfo--label'>Condição: </p>
          <p class='weatherInfo--data'>${condicao_desc}</p>
      </div>
      <div class='weatherInfo' id='temp_min'>
          <p class='weatherInfo--label'>Temperatura Min: </p>
          <p class='weatherInfo--data'>${min} °C</p>
      </div>
      <div class='weatherInfo' id='temp_max'>
          <p class='weatherInfo--label'>Temperatura Max: </p>
          <p class='weatherInfo--data'>${max} °C</p>
      </div>
    </div>
    `;
  };
  return weatherData
};
  
export { procurarIdCidade, buscarPrevisao, mostrarPrevisao };