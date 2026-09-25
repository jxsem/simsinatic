//Un componente cuyo trabajo es mostrar un terremoto.. y por cada terremoto que muestre pinta una tarjeta
function EarthquakeCardSpain({localidad, magnitud, fecha, latitud, longitud}){
    return (
        <div className="w-3/6 border-2 p-2 m-2 rounded-2xl">
            <p className="text-lg">{localidad}</p>
            <p className="text-m text-red-500">M {magnitud}</p>
            <p className="text-xs">lat: {latitud}</p>
            <p className="text-xs">long: {longitud}</p>
            <p className="text-xs">{fecha}</p>
        </div>
    )
}
export default EarthquakeCardSpain
/*
EarthquakesSpainList obtiene los datos de la API y crea una tarjeta por cada terremoto. 
EarthquakeCardSpain recibe mediante props los datos necesarios para representar un terremoto individual.
*/