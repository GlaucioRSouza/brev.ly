import { CreateLinkForm } from '../components/create-link-form';
import { LinkList } from '../components/link-list';

export function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="max-w-6xl mx-auto">
        {/* Header com Logo */}
        <header className="flex items-center gap-2 mb-10">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">b</div>
          <h1 className="text-2xl font-bold tracking-tight">brev.ly</h1>
        </header>

        {/* Grid Principal (Lado a Lado no PC, Empilhado no Celular) */}
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/60">
            <CreateLinkForm />
          </section>

          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/60">
            <LinkList />
          </section>
        </main>
      </div>
    </div>
  );
}

