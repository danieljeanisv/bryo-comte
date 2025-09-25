import { supabase } from '@/lib/supabaseClient';

export default async function TaxaPage() {
  const { data: taxa, error } = await supabase
    .from('taxon')
    .select('id, full_name')
    .order('full_name');

  if (error) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Erreur</h1>
        <p>{error.message}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Liste des taxons</h1>
      <ul>
        {(taxa ?? []).map((t) => (
          <li key={t.id}>{t.full_name}</li>
        ))}
      </ul>
    </main>
  );
}
