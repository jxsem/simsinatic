// Pedir a FASTAPI los terremotos de españa y mostrarlos en pantalla
// Entonces, usar el useState y el useEffect
import { useState, useEffect } from "react";
import EarthquakeCardSpain from "./EarthquakeCardSpain";

function EarthquakeSpainList() {
    // el useState guarda los terremotos que nos devuelve fastAPI.. Guarda datos que pueden cambiar y que React necesita recordar.
    const [earthquakeSpain, setEarthquakeSpain] = useState([]);

    // cuando aparece el componente, es el momento de hacer la peticion API.. Es para ejecutar código después de que React haya renderizado el componente, normalmente como respuesta a cambios en ciertas dependencias.
    useEffect(() => {
        fetch("http://localhost:8000/earthquakes/spain")
            // fetch devuelve una Promise. Cuando la petición termina,
            // el resultado se recibe en "response".
            .then((response) => response.json())
            // response.json() también devuelve una Promise.
            // Cuando termina, el JSON convertido a JavaScript
            // se recibe en "data".
            .then((data) => {
                setEarthquakeSpain(data);
            });
    }, []);

    //Por último, se muestran los terremotos
    return (
        <div>
            <h1 className="m-2" >Terremotos de España</h1>
            {earthquakeSpain.map((terremoto) => (
                //Esto son props, datos que un componente PADRE le pasa a un componente hijo... -> el padre es earthquakespainlist que le pasa al hijo earthquakecardspain
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