// Pedir a FASTAPI los terremotos de españa y mostrarlos en pantalla
// Entonces, usar el useState y el useEffect
import { useState, useEffect } from "react";
import EarthquakeCardSpain from "./EarthquakeCardSpain";

function EarthquakeSpainList() {
    // el useState guarda los terremotos que nos devuelve fastAPI
    const [earthquakeSpain, setEarthquakeSpain] = useState([]);

    // cuando aparece el componente, es el momento de hacer la peticion API
    useEffect(()=>{
        fetch("http://localhost:8000/earthquakes/spain")
            .then((response) => response.json())
            .then((data) => {
                setEarthquakeSpain(data);
            });
    }, []);

    //Por último, se muestran los terremotos
    return (
        <div>
            <h1 className="m-2" >Terremotos de España</h1>
            {earthquakeSpain.map((terremoto) => (
                <EarthquakeCardSpain
                    key={terremoto.id}
                    localidad={terremoto.localidad}
                    fecha={terremoto.fecha}
                    magnitud={terremoto.magnitud}
                    latitud={terremoto.latitud}
                    longitud={terremoto.longitud}
                />
            ))}
        </div>
    );
}
/*
EarthquakesSpainList obtiene los datos de la API y crea una tarjeta por cada terremoto. 
EarthquakeCardSpain recibe mediante props los datos necesarios para representar un terremoto individual.
*/
export default EarthquakeSpainList