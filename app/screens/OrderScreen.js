import React, { useCallback, useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import Screen from '../components/Screen';
import ListItem from '../components/list/ListItem';
import Icon from '../components/Icon';
import AuthContext from '../context/AuthContext';

import { getItems } from '../api/items';
import { getProjects, createProject } from '../api/projects';
import { createOrder } from '../api/orders';

function OrderScreen() {
  const { user, refreshUser } = useContext(AuthContext);

  const [step, setStep] = useState(1);

  const [items, setItems] = useState([]);
  const [projects, setProjects] = useState([]);

  const [selectedItems, setSelectedItems] = useState({});
  const [selectedProjectId, setSelectedProjectId] = useState('');

  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  const [redeemAllPoints, setRedeemAllPoints] = useState(false);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [itemsModalVisible, setItemsModalVisible] = useState(false);
  const [projectsModalVisible, setProjectsModalVisible] = useState(false);
  const [createProjectModalVisible, setCreateProjectModalVisible] =
    useState(false);

  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [submittedItems, setSubmittedItems] = useState([]);

  const loadData = async () => {
    try {
      setLoading(true);

      const [itemsResponse, projectsResponse] = await Promise.all([
        getItems(),
        getProjects(),
      ]);

      setItems(itemsResponse.data);
      setProjects(projectsResponse.data);
    } catch (err) {
      Alert.alert('Error', err.response?.data || 'Could not load order data.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const selectedProject = projects.find(
    (project) => project._id === selectedProjectId
  );

  const selectedCount = Object.values(selectedItems).reduce(
    (sum, selected) => sum + selected.quantity,
    0
  );

  const incrementItem = (item) => {
    setSelectedItems((current) => {
      const currentQuantity = current[item._id]?.quantity || 0;

      return {
        ...current,
        [item._id]: {
          item,
          quantity: currentQuantity + 1,
        },
      };
    });
  };

  const decrementItem = (item) => {
    setSelectedItems((current) => {
      const currentQuantity = current[item._id]?.quantity || 0;

      if (currentQuantity <= 1) {
        const copy = { ...current };
        delete copy[item._id];
        return copy;
      }

      return {
        ...current,
        [item._id]: {
          item,
          quantity: currentQuantity - 1,
        },
      };
    });
  };

  const getSelectedLineItems = () => {
    return Object.values(selectedItems).map(({ item, quantity }) => ({
      itemId: item._id,
      quantity,
    }));
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
      setSelectedProjectId(createdProject._id);

      setNewProjectName('');
      setNewProjectDescription('');
      setCreateProjectModalVisible(false);
    } catch (err) {
      Alert.alert('Error', err.response?.data || 'Could not create project.');
    }
  };

  const goToNextStep = () => {
    if (!selectedProjectId) {
      return Alert.alert(
        'Project Required',
        'Please select or create a project.'
      );
    }

    if (selectedCount === 0) {
      return Alert.alert('Items Required', 'Please add at least one item.');
    }

    setStep(2);
  };

  const handleSubmitOrder = async () => {
    const lineItems = getSelectedLineItems();

    try {
      setSubmitting(true);

      const selectedItemsSnapshot = Object.values(selectedItems);

      const response = await createOrder({
        project: selectedProjectId,
        lineItems,
        redeemAllPoints,
      });

      const order = response.data.order || response.data;

      await refreshUser();

      setCreatedOrder(order);
      setSubmittedItems(selectedItemsSnapshot);
      setSuccessModalVisible(true);
    } catch (err) {
      Alert.alert('Error', err.response?.data || 'Could not create order.');
    } finally {
      setSubmitting(false);
    }
  };

  const closeSuccessModal = () => {
    setSuccessModalVisible(false);
    setCreatedOrder(null);
    setSubmittedItems([]);
    setSelectedItems({});
    setSelectedProjectId('');
    setRedeemAllPoints(false);
    loadData();
    setStep(1);
  };

  if (loading) {
    return (
      <Screen style={styles.center}>
        <ActivityIndicator />
      </Screen>
    );
  }

  return (
    <Screen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Create Order</Text>

        {step === 1 && (
          <>
            <Text style={styles.stepText}>Step 1 of 2</Text>

            <Text style={styles.sectionTitle}>1. Project</Text>

            <View style={styles.projectButtonsRow}>
              <Pressable
                style={styles.projectButton}
                onPress={() => setProjectsModalVisible(true)}
              >
                <Text style={styles.buttonText}>Choose Previous Project</Text>
              </Pressable>

              <Pressable
                style={styles.projectButton}
                onPress={() => setCreateProjectModalVisible(true)}
              >
                <Text style={styles.buttonText}>Create New Project</Text>
              </Pressable>
            </View>

            {selectedProject ? (
              <View style={styles.selectedBox}>
                <Text style={styles.selectedLabel}>Selected Project</Text>
                <Text style={styles.selectedText}>{selectedProject.name}</Text>

                {selectedProject.description ? (
                  <Text style={styles.selectedSubText}>
                    {selectedProject.description}
                  </Text>
                ) : null}
              </View>
            ) : null}

            <Text style={styles.sectionTitle}>2. Items</Text>

            <ListItem
              title="Select Items"
              onPress={() => setItemsModalVisible(true)}
              IconComponent={
                <Icon
                  name="cart-outline"
                  backgroundColor="black"
                  iconColor="white"
                />
              }
            />

            {selectedCount > 0 ? (
              <View style={styles.selectedBox}>
                <Text style={styles.selectedLabel}>Selected Items</Text>

                {Object.values(selectedItems).map(({ item, quantity }) => (
                  <View key={item._id} style={styles.selectedItemRow}>
                    <Text style={styles.selectedText}>{item.name}</Text>
                    <Text style={styles.selectedQuantity}>Qty: {quantity}</Text>
                  </View>
                ))}

                <Text style={styles.summary}>Total Items: {selectedCount}</Text>
              </View>
            ) : null}

            <Pressable
              style={[
                styles.submitButton,
                (!selectedProjectId || selectedCount === 0) &&
                  styles.disabledButton,
              ]}
              onPress={goToNextStep}
              disabled={!selectedProjectId || selectedCount === 0}
            >
              <Text style={styles.buttonText}>Next</Text>
            </Pressable>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.stepText}>Step 2 of 2</Text>

            <Text style={styles.sectionTitle}>3. Points</Text>

            <Pressable
              style={[
                styles.redeemButton,
                redeemAllPoints && styles.redeemButtonActive,
                (!user?.points || user.points < 100) && styles.disabledButton,
              ]}
              disabled={!user?.points || user.points < 100}
              onPress={() => setRedeemAllPoints((current) => !current)}
            >
              <Text style={styles.buttonText}>
                {redeemAllPoints
                  ? 'Redeem Points: ON'
                  : `Redeem Points (${user?.points || 0} available)`}
              </Text>
            </Pressable>

            <Text style={styles.sectionTitle}>4. Shipment</Text>

            <View style={styles.selectedBox}>
              <Text style={styles.selectedText}>
                Shipment options will be added later.
              </Text>
            </View>

            <View style={styles.reviewBox}>
              <Text style={styles.selectedLabel}>Order Review</Text>
              <Text style={styles.selectedSubText}>
                Project: {selectedProject?.name}
              </Text>
              <Text style={styles.selectedSubText}>
                Selected Items: {selectedCount}
              </Text>
            </View>

            <View style={styles.bottomButtonsRow}>
              <Pressable style={styles.backButton} onPress={() => setStep(1)}>
                <Text style={styles.backButtonText}>Back</Text>
              </Pressable>

              <Pressable
                style={[styles.submitButtonFlex, submitting && styles.disabledButton]}
                onPress={handleSubmitOrder}
                disabled={submitting}
              >
                <Text style={styles.buttonText}>
                  {submitting ? 'Submitting...' : 'Submit Order'}
                </Text>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>

      <Modal visible={itemsModalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Items</Text>
              <Pressable onPress={() => setItemsModalVisible(false)}>
                <Text style={styles.closeText}>X</Text>
              </Pressable>
            </View>

            <ScrollView>
              {items.map((item) => {
                const selectedQuantity = selectedItems[item._id]?.quantity || 0;

                return (
                  <View key={item._id} style={styles.itemRow}>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemDetails}>
                        ${Number(item.sellingPrice || 0).toFixed(2)} | Stock:{' '}
                        {item.stockQuantity}
                      </Text>

                      {item.onSale ? (
                        <Text style={styles.saleText}>
                          On sale: {item.salePercentage}% off
                        </Text>
                      ) : null}
                    </View>

                    <View style={styles.quantityControls}>
                      <Pressable
                        style={styles.quantityButton}
                        onPress={() => decrementItem(item)}
                      >
                        <Text style={styles.quantityButtonText}>-</Text>
                      </Pressable>

                      <Text style={styles.quantityText}>{selectedQuantity}</Text>

                      <Pressable
                        style={styles.quantityButton}
                        onPress={() => incrementItem(item)}
                      >
                        <Text style={styles.quantityButtonText}>+</Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            <Pressable
              style={styles.doneButton}
              onPress={() => setItemsModalVisible(false)}
            >
              <Text style={styles.buttonText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={projectsModalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Project</Text>
              <Pressable onPress={() => setProjectsModalVisible(false)}>
                <Text style={styles.closeText}>X</Text>
              </Pressable>
            </View>

            <ScrollView>
              {projects.map((project) => (
                <Pressable
                  key={project._id}
                  style={[
                    styles.projectOption,
                    selectedProjectId === project._id && styles.selectedOption,
                  ]}
                  onPress={() => {
                    setSelectedProjectId(project._id);
                    setProjectsModalVisible(false);
                  }}
                >
                  <Text style={styles.projectText}>{project.name}</Text>

                  {project.description ? (
                    <Text style={styles.projectDescription}>
                      {project.description}
                    </Text>
                  ) : null}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={createProjectModalVisible}
        animationType="slide"
        transparent
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Project</Text>
              <Pressable onPress={() => setCreateProjectModalVisible(false)}>
                <Text style={styles.closeText}>X</Text>
              </Pressable>
            </View>

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

            <Pressable style={styles.createButton} onPress={handleCreateProject}>
              <Text style={styles.buttonText}>Create Project</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={successModalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Order Created</Text>

            <Text style={styles.selectedSubText}>
              Order Number: {createdOrder?.orderNumber}
            </Text>

            <Text style={styles.selectedLabel}>Items</Text>

            <ScrollView style={styles.successItemsList}>
              {submittedItems.map(({ item, quantity }) => {
                const orderLineItem = createdOrder?.lineItems?.find(
                  (lineItem) =>
                    lineItem.itemId === item._id ||
                    lineItem.itemId?._id === item._id
                );

                const unitPrice = Number(
                  orderLineItem?.unitPrice || item.sellingPrice || 0
                );

                const lineTotal = unitPrice * quantity;

                return (
                  <View key={item._id} style={styles.successItemRow}>
                    <View style={styles.itemInfo}>
                      <Text style={styles.selectedText}>{item.name}</Text>
                      <Text style={styles.selectedSubText}>
                        Qty: {quantity} × ${unitPrice.toFixed(2)}
                      </Text>
                    </View>

                    <Text style={styles.selectedQuantity}>
                      ${lineTotal.toFixed(2)}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>

            <View style={styles.orderSummaryBox}>
              <Text style={styles.summaryLine}>
                Discount: ${Number(createdOrder?.discount || 0).toFixed(2)}
              </Text>

              <Text style={styles.summaryLine}>
                Redeemed Amount: $
                {Number(createdOrder?.redeemedAmount || 0).toFixed(2)}
              </Text>

              <Text style={styles.finalAmount}>
                Final Price: ${Number(createdOrder?.amount || 0).toFixed(2)}
              </Text>

              <Text style={styles.summaryLine}>
                Earned Points: {createdOrder?.pointsEarned || 0}
              </Text>
            </View>

            <Pressable style={styles.submitButton} onPress={closeSuccessModal}>
              <Text style={styles.buttonText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    padding: 12,
    paddingBottom: 40,
  },
  center: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  stepText: {
    color: '#666',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 8,
  },
  projectButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  projectButton: {
    flex: 1,
    backgroundColor: 'black',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  projectOption: {
    padding: 12,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    marginBottom: 8,
  },
  selectedOption: {
    borderWidth: 2,
    borderColor: 'black',
  },
  projectText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  projectDescription: {
    marginTop: 4,
    color: '#555',
  },
  selectedBox: {
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  reviewBox: {
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    padding: 12,
    marginTop: 18,
  },
  selectedLabel: {
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
  },
  selectedText: {
    fontSize: 16,
    fontWeight: '600',
  },
  selectedSubText: {
    marginTop: 4,
    color: '#555',
  },
  selectedItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  selectedQuantity: {
    fontWeight: 'bold',
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
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f7f7f7',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  itemInfo: {
    flex: 1,
    paddingRight: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDetails: {
    marginTop: 4,
    color: '#555',
  },
  saleText: {
    marginTop: 4,
    color: 'green',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 20,
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: 'bold',
  },
  redeemButton: {
    backgroundColor: '#777',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  redeemButtonActive: {
    backgroundColor: 'black',
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButton: {
    backgroundColor: 'black',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonFlex: {
    flex: 1,
    backgroundColor: 'black',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'black',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  bottomButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  createButton: {
    backgroundColor: 'black',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  doneButton: {
    backgroundColor: 'black',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  summary: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
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
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  successItemsList: {
    maxHeight: 230,
  },
  successItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f7f7f7',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  orderSummaryBox: {
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    gap: 6,
  },
  summaryLine: {
    fontSize: 15,
  },
  finalAmount: {
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default OrderScreen;