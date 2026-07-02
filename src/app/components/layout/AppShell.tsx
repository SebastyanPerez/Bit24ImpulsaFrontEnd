import { useState } from "react";
import {
  Bell,
  BookOpen,
  Bot,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Info,
  Layers,
  LayoutDashboard,
  Map,
  Menu,
  MessageSquare,
  Search,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import bit24Logo from "../../../imports/bit24_logo.png";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useAuth } from "../../context/AuthContext";
import {
  C,
  mapBackendRoleToRolId,
  NavId,
  navLabels,
  roleConfig,
} from "../../data/datosRegenda";
import DashboardView from "../../pages/DashboardView";
import RutaView from "../../pages/RutaView";
import MicroaprendizajeView from "../../pages/MicroaprendizajeView";
import AsistenteIAView from "../../pages/AsistenteIAView";
import AlertasView from "../../pages/AlertasView";
import SoporteView from "../../pages/SoporteView";
import PanelResponsableView from "../../pages/PanelResponsableView";
import TecnologiasView from "../../pages/TecnologiasView";
import LoginScreen from "../../pages/LoginScreen";
import { GestionUsuarios } from "../../pages/GestionUsuarios";

interface NavItem {
  id: NavId;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={17} />,
  },
  {
    id: "ruta",
    label: "Ruta de adopción",
    icon: <Map size={17} />,
  },
  {
    id: "microaprendizaje",
    label: "Microaprendizaje",
    icon: <BookOpen size={17} />,
  },
  { id: "ia", label: "Asistente IA", icon: <Bot size={17} /> },
  {
    id: "alertas",
    label: "Alertas WhatsApp",
    icon: <MessageSquare size={17} />,
  },
  {
    id: "soporte",
    label: "Soporte",
    icon: <Headphones size={17} />,
  },
  {
    id: "responsable",
    label: "Panel Responsable",
    icon: <Shield size={17} />,
  },
  {
    id: "tecnologias",
    label: "Tecnologías",
    icon: <Layers size={17} />,
  },
  {
    id: "usuarios",
    label: "Gestión de Usuarios",
    icon: <Users size={17} />,
  },
];

export default function AppShell() {
  const { usuario, token, logout } = useAuth();
  const [active, setActive] = useState<NavId>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const rol = usuario && usuario.rol ? mapBackendRoleToRolId(usuario.rol.nombre) : null;

  if (!token || !rol) {
    return <LoginScreen />;
  }

  const cfg = roleConfig[rol];
  const userDisplayName = usuario ? `${usuario.nombre} ${usuario.apellido}` : cfg.user;
  const userInitials = userDisplayName.slice(0, 2).toUpperCase();

  function renderView() {
    const roleName = usuario?.rol?.nombre || "";
    switch (active) {
      case "dashboard":
        return <DashboardView rol={rol} />;
      case "ruta":
        return <RutaView rol={rol} />;
      case "microaprendizaje":
        return <MicroaprendizajeView />;
      case "ia":
        return <AsistenteIAView />;
      case "alertas":
        return <AlertasView />;
      case "soporte":
        return <SoporteView />;
      case "responsable":
        if (roleName !== "Responsable Interno" && roleName !== "Administrador") {
          return <DashboardView rol={rol} />;
        }
        return <PanelResponsableView />;
      case "tecnologias":
        return <TecnologiasView />;
      case "usuarios":
        if (roleName !== "Administrador") {
          return <DashboardView rol={rol} />;
        }
        return <GestionUsuarios />;
      default:
        return <DashboardView rol={rol} />;
    }
  }

  const SidebarContent = ({ mobile = false }) => (
    <div
      className="flex flex-col h-full"
      style={{
        width: mobile ? 272 : collapsed ? 64 : 240,
        backgroundColor: "#fff",
        borderRight: `1px solid ${C.purple}0d`,
        transition: "width 0.2s ease",
      }}
    >
      <div
        className="flex items-center gap-2.5 px-3 h-14 flex-shrink-0"
        style={{
          borderBottom: `1px solid ${C.purple}0d`,
          justifyContent:
            collapsed && !mobile ? "center" : undefined,
        }}
      >
        {!collapsed || mobile ? (
          <ImageWithFallback
            src={bit24Logo}
            alt="Logo Bit24 Impulsa"
            className="object-contain"
            style={{ height: 36, width: "auto" }}
          />
        ) : (
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${C.purple}, ${C.purpleMid})`,
            }}
          >
            <Zap size={14} color="#fff" />
          </div>
        )}
        {(!collapsed || mobile) && (
          <span
            className="text-sm font-extrabold"
            style={{
              color: C.purple,
              fontFamily: "var(--font-brand)",
              marginLeft: 2,
            }}
          >
            Impulsa
          </span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3 flex flex-col gap-0.5 px-2">
        {navItems
          .filter((item) => {
            const roleName = usuario?.rol?.nombre || "";
            if (item.id === "responsable") {
              return roleName === "Responsable Interno" || roleName === "Administrador";
            }
            if (item.id === "usuarios") {
              return roleName === "Administrador";
            }
            return true;
          })
          .map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActive(item.id);
                  setMobileOpen(false);
                }}
                title={
                  collapsed && !mobile ? item.label : undefined
                }
                className="flex items-center rounded-xl font-semibold transition-all hover:opacity-90"
                style={{
                  gap: 10,
                  padding:
                    collapsed && !mobile ? "9px 0" : "9px 12px",
                  justifyContent:
                    collapsed && !mobile
                      ? "center"
                      : "flex-start",
                  width: "100%",
                  backgroundColor: isActive
                    ? `${C.purple}12`
                    : "transparent",
                  color: isActive ? C.purple : C.gray,
                  fontFamily: "var(--font-brand)",
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  minHeight: "36px",
                  borderLeft: isActive
                    ? `3px solid ${C.purple}`
                    : "3px solid transparent",
                }}
              >
                <span style={{ flexShrink: 0 }}>{item.icon}</span>
                {(!collapsed || mobile) && (
                  <span className="truncate text-left">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
      </nav>

      <div
        className="p-3"
        style={{ borderTop: `1px solid ${C.purple}0d` }}
      >
        {(!collapsed || mobile) && (
          <>
            <div
              className="flex items-center gap-2.5 px-2 py-2 rounded-xl mb-2"
              style={{ backgroundColor: C.purpleLight }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${C.purple}, ${C.purpleMid})`,
                  fontFamily: "var(--font-brand)",
                }}
              >
                {userInitials}
              </div>
              <div className="min-w-0">
                <p
                  className="text-xs font-extrabold truncate"
                  style={{
                    color: C.purple,
                    fontFamily: "var(--font-brand)",
                  }}
                >
                  {userDisplayName}
                </p>
                <p
                  className="text-xs truncate"
                  style={{
                    color: C.gray,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {usuario?.rol?.nombre || cfg.label}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full text-xs font-semibold py-1.5 rounded-xl hover:opacity-80 transition-opacity"
              style={{
                color: C.gray,
                fontFamily: "var(--font-brand)",
              }}
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        backgroundColor: "#f4f2f5",
        fontFamily: "var(--font-body)",
      }}
    >
      <div className="hidden md:flex h-full flex-shrink-0 relative">
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-16 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md z-10 hover:shadow-lg transition-shadow"
          style={{
            border: `1px solid ${C.purple}15`,
            color: C.purple,
          }}
        >
          {collapsed ? (
            <ChevronRight size={12} />
          ) : (
            <ChevronLeft size={12} />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative h-full shadow-2xl">
            <SidebarContent mobile />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header
          className="h-14 bg-white flex items-center gap-3 px-4 flex-shrink-0"
          style={{
            borderBottom: `1px solid ${C.purple}0d`,
            boxShadow: `0 1px 8px ${C.purple}06`,
          }}
        >
          <button
            className="md:hidden p-1.5 rounded-xl hover:opacity-80"
            style={{ color: C.purple }}
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={18} />
          </button>

          <div className="flex items-center gap-1.5 text-sm flex-1 min-w-0">
            <span
              className="font-extrabold hidden sm:block"
              style={{
                color: C.purple,
                fontFamily: "var(--font-brand)",
              }}
            >
              Impulsa
            </span>
            <ChevronRight
              size={14}
              style={{ color: `${C.purple}40` }}
              className="hidden sm:block"
            />
            <span
              className="font-extrabold truncate"
              style={{
                color: "#2a1028",
                fontFamily: "var(--font-brand)",
              }}
            >
              {navLabels[active]}
            </span>
          </div>

          <div
            className="hidden sm:flex items-center gap-2 rounded-xl px-3 py-1.5 w-44"
            style={{
              backgroundColor: C.purpleLight,
              border: `1px solid ${C.purple}18`,
            }}
          >
            <Search
              size={13}
              style={{ color: C.purple, flexShrink: 0 }}
            />
            <input
              placeholder="Buscar..."
              className="bg-transparent text-sm outline-none w-full"
              style={{
                color: "#2a1028",
                fontFamily: "var(--font-body)",
              }}
            />
          </div>

          <div
            className="hidden sm:flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
            style={{
              backgroundColor: C.yellowLight,
              color: "#7a4f00",
              border: `1px solid ${C.yellow}`,
              fontFamily: "var(--font-brand)",
            }}
          >
            <Info size={11} /> Demo 20%
          </div>

          <button
            className="relative p-1.5 rounded-xl hover:opacity-80 transition-opacity"
            style={{ color: C.purple }}
            onClick={() => setActive("alertas")}
          >
            <Bell size={18} />
            <span
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{ backgroundColor: C.red }}
            />
          </button>

          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-extrabold cursor-pointer hover:opacity-90 flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${C.purple}, ${C.purpleMid})`,
              fontFamily: "var(--font-brand)",
            }}
          >
            {userInitials}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
