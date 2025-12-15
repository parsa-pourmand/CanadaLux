import React from 'react'
import { StyleSheet, View } from 'react-native'
import * as Yup from 'yup'

import Screen from '../components/Screen'
import FormComponent from '../components/form/FormComponent'
import FormFieldComponent from '../components/form/FormFieldComponent'
import SubmitButton from '../components/form/SubmitButton'


const validationSchema = Yup.object().shape({

    email: Yup.string().required().email().label("Email"),
    password: Yup.string().required().min(5).label("Password"),
    confirmPassword: Yup.string().required().oneOf([Yup.ref('password')], 'Password must match').label("Confirm Password")
})

export default function RegisterScreen() {

    const handleRegister = (userInfo)=>{
        console.log(userInfo.email)
    }

    return(
        <Screen style={styles.container}>
            <FormComponent initialValues={{email:'', password:'', confirmPassword:''}} onSubmit={handleRegister} validationSchema={validationSchema}>
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
                <SubmitButton title="Register"/>
            </FormComponent>
        </Screen>
    )
}

const styles = StyleSheet.create({
    container:{
        padding:10
    }
})