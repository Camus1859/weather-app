import './style.css';

/* eslint-disable no-console */
const SunCalc = require('suncalc');
const moment = require('moment');
const momentTimeZone = require('moment-timezone');

const cityName = document.querySelector('#city-title');
const fullDateTime = document.querySelector('#full-date-time');
const currentTemp = document.querySelector('#temp');
const cloudType = document.querySelector('#cloud-type');
const feelsLikeNumber = document.querySelector('#feels-like-num');
const humidityNumber = document.querySelector('#humidity-num');
const windNumber = document.querySelector('#wind-num');
const sunRiseTime = document.querySelector('#sunrise-time');
const sunSetTime = document.querySelector('#sunset-time');

const celciusBtn = document.querySelector('.degrees-btn-C');
const fahrenheitBtn = document.querySelector('.degrees-btn-F');
let city;

const getCityTemp = async (zip, country = 'US') => {
  try {
    const url = ` https://api.openweathermap.org/data/2.5/weather?zip=${zip},${country}&units=imperial&appid=97238fe444ebb191d0dead1fb52bfed9
  `;
    city = await fetch(url);
    city = await city.json();
    console.log(city);
    cityName.textContent = city.name;
    fullDateTime.textContent = momentTimeZone()
      .tz(`America/${city.name.replace(' ', '_')}`)
      .format('MMMM Do YYYY, h:mma');
    currentTemp.innerHTML = `${Math.round(`${city.main.temp}`)}&#8457`;
    const clouds = city.weather[0].description;
    cloudType.textContent =
      clouds.charAt(0).toUpperCase() + clouds.substring(1);
    feelsLikeNumber.innerHTML = `${Math.round(
      `${city.main.feels_like}`
    )}&#8457`;
    humidityNumber.textContent = `${Math.round(`${city.main.humidity}`)}%`;
    windNumber.textContent = `${Math.round(`${city.wind.speed}`)}mph`;
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
    sunRiseTime.textContent = `${moment(`${sunRise}`, 'HH:mm').format(
      'h:mma'
    )}`;
    sunSetTime.textContent = `${moment(`${sunSet}`, 'HH:mm').format('h:mma')}`;
  } catch (err) {
    console.error(err);
  }
  setBackgroundImg();
};

const form = document.querySelector('form');
const input = document.querySelector('input');

const getCity = (e) => {
  if (e.target === input && e.key === 'Enter') {
    const usersZipCode = input.value;
    console.log(usersZipCode);
    getCityTemp(+usersZipCode);
    e.preventDefault();
    input.value = '';
  }
};

form.addEventListener('keydown', getCity);

const convertTempToCelcius = (e) => {
  e.preventDefault();
  currentTemp.innerHTML = `${Math.round(
    (`${city.main.temp}` - 32) / 1.8
  )}&#8451`;
  feelsLikeNumber.innerHTML = `${Math.round(
    (`${city.main.feels_like}` - 32) / 1.8
  )}&#8451`;
  celciusBtn.classList.add('hidden');
  fahrenheitBtn.classList.remove('hidden');
};

const convertTempToFahrenheit = (e) => {
  e.preventDefault();
  currentTemp.innerHTML = `${Math.round(`${city.main.temp}`)}&#8457`;
  feelsLikeNumber.innerHTML = `${Math.round(`${city.main.feels_like}`)}&#8457`;
  celciusBtn.classList.remove('hidden');
  fahrenheitBtn.classList.add('hidden');
};

celciusBtn.addEventListener('click', convertTempToCelcius);
fahrenheitBtn.addEventListener('click', convertTempToFahrenheit);

const img = document.querySelector('html');

const setBackgroundImg = () => {
  let coverage = city.weather[0].description;
  if (!coverage.includes('rain') || !coverage.includes('snow')) {
    coverage = coverage.replace(' ', '-');
    img.style.backgroundImage = `url(/src/images/${coverage}.jpeg)`;
  }
  if (coverage.includes('rain')) {
    coverage = coverage.replace(' ', '-');
    img.style.backgroundImage = `url(/src/images/${coverage}.jpeg)`;
  }
  if (coverage.includes('snow')) {
    coverage = coverage.replace(' ', '-');
    img.style.backgroundImage = `url(/src/images/${coverage}.jpeg)`;
  }
};
