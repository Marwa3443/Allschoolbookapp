import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const DailyStatistics = sequelize.define('DailyStatistics', {
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
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  verses_memorized: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  total_study_minutes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  streak_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'daily_statistics',
  timestamps: false,
  underscored: true,
  indexes: [
    { fields: ['user_id', 'date'], unique: true },
  ],
});

DailyStatistics.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(DailyStatistics, { foreignKey: 'user_id' });

export default DailyStatistics;
