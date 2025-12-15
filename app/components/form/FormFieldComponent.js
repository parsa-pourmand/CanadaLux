import { useFormikContext } from 'formik'
import ErrorMessage from './ErrorMessage'
import TextInputComponent from '../TextInputComponent';

export default function FormFieldComponent({name, width, ...otherProps}) {
    const {setFieldValue, values, errors, setFieldTouched, touched} = useFormikContext();
  return (
    <>
      <TextInputComponent 
        onChangeText={text => setFieldValue(name, text)}
        onBlur={()=>setFieldTouched(name)}
        value={values[name]}
        width={width}
        {...otherProps}
      />
        <ErrorMessage error={errors[name]} visible={touched[name]}/>
    </>
  )
}