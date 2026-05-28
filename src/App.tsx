import { Switch, Route, Router as WouterRouter } from "wouter";
import GamePage from "@/pages/GamePage";

function NotFound() {
  return (
    <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a", color: "#94a3b8" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48 }}>🍉</div>
        <h1 style={{ color: "#f1f5f9", marginTop: 8 }}>Page not found</h1>
        <a href="/" style={{ color: "#34d399", marginTop: 8, display: "block" }}>← Back to game</a>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={GamePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
    </WouterRouter>
  );
}
