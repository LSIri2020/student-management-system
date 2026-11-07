const express = require('express');
const mongoose = require('mongoose');
const Student = require('../models/Student');

const router = express.Router();

// Vérifie que l'ID a un format valide
function idValide(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'ID invalide' });
  }
  next();
}

// Transforme les erreurs en réponses claires
function gererErreur(err, res) {
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Cet email existe déjà' });
  }
  console.error(err);
  res.status(500).json({ message: 'Erreur serveur' });
}

// Sécurise la recherche (évite les caractères spéciaux de regex)
const echapper = (texte) => texte.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// LISTER (avec recherche optionnelle : ?search=...)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const filtre = search
      ? {
          $or: [
            { nom: { $regex: echapper(search), $options: 'i' } },
            { filiere: { $regex: echapper(search), $options: 'i' } }
          ]
        }
      : {};
    const students = await Student.find(filtre).sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    gererErreur(err, res);
  }
});

// VOIR LE DÉTAIL
router.get('/:id', idValide, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Étudiant introuvable' });
    res.json(student);
  } catch (err) {
    gererErreur(err, res);
  }
});

// AJOUTER
router.post('/', async (req, res) => {
  try {
    const { nom, email, filiere, age } = req.body;
    const student = await Student.create({ nom, email, filiere, age });
    res.status(201).json(student);
  } catch (err) {
    gererErreur(err, res);
  }
});

// MODIFIER
router.put('/:id', idValide, async (req, res) => {
  try {
    const { nom, email, filiere, age } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { nom, email, filiere, age },
      { new: true, runValidators: true }
    );
    if (!student) return res.status(404).json({ message: 'Étudiant introuvable' });
    res.json(student);
  } catch (err) {
    gererErreur(err, res);
  }
});

// SUPPRIMER
router.delete('/:id', idValide, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Étudiant introuvable' });
    res.json({ message: 'Étudiant supprimé' });
  } catch (err) {
    gererErreur(err, res);
  }
});

module.exports = router;