const API_KEY = '';
const CITY = 'São Paulo';
const UNITS = 'metric';
const LANG = 'pt_br';

async function fetchWeather() {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&units=${UNITS}&lang=${LANG}&appid=${API_KEY}`);
    const data = await response.json();

    // Card Atual
    const current = data.list[0];
    const nowCard = document.querySelector('.wf-card:nth-child(1)');
    nowCard.querySelector('.wf-temp').textContent = `${Math.round(current.main.temp)}°C`;
    nowCard.querySelector('.wf-icon').textContent = getWeatherIcon(current.weather[0].main);
    nowCard.querySelectorAll('.wf-condition-text')[0].textContent = `Umidade: ${current.main.humidity}%`;
    nowCard.querySelectorAll('.wf-condition-text')[1].textContent = `Vento: ${Math.round(current.wind.speed)} km/h`;

    // Cards dos próximos dias
    const dayCards = document.querySelectorAll('.wf-card');

    // Organizando previsões por dia
    const daysMap = {};
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString('pt-BR', { weekday: 'long' });
      if (!daysMap[day]) daysMap[day] = [];
      daysMap[day].push(item);
    });

    const daysArray = Object.keys(daysMap);
    for (let i = 0; i < 3; i++) {
      const dayName = daysArray[i];
      const dayDataList = daysMap[dayName];

      // Pegando o menor e maior temp do dia
      const minTemp = Math.min(...dayDataList.map(d => d.main.temp_min));
      const maxTemp = Math.max(...dayDataList.map(d => d.main.temp_max));
      const midData = dayDataList[Math.floor(dayDataList.length / 2)]; // previsão média para o dia

      const card = dayCards[i + 1];
      card.querySelector('h3').textContent = dayName.charAt(0).toUpperCase() + dayName.slice(1);
      card.querySelector('.wf-icon').textContent = getWeatherIcon(midData.weather[0].main);
      card.querySelector('.wf-range').textContent = `Min: ${Math.round(minTemp)}°C | Max: ${Math.round(maxTemp)}°C`;
      card.querySelector('.wf-condition-text').textContent = midData.weather[0].description;
    }

  } catch (error) {
    console.error('Erro ao buscar dados do tempo:', error);
  }
}

function getWeatherIcon(condition) {
  switch(condition) {
    case 'Clear': return '☀️';
    case 'Clouds': return '☁️';
    case 'Rain': return '🌧️';
    case 'Snow': return '❄️';
    case 'Thunderstorm': return '⛈️';
    case 'Drizzle': return '🌦️';
    default: return '🌡️';
  }
}

fetchWeather();
