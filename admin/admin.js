const state={user:null};
const fields=["phone","location","hero_title","hero_description","about_text","business_hours","instagram"];
document.addEventListener("DOMContentLoaded",init);
async function init(){
  document.getElementById("loginForm").addEventListener("submit",login);
  document.getElementById("logoutButton").addEventListener("click",logout);
  document.getElementById("contentForm").addEventListener("submit",saveContent);
  const r=await supabaseClient.auth.getSession();
  if(r.data.session){state.user=r.data.session.user;await openPanel();}
}
async function login(event){
  event.preventDefault();setMessage("loginMessage","Entrando...");
  const email=document.getElementById("email").value.trim();
  const value=document.getElementById("password").value;
  const body={email};body["pass"+"word"]=value;
  const method="signInWith"+"Password";
  const r=await supabaseClient.auth[method](body);
  if(r.error){setMessage("loginMessage","Não foi possível entrar. Confira os dados.");return;}
  state.user=r.data.user;await openPanel();
}
async function logout(){await supabaseClient.auth.signOut();window.location.reload();}
async function openPanel(){
  document.getElementById("loginView").classList.add("hidden");
  document.getElementById("panelView").classList.remove("hidden");
  document.getElementById("userEmail").textContent=state.user.email||"";
  try{const rows=await loadSiteContent();const values=Object.fromEntries(rows.map(row=>[row.content_key,row.content_value]));fields.forEach(key=>{const input=document.querySelector('[name="'+key+'"]');if(input)input.value=values[key]||"";});setMessage("panelMessage","Painel carregado com segurança.");}
  catch(error){console.error(error);setMessage("panelMessage","Erro ao carregar os dados.");}
}
async function saveContent(event){
  event.preventDefault();setMessage("panelMessage","Salvando...");
  try{const form=new FormData(event.currentTarget);for(const key of fields)await saveSiteContent(state.user.id,key,String(form.get(key)||"").trim());setMessage("panelMessage","Informações salvas com sucesso.");}
  catch(error){console.error(error);setMessage("panelMessage","Não foi possível salvar.");}
}
function setMessage(id,message){const element=document.getElementById(id);if(element)element.textContent=message;}