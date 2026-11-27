
import * as SQLite from 'expo-sqlite';
import { doc, setDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';
import { auth, db as firestoreDb } from '../services/firebase';

export type Trip = {
  id: number;
  destination: string;
  startDate: string;
  endDate: string;
  description: string;
};
export type ItineraryItem = {
  id: number;
  tripId: number;
  activity: string;
  activityDate: string;
  notes: string;
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
    await database.execAsync(`
  CREATE TABLE IF NOT EXISTS itinerary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tripId INTEGER NOT NULL,
    activity TEXT NOT NULL,
    activityDate TEXT NOT NULL,
    notes TEXT
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
  const localDb = await getDatabase();

  const result = await localDb.runAsync(
    `INSERT INTO trips (destination, startDate, endDate, description)
     VALUES (?, ?, ?, ?)`,
    destination,
    startDate,
    endDate,
    description
  );

  const user = auth.currentUser;

  if (user) {
    try {
      await setDoc(
        doc(
          firestoreDb,
          'users',
          user.uid,
          'trips',
          String(result.lastInsertRowId)
        ),
        {
          id: result.lastInsertRowId,
          destination,
          startDate,
          endDate,
          description,
        }
      );
    } catch (error) {
      console.warn('Cloud save failed:', error);
    }
  }
}

export async function getTrips(): Promise<Trip[]> {
  const localDb = await getDatabase();
  const user = auth.currentUser;

  if (user) {
    try {
      const snapshot = await getDocs(
        collection(firestoreDb, 'users', user.uid, 'trips')
      );

      for (const tripDoc of snapshot.docs) {
        const trip = tripDoc.data();

        await localDb.runAsync(
          `INSERT OR REPLACE INTO trips
           (id, destination, startDate, endDate, description)
           VALUES (?, ?, ?, ?, ?)`,
          trip.id,
          trip.destination,
          trip.startDate,
          trip.endDate,
          trip.description
        );
      }
    } catch (error) {
      console.warn('Cloud fetch failed:', error);
    }
  }

  return await localDb.getAllAsync<Trip>(
    'SELECT * FROM trips ORDER BY id DESC'
  );
}
export async function saveItineraryItem(
  tripId: number,
  activity: string,
  activityDate: string,
  notes: string
) {
  const localDb = await getDatabase();

  const result = await localDb.runAsync(
    `INSERT INTO itinerary (tripId, activity, activityDate, notes)
     VALUES (?, ?, ?, ?)`,
    tripId,
    activity,
    activityDate,
    notes
  );

  const user = auth.currentUser;

  if (user) {
    try {
      await setDoc(
        doc(
          firestoreDb,
          'users',
          user.uid,
          'itinerary',
          String(result.lastInsertRowId)
        ),
        {
          id: result.lastInsertRowId,
          tripId,
          activity,
          activityDate,
          notes,
        }
      );
    } catch (error) {
      console.warn('Cloud itinerary save failed:', error);
    }
  }
}
export async function getItineraryItems(
  tripId: number
): Promise<ItineraryItem[]> {
  const localDb = await getDatabase();
  const user = auth.currentUser;

  if (user) {
    try {
      const snapshot = await getDocs(
        collection(firestoreDb, 'users', user.uid, 'itinerary')
      );

      for (const itemDoc of snapshot.docs) {
        const item = itemDoc.data();

        if (item.tripId === tripId) {
          await localDb.runAsync(
            `INSERT OR REPLACE INTO itinerary
             (id, tripId, activity, activityDate, notes)
             VALUES (?, ?, ?, ?, ?)`,
            item.id,
            item.tripId,
            item.activity,
            item.activityDate,
            item.notes
          );
        }
      }
    } catch (error) {
      console.warn('Cloud itinerary fetch failed:', error);
    }
  }

  return await localDb.getAllAsync<ItineraryItem>(
    'SELECT * FROM itinerary WHERE tripId = ? ORDER BY activityDate ASC',
    tripId
  );
}
export async function deleteItineraryItem(id: number) {
  const localDb = await getDatabase();

  // Delete from local SQLite database
  await localDb.runAsync(
    'DELETE FROM itinerary WHERE id = ?',
    id
  );

  // Delete from Firebase
  const user = auth.currentUser;

  if (user) {
    try {
      await deleteDoc(
        doc(
          firestoreDb,
          'users',
          user.uid,
          'itinerary',
          String(id)
        )
      );
    } catch (error) {
      console.warn('Cloud itinerary deletion failed:', error);
    }
  }
}
export async function updateTrip(
  id: number,
  destination: string,
  startDate: string,
  endDate: string,
  description: string
) {
  const localDb = await getDatabase();

  await localDb.runAsync(
    `UPDATE trips
     SET destination = ?, startDate = ?, endDate = ?, description = ?
     WHERE id = ?`,
    destination,
    startDate,
    endDate,
    description,
    id
  );

  const user = auth.currentUser;

  if (user) {
    try {
      await setDoc(
        doc(firestoreDb, 'users', user.uid, 'trips', String(id)),
        {
          id,
          destination,
          startDate,
          endDate,
          description,
        }
      );
    } catch (error) {
      console.warn('Cloud update failed:', error);
    }
  }
}
export async function deleteTrip(id: number) {
  const localDb = await getDatabase();

  await localDb.runAsync(
    'DELETE FROM trips WHERE id = ?',
    id
  );

  const user = auth.currentUser;

  if (user) {
    try {
      await deleteDoc(
        doc(firestoreDb, 'users', user.uid, 'trips', String(id))
      );
    } catch (error) {
      console.warn('Cloud deletion failed:', error);
    }
  }
}