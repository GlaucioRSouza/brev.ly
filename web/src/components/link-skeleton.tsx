export function LinkSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border border-transparent border-b-gray-100 last:border-b-0 rounded-xl animate-pulse">
      {/* Simulação do Texto (Slug e URL Original) */}
      <div className="min-w-0 flex-1 space-y-2">
        {/* Simula o brev.ly/slug */}
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        {/* Simula a URL original em baixo */}
        <div className="h-3 bg-gray-100 rounded w-1/2"></div>
      </div>
      
      {/* Simulação das Informações e Botões à direita */}
      <div className="flex items-center gap-2 ml-4">
        {/* Simula o contador de acessos (pílula) */}
        <div className="h-6 w-16 bg-gray-100 rounded-full"></div>
        
        {/* Simula o botão de copiar */}
        <div className="h-9 w-9 bg-gray-50 rounded-lg"></div>
        
        {/* Simula o botão de excluir */}
        <div className="h-9 w-9 bg-gray-50 rounded-lg"></div>
      </div>
    </div>
  );
}