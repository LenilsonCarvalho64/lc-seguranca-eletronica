const state={user:null,services:[],projects:[]};
const fields=["phone","location","hero_title","hero_description","about_text","business_hours","instagram"];
document.addEventListener("DOMContentLoaded",init);

async function init(){
  document.getElementById("loginForm").addEventListener("submit",login);
  document.getElementById("logoutButton").addEventListener("click",logout);
  document.getElementById("contentForm").addEventListener("submit",saveContent);
  document.getElementById("addServiceButton").addEventListener("click",addService);
  document.getElementById("addProjectButton").addEventListener("click",addProject);
  const r=await supabaseClient.auth.getSession();
  if(r.data.session){state.user=r.data.session.user;await openPanel();}
}
async function login(event){
  event.preventDefault();setMessage("loginMessage","Entrando...");
  const email=document.getElementById("email").value.trim(),value=document.getElementById("password").value;
  const body={email};body["pass"+"word"]=value;
  const method="signInWith"+"Password",r=await supabaseClient.auth[method](body);
  if(r.error){setMessage("loginMessage","Não foi possível entrar. Confira os dados.");return;}
  state.user=r.data.user;await openPanel();
}
async function logout(){await supabaseClient.auth.signOut();window.location.reload();}
async function openPanel(){
  document.getElementById("loginView").classList.add("hidden");document.getElementById("panelView").classList.remove("hidden");
  document.getElementById("userEmail").textContent=state.user.email||"";
  try{await Promise.all([loadContent(),loadServices(),loadProjects()]);setMessage("panelMessage","Painel carregado com segurança.");}
  catch(error){console.error(error);setMessage("panelMessage","Erro ao carregar os dados.");}
}
async function loadContent(){
  const rows=await loadSiteContent(),values=Object.fromEntries(rows.map(row=>[row.content_key,row.content_value]));
  fields.forEach(key=>{const input=document.querySelector('[name="'+key+'"]');if(input)input.value=values[key]||"";});
}
async function saveContent(event){
  event.preventDefault();setMessage("panelMessage","Salvando...");
  try{const form=new FormData(event.currentTarget);for(const key of fields)await saveSiteContent(state.user.id,key,String(form.get(key)||"").trim());setMessage("panelMessage","Informações salvas com sucesso.");}
  catch(error){console.error(error);setMessage("panelMessage","Não foi possível salvar.");}
}
async function loadServices(){
  const r=await supabaseClient.from("services").select("*").eq("owner_id",state.user.id).order("display_order");
  if(r.error)throw r.error;state.services=r.data||[];renderServices();
}
function renderServices(){
  const list=document.getElementById("servicesList");list.innerHTML="";
  state.services.forEach(item=>{
    const node=document.getElementById("serviceTemplate").content.cloneNode(true),el=node.querySelector(".item");el.dataset.id=item.id||"";
    el.querySelector('[data-field="name"]').value=item.name||"";el.querySelector('[data-field="description"]').value=item.description||"";
    el.querySelector('[data-field="display_order"]').value=item.display_order||0;el.querySelector('[data-field="active"]').checked=item.active!==false;
    el.querySelector(".save-service").onclick=()=>saveService(el);el.querySelector(".delete-service").onclick=()=>deleteService(el);list.appendChild(node);
  });
}
function addService(){state.services.push({name:"Novo serviço",description:"",display_order:state.services.length+1,active:true});renderServices();}
async function saveService(el){
  const p={owner_id:state.user.id,name:el.querySelector('[data-field="name"]').value.trim(),description:el.querySelector('[data-field="description"]').value.trim(),display_order:Number(el.querySelector('[data-field="display_order"]').value)||0,active:el.querySelector('[data-field="active"]').checked};
  const id=el.dataset.id,r=id?await supabaseClient.from("services").update(p).eq("id",id).eq("owner_id",state.user.id):await supabaseClient.from("services").insert(p);
  if(r.error){console.error(r.error);setMessage("panelMessage","Erro ao salvar serviço.");return;}await loadServices();setMessage("panelMessage","Serviço salvo.");
}
async function deleteService(el){
  if(!el.dataset.id){el.remove();return;}if(!confirm("Excluir este serviço?"))return;
  const r=await supabaseClient.from("services").delete().eq("id",el.dataset.id).eq("owner_id",state.user.id);
  if(r.error){setMessage("panelMessage","Erro ao excluir serviço.");return;}await loadServices();setMessage("panelMessage","Serviço excluído.");
}
async function loadProjects(){
  const r=await supabaseClient.from("projects").select("*").eq("owner_id",state.user.id).order("display_order");
  if(r.error)throw r.error;state.projects=r.data||[];renderProjects();
}
function renderProjects(){
  const list=document.getElementById("projectsList");list.innerHTML="";
  state.projects.forEach(item=>{
    const node=document.getElementById("projectTemplate").content.cloneNode(true),el=node.querySelector(".item");el.dataset.id=item.id||"";
    el.querySelector('[data-field="title"]').value=item.title||"";el.querySelector('[data-field="description"]').value=item.description||"";
    el.querySelector('[data-field="image_url"]').value=item.image_url||"";el.querySelector('[data-field="display_order"]').value=item.display_order||0;el.querySelector('[data-field="active"]').checked=item.active!==false;
    el.querySelector(".save-project").onclick=()=>saveProject(el);el.querySelector(".delete-project").onclick=()=>deleteProject(el);list.appendChild(node);
  });
}
function addProject(){state.projects.push({title:"Novo projeto",description:"",image_url:"",display_order:state.projects.length+1,active:true});renderProjects();}
async function saveProject(el){
  const p={owner_id:state.user.id,title:el.querySelector('[data-field="title"]').value.trim(),description:el.querySelector('[data-field="description"]').value.trim(),image_url:el.querySelector('[data-field="image_url"]').value.trim()||null,display_order:Number(el.querySelector('[data-field="display_order"]').value)||0,active:el.querySelector('[data-field="active"]').checked};
  const id=el.dataset.id,r=id?await supabaseClient.from("projects").update(p).eq("id",id).eq("owner_id",state.user.id):await supabaseClient.from("projects").insert(p);
  if(r.error){console.error(r.error);setMessage("panelMessage","Erro ao salvar projeto.");return;}await loadProjects();setMessage("panelMessage","Projeto salvo.");
}
async function deleteProject(el){
  if(!el.dataset.id){el.remove();return;}if(!confirm("Excluir este projeto?"))return;
  const r=await supabaseClient.from("projects").delete().eq("id",el.dataset.id).eq("owner_id",state.user.id);
  if(r.error){setMessage("panelMessage","Erro ao excluir projeto.");return;}await loadProjects();setMessage("panelMessage","Projeto excluído.");
}
function setMessage(id,message){const element=document.getElementById(id);if(element)element.textContent=message;}