import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { queryClient } from '../lib/query-client';
import { Copy, Trash2, Download } from 'lucide-react';

interface Link {
  id: string;
  originalUrl: string;
  slug: string;
  clicks: number;
}

export function LinkList() {
  const { data: links, isLoading } = useQuery<Link[]>({
    queryKey: ['links'],
    queryFn: async () => (await api.get('/links')).data,
  });

  const { mutateAsync: deleteLink } = useMutation({
    mutationFn: (slug: string) => api.delete(`/links/${slug}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['links'] }),
  });

  const exportCsv = async () => {
    const { data } = await api.post('/links/export');
    window.open(data.url, '_blank');
  };

  if (isLoading) return <p>Carregando...</p>;

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Meus links</h2>
        <button onClick={exportCsv} className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">
          <Download size={16} /> Baixar CSV
        </button>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {links?.map((link) => (
          <div key={link.id} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-gray-50 transition-colors">
            <div>
              <p className="text-indigo-600 font-bold">brev.ly/{link.slug}</p>
              <p className="text-gray-400 text-sm truncate max-w-xs">{link.originalUrl}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">{link.clicks} acessos</span>
              <button onClick={() => navigator.clipboard.writeText(`brev.ly/${link.slug}`)} className="p-2 hover:bg-gray-200 rounded-md transition-colors"><Copy size={18} /></button>
              <button onClick={() => confirm(`Apagar ${link.slug}?`) && deleteLink(link.slug)} className="p-2 hover:bg-red-50 text-red-500 rounded-md transition-colors"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
        {links?.length === 0 && <p className="text-center text-gray-400 py-10">Nenhum link encontrado.</p>}
      </div>
    </div>
  );
}