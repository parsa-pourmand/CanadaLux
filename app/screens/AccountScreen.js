import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import Icon from '../components/Icon';
import ListItem from '../components/list/ListItem';
import colors from '../config/colors';
import ListItemSeparator from '../components/list/ListItemSeparator'
import Screen from '../components/Screen';

const user = {
    image:require("../assets/parsa.jpeg"),
    name:"Parsa Pourmand",
    email:"poupars89@gmail.com"
}

const items = [
    {
        id: 1,
        title: "My Invoices",
        icon: {
        name: "format-list-bulleted",
        backgroundColor: colors.black,
        },
        targetScreen: "Invoice",
    },
    {
        id: 2,
        title: "My Orders",
        icon: {
        name: "email",
        backgroundColor: colors.black,
        },
        targetScreen: "Order",
    },
];

function AccountScreen({navigation}) {
  return (
    <View style={styles.screen}>
        <View style={styles.profileContainer}>
            <ListItem image={user.image} title={user.name} subTitle={user.email}/>
        </View>


        <View style={styles.listContainer}>
            <FlatList
                data={items}
                keyExtractor={item=>item.id.toString()}
                renderItem={({item}) =><ListItem title={item.title} IconComponent={<Icon
                                                                                    name={item.icon.name}
                                                                                    iconColor={colors.white}
                                                                                    backgroundColor={item.icon.backgroundColor}
                                                                                    />
                                                                                } 
                    onPress={
                        ()=>{navigation.navigate(item.targetScreen)}
                    }
                    />}
                ItemSeparatorComponent={ListItemSeparator} 
            />
        </View>

        <View style={styles.logout}>
            <ListItem title="Log Out" IconComponent={<Icon name="logout" iconColor={colors.white} backgroundColor={colors.primary}/>}/>
        </View>

    </View>
  );
}

const styles = StyleSheet.create({
    screen:{
        backgroundColor:colors.light,
        flex:1
    },
    profileContainer:{
        width:"100%",
        marginBottom:5,
        padding:5,
        backgroundColor:colors.white
    },
    listContainer:{
        backgroundColor:colors.white,
        width:"100%",
        marginVertical:15,
    },
    logout:{
        backgroundColor:colors.white,
        width:"100%",
        height:70
    }
});

export default AccountScreen;