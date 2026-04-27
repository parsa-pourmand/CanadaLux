import React, { useState, useContext } from 'react';
import { StyleSheet, Text } from 'react-native';
import * as Yup from 'yup';

import Screen from '../components/Screen';
import FormComponent from '../components/form/FormComponent';
import FormFieldComponent from '../components/form/FormFieldComponent';
import SubmitButton from '../components/form/SubmitButton';

import { register } from '../api/auth';
import { storeAuth } from '../auth/storage';
import { setAuthToken } from '../api/client';
import AuthContext from '../context/AuthContext';

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required().min(2).label('First Name'),
  lastName: Yup.string().required().min(2).label('Last Name'),
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(5).label('Password'),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref('password')], 'Password must match')
    .label('Confirm Password'),
  companyName: Yup.string().label('Company'),
  phoneNumber: Yup.string().required().label('Phone Number'),
  billingAddress: Yup.string().required().label('Billing Address'),
  shippingAddress: Yup.string().required().label('Shipping Address'),
});

export default function RegisterScreen() {
  const [error, setError] = useState('');
  const authContext = useContext(AuthContext);

  const handleRegister = async (userInfo) => {
    try {
      setError('');

      const response = await register({
        Firstname: userInfo.firstName,
        Lastname: userInfo.lastName,
        email: userInfo.email,
        password: userInfo.password,
        companyName: userInfo.companyName,
        phoneNumber: userInfo.phoneNumber,
        billingAddress: userInfo.billingAddress,
        shippingAddress: userInfo.shippingAddress,
      });

      const { token, user } = response.data;

      await storeAuth(token, user);
      setAuthToken(token);
      authContext.setUser(user);
    } catch (err) {
      setError(err.response?.data || 'Register failed. Please try again.');
    }
  };

  return (
    <Screen style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FormComponent
        initialValues={{
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          companyName: '',
          phoneNumber: '',
          billingAddress: '',
          shippingAddress: '',
        }}
        onSubmit={handleRegister}
        validationSchema={validationSchema}
      >
        <FormFieldComponent
          name="firstName"
          icon="account"
          placeholder="First Name"
          autoCorrect={false}
        />

        <FormFieldComponent
          name="lastName"
          icon="account"
          placeholder="Last Name"
          autoCorrect={false}
        />

        <FormFieldComponent
          name="email"
          icon="email"
          placeholder="Email"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoCorrect={false}
          autoCapitalize="none"
        />

        <FormFieldComponent
          name="password"
          icon="lock"
          placeholder="Password"
          textContentType="password"
          autoCorrect={false}
          autoCapitalize="none"
          secureTextEntry
        />

        <FormFieldComponent
          name="confirmPassword"
          icon="lock"
          placeholder="Confirm Password"
          textContentType="password"
          autoCorrect={false}
          autoCapitalize="none"
          secureTextEntry
        />

        <FormFieldComponent
          name="companyName"
          icon="office-building"
          placeholder="Company"
          autoCorrect={false}
          autoCapitalize="words"
        />

        <FormFieldComponent
          name="phoneNumber"
          icon="phone"
          placeholder="Phone Number"
          keyboardType="phone-pad"
          autoCorrect={false}
        />

        <FormFieldComponent
          name="billingAddress"
          icon="home"
          placeholder="Billing Address"
          autoCorrect={false}
        />

        <FormFieldComponent
          name="shippingAddress"
          icon="home"
          placeholder="Shipping Address"
          autoCorrect={false}
        />

        <SubmitButton title="Register" />
      </FormComponent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});