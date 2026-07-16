import { useState, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";
import { C, aiResponses } from "../data/datosRegenda";
import { FilledIconCard } from "../components/ui-shared/DesignSystem";
import { preguntar, getHistorial } from "../api/asistenteIA";

// ─── MÓDULO 5: Asistente IA generativa (Gemini) ───────────────────────────
export default function AsistenteIAView() {
  const [messages, setMessages] = useState<{ role: "assistant" | "user"; text: string }[]>([
    {
      role: "assistant",
      text: "Hola, soy **Impulsa AI** 🤖 Estoy aquí para ayudarte con cualquier duda sobre Bit24 en REGENDA. Escribí tu pregunta o elegí una sugerida.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const historyData = await getHistorial();
        const loadedMessages: { role: "assistant" | "user"; text: string }[] = [];
        // Insert greeting
        loadedMessages.push({
          role: "assistant",
          text: "Hola, soy **Impulsa AI** 🤖 Estoy aquí para ayudarte con cualquier duda sobre Bit24 en REGENDA. Escribí tu pregunta o elegí una sugerida.",
        });

        // The API returns historical logs sorted by created_at DESC (newest first).
        // Reverse them so they render chronologically (oldest first).
        const chronological = [...historyData].reverse();
        chronological.forEach((h) => {
          loadedMessages.push({ role: "user", text: h.pregunta });
          loadedMessages.push({ role: "assistant", text: h.respuesta || "" });
        });
        setMessages(loadedMessages);
      } catch (err) {
        console.error("Error al cargar historial del asistente:", err);
      }
    };

    fetchHistory();
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    setMessages((prev) => [
      ...prev,
      { role: "user" as const, text },
    ]);
    setInput("");
    setLoading(true);
    try {
      const response = await preguntar(text);
      setMessages((prev) => [
        ...prev,
        { role: "assistant" as const, text: response.respuesta || "No recibí respuesta del asistente." },
      ]);
    } catch (err) {
      console.error("Error al enviar pregunta a la IA:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant" as const,
          text: "Lo siento, ocurrió un error de conexión al consultar al asistente. Por favor, intente más tarde.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  function renderText(t: string) {
    return t
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br/>");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1
          className="text-xl font-extrabold"
          style={{
            color: C.purple,
            fontFamily: "var(--font-brand)",
          }}
        >
          Asistente IA
        </h1>
        <p
          className="text-sm mt-0.5"
          style={{
            color: C.gray,
            fontFamily: "var(--font-body)",
          }}
        >
          Respuestas en lenguaje natural sobre Bit24 — Gemini
        </p>
      </div>

      <div
        className="bg-white rounded-2xl flex flex-col overflow-hidden"
        style={{
          height: 530,
          border: `1.5px solid ${C.purple}18`,
          boxShadow: `0 4px 24px ${C.purple}0a`,
        }}
      >
        {/* Header IA */}
        <div
          className="flex items-center gap-3 p-4"
          style={{
            borderBottom: `1px solid ${C.purple}10`,
            background: `linear-gradient(135deg, ${C.purple}06, ${C.teal}04)`,
          }}
        >
          <FilledIconCard
            icon={<Sparkles size={16} />}
            size={38}
            color={C.purple}
          />
          <div>
            <p
              className="font-extrabold text-sm"
              style={{
                color: C.purple,
                fontFamily: "var(--font-brand)",
              }}
            >
              Impulsa AI
            </p>
            <p
              className="text-xs font-semibold"
              style={{
                color: C.teal,
                fontFamily: "var(--font-body)",
              }}
            >
              ● En línea · Conectado
            </p>
          </div>
          <span
            className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: `${C.purple}20`,
              color: C.purple,
              border: `1px solid ${C.purple}30`,
              fontFamily: "var(--font-brand)",
            }}
          >
            Powered by Gemini
          </span>
        </div>

        {/* Preguntas sugeridas ── Gestalt similitud */}
        <div
          className="p-3 flex gap-2 flex-wrap"
          style={{
            borderBottom: `1px solid ${C.purple}08`,
            backgroundColor: "#fdfbfd",
          }}
        >
          {Object.keys(aiResponses).map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="text-xs font-semibold px-3 py-1.5 rounded-full transition-all hover:opacity-90"
              style={{
                backgroundColor: `${C.purple}12`,
                color: C.purple,
                border: `1px solid ${C.purple}20`,
                fontFamily: "var(--font-brand)",
                minHeight: "30px",
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} gap-2`}
            >
              {m.role === "assistant" && (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    background: `linear-gradient(135deg, ${C.purple}, ${C.purpleMid})`,
                  }}
                >
                  <Sparkles size={12} color="#fff" />
                </div>
              )}
              <div
                className="max-w-xs sm:max-w-sm px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                style={{
                  background:
                    m.role === "user"
                      ? `linear-gradient(135deg, ${C.purple}, ${C.purpleMid})`
                      : "#f8f4f9",
                  color: m.role === "user" ? "#fff" : "#2a1028",
                  borderBottomRightRadius:
                    m.role === "user" ? 4 : undefined,
                  borderBottomLeftRadius:
                    m.role === "assistant" ? 4 : undefined,
                  fontFamily: "var(--font-body)",
                }}
                dangerouslySetInnerHTML={{
                  __html: renderText(m.text),
                }}
              />
            </div>
          ))}
          {loading && (
            <div className="flex gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${C.purple}, ${C.purpleMid})`,
                }}
              >
                <Sparkles size={12} color="#fff" />
              </div>
              <div
                className="px-4 py-3 rounded-2xl rounded-bl-sm"
                style={{ backgroundColor: "#f8f4f9" }}
              >
                <div className="flex gap-1 items-center h-4">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full animate-bounce"
                      style={{
                        backgroundColor: C.purple,
                        animationDelay: `${i * 150}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div
          className="p-4 flex gap-2"
          style={{ borderTop: `1px solid ${C.purple}10` }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && sendMessage(input)
            }
            placeholder="Escribí tu consulta sobre Bit24..."
            className="flex-1 text-sm rounded-xl px-4 py-2.5 outline-none"
            style={{
              backgroundColor: "#f8f4f9",
              border: `1.5px solid ${C.purple}18`,
              color: "#2a1028",
              fontFamily: "var(--font-body)",
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity"
            style={{
              background: `linear-gradient(135deg, ${C.purple}, ${C.purpleMid})`,
              minWidth: "40px",
            }}
          >
            <Send size={15} color="#fff" />
          </button>
        </div>
      </div>
    </div>
  );
}
