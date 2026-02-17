import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { queryClient } from '../lib/query-client';
import { Copy, Trash2, Download, Check } from 'lucide-react';
import { useState } from 'react';

interface Link {
  id: string;
  originalUrl: string;
  slug: string;
  clicks: number;
}

export function LinkList() {
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const { data: links, isLoading } = useQuery<Link[]>({
    queryKey: ['links'],
    queryFn: async () => {
      const response = await api.get('/links');
      return response.data;
    },
  });

  const { mutateAsync: deleteLinkFn } = useMutation({
    // Garantimos que a URL inclua o prefixo /links/ para não cair no redirecionador
    mutationFn: (slug: string) => api.delete(`/links/${slug}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
    },
    onError: (error) => {
      console.error("Erro ao deletar link:", error);
      alert("Não foi possível excluir o link. Verifique se o servidor está rodando.");
    }
  });

  const handleCopy = async (slug: string) => {
    // O link copiado deve apontar para onde sua API processa o redirecionamento
    const url = `http://localhost:3333/${slug}`; 
    
    try {
      await navigator.clipboard.writeText(url);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    } catch (err) {
      alert("Erro ao copiar para a área de transferência.");
    }
  };

  const handleDelete = async (slug: string) => {
    if (confirm(`Deseja realmente apagar o link brev.ly/${slug}?`)) {
      try {
        await deleteLinkFn(slug);
      } catch (err) {
        // Erro tratado no onError
      }
    }
  };

  const exportCsv = async () => {
    try {
      const { data } = await api.post('/links/export');
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      alert("Erro ao exportar CSV.");
    }
  };

  if (isLoading) return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex-1 animate-pulse">
      <p className="text-center text-gray-400">Carregando seus links...</p>
    </div>
  );

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex-1 min-w-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Meus links</h2>
        <button 
          onClick={exportCsv} 
          className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-gray-100"
        >
          <Download size={16} /> Baixar CSV
        </button>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {Array.isArray(links) && links.length > 0 ? (
          links.map((link) => (
            <div key={link.id} className="flex items-center justify-between p-4 border border-transparent border-b-gray-100 last:border-b-0 hover:border-indigo-100 hover:bg-indigo-50/30 rounded-xl transition-all group">
              <div className="min-w-0 flex-1">
                <p className="text-indigo-600 font-bold truncate">brev.ly/{link.slug}</p>
                <p className="text-gray-400 text-sm truncate max-w-[200px] md:max-w-xs">
                  {link.originalUrl}
                </p>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <span className="text-gray-400 text-xs font-medium bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
                  {link.clicks} {link.clicks === 1 ? 'acesso' : 'acessos'}
                </span>
                
                <button 
                  onClick={() => handleCopy(link.slug)} 
                  title="Copiar link encurtado"
                  className="p-2 hover:bg-white hover:shadow-sm text-gray-400 hover:text-indigo-600 rounded-lg transition-all"
                >
                  {copiedSlug === link.slug ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                </button>
                
                <button 
                  onClick={() => handleDelete(link.slug)} 
                  title="Excluir link"
                  className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">Nenhum link encontrado.</p>
            <p className="text-sm text-gray-300">Crie seu primeiro link ao lado!</p>
          </div>
        )}
      </div>
    </div>
  );
}