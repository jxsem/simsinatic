//Por cada seismo que hay en sismoData CREA un earthquakecard y pasale datos como props
import EarthquakeCard from "./EarthquakeCard"
function EarthquakeList({ earthquakes }) {
    const earthquakeElements = earthquakes.map((sismo) => (
        <EarthquakeCard
            key={sismo.id}
            place={sismo.place}
            magnitude={sismo.magnitude}
            time={sismo.time}
        />
    ))

    return (
        <div className="flex flex-wrap gap-4 p-6">
            {earthquakeElements}
        </div>
    )
}

export default EarthquakeList