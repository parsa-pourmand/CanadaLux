import React, {useEffect} from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Image, Alert } from 'react-native';
import colors from '../config/colors';
import Icon from './Icon';
import * as ImagePicker from 'expo-image-picker'

function ImageInput({onChangeImage, imageUri}) {
    
    const requestPermission = async () => {
        const result = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if(!result.granted)
            alert("You need to enable permission to access the library")
    }
    
    useEffect(() => {
        requestPermission()
    }, [])

    const selectImage = async () => {
        try{
            const result = await ImagePicker.launchImageLibraryAsync({mediaTypes: ['images'], quality:0.5})
            if(!result.canceled){
                const uri = result.assets[0].uri
                onChangeImage(uri)
            }        
        }catch(error){
            logger.log('Error reading the image: ', error)
        }
    }

    const handlePress = () => {
        if (!imageUri) selectImage()
        else Alert.alert('Delete', 'Are you sure you want to delete this item?', [
            {text:"Yes", onPress:() => onChangeImage(null)},
            {text:"No"}
        ] )
    }

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
        <View style={styles.container}>
            {!imageUri && <Icon name="camera-outline" size={60} backgroundColor iconColor={colors.medium}/>}
            
            {imageUri && <Image source={{uri: imageUri}} style={styles.image}/>}
        </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:colors.light,
    width:100,
    height:100,
    overflow:'hidden',
    borderRadius:20
  },
  image:{
    width:"100%",
    height:"100%",
  }
});

export default ImageInput;