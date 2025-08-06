import Papa from 'papaparse';
import { GOOGLE_SHEET_ID, CACHE_SETTINGS } from '../config/guestDataConfig';

export interface Guest {
  name: string;
  table: number;
  note: string;
  image: string;
}

export class GuestDataService {
  private static instance: GuestDataService;
  private cache: Guest[] | null = null;
  private lastFetchTime: number = 0;
  private readonly CACHE_DURATION = CACHE_SETTINGS.DURATION_MINUTES * 60 * 1000;
  
  private constructor() {}

  static getInstance(): GuestDataService {
    if (!GuestDataService.instance) {
      GuestDataService.instance = new GuestDataService();
    }
    return GuestDataService.instance;
  }

  /**
   * Get the CSV export URL for the Google Sheet
   */
  private getSheetCsvUrl(): string {
    if (!GOOGLE_SHEET_ID) {
      throw new Error('Google Sheet ID not configured. Please set GOOGLE_SHEET_ID in src/config/guestDataConfig.ts');
    }
    return `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/export?format=csv&gid=0`;
  }

  /**
   * Check if cached data is still valid
   */
  private isCacheValid(): boolean {
    return this.cache !== null && 
           (Date.now() - this.lastFetchTime) < this.CACHE_DURATION;
  }

  /**
   * Parse CSV data into Guest objects
   */
  private parseGuestData(csvText: string): Guest[] {
    const result = Papa.parse<any>(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase()
    });

    if (result.errors.length > 0) {
      console.warn('CSV parsing warnings:', result.errors);
    }

    return result.data.map((row: any) => ({
      name: String(row.name || '').trim(),
      table: parseInt(row.table) || 0,
      note: String(row.note || '').trim(),
      image: String(row.image || '').trim()
    })).filter(guest => guest.name); // Filter out empty rows
  }

  /**
   * Fetch guest data from Google Sheets
   */
  async fetchGuests(): Promise<Guest[]> {
    // Return cached data if still valid
    if (this.isCacheValid()) {
      return this.cache!;
    }

    try {
      const response = await fetch(this.getSheetCsvUrl());
      
      if (!response.ok) {
        throw new Error(`Failed to fetch guest data: ${response.status} ${response.statusText}`);
      }

      const csvText = await response.text();
      const guests = this.parseGuestData(csvText);

      // Update cache
      this.cache = guests;
      this.lastFetchTime = Date.now();

      return guests;
    } catch (error) {
      console.error('Error fetching guest data:', error);
      
      // Return cached data if available, even if expired
      if (this.cache) {
        console.warn('Using cached guest data due to fetch error');
        return this.cache;
      }

      // Fallback to default data if no cache available
      return this.getFallbackData();
    }
  }

  /**
   * Search for a guest by name (case-insensitive, partial match)
   */
  async findGuest(searchName: string): Promise<Guest | null> {
    const guests = await this.fetchGuests();
    const normalizedSearch = searchName.toLowerCase().trim();
    
    return guests.find(guest => 
      guest.name.toLowerCase().includes(normalizedSearch)
    ) || null;
  }

  /**
   * Get all guests for a specific table
   */
  async getGuestsByTable(tableNumber: number): Promise<Guest[]> {
    const guests = await this.fetchGuests();
    return guests.filter(guest => guest.table === tableNumber);
  }

  /**
   * Force refresh of guest data (bypass cache)
   */
  async refreshData(): Promise<Guest[]> {
    this.cache = null;
    return this.fetchGuests();
  }

  /**
   * Fallback data in case Google Sheets is unavailable
   */
  private getFallbackData(): Guest[] {
    return [
      { name: "John Smith", table: 5, note: "Looking forward to having you join us!", image: "guests/guest-john.jpg" },
      { name: "Emma Johnson", table: 3, note: "Can't wait to celebrate with you!", image: "guests/guest-emma.jpg" },
      { name: "Michael Williams", table: 8, note: "We're so happy you can make it!", image: "guests/guest-michael.jpg" },
      { name: "Sarah Brown", table: 2, note: "Thank you for being part of our special day!", image: "guests/guest-sarah.jpg" },
      { name: "David Miller", table: 9, note: "We're so glad you're here, David! You have been such a light to us, thank you for joining. Can't wait to spend more time with you at dinner :) We're so glad you're here, David! You have been such a light to us, thank you for joining. Can't wait to spend more time with you at dinner :)", image: "guests/guest-david.jpg" },
    ];
  }
}

// Export singleton instance
export const guestDataService = GuestDataService.getInstance();