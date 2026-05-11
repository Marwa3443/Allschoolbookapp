import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { REVELATION_TYPE } from '../config/constants.js';

const Surah = sequelize.define('Surah', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  arabic_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  english_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  transliteration: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  verse_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  revelation_type: {
    type: DataTypes.ENUM(REVELATION_TYPE.MAKKAN, REVELATION_TYPE.MADANAH),
    allowNull: true,
  },
  revelation_order: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  surah_order: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  image_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'surahs',
  timestamps: false,
  underscored: true,
});

export default Surah;
