// Importamos los componentes
import EarthquakeList from "./components/EarthquakeList";
import EarthquakesSpainList from "./components/EarthquakesSpainList";
import Bienvenida from "./components/Bienvenida";
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
   
    // Renderizamos los dos componentes cada uno con una ruta diferente
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Bienvenida />}
                />

                <Route 
                    path="/earthquakes"
                    element={<EarthquakeList />}
                />
                <Route
                    path="/earthquakes/spain"
                    element={<EarthquakesSpainList />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;