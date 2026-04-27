import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import * as Yup from 'yup';

import FormComponent from '../components/form/FormComponent';
import FormFieldComponent from '../components/form/FormFieldComponent';
import SubmitButton from '../components/form/SubmitButton';
import colors from '../config/colors';
import FormImageInputList from '../components/FormImageInputList';
import { createQuote } from '../api/quotes';

const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(2).max(255).label('Title'),
  details: Yup.string().required().min(5).max(5000).label('Details'),
  images: Yup.array(),
});

function QuoteScreen() {
  const [error, setError] = useState('');

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setError('');

      await createQuote({
        title: values.title,
        details: values.details,
        images: values.images || [],
      });

      resetForm();
      Alert.alert('Quote Sent', 'Your quote request has been submitted.');
    } catch (err) {
      setError(err.response?.data || 'Could not submit quote.');
    }
  };

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FormComponent
        initialValues={{ title: '', details: '', images: [] }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <FormImageInputList name="images" />

        <FormFieldComponent
          name="title"
          placeholder="Title (SKU, Item Name, etc.)"
          maxLength={255}
        />

        <FormFieldComponent
          name="details"
          placeholder="Enter quote details here."
          multiline
          numberOfLines={5}
          style={{ height: 100, textAlignVertical: 'top' }}
        />

        <SubmitButton title="Submit Quote" />
      </FormComponent>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.white,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default QuoteScreen;