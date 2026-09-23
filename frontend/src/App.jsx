//Importamos el componente a nuestro app.jsx
import EarthquakeList from "./EarthquakeList"
import { useState  } from "react"
import { useEffect } from "react";

function App(){
    //useState(inicial) → [valor, setValor]. Cambiar con set... es lo único que hace que React vuelva a pintar terremotos por cada cambio que haga la api
    const [earthquakes, setEarthquakes] = useState([]);
    // Conectar la api con la url y el json, setEarthquakes sera el que protagonice los cambios que haya en el json
    useEffect(() => {
        fetch("http://localhost:8000/earthquakes")
        .then((response) => response.json())
        .then((data) => setEarthquakes(data))
    }, [])
    //Por ultimo, por cada terremoto, pinta una tarjeta con sus props
    return (
        <EarthquakeList earthquakes={earthquakes} />
    )
}
export default App