import { useRef } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import ImageInput from './ImageInput';

function ImageInputList({onRemoveImage, onAddImage, imageUris = []}) {

    const scrollView = useRef()

  return (
    <View>
        <ScrollView horizontal ref={scrollView}  onContentSizeChange={()=> scrollView.current.scrollToEnd()}>
            <View style={styles.container}>

                {imageUris.map((uri)=>(
                    <View  key={uri} style={styles.images}>
                        <ImageInput imageUri={uri} key={uri} onChangeImage={() => onRemoveImage(uri)}/>
                    </View>
                ))}
                <ImageInput onChangeImage={(uri) => onAddImage(uri)}/>
            </View>
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:'row'
  },
  images:{
    marginRight:10
  }
});

export default ImageInputList;