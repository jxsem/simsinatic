import { useState, useEffect } from "react";

function EarthquakeList() {

    // 1- Hacemos useState y guardamos aquí los terremotos que vienen de la API
    const [earthquakes, setEarthquakes] = useState([]);

    // 2- Hacemos un useEffect seguido del fetch cuando se carga este componente
    useEffect(() => {
        fetch("http://localhost:8000/earthquakes")
            .then((response) => response.json())
            .then((data) => setEarthquakes(data));
    }, []);
    // 3- Retorna un map y devuelve los terremotos con una funcion flecha
    return (
        <div>
            
            {earthquakes.map((terremoto) => (
                
                    <div key={terremoto.id}>
                        <p>{terremoto.localidad}</p>
                        <p>{terremoto.fecha}</p>
                    </div>
                
            ))}

        </div>
    );
}

export default EarthquakeList;