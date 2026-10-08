async function loadSiteContent() {
  const result = await supabaseClient.from("site_content").select("content_key,content_value").order("content_key");
  if (result.error) throw result.error;
  return result.data || [];
}
async function saveSiteContent(ownerId,key,value) {
  const result = await supabaseClient.from("site_content").upsert(
    {owner_id:ownerId,content_key:key,content_value:value,is_public:true},
    {onConflict:"owner_id,content_key"}
  );
  if (result.error) throw result.error;
}