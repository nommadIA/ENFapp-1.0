import { createClient } from "npm:@supabase/supabase-js@2";
const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } });
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return json({ error: "não autenticado" }, 401);
  const { data, error } = await sb.from("app_data").select("key,value").in("key", ["enf_plantoes", "enf_receber", "enf_contas"]);
  if (error) return json({ error: error.message }, 500);
  const hoje = new Date().setHours(0, 0, 0, 0), fim = ["Recebido", "Cancelado"], out: unknown[] = [];
  for (const row of data ?? []) {
    const tipo = row.key.replace("enf_", "");
    for (const r of (row.value as any[]) ?? []) {
      const dt = tipo === "plantoes" ? r.rec : r.data;
      if (!dt || !r.lem || r.pago || fim.includes(r.status)) continue;
      const dias = Math.round((new Date(dt + "T00:00").getTime() - hoje) / 864e5);
      if (dias <= 3) out.push({ tipo, descricao: r.desc || r.pac || r.hc, valor: r.valor, data: dt, hora: r.hrl ?? null, dias });
    }
  }
  return json({ lembretes: out });
});
