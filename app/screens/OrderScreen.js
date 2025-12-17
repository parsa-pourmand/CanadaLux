import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import FormComponent from '../components/form/FormComponent';
import { Form } from 'formik';
import FormFieldComponent from '../components/form/FormFieldComponent';
import SubmitButton from '../components/form/SubmitButton';
import colors from '../config/colors';

function OrderScreen(props) {
  return (
    <View style={styles.container}>
      <FormComponent initialValues={{ orderDetails: '' }} onSubmit={(values, {resetForm}) => {console.log(values) ; resetForm();}}>
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