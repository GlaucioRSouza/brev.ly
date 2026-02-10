import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-6xl font-bold text-indigo-600 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Ops! Esse link não existe ou foi removido.</p>
      <Link to="/" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700">
        Voltar para o início
      </Link>
    </div>
  );
}