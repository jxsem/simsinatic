import { useState, useEffect } from "react";

function useEarthquakes(url, paramName) {
    const [earthquakes, setEarthquakes] = useState([]); //earthquakes viene del json o del js que se procesa en python y demas
    const [minMagnitude, setMinMagnitude] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function getEarthquakes() {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`${url}?${paramName}=${minMagnitude}`); //<- paramName, el parametro de la funcioon en el fecth, se le asigna que paramName sea la query
                if (!response.ok) throw new Error("Error al recibir terremotos");
                const data = await response.json();
                setEarthquakes(data);
            } catch (err) {
                setError("No se pudieron cargar los terremotos");
                setEarthquakes([]);
            } finally {
                setIsLoading(false);
            }
        }
        getEarthquakes();
    }, [url, paramName, minMagnitude]);

    return { earthquakes, minMagnitude, setMinMagnitude, isLoading, error };
}

export default useEarthquakes;