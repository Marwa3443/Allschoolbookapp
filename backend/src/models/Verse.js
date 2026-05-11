import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Surah from './Surah.js';

const Verse = sequelize.define('Verse', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  surah_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Surah,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  verse_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  arabic_text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  transliteration: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  translation: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tajweed_rules: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  audio_duration: {
    type: DataTypes.INTEGER, // in seconds
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'verses',
  timestamps: false,
  underscored: true,
  indexes: [
    { fields: ['surah_id', 'verse_number'], unique: true },
  ],
});

Verse.belongsTo(Surah, { foreignKey: 'surah_id' });
Surah.hasMany(Verse, { foreignKey: 'surah_id' });

export default Verse;
