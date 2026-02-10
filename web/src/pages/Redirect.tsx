import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/axios';

export function Redirect() {
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function handleRedirect() {
      try {
        const { data } = await api.get(`/links/${slug}`);
        // Incrementa acessos via API antes de sair
        await api.patch(`/links/${slug}/access`);
        window.location.href = data.originalUrl;
      } catch {
        navigate('/404');
      }
    }
    handleRedirect();
  }, [slug, navigate]);

  return (
    <div className="h-screen flex items-center justify-center font-medium text-gray-500">
      Redirecionando para a URL original...
    </div>
  );
}