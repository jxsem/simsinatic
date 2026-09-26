// Pedir a FASTAPI los terremotos de españa y mostrarlos en pantalla
// Entonces, usar el useState y el useEffect
import { useState, useEffect } from "react";
import EarthquakeCardSpain from "./EarthquakeCardSpain";

function EarthquakeSpainList() {
    // el useState guarda los terremotos que nos devuelve fastAPI.. Guarda datos que pueden cambiar y que React necesita recordar.
    const [earthquakeSpain, setEarthquakeSpain] = useState([]);
    //useState para el filtro mediante un formulario
    const [minMagnitude, setMinMagnitude] = useState(0)

    //usestate para el manejo de carga
    const [isLoading, setIsLoading] = useState(false)

    //useState para el manejo de errores
    const [error, setError] = useState(null)

    // Es un hook, permite usar el estado de la fetch y cuando aparece el componente, es el momento de hacer la peticion API.. Es para ejecutar código después de que React haya renderizado el componente, normalmente como respuesta a cambios en ciertas dependencias.
    useEffect(() => {
            //Para hcer el fetch la mejor practica es con una funcion asincrona
            async function getEarthquakesSpain() {
                setIsLoading(true);
                setError(null); //<- null porque NO HAY NINGUN ERROR TODAVIA
                //1- que INTENTE conectar con el endpoint del backend
                try{
                    // y guardamos la respuesta en una constante
                    const response = await fetch(`http://localhost:8000/earthquakes/spain?min_magnitud=${minMagnitude}`); // await significa, conceptualmente: "Espera a que esta Promise termine y dame su resultado."
                    // Si se puede conectar o recibir ese json se guardara y se convertira en un objeto json
                    // si no, salta este error
                    if (!response.ok){
                        throw new Error("Error al objetner los terremotos");
                    }
                    const data = await response.json();
                    //y, si puede, actualiza el estado con la lista devuelva
                    setEarthquakeSpain(data)
                } catch (error) {
                    setError("No se ha podido cargar los terremotos") //<- CAMBIA EL ESTADO DE NULL A STRING
                    setEarthquakeSpain([]) //<- QUE DEVUELVA LA LISTA VACIA
                } finally {
                    setIsLoading(false)
                }
            }
        getEarthquakesSpain();
    }, [minMagnitude]) //<- El efecto se volverá a ejecutar CADA VEZ QUE el valor de minMagnitude cambie, devolviendo  datos sincronizados con el filtro activado
        
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