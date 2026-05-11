import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { ACHIEVEMENT_TYPE } from '../config/constants.js';

const Achievement = sequelize.define('Achievement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  badge_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  icon_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  requirement_type: {
    type: DataTypes.ENUM(
      ACHIEVEMENT_TYPE.VERSES_MEMORIZED,
      ACHIEVEMENT_TYPE.SURAHS_COMPLETED,
      ACHIEVEMENT_TYPE.DAILY_STREAK,
      ACHIEVEMENT_TYPE.ACCURACY_PERCENTAGE
    ),
    allowNull: false,
  },
  requirement_value: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  points_reward: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'achievements',
  timestamps: false,
  underscored: true,
});

export default Achievement;
