// Pedir a FASTAPI los terremotos de españa y mostrarlos en pantalla
// Entonces, usar el useState y el useEffect
import EarthquakeCardSpain from "./EarthquakeCardSpain";
import useEarthquakes from "./hooks/useEarthquakes";

function EarthquakeSpainList() {
    const {earthquakes, minMagnitude, setMinMagnitude, isLoading, error } = useEarthquakes("http://localhost:8000/earthquakes/spain","minMagnitude")         
    // ****** FORMULARIO ******
    function formularioMagnitud(evento){ //// Función que se ejecutará cuando este formulario se envíe
        evento.preventDefault();
        const datosFormulario = new FormData(evento.currentTarget); //<- Coge el formulario que ha provocado este evento y crea con él un objeto FormData para poder leer sus campos.
        const valor = datosFormulario.get("magnitudMinima"); // <- Busca dentro de los datos del formulario el campo cuyo name sea magnitudMinima y dame su valor."
        //Para resolver problemas de , o . (ejemplo: magnitud 4.2 o 4,2) es mejor reemplazar la , y el .
        const valorNormalizado = valor.replace(",", ".");

        setMinMagnitude(Number(valorNormalizado)); //<- Lo de arriba produce un String asi que esta linea dice: Actualiza el estado minMagnitude con este número. 
    }

    //Por último, se muestran los terremotos
    return (
        <div>
            <form onSubmit={formularioMagnitud}>  {/* <- significa que Cuando este formulario reciba un evento submit, ejecuta la función formularioMagnitud */}
                <label htmlFor="magnitudMinima" className="m-2">
                    Magnitud mínima:
                </label>
                <input className="m-2 p-1 border border-solid rounded-xl"
                        type="text"
                        id="magnitudMinima"
                        name="magnitudMinima"
                        // step={"any"} <- step le dice al navegador los valores validos avanzan de 0.0 al 9.9, siempre y cuando el input sea tipo number, en este caso como hemos optado a pasarlo a text no pasa nada, de hecho, tampoco se rompe 
                        min={0}
                        max={10}
                        defaultValue={0}
                        inputMode="decimal"
                />
                <button
                    type="submit"
                    className="p-1 border border-solid rounded-xl cursor-pointer"
                >
                    Filtrar
                </button>
            </form>
            {isLoading && <p>Cargando...</p>}
            
            <h1 className="m-2" >Terremotos de España</h1>
            {error && <p className="m-2">{error}</p>}
            {earthquakes.map((terremoto) => (
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