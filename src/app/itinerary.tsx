import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  getItineraryItems,
  saveItineraryItem,
  deleteItineraryItem,
  type ItineraryItem,
} from '../database/database'

export default function ItineraryScreen() {
  const [tripId, setTripId] = useState('1');
  const [activity, setActivity] = useState('');
  const [activityDate, setActivityDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<ItineraryItem[]>([]);

  async function loadItems() {
    const data = await getItineraryItems(Number(tripId));
    setItems(data);
  }

async function addActivity() {
  if (!activity.trim() || !activityDate.trim()) {
    Alert.alert('Missing details', 'Enter an activity and date.');
    return;
  }

  await saveItineraryItem(
    Number(tripId),
    activity,
    activityDate,
    notes
  );

  setActivity('');
  setActivityDate('');
  setNotes('');
  await loadItems();
}

async function removeActivity(id: number) {
  await deleteItineraryItem(id);
  await loadItems();
}

    

  useEffect(() => {
    loadItems();
  }, [tripId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Itinerary</Text>

      <TextInput
        style={styles.input}
        placeholder="Trip ID"
        keyboardType="numeric"
        value={tripId}
        onChangeText={setTripId}
      />

      <TextInput
        style={styles.input}
        placeholder="Activity"
        value={activity}
        onChangeText={setActivity}
      />

      <TextInput
        style={styles.input}
        placeholder="Date (YYYY-MM-DD)"
        value={activityDate}
        onChangeText={setActivityDate}
      />

      <TextInput
        style={styles.input}
        placeholder="Notes"
        value={notes}
        onChangeText={setNotes}
      />

      <Button title="Add Activity" onPress={addActivity} />

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.activity}>{item.activity}</Text>
            <Text>{item.activityDate}</Text>
            <Text>{item.notes}</Text>
            <Button
  title="Delete"
  color="#B23B3B"
  onPress={() => removeActivity(item.id)}
/>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F0',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#245B50',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  activity: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#245B50',
  },
});