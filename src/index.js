/* eslint-disable no-console */
const SunCalc = require('suncalc');
const moment = require('moment');
const momentTimeZone = require('moment-timezone');

const cityName = document.querySelector('#city-title');
const fullDateTime = document.querySelector('#full-date-time');
const currentTemp = document.querySelector('#temp');
const degreeIconF = document.querySelector('#degree-icon-F');
const degreeIconC = document.querySelector('#degree-icon-C');

const smallWeatherIcon = document.querySelector('#weather-img');
const cloudType = document.querySelector('#cloud-type');
const feelsLikeNumber = document.querySelector('#feels-like-num');
const humidityNumber = document.querySelector('#humidity-num');
const windNumber = document.querySelector('#wind-num');
const sunRiseTime = document.querySelector('#sunrise-time');
const sunSetTime = document.querySelector('#sunset-time');

const getCityTemp = async (zip, country = 'US') => {
  try {
    const url = ` https://api.openweathermap.org/data/2.5/weather?zip=${zip},${country}&units=imperial&appid=97238fe444ebb191d0dead1fb52bfed9
  `;
    let city = await fetch(url);
    city = await city.json();
    cityName.textContent = city.name;
    fullDateTime.textContent = momentTimeZone()
      .tz(`America/${city.name.replace(' ', '_')}`)
      .format('MMMM Do YYYY, h:mma');
    currentTemp.innerHTML = `${Math.round(`${city.main.temp}`)}&#8457`;
    const clouds = city.weather[0].description;
    cloudType.textContent = clouds.charAt(0).toUpperCase() + clouds.substring(1);
    feelsLikeNumber.innerHTML = `${Math.round(`${city.main.feels_like}`)}&#8457`;
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
    sunRiseTime.textContent = `${moment(`${sunRise}`, 'HH:mm').format('h:mma')}`;
    sunSetTime.textContent = `${moment(`${sunSet}`, 'HH:mm').format('h:mma')}`;
  } catch (err) {
    console.error(err);
  }
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
