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

import {createTodo, updateTodo, deleteTodo} from '../graphql/mutations';
import {listTodos} from '../graphql/queries';

const UpdatePet = props => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const item = props.route.params.item;

  useEffect(() => {
    if (item) {
      setName(item.name);
      setDescription(item.description);
    }
  }, [item]);

  const updatePetManager = async () => {
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
        petType: 'cat',
      };

      const res = await API.graphql(
        graphqlOperation(mutations.updatePet, {input: {id: item.id, ...pet}}),
      );
      if (res) {
        Alert.alert('UPDATED!');
        setName('');
        setDescription('');
        props.navigation.goBack();
      }
      console.log('Answer', res);
    } catch (error) {
      console.log('main error', error);
    }
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
          <TextInput
            placeholder="Enter the name"
            placeholderTextColor={'grey'}
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          <TextInput
            placeholder="Enter the description"
            placeholderTextColor={'grey'}
            style={styles.input}
            value={description}
            onChangeText={setDescription}
          />

          <Button title="Update" onPress={updatePetManager} />
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

export default UpdatePet;
