import { View, Text, StyleSheet, Image, TouchableHighlight } from 'react-native'

import colors from '../../config/colors'
import Icon from '../Icon'

export default function ListItem(props) {
  return (
    <TouchableHighlight onPress={props.onPress} underlayColor={colors.light}>
    <View style={styles.container}>
        {props.IconComponent}
        {props.image && <Image  style={styles.userImage} source={props.image}/>}
            <View style={styles.userInfo}>
                <Text style={styles.title} numberOfLines={1}>{props.title}</Text>
                {props.subTitle && <Text style={styles.subTitle} numberOfLines={2}>{props.subTitle}</Text>}
            </View>
        
        {props.chevrons && <Icon name="chevron-right" iconColor={colors.medium} backgroundColor={colors.white}/>}
        
    </View>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
    container:{
        flexDirection:"row",
        alignItems:'center',
        padding:15
    },
    userImage:{
        width:60,
        height:60,
        borderRadius:30,
        
    },
    userInfo:{
        flex:1,
        marginLeft:10
    },
    title:{
        marginTop:5,
        fontSize:16,
        fontWeight:'500'
    },
    subTitle:{
        marginTop:5,
        fontSize:14,
        color:"gray"
    },
    
})