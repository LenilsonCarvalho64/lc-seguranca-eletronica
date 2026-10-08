const SUPABASE_URL = "https://gsixkkkzilucpjvrpvfo.supabase.co";
// A chave pública do Supabase será configurada neste arquivo antes do primeiro uso do painel.
const SUPABASE_PUBLISHABLE_KEY = "COLOQUE_A_CHAVE_PUBLICA_DO_SUPABASE_AQUI";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);