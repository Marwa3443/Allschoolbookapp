import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const CommunityPost = sequelize.define('CommunityPost', {
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
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING(50), // سؤال، نصيحة، إلخ
    allowNull: true,
  },
  is_pinned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  views_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
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
  tableName: 'community_posts',
  timestamps: false,
  underscored: true,
});

CommunityPost.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(CommunityPost, { foreignKey: 'user_id' });

export default CommunityPost;
