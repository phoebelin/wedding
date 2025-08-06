# Google Sheets Integration Setup Guide

## Step 1: Create Your Google Sheet

1. **Create a new Google Sheet**: Go to [sheets.google.com](https://sheets.google.com) and create a new sheet
2. **Set up columns** in Row 1 with these exact headers:
   ```
   A1: name
   B1: table  
   C1: note
   D1: image
   ```

3. **Add your guest data** starting from Row 2:
   ```
   Example:
   A2: John Smith        B2: 5    C2: Looking forward to celebrating!    D2: guests/guest-john.jpg
   A3: Emma Johnson      B3: 3    C3: Can't wait to see you there!       D3: guests/guest-emma.jpg
   ```

## Step 2: Make Sheet Publicly Accessible

1. **Click the "Share" button** in the top-right corner of your Google Sheet
2. **Change access settings**:
   - Click "Anyone with the link"
   - Set permissions to "Viewer" (not Editor)
   - Click "Done"

## Step 3: Get Your Sheet ID

1. **Copy the Sheet URL** - it looks like:
   ```
   https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0
   ```

2. **Extract the Sheet ID** - it's the long string between `/d/` and `/edit`:
   ```
   In the example above: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
   ```

## Step 4: Configure Your Wedding App

1. **Open the file**: `src/config/guestDataConfig.ts`
2. **Replace the empty GOOGLE_SHEET_ID** with your Sheet ID:
   ```typescript
   export const GOOGLE_SHEET_ID = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms';
   ```

## Step 5: Test Your Setup

1. **Start your development server**: `npm start`
2. **Navigate to the seat finder page**
3. **Search for one of your guests** - it should find them from your Google Sheet!

## Updating Guest Data

To update guest information:
1. **Edit your Google Sheet** directly (add/remove guests, change table numbers, etc.)
2. **Refresh your wedding website** - changes appear automatically within 5 minutes!

## Notes

- **Privacy**: Your sheet is publicly viewable but not editable
- **Performance**: Data is cached for 5 minutes to avoid excessive requests
- **Fallback**: If Google Sheets is unavailable, the app falls back to hardcoded guest data
- **Real-time**: Changes to your sheet appear on the website within 5 minutes automatically

## Troubleshooting

**Guest not found**: Check that:
- Guest name in sheet matches search exactly
- Sheet is publicly accessible
- Sheet ID is correct in config file

**Errors loading data**: Check browser developer console for specific error messages.