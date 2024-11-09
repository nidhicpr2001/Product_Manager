import React, { useState } from 'react';
import { View, TextInput, Button, Text, Image, TouchableOpacity, Alert, ActivityIndicator,StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { FAB } from 'react-native-paper';
const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled) {
    setImage(result.assets[0].uri);
  } else {
    Alert.alert('Image Selection', 'You did not select any image.');
  }
};

  const handleAddProduct = async () => {
    if (!name || !price) {
      Alert.alert('Validation Error', 'Product name and price are required');
      return;
    }

    setLoading(true);
    try {
      const newProduct = { name, price, image };
      const storedProducts = await AsyncStorage.getItem('products');
      const products = storedProducts ? JSON.parse(storedProducts) : [];

      if (products.some((product) => product.name.toLowerCase() === name.toLowerCase())) {
        Alert.alert('Error', 'Product already exists');
        return;
      }

      products.push(newProduct);
      await AsyncStorage.setItem('products', JSON.stringify(products));

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        style={{ borderWidth: 1, padding: 10, marginBottom: 20,marginTop:50,borderRadius:3 }}
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={{ borderWidth: 1, padding: 10, marginBottom: 20,borderRadius:3  }}
        placeholder="Product Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TouchableOpacity onPress={pickImage} style={{ marginBottom: 20 ,flexDirection:'row'}}>
        <Text style={{ color: 'blue',fontSize:20 }}>Choose an image</Text>
        <Icon name="image" size={20} color="blue" style={{ marginTop:6,marginLeft:7 }} />

      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={{ width: 100, height: 100, marginBottom: 20,marginLeft:20 }} />}
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Add Product" onPress={handleAddProduct} />
      )}
    </View>
  );
};

export default AddProduct;
const styles=StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom:-10,
    right: 180,
    
  },
})