import ButtonComponent from '../ButtonComponent'
import { useFormikContext } from 'formik'


export default function SubmitButton({title}) {
    const {handleSubmit} = useFormikContext()
  return (
    <ButtonComponent title={title} onPress={handleSubmit} color="black"/> 
  )
}