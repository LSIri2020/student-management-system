const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, 'Le nom est obligatoire'],
      trim: true,
      minlength: [2, 'Le nom est trop court']
    },
    email: {
      type: String,
      required: [true, "L'email est obligatoire"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email invalide']
    },
    filiere: {
      type: String,
      required: [true, 'La filière est obligatoire'],
      trim: true
    },
    age: {
      type: Number,
      required: [true, "L'âge est obligatoire"],
      min: [15, 'Âge minimum : 15 ans'],
      max: [100, 'Âge maximum : 100 ans']
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);