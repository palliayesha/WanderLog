
import * as SQLite from 'expo-sqlite';

export type Trip = {
  id: number;
  destination: string;
  startDate: string;
  endDate: string;
  description: string;
};

let database: SQLite.SQLiteDatabase | null = null;

export async function getDatabase() {
  if (!database) {
    database = await SQLite.openDatabaseAsync('wanderlog.db');

    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS trips (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        destination TEXT NOT NULL,
        startDate TEXT NOT NULL,
        endDate TEXT NOT NULL,
        description TEXT
      );
    `);
  }

  return database;
}

export async function saveTrip(
  destination: string,
  startDate: string,
  endDate: string,
  description: string
) {
  const db = await getDatabase();

  await db.runAsync(
    `INSERT INTO trips (destination, startDate, endDate, description)
     VALUES (?, ?, ?, ?)`,
    destination,
    startDate,
    endDate,
    description
  );
}

export async function getTrips(): Promise<Trip[]> {
  const db = await getDatabase();

  return await db.getAllAsync<Trip>(
    'SELECT * FROM trips ORDER BY id DESC'
  );
}
