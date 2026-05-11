-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  tier VARCHAR(20) DEFAULT 'free', -- free, premium
  birth_date DATE,
  country VARCHAR(100),
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Surahs Table
CREATE TABLE IF NOT EXISTS surahs (
  id SERIAL PRIMARY KEY,
  arabic_name VARCHAR(100) NOT NULL,
  english_name VARCHAR(100) NOT NULL,
  transliteration VARCHAR(100),
  verse_count INTEGER NOT NULL,
  revelation_type VARCHAR(20), -- makkan, madanah
  revelation_order INTEGER,
  surah_order INTEGER UNIQUE NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Verses Table
CREATE TABLE IF NOT EXISTS verses (
  id SERIAL PRIMARY KEY,
  surah_id INTEGER NOT NULL REFERENCES surahs(id) ON DELETE CASCADE,
  verse_number INTEGER NOT NULL,
  arabic_text TEXT NOT NULL,
  transliteration TEXT,
  translation TEXT,
  tajweed_rules TEXT,
  audio_duration INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(surah_id, verse_number)
);

-- Reciters Table
CREATE TABLE IF NOT EXISTS reciters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  arabic_name VARCHAR(255) NOT NULL,
  english_name VARCHAR(255) NOT NULL,
  country VARCHAR(100),
  bio TEXT,
  image_url VARCHAR(500),
  recitation_style VARCHAR(100),
  is_verified BOOLEAN DEFAULT false,
  rating NUMERIC(3, 2) DEFAULT 0,
  total_ratings INTEGER DEFAULT 0,
  popularity_score INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audio Files Table
CREATE TABLE IF NOT EXISTS audio_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  surah_id INTEGER NOT NULL REFERENCES surahs(id) ON DELETE CASCADE,
  reciter_id UUID REFERENCES reciters(id) ON DELETE SET NULL,
  audio_url VARCHAR(500) NOT NULL,
  duration INTEGER NOT NULL,
  bitrate INTEGER DEFAULT 320,
  file_size INTEGER,
  format VARCHAR(10) DEFAULT 'mp3',
  download_count INTEGER DEFAULT 0,
  rating NUMERIC(3, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Progress Table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  surah_id INTEGER NOT NULL REFERENCES surahs(id) ON DELETE CASCADE,
  verse_number INTEGER,
  status VARCHAR(20) DEFAULT 'learning', -- learning, memorized, revised
  accuracy_percentage NUMERIC(5, 2) DEFAULT 0,
  times_reviewed INTEGER DEFAULT 0,
  last_review_date TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, surah_id, verse_number)
);

-- User Recordings Table
CREATE TABLE IF NOT EXISTS user_recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  surah_id INTEGER NOT NULL REFERENCES surahs(id) ON DELETE CASCADE,
  verse_number INTEGER,
  recording_url VARCHAR(500) NOT NULL,
  duration INTEGER NOT NULL,
  accuracy_percentage NUMERIC(5, 2),
  errors_detected INTEGER DEFAULT 0,
  feedback TEXT,
  audio_analysis JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  badge_name VARCHAR(100) NOT NULL,
  description TEXT,
  icon_url VARCHAR(500),
  requirement_type VARCHAR(50) NOT NULL, -- verses_memorized, surahs_completed, daily_streak, accuracy_percentage
  requirement_value INTEGER NOT NULL,
  points_reward INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Achievements Table
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, achievement_id)
);

-- Daily Statistics Table
CREATE TABLE IF NOT EXISTS daily_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  verses_memorized INTEGER DEFAULT 0,
  total_study_minutes INTEGER DEFAULT 0,
  streak_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date)
);

-- Community Posts Table
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50),
  is_pinned BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Settings Table
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  dark_mode BOOLEAN DEFAULT false,
  font_size VARCHAR(20) DEFAULT 'medium',
  notifications_enabled BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  daily_reminder_time TIME,
  language VARCHAR(10) DEFAULT 'ar',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_verses_surah ON verses(surah_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_surah ON user_progress(surah_id);
CREATE INDEX IF NOT EXISTS idx_user_recordings_user ON user_recordings(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_statistics_user_date ON daily_statistics(user_id, date);
CREATE INDEX IF NOT EXISTS idx_community_posts_user ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_audio_files_surah ON audio_files(surah_id);
CREATE INDEX IF NOT EXISTS idx_audio_files_reciter ON audio_files(reciter_id);
