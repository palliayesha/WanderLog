
import { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  getTrips,
  saveTrip,
  type Trip
} from '../database/database';


export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [trips, setTrips] = useState<Trip[]>([]);
useEffect(() => {
  const loadSavedTrips = async () => {
    try {
      const savedTrips = await getTrips();
      setTrips(savedTrips);
    } catch (error) {
      console.error('Error loading trips:', error);
      Alert.alert('Error', 'Could not load your saved trips.');
    }
  };

  loadSavedTrips();
}, []);
  
const createTrip = async () => {
  if (!destination.trim() || !startDate.trim() || !endDate.trim()) {
    Alert.alert('Missing details', 'Please enter destination and both dates.');
    return;
  }

  try {
    await saveTrip(
      destination.trim(),
      startDate.trim(),
      endDate.trim(),
      description.trim()
    );

    const savedTrips = await getTrips();
    setTrips(savedTrips);

    setDestination('');
    setStartDate('');
    setEndDate('');
    setDescription('');
    setModalVisible(false);

    Alert.alert('Success!', 'Your trip has been saved.');
  } catch (error) {
    console.error('Error saving trip:', error);
    Alert.alert('Error', 'Could not save your trip. Please try again.');
  }
};


  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>✈ WanderLog</Text>
        <Text style={styles.tagline}>YOUR JOURNEY, YOUR STORY</Text>
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroSmall}>
          EXPLORE • DISCOVER • REMEMBER
        </Text>
        <Text style={styles.heroTitle}>
          Every journey{'\n'}has a story.
        </Text>
        <Text style={styles.heroText}>
          Plan your trips, capture memories,
          and keep every adventure in one place.
        </Text>
        <Text style={styles.heroIcon}>🌍 ✈️ 🧳</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Adventures</Text>

        <Pressable
          style={styles.createButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.createButtonText}>＋ Create New Trip</Text>
        </Pressable>

        {trips.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No trips yet!</Text>
            <Text style={styles.emptyText}>
              Your next adventure starts here.
              Create your first trip and make memories.
            </Text>
          </View>
        ) : (
          trips.map((trip) => (
            <View key={trip.id} style={styles.tripCard}>
              <Text style={styles.tripName}>📍 {trip.destination}</Text>
              <Text style={styles.tripDate}>
                {trip.startDate} — {trip.endDate}
              </Text>
              <Text style={styles.tripDescription}>
                {trip.description || 'Your next adventure awaits!'}
              </Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          MADE FOR THE JOURNEYS THAT MATTER
        </Text>
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.modalScroll}
          >
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Plan a New Trip ✈️</Text>
              <Text style={styles.modalSubtitle}>
                Every great journey begins with a plan.
              </Text>

              <Text style={styles.label}>Destination *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Ooty, Paris, Dubai"
                value={destination}
                onChangeText={setDestination}
              />

              <Text style={styles.label}>Start Date *</Text>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/YYYY"
                value={startDate}
                onChangeText={setStartDate}
              />

              <Text style={styles.label}>End Date *</Text>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/YYYY"
                value={endDate}
                onChangeText={setEndDate}
              />

              <Text style={styles.label}>Trip Description</Text>
              <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="Tell us about your adventure..."
                multiline
                value={description}
                onChangeText={setDescription}
              />

              <Pressable
                style={styles.saveButton}
                onPress={createTrip}
              >
                <Text style={styles.saveButtonText}>Save My Trip</Text>
              </Pressable>

              <Pressable
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F0',
  },
  header: {
    padding: 24,
    paddingTop: 55,
  },
  logo: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#245B50',
  },
  tagline: {
    fontSize: 11,
    letterSpacing: 2,
    color: '#858B52',
    marginTop: 8,
  },
  hero: {
    backgroundColor: '#245B50',
    margin: 20,
    padding: 25,
    borderRadius: 24,
  },
  heroSmall: {
    color: '#E8E6D9',
    fontSize: 10,
    letterSpacing: 1.5,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 22,
    lineHeight: 43,
  },
  heroText: {
    color: '#E8E6D9',
    fontSize: 14,
    lineHeight: 23,
    marginTop: 14,
  },
  heroIcon: {
    fontSize: 35,
    marginTop: 25,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#253C35',
    marginBottom: 18,
  },
  createButton: {
    backgroundColor: '#858B52',
    padding: 17,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyCard: {
    backgroundColor: '#E8E6D9',
    padding: 20,
    borderRadius: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#245B50',
  },
  emptyText: {
    fontSize: 14,
    color: '#59665B',
    lineHeight: 22,
    marginTop: 8,
  },
  tripCard: {
    backgroundColor: '#E8E6D9',
    padding: 20,
    borderRadius: 16,
    marginBottom: 14,
  },
  tripName: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#245B50',
  },
  tripDate: {
    color: '#858B52',
    marginTop: 10,
    fontWeight: '600',
  },
  tripDescription: {
    color: '#59665B',
    marginTop: 8,
  },
  footer: {
    padding: 25,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: '#858B52',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  modalScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#F8F6F0',
    padding: 24,
    borderRadius: 22,
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#245B50',
  },
  modalSubtitle: {
    color: '#858B52',
    marginTop: 8,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#253C35',
    marginBottom: 7,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D4D5C4',
    borderRadius: 11,
    padding: 13,
    color: '#253C35',
    fontSize: 15,
  },
  descriptionInput: {
    height: 90,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#245B50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 22,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    padding: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#858B52',
    fontWeight: '600',
  },
});
