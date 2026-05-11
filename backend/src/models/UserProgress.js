import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import Surah from './Surah.js';
import { PROGRESS_STATUS } from '../config/constants.js';

const UserProgress = sequelize.define('UserProgress', {
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
  status: {
    type: DataTypes.ENUM(
      PROGRESS_STATUS.LEARNING,
      PROGRESS_STATUS.MEMORIZED,
      PROGRESS_STATUS.REVISED
    ),
    defaultValue: PROGRESS_STATUS.LEARNING,
  },
  accuracy_percentage: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
  },
  times_reviewed: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  last_review_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
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
  tableName: 'user_progress',
  timestamps: false,
  underscored: true,
  indexes: [
    { fields: ['user_id', 'surah_id', 'verse_number'], unique: true },
  ],
});

UserProgress.belongsTo(User, { foreignKey: 'user_id' });
UserProgress.belongsTo(Surah, { foreignKey: 'surah_id' });
User.hasMany(UserProgress, { foreignKey: 'user_id' });
Surah.hasMany(UserProgress, { foreignKey: 'surah_id' });

export default UserProgress;
