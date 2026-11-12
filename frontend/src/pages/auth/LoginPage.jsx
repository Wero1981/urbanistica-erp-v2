/**
 * Pantalla de autenticacion del ERP inmobiliario.
 */

import { useState } from "react";
import {
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { apiError } from "../../api/apiClient";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useAuth } from "../../contexts/authContext";

export default function LoginPage(){
    const navigate = useNavigate();
    const {signIn, isLoading} = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, SetError] = useState("");

    async function handleSubmit(event) {

        event.preventDefault();

        SetError("");

        try{
            await signIn(username.trim(), password);
            
            // Cada nuevo inicio de sesión comienza sin empresa seleccionada.
            sessionStorage.removeItem("urbanistica-v2.company");

            navigate("/seleccionar-empresa", {
                replace: true,
            });
        }catch(err){
            const status = err.response?.status;

            if(status === 401 ){
                SetError(
                    "El usuario o la contraseña no son correctos."
                )
                return;

            }

            SetError(
                apiError(err)
            );

        }
   
    }

return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[1.1fr_0.9fr]">

      {/* Panel institucional */}
      <section className="relative hidden overflow-hidden bg-primary p-12 text-text-inverse lg:flex lg:flex-col lg:justify-between">

        <div
          aria-hidden="true"
          className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/10"
        />

        <div
          aria-hidden="true"
          className="absolute -bottom-40 -left-24 h-[32rem] w-[32rem] rounded-full border border-white/10"
        />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
            <Building2 size={23} />
          </div>

          <div>
            <p className="font-semibold">
              Urbanística
            </p>

            <p className="text-xs text-white/60">
              Gestión inmobiliaria
            </p>
          </div>
        </div>

        <div className="relative z-10 max-w-xl">
          <p className="mb-5 text-sm font-medium uppercase tracking-[0.22em] text-white/55">
            ERP Inmobiliario
          </p>

          <h1 className="text-4xl font-semibold leading-tight xl:text-5xl">
            Control integral de su patrimonio inmobiliario.
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-white/65">
            Centralice inmuebles, contratos, documentos,
            mantenimiento y operaciones desde una sola plataforma.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-sm text-white/55">
          <ShieldCheck size={17} />

          <span>
            Acceso seguro a información empresarial
          </span>
        </div>
      </section>


      {/* Autenticación */}
      <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10 lg:px-16">

        <div className="w-full max-w-md">

          <div className="mb-10 lg:hidden">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-text-inverse">
              <Building2 size={24} />
            </div>

            <p className="font-semibold text-text">
              Urbanística Inmobiliaria
            </p>
          </div>


          <header className="mb-8">
            <p className="mb-2 text-sm font-medium text-secondary">
              Bienvenido
            </p>

            <h2 className="text-3xl font-semibold tracking-tight text-text">
              Iniciar sesión
            </h2>

            <p className="mt-3 text-sm leading-6 text-text-muted">
              Ingrese sus credenciales para acceder al sistema de
              administración inmobiliaria.
            </p>
          </header>


          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <Input
              id="username"
              label="Usuario"
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              placeholder="Ingrese su usuario"
              autoComplete="username"
              autoFocus
              required
            />


            <div className="relative">
              <Input
                id="password"
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Ingrese su contraseña"
                autoComplete="current-password"
                required
                className="pr-12"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((current) => !current)
                }
                className="absolute right-3 top-[38px] flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition hover:bg-surface-muted hover:text-text"
                aria-label={
                  showPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                {showPassword
                  ? <EyeOff size={18} />
                  : <Eye size={18} />
                }
              </button>
            </div>


            {error && (
              <div
                role="alert"
                className="rounded-xl border border-danger/20 bg-danger-soft px-4 py-3 text-sm text-danger"
              >
                {error}
              </div>
            )}


            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  Iniciar sesión
                  <ArrowRight size={17} />
                </>
              )}
            </Button>
          </form>


          <footer className="mt-10 border-t border-border pt-6">
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <LockKeyhole size={14} />

              <span>
                Acceso exclusivo para usuarios autorizados.
              </span>
            </div>
          </footer>

        </div>
      </section>
    </main>
  );

}
