import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/dashboard';
import { Redirect } from './pages/Redirect';
import { NotFound } from './pages/404';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Principal: Dashboard com Form e Listagem */}
        <Route path="/" element={<Dashboard />} />

        {/* Rota de Redirecionamento Dinâmico */}
        <Route path="/:slug" element={<Redirect />} />

        {/* Fallback para rotas não encontradas */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}