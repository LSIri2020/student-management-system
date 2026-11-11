import { useEffect, useState } from 'react';
import './App.css';

const API = 'https://student-management-api-7zpp.onrender.com/api/students';
const VIDE = { nom: '', email: '', filiere: '', age: '' };

export default function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(VIDE);
  const [editingId, setEditingId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);

  async function charger() {
    try {
      const res = await fetch(`${API}?search=${encodeURIComponent(search)}`);
      if (!res.ok) throw new Error('Chargement impossible');
      setStudents(await res.json());
    } catch (e) {
      setMessage({ type: 'error', text: e.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    charger();
  }, [search]);

  function changer(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function annuler() {
    setForm(VIDE);
    setEditingId(null);
  }

  async function enregistrer(e) {
    e.preventDefault();
    try {
      const res = await fetch(editingId ? `${API}/${editingId}` : API, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, age: Number(form.age) })
      });
      const data = await res.json();
      if (!res.ok) return setMessage({ type: 'error', text: data.message });
      setMessage({ type: 'success', text: editingId ? 'Étudiant modifié' : 'Étudiant ajouté' });
      annuler();
      charger();
    } catch {
      setMessage({ type: 'error', text: 'Serveur injoignable' });
    }
  }

  function modifier(s) {
    setEditingId(s._id);
    setForm({ nom: s.nom, email: s.email, filiere: s.filiere, age: s.age });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function supprimer(s) {
    if (!window.confirm(`Supprimer ${s.nom} ?`)) return;
    try {
      const res = await fetch(`${API}/${s._id}`, { method: 'DELETE' });
      const data = await res.json();
      setMessage({ type: res.ok ? 'success' : 'error', text: data.message });
      if (selected && selected._id === s._id) setSelected(null);
      charger();
    } catch {
      setMessage({ type: 'error', text: 'Serveur injoignable' });
    }
  }

  return (
    <div className="app">
      <header className="top">
        <h1>Gestion des étudiants</h1>
        <p>Ajoutez, modifiez et consultez vos étudiants.</p>
      </header>

      {message.text && <p className={`msg ${message.type}`} role="status">{message.text}</p>}

      <section className="panel">
        <h2>{editingId ? "Modifier l'étudiant" : 'Ajouter un étudiant'}</h2>
        <form onSubmit={enregistrer} className="form">
          <label>Nom<input name="nom" value={form.nom} onChange={changer} required /></label>
          <label>Email<input name="email" type="email" value={form.email} onChange={changer} required /></label>
          <label>Filière<input name="filiere" value={form.filiere} onChange={changer} required /></label>
          <label>Âge<input name="age" type="number" min="15" max="100" value={form.age} onChange={changer} required /></label>
          <div className="actions">
            <button type="submit" className="btn primary">{editingId ? 'Enregistrer' : 'Ajouter'}</button>
            {editingId && <button type="button" className="btn" onClick={annuler}>Annuler</button>}
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="bar">
          <h2>Liste des étudiants ({students.length})</h2>
          <input
            className="search"
            placeholder="Rechercher par nom ou filière"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? <p>Chargement…</p> : students.length === 0 ? (
          <p>Aucun étudiant trouvé.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Nom</th><th>Email</th><th>Filière</th><th>Âge</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id}>
                    <td>{s.nom}</td>
                    <td>{s.email}</td>
                    <td>{s.filiere}</td>
                    <td>{s.age}</td>
                    <td className="row-actions">
                      <button className="btn small" onClick={() => setSelected(s)}>Détail</button>
                      <button className="btn small" onClick={() => modifier(s)}>Modifier</button>
                      <button className="btn small danger" onClick={() => supprimer(s)}>Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selected && (
        <section className="panel detail">
          <h2>Détail de l'étudiant</h2>
          <p><strong>Nom :</strong> {selected.nom}</p>
          <p><strong>Email :</strong> {selected.email}</p>
          <p><strong>Filière :</strong> {selected.filiere}</p>
          <p><strong>Âge :</strong> {selected.age} ans</p>
          <p><strong>Ajouté le :</strong> {new Date(selected.createdAt).toLocaleDateString('fr-FR')}</p>
          <button className="btn" onClick={() => setSelected(null)}>Fermer</button>
        </section>
      )}
    </div>
  );
}