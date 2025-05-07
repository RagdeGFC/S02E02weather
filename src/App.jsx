import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9 } from './assets/images/';
import randomIndex from './helpers/randomIndex';
import initialState from './helpers/initialState';
import conditionCodes from './helpers/conditionCodes';

import {
	atmosphereSvg,
	clearSvg,
	cloudSvg,
	drizzleSvg,
	rainSvg,
	snowSvg,
	thunderstormSvg,
} from './assets/images/';

const images = [bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9];
const key = 'eeb9fbc4375472b2fb1cb0109bf62e04';
const url = 'https://api.openweathermap.org/data/2.5/weather';

const icons = {
	thunderstorm: thunderstormSvg,
	drizzle: drizzleSvg,
	rain: rainSvg,
	snow: snowSvg,
	atmosphere: atmosphereSvg,
	clear: clearSvg,
	clouds: cloudSvg,
};

// Relaciona el tipo de clima con una imagen de fondo
const weatherImages = {
	Thunderstorm: bg1,
	Drizzle: bg2,
	Rain: bg3,
	Snow: bg4,
	Atmosphere: bg5,
	Clear: bg6,
	Clouds: bg7,
};

function App() {
	const [img, setImg] = useState(images[randomIndex(images.length)]);
	const [coords, setCoords] = useState(initialState);
	const [weather, setWeather] = useState({});
	const [toggle, setToggle] = useState(false);

	function changePhrase() {
		setImg(images[randomIndex(images.length)]);
	}

	function handleBlurOnClick(e) {
		setTimeout(() => {
			e.target.blur();
		}, 500);
	}

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords;
				setCoords({ latitude, longitude });
				console.log('si aceptaste la ubicacion');
			},
			(error) => {
				console.log('no aceptaste la ubicacion');
			},
		);
	}, []);

	useEffect(() => {
		if (coords) {
			axios
				.get(
					`${url}?lat=${coords.latitude}&lon=${coords.longitude}&appid=${key}`,
				)
				.then((res) => {
					console.log(res);
					const keys = Object.keys(conditionCodes);
					const iconName = keys.find((key) =>
						conditionCodes[key].includes(res.data?.weather[0]?.id),
					);

					setWeather({
						city: res.data?.name,
						country: res.data?.sys?.country,
						icon: icons[iconName],
						main: res.data?.weather[0]?.main,
						wind: res.data?.wind?.speed,
						clouds: res.data?.clouds?.all,
						pressure: res.data?.main?.pressure,
						temperature: parseInt(res.data?.main?.temp - 273.15),
					});

					// Cambia la imagen de fondo según el clima SOLO al inicio
					const main = res.data?.weather[0]?.main;
					if (weatherImages[main]) {
						setImg(weatherImages[main]);
					}
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, [coords]);

	const temp = toggle
		? parseInt((weather.temperature * 9) / 5) + 32
		: weather.temperature;

	return (
		<div className="wrapper" style={{ backgroundImage: `url('${img}')` }}>
			<div className="container">
				<div className="card">
					<h1 className="card__title">Weather APP</h1>
					<h2 className="card__subtitle">
						{weather.city},{weather.country}
					</h2>
					<div className="card__body">
						<img src={weather.icon} alt={weather.main} width={130} />
						<div className="card__info">
							<h3 className="card__main">"{weather.main}"</h3>
							<p className="card__wind-speed">
								- Wind speed: {weather.wind} m/s
							</p>
							<p className="card__clouds">- Clouds: {weather.clouds}%</p>
							<p className="card__pressure">
								- Pressure: {weather.pressure} hpa{' '}
							</p>
						</div>
					</div>
					<h2 className="card__temperature">
						{temp}
						{toggle ? '°F' : '°C'}
					</h2>
					<div className="card__button-group">
						<button
							onClick={(e) => {
								setToggle(!toggle);
								handleBlurOnClick(e);
							}}
							className="card__button"
						>
							Change to {!toggle ? '°F' : '°C'}
						</button>
						<button
							onClick={(e) => {
								changePhrase();
								handleBlurOnClick(e);
							}}
							className="card__button"
						>
							Change image{' '}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
