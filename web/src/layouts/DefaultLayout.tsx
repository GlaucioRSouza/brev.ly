import { Outlet } from "react-router-dom";

export function DefaultLayout() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* Header aqui futuramente */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
