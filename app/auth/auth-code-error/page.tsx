import Link from "next/link"

export default function AuthCodeError() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd 0%, #e8f5e8 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "500px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#1565c0",
              margin: "0 0 8px 0",
            }}
          >
            SEMA
          </h1>
          <p
            style={{
              color: "#2e7d32",
              fontSize: "16px",
              margin: 0,
            }}
          >
            Sistema de Gestão Educacional
          </p>
        </div>

        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "32px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              backgroundColor: "#ffebee",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <span style={{ fontSize: "32px", color: "#d32f2f" }}>⚠️</span>
          </div>

          <h2
            style={{
              fontSize: "24px",
              marginBottom: "16px",
              color: "#1a1a1a",
            }}
          >
            Erro na Confirmação
          </h2>

          <p
            style={{
              color: "#666666",
              marginBottom: "24px",
              lineHeight: "1.6",
            }}
          >
            O link de confirmação é inválido ou expirou. Isso pode acontecer se:
          </p>

          <ul
            style={{
              textAlign: "left",
              color: "#666666",
              marginBottom: "32px",
              paddingLeft: "20px",
            }}
          >
            <li style={{ marginBottom: "8px" }}>
              O link já foi usado anteriormente
            </li>
            <li style={{ marginBottom: "8px" }}>
              O link expirou (válido por 24 horas)
            </li>
            <li style={{ marginBottom: "8px" }}>
              O link foi copiado incorretamente
            </li>
          </ul>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Link
              href="/auth/login"
              style={{
                display: "block",
                padding: "12px 24px",
                backgroundColor: "#1976d2",
                color: "white",
                textDecoration: "none",
                borderRadius: "8px",
                fontWeight: "600",
              }}
            >
              Tentar Fazer Login
            </Link>

            <Link
              href="/auth/sign-up"
              style={{
                display: "block",
                padding: "12px 24px",
                backgroundColor: "transparent",
                color: "#1976d2",
                textDecoration: "none",
                borderRadius: "8px",
                border: "2px solid #1976d2",
                fontWeight: "600",
              }}
            >
              Criar Nova Conta
            </Link>
          </div>

          <p
            style={{
              fontSize: "14px",
              color: "#999999",
              marginTop: "24px",
            }}
          >
            Se o problema persistir, entre em contato com o administrador.
          </p>
        </div>
      </div>
    </div>
  )
}
