import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import * as Yup from 'yup'


import Screen from '../components/Screen'
import FormComponent from '../components/form/FormComponent'
import FormFieldComponent from '../components/form/FormFieldComponent'
import SubmitButton from '../components/form/SubmitButton'

const validationSchema = Yup.object().shape({

    email: Yup.string().required().email().label("Email"),
    password: Yup.string().required().min(5).label("Password"),
})

function LoginScreen(props) {

    const handleLogin = (userInfo)=>{
        console.log(userInfo.email)
    }

  return (
    <Screen style={styles.container}>
        
        <Image source={require('../assets/icon-512.png')} style={styles.logo}/>
    
        <FormComponent initialValues={{email:'', password:''}} onSubmit={handleLogin} validationSchema={validationSchema}>
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
            <SubmitButton title="LOGIN"/>
        </FormComponent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding:10
  },
  logo:{
    height:150,
    width:150,
    alignSelf:'center'
  }
});

export default LoginScreen;