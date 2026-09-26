// Importamos los hooks fundamentales de React:
// useState: Para gestionar el estado local (variables que al cambiar fuerzan un nuevo renderizado).
// useEffect: Para ejecutar efectos secundarios (en este caso, peticiones HTTP a la API).
import { useState, useEffect } from "react";

// Importamos el componente hijo encargo de renderizar la tarjeta individual de cada terremoto.
import EarthquakeCard from "./EarthquakeCard";

function EarthquakeList() {
    // ESTADOS DEL COMPONENTE:
    
    // Almacena el listado de terremotos devuelto por la API.
    // Se inicializa como un array vacío ([]) para evitar errores de tipo al mapearlo antes de recibir datos.
    const [earthquakes, setEarthquakes] = useState([]);

    // Guarda el valor del filtro de magnitud mínima.
    // Se inicializa en 0 para pedir a la API todos los registros desde el inicio por defecto.
    const [minMagnitude, setMinMagnitude] = useState(0);

    // Estado booleano de retroalimentación de interfaz.
    // Indica si hay una petición HTTP en curso para mostrar o no un indicador visual de carga.
    const [isLoading, setIsLoading] = useState(false);

    // Almacena mensajes de fallo si la petición HTTP falla.
    // Se inicializa en null para indicar la ausencia predeterminada de errores.
    const [error, setError] = useState(null);

    // EFECTO SECUNDARIO (FETCH DE DATOS):
    useEffect(() => {
        // Definimos una función asíncrona interna porque el callback directo de useEffect NO puede ser async, por norma general se suele hacer funciones asincronas para tomar peticiones.
        async function getEarthquakes() {
            // Iniciamos la carga marcando el indicador como verdadero.
            setIsLoading(true);
            setError(null);
            try {
                // Realizamos la petición HTTP incluyendo la magnitud mínima actual como Query Parameter.
                const response = await fetch(
                    `http://localhost:8000/earthquakes?min_magnitude=${minMagnitude}`
                );
                if (!response.ok){
                    throw new Error("Error al recibir terremotos en json")
                }
                // Convertimos la respuesta cruda en un objeto/array JS legible.
                const data = await response.json();
                // Actualizamos el estado con la lista devuelta, lo que desencadena un re-render con los nuevos datos.
                setEarthquakes(data);
            } catch (error) {
                // Si hay un error de red o de parseo, capturamos el fallo y mostramos un mensaje amigable al usuario.
                setError("No se pudieron cargar los terremotos");
                setEarthquakes([])
            } finally {
                // Se ejecuta SIEMPRE al terminar la petición (sea éxito o error) para ocultar el estado de carga.
                setIsLoading(false);
            }
        }
        // Ejecutamos la función de consulta al montarse el componente o al cambiar la dependencia.
        getEarthquakes();

    // MATRIZ DE DEPENDENCIAS:
    // El efecto se volverá a ejecutar AUTOMÁTICAMENTE cada vez que el valor de 'minMagnitude' cambie,
    // garantizando que la API siempre traiga datos sincronizados con el filtro activo.
    }, [minMagnitude]);

    // MANEJADOR DE EVENTOS DEL FORMULARIO:
    function handleSubmit(event) {
        // Evitamos que el formulario recargue la página completa (comportamiento HTML por defecto).
        event.preventDefault();

        // Leemos los datos del formulario directamente utilizando la API nativa FormData a través del objetivo del evento (el formulario).
        const formData = new FormData(event.currentTarget);
        
        // Obtenemos el valor asignado al campo cuyo 'name' es "minMagnitude".
        const value = formData.get("minMagnitude");

        // Convertimos el input (que siempre se lee como string) a tipo Number y actualizamos el estado.
        // Esto desencadena el useEffect declarado arriba.
        const valueFiltrado = value.replace(",", ".")
        setMinMagnitude(Number(valueFiltrado));
    }
    // ESTRUCTURA VISUAL (JSX):
    return (
        <div>
            {/* Formulario que captura la interacción para actualizar el filtro de magnitud */}
            <form onSubmit={handleSubmit} className="p-2">
                <label htmlFor="minMagnitude">
                    Magnitud Mínima:
                </label>
                <input
                    className="m-2 p-1 border border-solid rounded-xl"
                    type="text"
                    id="minMagnitude"
                    name="minMagnitude" // El atributo 'name' es clave para que FormData() capture su valor
                />
                <button
                    type="submit"
                    className="p-1 border border-solid rounded-xl cursor-pointer"
                >
                    Filtrar
                </button>
            </form>
            {/* RENDERIZADO CONDICIONAL: Evalúa el booleano isLoading. Si es true, muestra el texto de espera */}
            {isLoading && <p>Cargando...</p>}
            {/* RENDERIZADO CONDICIONAL: Si existe un mensaje de error (no es null), lo renderiza en pantalla */}
            
            <div>
                <h1>TERREMOTOS DEL MUNDO</h1>
                {error && <p>{error}</p>}
                {/* Transformamos la lista de terremotos en elementos componentes de React mediante .map() */}
                {earthquakes.map((terremoto) => (
                    <EarthquakeCard
                        // La prop 'key' es OBLIGATORIA en listas de React para ayudar al DOM virtual
                        // a identificar de forma eficiente qué elementos cambian, se añaden o se eliminan.
                        key={terremoto.id}
                        place={terremoto.place}
                        magnitude={terremoto.magnitude}
                    />
                ))}
            </div>
        </div>
    );
}
// Exportamos el componente para poder reutilizarlo dentro de App.jsx u otros módulos.
export default EarthquakeList;