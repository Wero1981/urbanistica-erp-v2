
import { Link } from "react-router-dom";
import { House, CarFront, Package } from "lucide-react";

const categories = [
  {
    title: "Inmuebles",
    description: "Casas, terrenos, edificios, ranchos y locales.",
    icon: House,
    path: "/propiedades/inmuebles",
  },
  {
    title: "Vehículos",
    description: "Automóviles, camionetas y otros vehículos.",
    icon: CarFront,
    path: "/propiedades/vehiculos",
  },
  {
    title: "Otros bienes",
    description: "Otros activos patrimoniales de la empresa.",
    icon: Package,
    path: "/propiedades/otros",
  },
];

export default function PropertiesPage() {
  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">
          Propiedades
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Administración del patrimonio de la empresa activa.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-3">
        {categories.map(({ title, description, icon: Icon, path }) => (
          <Link
            key={path}
            to={path}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-400 hover:shadow-md"
          >
            <Icon className="mb-4 h-9 w-9 text-blue-600" />
            <h2 className="text-lg font-semibold">
              {title}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {description}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
