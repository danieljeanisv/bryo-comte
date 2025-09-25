'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Character = { id:string; name:string; order_index:number };
type State = { id:string; character_id:string; code:string; label:string };
type Result = { taxon_id:string; full_name:string; score:number };

export default function IdentifyPage() {
  const [chars, setChars] = useState<Character[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [results, setResults] = useState<Result[]|null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: c } = await supabase.from('character').select('id,name,order_index').order('order_index');
      const { data: s } = await supabase.from('character_state').select('id,character_id,code,label');
      setChars(c ?? []); setStates(s ?? []);
    })();
  }, []);

  const toggle = (code:string) =>
    setSelected(p => p.includes(code) ? p.filter(x=>x!==code) : [...p, code]);

  const run = async () => {
    setLoading(true);
    const { data } = await supabase.rpc('match_taxa_by_codes', { selected_codes: selected });
    setResults(data ?? []);
    setLoading(false);
  };

  return (
    <main style={{padding:24, display:'grid', gap:24}}>
      <h1>Identifier</h1>
      {chars.map(ch => (
        <div key={ch.id} style={{border:'1px solid #ddd', borderRadius:8, padding:12}}>
          <strong>{ch.name}</strong>
          <div style={{display:'flex', flexWrap:'wrap', gap:8, marginTop:8}}>
            {states.filter(s=>s.character_id===ch.id).map(st => {
              const checked = selected.includes(st.code);
              return (
                <label key={st.id} style={{border:'1px solid #ccc', borderRadius:6, padding:'6px 10px', cursor:'pointer'}}>
                  <input type="checkbox" checked={checked} onChange={()=>toggle(st.code)} style={{marginRight:6}}/>
                  {st.label} <small style={{opacity:.6}}>({st.code})</small>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      <div>
        <button onClick={run} disabled={loading} style={{padding:'8px 14px'}}>
          {loading ? 'Recherche…' : 'Identifier'}
        </button>
        <div style={{marginTop:8}}><small>États sélectionnés : {selected.join(', ') || 'aucun'}</small></div>
      </div>

      <section>
        <h2>Résultats</h2>
        {!results?.length && <p>Aucun résultat pour l’instant.</p>}
        <ul>
          {results?.map(r => (
            <li key={r.taxon_id}>
              <a href={`/taxa/${r.taxon_id}`}>{r.full_name}</a> — score {r.score}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
