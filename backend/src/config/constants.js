// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// User Tiers
export const USER_TIERS = {
  FREE: 'free',
  PREMIUM: 'premium',
};

// Progress Status
export const PROGRESS_STATUS = {
  LEARNING: 'learning',
  MEMORIZED: 'memorized',
  REVISED: 'revised',
};

// Revelation Type
export const REVELATION_TYPE = {
  MAKKAN: 'makkan',
  MADANAH: 'madanah',
};

// Achievement Types
export const ACHIEVEMENT_TYPE = {
  VERSES_MEMORIZED: 'verses_memorized',
  SURAHS_COMPLETED: 'surahs_completed',
  DAILY_STREAK: 'daily_streak',
  ACCURACY_PERCENTAGE: 'accuracy_percentage',
};

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'بيانات دخول غير صحيحة',
  USER_NOT_FOUND: 'المستخدم غير موجود',
  EMAIL_ALREADY_EXISTS: 'البريد الإلكتروني مسجل بالفعل',
  UNAUTHORIZED_ACCESS: 'وصول غير مصرح',
  INVALID_TOKEN: 'توكن غير صحيح',
  TOKEN_EXPIRED: 'انتهت صلاحية التوكن',
  SERVER_ERROR: 'خطأ في السيرفر',
  VALIDATION_ERROR: 'خطأ في التحقق من البيانات',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Token Expiry Times
export const TOKEN_EXPIRY = {
  ACCESS_TOKEN: '1h',
  REFRESH_TOKEN: '90d',
};

// File Upload
export const FILE_LIMITS = {
  MAX_FILE_SIZE: 500 * 1024 * 1024, // 500MB
  ALLOWED_AUDIO_FORMATS: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
  ALLOWED_IMAGE_FORMATS: ['image/jpeg', 'image/png', 'image/gif'],
};

// Cache Duration (in seconds)
export const CACHE_DURATION = {
  SHORT: 60,        // 1 minute
  MEDIUM: 300,      // 5 minutes
  LONG: 3600,       // 1 hour
  VERY_LONG: 86400, // 24 hours
};
