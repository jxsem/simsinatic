// Crear componente para ver terremotos cuyo componente recibirá propiedades
function EarthquakeCard({place, magnitude, time}) {
    return (
        <div className="w-3/6 border-2 p-2 m-2 rounded-2xl">
            <p className="text-lg">{place}</p>
            <p className="text-m text-red-500">M {magnitude}</p>
            <p className="text-xs">{time}</p>
        </div>
    )
}
export default EarthquakeCard