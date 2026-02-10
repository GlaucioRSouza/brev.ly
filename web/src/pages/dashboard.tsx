import { CreateLinkForm } from '../components/create-link-form';
import { LinkList } from '../components/link-list';

export function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <header className="max-w-7xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-indigo-900 flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm">b</div>
          brev.ly
        </h1>
      </header>
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-start">
        <CreateLinkForm />
        <LinkList />
      </div>
    </main>
  );
}