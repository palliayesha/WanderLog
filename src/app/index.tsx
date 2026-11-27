
import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../services/firebase';
import { login, signUp, logout } from '../services/auth';
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
  deleteTrip,
  getTrips,
  saveTrip,
  updateTrip,
  type Trip
} from '../database/database';


export default function HomeScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [isSignUp, setIsSignUp] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [editingTripId, setEditingTripId] = useState<number | null>(null);
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

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  return unsubscribe;
}, []);


  const handleAuthentication = async () => {
  if (!email.trim() || !password.trim()) {
    Alert.alert('Missing details', 'Please enter your email and password.');
    return;
  }

  try {
    if (isSignUp) {
      await signUp(email.trim(), password);
      Alert.alert('Success', 'Your account has been created!');
    } else {
      await login(email.trim(), password);
    }
  } catch (error: any) {
    Alert.alert('Authentication Error', error.message);
  }
};

const createTrip = async () => {
  if (!destination.trim() || !startDate.trim() || !endDate.trim()) {
    Alert.alert('Missing details', 'Please enter destination and both dates.');
    return;
  }

  try {
    if (editingTripId !== null) {
      await updateTrip(
        editingTripId,
        destination.trim(),
        startDate.trim(),
        endDate.trim(),
        description.trim()
      );
    } else {
      await saveTrip(
        destination.trim(),
        startDate.trim(),
        endDate.trim(),
        description.trim()
      );
    }

    const savedTrips = await getTrips();
    setTrips(savedTrips);

    setDestination('');
    setStartDate('');
    setEndDate('');
    setDescription('');
    setEditingTripId(null);
    setModalVisible(false);

    Alert.alert(
      'Success!',
      editingTripId !== null
        ? 'Your trip has been updated.'
        : 'Your trip has been saved.'
    );
  } catch (error) {
    console.error('Error saving trip:', error);
    Alert.alert('Error', 'Could not save your trip. Please try again.');
  }
};
const startEditingTrip = (trip: Trip) => {
  setEditingTripId(trip.id);
  setDestination(trip.destination);
  setStartDate(trip.startDate);
  setEndDate(trip.endDate);
  setDescription(trip.description);
  setModalVisible(true);
};
const confirmDeleteTrip = (trip: Trip) => {
  Alert.alert(
    'Delete Trip',
    `Are you sure you want to delete ${trip.destination}?`,
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTrip(trip.id);
            const savedTrips = await getTrips();
            setTrips(savedTrips);
          } catch (error) {
            Alert.alert('Error', 'Could not delete this trip.');
          }
        },
      },
    ]
  );
};
if (!user) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>✈ WanderLog</Text>
      <Text style={styles.tagline}>YOUR JOURNEY, YOUR STORY</Text>

      <Text style={styles.heroTitle}>
        {isSignUp ? 'Create Account' : 'Welcome Back'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email address"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable
        style={styles.createButton}
        onPress={handleAuthentication}
      >
        <Text style={styles.createButtonText}>
          {isSignUp ? 'Create Account' : 'Login'}
        </Text>
      </Pressable>

      <Pressable onPress={() => setIsSignUp(!isSignUp)}>
        <Text style={styles.footerText}>
          {isSignUp
            ? 'Already have an account? Login'
            : 'New here? Create an account'}
        </Text>
      </Pressable>
    </View>
  );
}

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
              <View style={styles.actionButtons}>
  <Pressable
    style={styles.editButton}
    onPress={() => startEditingTrip(trip)}
  >
    <Text style={styles.editButtonText}>Edit Trip</Text>
  </Pressable>

  <Pressable
    style={styles.deleteButton}
    onPress={() => confirmDeleteTrip(trip)}
  >
    <Text style={styles.deleteButtonText}>Delete Trip</Text>
  </Pressable>
</View>
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
                <Text style={styles.saveButtonText}>
  {editingTripId !== null ? 'Update Trip' : 'Save My Trip'}
</Text>
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
  backgroundColor: '#FFFFFF',
  padding: 20,
  borderRadius: 20,
  marginBottom: 18,
  borderWidth: 1,
  borderColor: '#E8E6D9',
  elevation: 3,
  shadowColor: '#253C35',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  },
  actionButtons: {
  flexDirection: 'row',
  gap: 12,
  marginTop: 16,
},

editButton: {
  flex: 1,
  backgroundColor: '#245B50',
  padding: 12,
  borderRadius: 10,
  alignItems: 'center',
},

editButtonText: {
  color: '#FFFFFF',
  fontWeight: 'bold',
},

deleteButton: {
  flex: 1,
  backgroundColor: '#F3E4DF',
  padding: 12,
  borderRadius: 10,
  alignItems: 'center',
},

deleteButtonText: {
  color: '#A34435',
  fontWeight: 'bold',
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
