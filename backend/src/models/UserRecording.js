import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import Surah from './Surah.js';

const UserRecording = sequelize.define('UserRecording', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
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
    allowNull: true,
  },
  recording_url: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER, // in seconds
    allowNull: false,
  },
  accuracy_percentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
  errors_detected: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  audio_analysis: {
    type: DataTypes.JSON,
    allowNull: true, // storing analysis data
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'user_recordings',
  timestamps: false,
  underscored: true,
});

UserRecording.belongsTo(User, { foreignKey: 'user_id' });
UserRecording.belongsTo(Surah, { foreignKey: 'surah_id' });
User.hasMany(UserRecording, { foreignKey: 'user_id' });
Surah.hasMany(UserRecording, { foreignKey: 'surah_id' });

export default UserRecording;
