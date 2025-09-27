// src/screens/UserProfileScreen.styles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212529',
    textAlign: 'center',
  },
  userCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarText: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007bff',
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 80,
  },
  userDetails: {
    alignItems: 'center',
  },
  displayName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d4edda',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#28a745',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#155724',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});