// Importamos el componente hijo encargo de renderizar la tarjeta individual de cada terremoto.
import EarthquakeCard from "./EarthquakeCard";
import useEarthquakes from "./hooks/useEarthquakes";


function EarthquakeList() {
    // Como tenemos el useEarthquakes solamente tenemos que adjuntarle los parametros que va a recibir (los estados)
    const { earthquakes, minMagnitude, setMinMagnitude, isLoading, error } = useEarthquakes("http://localhost:8000/earthquakes","minMagnitude") // useEarthquakes es una funcion que devuelve un objeto
    // Las {} después de const son desestructuración de objetos. La desestructuración de objetos es una característica de JavaScript que permite extraer propiedades de un objeto y guardarlas directamente en variables. En lugar de hacer 4 constantes escribes 1 y guardas todas las propiedades basicamente

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
                    defaultValue={0}
                    min={0}
                    max={10}
                    inputMode="decimal" //<- que teclado virtual aparece en los dispositivos móviles
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
                        time={terremoto.time}
                    />
                ))}
            </div>
        </div>
    );
}
// Exportamos el componente para poder reutilizarlo dentro de App.jsx u otros módulos.
export default EarthquakeList;