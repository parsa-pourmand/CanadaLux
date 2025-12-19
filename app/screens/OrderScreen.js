import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import FormComponent from '../components/form/FormComponent';
import { Form } from 'formik';
import FormFieldComponent from '../components/form/FormFieldComponent';
import SubmitButton from '../components/form/SubmitButton';
import colors from '../config/colors';
import FormImageInputList from '../components/FormImageInputList';

function OrderScreen(props) {
  return (
    <View style={styles.container}>
      <FormComponent initialValues={{ orderDetails: '', images:[], title: '' }} onSubmit={(values, {resetForm}) => {console.log(values) ; resetForm();}}>
        
        <FormImageInputList name="images" />

        <FormFieldComponent
          name="title"
          placeholder="Title (SKU, Item Name, etc.)"
          maxLength={255}
        />

        <FormFieldComponent
          name="orderDetails"
          placeholder="Enter order details here."
          multiline
          numberOfLines={5}
          style={{ height: 100, textAlignVertical: 'top' }}
        />
        <SubmitButton title="Submit Order" />
      </FormComponent>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.white,
  }
});

export default OrderScreen;