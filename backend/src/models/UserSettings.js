import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const UserSettings = sequelize.define('UserSettings', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  dark_mode: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  font_size: {
    type: DataTypes.ENUM('small', 'medium', 'large'),
    defaultValue: 'medium',
  },
  notifications_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  email_notifications: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  daily_reminder_time: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  language: {
    type: DataTypes.STRING(10),
    defaultValue: 'ar',
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
  tableName: 'user_settings',
  timestamps: false,
  underscored: true,
});

UserSettings.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(UserSettings, { foreignKey: 'user_id' });

export default UserSettings;
