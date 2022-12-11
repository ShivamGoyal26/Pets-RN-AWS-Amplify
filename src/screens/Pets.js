import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  Button,
  Alert,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {API, graphqlOperation} from 'aws-amplify';
import {useFocusEffect} from '@react-navigation/native';
import * as mutations from '../graphql/mutations';
import * as queries from '../graphql/queries';
import {Auth} from 'aws-amplify';

const Pets = props => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      getListManager();
    }, []),
  );

  const signout = async () => {
    try {
      const res = await Auth.signOut();
      console.log('>>> . signout', res);
      setData([]);
    } catch (error) {
      console.log(error);
    }
  };

  const getListManager = async () => {
    console.log('get List manager');
    try {
      setLoading(true);
      const pets = await API.graphql({
        query: queries.listPets,
      });
      if (pets?.data?.listPets?.items?.length) {
        setData(pets?.data?.listPets.items);
      } else {
        Alert.alert('No Pets Found!');
        setData([]);
      }
    } catch (error) {
      setData([]);
      if (error?.errors) {
        Alert.alert(error.errors[0].message);
      } else {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const createPetManager = async () => {
    if (!name.trim()) {
      return Alert.alert('Please enter the name');
    }
    if (!description.trim()) {
      return Alert.alert('Please enter the description');
    }
    try {
      const pet = {
        name: name,
        description: description,
        petType: 'dog',
      };
      const res = await API.graphql({
        query: mutations.createPet,
        variables: {input: pet},
      });
      if (res) {
        Alert.alert('ADDED!');
        setName('');
        setDescription('');
        getListManager();
      }
    } catch (error) {
      console.log('Eror >', error);
      Alert.alert(error.errors[0].message);
    }
  };

  const deletePetsManager = async todoId => {
    try {
      const res = await API.graphql(
        graphqlOperation(mutations.deletePet, {input: {id: todoId}}),
      );
      console.log(res);
      if (res) {
        Alert.alert('DELETED');
        getListManager();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = ({item}) => {
    return (
      <View
        style={{
          marginBottom: 15,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={{flex: 1}}>
          <Text>{item.name}</Text>
          {item.description ? <Text>{item.description}</Text> : null}
          {item.petType ? <Text> petType: {item.petType}</Text> : null}
        </View>
        <TouchableOpacity
          style={{marginHorizontal: 10}}
          onPress={() => {
            props.navigation.navigate('UpdatePet', {item: item});
          }}>
          <Text>update</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            deletePetsManager(item.id);
          }}>
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        <View
          style={{
            height: 60,
            backgroundColor: 'black',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: 'white'}}>TODOS</Text>
        </View>
        <View style={{padding: 20}}>
          <View>
            <TextInput
              placeholder="Pet Name"
              placeholderTextColor={'grey'}
              style={styles.input}
              value={name}
              onChangeText={setName}
            />

            <TextInput
              placeholder="Pet description"
              placeholderTextColor={'grey'}
              style={styles.input}
              value={description}
              onChangeText={setDescription}
            />

            <Button title="ADD" onPress={createPetManager} />
            <Button title="Sign out" onPress={signout} />
          </View>
          <FlatList
            ListHeaderComponent={() => (loading ? <ActivityIndicator /> : null)}
            data={data}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  safe: {
    flex: 1,
    backgroundColor: 'black',
  },
  input: {
    marginBottom: 20,
    color: 'black',
  },
});

export default Pets;
