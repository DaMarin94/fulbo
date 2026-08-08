import { Route, Routes } from 'react-router-dom'
import { CompetitionScreen } from './screens/CompetitionScreen'
import { HomeScreen } from './screens/HomeScreen'
import { SettingsScreen } from './screens/SettingsScreen'
import { TeamScreen } from './screens/TeamScreen'

/**
 * Enrutamiento base. `docs/screens.md` no fija paths de URL (es navegación por
 * drill-down, sin definir rutas concretas): `/competicion/:competitionId` y
 * `/equipo/:teamId` son una elección de `frontend`, documentada en el reporte de
 * la etapa. Inicio y Configuración son las únicas dos pantallas sin parámetro.
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/competicion/:competitionId" element={<CompetitionScreen />} />
      <Route path="/equipo/:teamId" element={<TeamScreen />} />
      <Route path="/configuracion" element={<SettingsScreen />} />
    </Routes>
  )
}

export default App
