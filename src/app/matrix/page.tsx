import { supabase } from '@/lib/supabaseClient';

type CharacterMini = { id: string; name: string; order_index: number };
type StateMini = { id: string; code: string; label: string };
type TcsRow = {
  taxon_id: string | null;
  certainty: string | null;
  taxon: { id: string; full_name: string } | null;
  character: CharacterMini | null;
  state: StateMini | null;
};

export default async function MatrixPage() {
  const { data, error } = await supabase
    .from('taxon_character_state')
    .select(`
      taxon_id,
      certainty,
      taxon:taxon_id ( id, full_name ),
      character:character_id ( id, name, order_index ),
      state:character_state_id ( id, code, label )
    `);

  if (error) {
    return <main style={{ padding: 24 }}>Erreur : {error.message}</main>;
  }
  const rows: TcsRow[] = (data ?? []) as TcsRow[];

  // Regrouper par taxon
  const byTaxon = new Map<string, { name: string; rows: TcsRow[] }>();
  for (const r of rows) {
    const id = r.taxon?.id;
    const name = r.taxon?.full_name ?? '—';
    if (!id) continue;
    if (!byTaxon.has(id)) byTaxon.set(id, { name, rows: [] });
    byTaxon.get(id)!.rows.push(r);
  }

  // Trier les caractères par order_index
  for (const v of byTaxon.values()) {
    v.rows.sort(
      (a, b) => (a.character?.order_index ?? 0) - (b.character?.order_index ?? 0)
    );
  }

  const groups = [...byTaxon.entries()].sort((a, b) =>
    a[1].name.localeCompare(b[1].name)
  );

  return (
    <main style={{ padding: 24, display: 'grid', gap: 24 }}>
      <h1>Taxons & caractères</h1>
      {groups.map(([taxonId, group]) => (
        <section
          key={taxonId}
          style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}
        >
          <h2 style={{ margin: 0 }}>{group.name}</h2>
          <ul style={{ marginTop: 8 }}>
            {group.rows.map((r, i) => (
              <li key={i}>
                <strong>{r.character?.name} :</strong> {r.state?.label}{' '}
                <small style={{ opacity: 0.6 }}>
                  ({r.state?.code}{r.certainty ? `, ${r.certainty}` : ''})
                </small>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
