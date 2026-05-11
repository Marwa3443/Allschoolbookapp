import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Reciter = sequelize.define('Reciter', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  arabic_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  english_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  image_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  recitation_style: {
    type: DataTypes.STRING(100), // موالي، قراءة عادية، إلخ
    allowNull: true,
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
  },
  total_ratings: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  popularity_score: {
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
  tableName: 'reciters',
  timestamps: false,
  underscored: true,
});

export default Reciter;
