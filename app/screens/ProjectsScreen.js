import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { getProjects, createProject } from '../api/projects';

function ProjectsScreen() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  const loadProjects = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);

      const response = await getProjects();
      setProjects(response.data);
    } catch (err) {
      Alert.alert('Error', err.response?.data || 'Could not load projects.');
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProjects();
    }, [])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProjects(false);
    setRefreshing(false);
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      return Alert.alert('Project Required', 'Please enter a project name.');
    }

    try {
      const response = await createProject({
        name: newProjectName.trim(),
        description: newProjectDescription.trim(),
      });

      const createdProject = response.data;

      setProjects((current) => [createdProject, ...current]);
      setNewProjectName('');
      setNewProjectDescription('');
      setModalVisible(false);
    } catch (err) {
      Alert.alert('Error', err.response?.data || 'Could not create project.');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={projects}
        keyExtractor={(project) => project._id}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <Text style={styles.header}>Projects</Text>

            <Pressable
              style={styles.createButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.buttonText}>Create New Project</Text>
            </Pressable>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No projects found.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.projectCard}>
            <Text style={styles.projectName}>{item.name}</Text>

            {item.description ? (
              <Text style={styles.projectDescription}>{item.description}</Text>
            ) : (
              <Text style={styles.projectDescription}>No description</Text>
            )}
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Create Project</Text>

            <TextInput
              style={styles.input}
              placeholder="Project name"
              value={newProjectName}
              onChangeText={setNewProjectName}
            />

            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Description optional"
              value={newProjectDescription}
              onChangeText={setNewProjectDescription}
              multiline
            />

            <Pressable style={styles.submitButton} onPress={handleCreateProject}>
              <Text style={styles.buttonText}>Create</Text>
            </Pressable>

            <Pressable
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  list: {
    padding: 12,
    paddingBottom: 30,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  createButton: {
    backgroundColor: 'black',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  projectCard: {
    backgroundColor: '#f7f7f7',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  projectName: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  projectDescription: {
    marginTop: 6,
    color: '#555',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#666',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  input: {
    backgroundColor: '#f7f7f7',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  descriptionInput: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: 'black',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default ProjectsScreen;