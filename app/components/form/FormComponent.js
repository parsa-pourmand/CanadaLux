import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Formik } from 'formik';

export default function FormComponent(props) {
  return (
    <Formik initialValues={props.initialValues} onSubmit={props.onSubmit} validationSchema={props.validationSchema}>

        {()=>(
            <>
                {props.children}
            </>
            
        )}
    </Formik>
  );
}

