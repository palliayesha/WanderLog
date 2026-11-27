
import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import {
  saveJournalEntry,
  getJournalEntries,
  deleteJournalEntry,
  type JournalEntry,
} from '../database/database';

export default function JournalScreen() {
  const [tripId, setTripId] = useState('1');
  const [caption, setCaption] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  async function loadEntries() {
    const data = await getJournalEntries(Number(tripId));
    setEntries(data);
  }

  async function pickImage() {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow gallery access to choose a photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  }

  async function addEntry() {
    if (!imageUri) {
      Alert.alert('Choose a photo', 'Please select a photo first.');
      return;
    }

    await saveJournalEntry(Number(tripId), imageUri, caption);
    setImageUri('');
    setCaption('');
    await loadEntries();
  }

  async function removeEntry(id: number) {
    await deleteJournalEntry(id);
    await loadEntries();
  }

  useEffect(() => {
    loadEntries();
  }, [tripId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Travel Journal</Text>

      <TextInput
        style={styles.input}
        placeholder="Trip ID"
        keyboardType="numeric"
        value={tripId}
        onChangeText={setTripId}
      />

      <Button title="Choose Photo" onPress={pickImage} />

      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.preview} />
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Write a caption..."
        value={caption}
        onChangeText={setCaption}
      />

      <Button title="Save Journal Entry" onPress={addEntry} />

      <FlatList
        data={entries}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imageUri }} style={styles.photo} />
            <Text style={styles.caption}>{item.caption}</Text>
            <Text>{new Date(item.createdAt).toLocaleDateString()}</Text>
            <Button
              title="Delete"
              color="#B23B3B"
              onPress={() => removeEntry(item.id)}
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
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  preview: {
    width: '100%',
    height: 200,
    marginVertical: 12,
    borderRadius: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginTop: 15,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  caption: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#245B50',
    marginVertical: 8,
  },
});
