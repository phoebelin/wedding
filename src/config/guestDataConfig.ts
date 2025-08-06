/**
 * Google Sheets Configuration for Wedding Guest Data
 * 
 * To set up your Google Sheet:
 * 1. Create a new Google Sheet with columns: name, table, note, image
 * 2. Add your guest data
 * 3. Make the sheet publicly viewable (Share -> Anyone with link -> Viewer)
 * 4. Copy the Sheet ID from the URL and paste it below
 * 
 * Sheet URL format: https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit#gid=0
 */

// Replace this with your Google Sheet ID
export const GOOGLE_SHEET_ID = '14jTS1M8d8ui22EYunaIuZ31cLxz9d-xEH8DWPmr9TGg';

// Example Sheet ID format: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'
// You can find this in your Google Sheet URL between /d/ and /edit

/**
 * Column mapping for the Google Sheet
 * Make sure your sheet has these exact column headers (case-insensitive):
 */
export const SHEET_COLUMNS = {
  NAME: 'name',
  TABLE: 'table', 
  NOTE: 'note',
  IMAGE: 'image'
} as const;

/**
 * Cache settings
 */
export const CACHE_SETTINGS = {
  DURATION_MINUTES: 5, // How long to cache data before fetching again
  MAX_RETRIES: 3 // How many times to retry failed requests
} as const;