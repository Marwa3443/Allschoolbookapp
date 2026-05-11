import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import Achievement from './Achievement.js';

const UserAchievement = sequelize.define('UserAchievement', {
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
  achievement_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Achievement,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  unlocked_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'user_achievements',
  timestamps: false,
  underscored: true,
  indexes: [
    { fields: ['user_id', 'achievement_id'], unique: true },
  ],
});

UserAchievement.belongsTo(User, { foreignKey: 'user_id' });
UserAchievement.belongsTo(Achievement, { foreignKey: 'achievement_id' });
User.hasMany(UserAchievement, { foreignKey: 'user_id' });
Achievement.hasMany(UserAchievement, { foreignKey: 'achievement_id' });

export default UserAchievement;
