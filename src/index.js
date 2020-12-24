/* eslint-disable no-console */
const SunCalc = require('suncalc');
const moment = require('moment');

const getCityTemp = async (zip, country = 'US') => {
  try {
    const url = ` https://api.openweathermap.org/data/2.5/weather?zip=${zip},${country}&units=imperial&appid=97238fe444ebb191d0dead1fb52bfed9
  `;
    let city = await fetch(url);
    city = await city.json();
    console.log(city);
    console.log(`Temp: ${city.main.temp}`);
    console.log(`Humidity: ${city.main.humidity}`);
    console.log(`Wind: ${city.wind.speed}`);
    console.log(`Feels like: ${city.main.feels_like}`);
    console.log(city.weather[0].description);
    const { lat, lon } = city.coord;
    const times = SunCalc.getTimes(new Date(), lat, lon);
    const sunRise = `${times.sunrise}`
      .split(' ')[4]
      .replace(/^0+/, '')
      .trim()
      .split(':')
      .slice(0, -1)
      .join(':');
    console.log(`${sunRise}am`);

    const sunSet = `${times.sunset}`
      .split(' ')[4]
      .replace(/^0+/, '')
      .split(':')
      .slice(0, -1)
      .join(':');
    console.log(`${moment(`${sunSet}`, 'HH:mm').format('h:mma')}`);
    console.log(moment().format('MMMM Do YYYY, h:mma'));
  } catch (err) {
    console.error(err);
  }
};

const form = document.querySelector('form');
const input = document.querySelector('input');

const getCity = (e) => {
  if (e.target === input && e.key === 'Enter') {
    const usersCity = input.value;
    console.log(usersCity);
    getCityTemp(+usersCity);
    e.preventDefault();
    input.value = '';
  }
};

form.addEventListener('keydown', getCity);
