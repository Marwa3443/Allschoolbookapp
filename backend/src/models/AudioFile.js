import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Surah from './Surah.js';
import Reciter from './Reciter.js';

const AudioFile = sequelize.define('AudioFile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
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
  reciter_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: Reciter,
      key: 'id',
    },
    onDelete: 'SET NULL',
  },
  audio_url: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER, // in seconds
    allowNull: false,
  },
  bitrate: {
    type: DataTypes.INTEGER, // kbps
    defaultValue: 320,
  },
  file_size: {
    type: DataTypes.INTEGER, // in bytes
    allowNull: true,
  },
  format: {
    type: DataTypes.STRING(10),
    defaultValue: 'mp3',
  },
  download_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'audio_files',
  timestamps: false,
  underscored: true,
});

AudioFile.belongsTo(Surah, { foreignKey: 'surah_id' });
AudioFile.belongsTo(Reciter, { foreignKey: 'reciter_id' });
Surah.hasMany(AudioFile, { foreignKey: 'surah_id' });
Reciter.hasMany(AudioFile, { foreignKey: 'reciter_id' });

export default AudioFile;
