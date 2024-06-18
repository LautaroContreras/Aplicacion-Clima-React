/* import { useState } from "react"

export const WeatherApp = () => {

    const urlBase = 'https://api.openweathermap.org/data/2.5/weather'
    const API_KEY = 'af83734946072a1b3d689db5aa7b125e'
    const difKelvin = 273.15

    const [ciudad,setCiudad] = useState('')
    const [dataClima,setDataClima] = useState(null)

    const handleCambioCiudad = (e) =>{
        setCiudad(e.target.value)
    }

    const handleSubmit = (e) =>{
        e.preventDefault()
        if(ciudad.length > 0)  fetchClima()
    }

    const fetchClima = async () => {
        try{
           
            const response = await fetch (`${urlBase}?q=${ciudad}&appid=${API_KEY} `)
            const data = await response.json()
            setDataClima(data)
        } catch (error){
            console.error('Ocurrio el siguiente problema:', error)
        }
    }


  return (
    <div className='container'>
        <h1>Aplicación del Clima</h1>

        <form onSubmit={handleSubmit}>
            <input 
            type="text"
            value={ciudad}
            onChange={handleCambioCiudad}
             />
             <button type="submit">Buscar</button>
        </form>
        {
            dataClima && (
                <div>
                    <h2>{dataClima.name}</h2>
                    <p>Temperatura : {parseInt(dataClima?.main?.temp - difKelvin)}°C </p>
                    <p>Condición meteorologica : {dataClima.weather[0].description}</p>
                    <img src={`https://openweathermap.org/img/wn/${dataClima.weather[0].icon}@2x.png`} />
                </div>
            )
        }
    </div>
  )
} */

  import { useState, useEffect } from "react";

export const WeatherApp = () => {
    const urlBase = 'https://api.openweathermap.org/data/2.5/weather';
    const API_KEY = 'af83734946072a1b3d689db5aa7b125e';
    const difKelvin = 273.15;

    const [ciudad, setCiudad] = useState('');
    const [dataClima, setDataClima] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [unit, setUnit] = useState('metric'); // 'metric' para Celsius, 'imperial' para Fahrenheit

    useEffect(() => {
        const lastCity = localStorage.getItem('lastCity');
        if (lastCity) {
            setCiudad(lastCity);
            fetchClima(lastCity);
        }
    }, []);

    const handleCambioCiudad = (e) => {
        setCiudad(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (ciudad.length > 0) {
            localStorage.setItem('lastCity', ciudad);
            fetchClima(ciudad);
        }
    };

    const fetchClima = async (city) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${urlBase}?q=${city}&units=${unit}&appid=${API_KEY}`);
            if (!response.ok) throw new Error("Ciudad no encontrada");
            const data = await response.json();
            setDataClima(data);
        } catch (error) {
            setError(error.message);
            setDataClima(null);
        } finally {
            setLoading(false);
        }
    };

    const handleUnitChange = (e) => {
        setUnit(e.target.value);
        if (ciudad.length > 0) {
            fetchClima(ciudad);
        }
    };

    return (
        <div className='container'>
            <h1>Aplicación del Clima</h1>

            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    value={ciudad}
                    onChange={handleCambioCiudad}
                    placeholder="Ingrese una ciudad"
                />
                <button type="submit">Buscar</button>
            </form>

            <div>
                <label>
                    <input 
                        type="radio" 
                        value="metric" 
                        checked={unit === 'metric'} 
                        onChange={handleUnitChange} 
                    /> Celsius
                </label>
                <label>
                    <input 
                        type="radio" 
                        value="imperial" 
                        checked={unit === 'imperial'} 
                        onChange={handleUnitChange} 
                    /> Fahrenheit
                </label>
            </div>

            {loading && <p>Cargando...</p>}
            {error && <p>Error: {error}</p>}

            {dataClima && (
                <div>
                    <h2>{dataClima.name}</h2>
                    <p>Temperatura: {unit === 'metric' ? dataClima.main.temp : (dataClima.main.temp * 1.8 + 32).toFixed(1)}°{unit === 'metric' ? 'C' : 'F'}</p>
                    <p>Condición meteorológica: {dataClima.weather[0].description}</p>
                    <p>Humedad: {dataClima.main.humidity}%</p>
                    <p>Viento: {dataClima.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</p>
                    <p>Presión: {dataClima.main.pressure} hPa</p>
                    <img src={`https://openweathermap.org/img/wn/${dataClima.weather[0].icon}@2x.png`} alt="Icono del clima" />
                </div>
            )}
        </div>
    );
};

