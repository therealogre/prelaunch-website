/**
 * Environment Configuration
 * This file provides environment variables to the frontend.
 * In production, these values are injected at build time.
 * For local development, they can be set in the .env file.
 */

// Base configuration
const config = {
  // Supabase Configuration
  supabaseUrl: process.env.SUPABASE_URL || window.ENV_SUPABASE_URL || 'https://your-supabase-url.supabase.co',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || window.ENV_SUPABASE_ANON_KEY || 'your-supabase-anon-key',
  
  // Application Settings
  nodeEnv: process.env.NODE_ENV || 'development',
  apiUrl: process.env.API_URL || '/api',
  
  // Feature Flags
  enableAnalytics: process.env.ENABLE_ANALYTICS === 'true' || false,
  enableEmailVerification: process.env.ENABLE_EMAIL_VERIFICATION !== 'false', // true by default
  
  // Payment Configuration
  paynowIntegrationId: process.env.PAYNOW_INTEGRATION_ID || '',
  
  // Logging
  logLevel: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'error' : 'debug'),
  
  // Version
  version: process.env.APP_VERSION || '1.0.0'
};

// Validate required environment variables
const requiredVars = ['supabaseUrl', 'supabaseAnonKey'];
const missingVars = requiredVars.filter(key => !config[key]);

if (missingVars.length > 0 && config.nodeEnv === 'development') {
  console.warn('Missing required environment variables:', missingVars.join(', '));
}

// Export configuration
window.ENV = Object.freeze(config);

export default config;
