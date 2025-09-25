import { supabase } from '@/lib/supabaseClient';

type Row = {
  taxon_id: string;
  full_name: string;
  character: { id: string; name: string; order_index: number } | null;
  state: { id: string; code: string; label: string } | null;
  certainty: string | null;
};

export default async function MatrixPage() {
  // On tire tout puis on regroupe côté serveur (page.tsx est un Server Component)
  const { data, error } = await supabase
    .from('taxon_character_state')
    .select(`
      taxon_id,
      certainty,
      taxon:taxon_id ( id, full_name ),
      character:character_id ( id, name, order_index ),
      state:character_state_id ( id, code, label )
    `);

  if (error) return <main style={{padding:24}}>Erreur : {error.message}</main>;

  // Regroupement par taxon
  const byTaxon = new Map<string, { name: string; rows: Row[] }>();
  (data as any[]).forEach((r) => {
    const id = r.taxon?.id as string;
    const name = r.taxon?.full_name as string;
    if (!byTaxon.has(id)) byTaxon.set(id, { name, rows: [] });
    byTaxon.get(id)!.rows.push({
      taxon_id: id,
      full_name: name,
      character: r.character,
      state: r.state,
      certainty: r.certainty
    });
  });

  // Tri des caractères à l’intérieur de chaque taxon
  for (const v of byTaxon.values()) {
    v.rows.sort((a, b) => (a.character?.order_index ?? 0) - (b.character?.order_index ?? 0));
  }

  return (
    <main style={{padding:24, display:'grid', gap:24}}>
      <h1>Taxons & caractères</h1>
      {[...byTaxon.entries()]
        .sort((a,b) => a[1].name.localeCompare(b[1].name))
        .map(([taxonId, group]) => (
        <section key={taxonId} style={{border:'1px solid #eee', borderRadius:8, padding:12}}>
          <h2 style={{margin:0}}>{group.name}</h2>
          <ul style={{marginTop:8}}>
            {group.rows.map((r, i) => (
              <li key={i}>
                <strong>{r.character?.name} :</strong> {r.state?.label}
                {' '}
                <small style={{opacity:.6}}>({r.state?.code}{r.certainty ? `, ${r.certainty}` : ''})</small>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
const { data, error } = await supabase.rpc('get_taxa_with_characters');
const taxa = data as Array<{ id:string; full_name:string; characters:any[] }>;

