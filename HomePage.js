import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, ToastAndroid, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FAB } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome';
const HomePage = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const storedProducts = await AsyncStorage.getItem('products');
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts).map(product => ({
          ...product,
          id: product.id || Date.now() + Math.random(),
        })));
      } else {
        setProducts([]);
      }
    } catch (error) {
      showToast('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [])
  );

  const handleDeleteProduct = async (productId) => {
    setLoading(true);
    try {
      const updatedProducts = products.filter((product) => product.id !== productId);
      await AsyncStorage.setItem('products', JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
      showToast('Product deleted successfully');
    } catch (error) {
      showToast('Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      
      <TextInput
        style={styles.searchInput}
        placeholder="Search products..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
<FontAwesome name="search" size={20} color="#888" style={styles.searchIcon} />
<Text style={{fontWeight:'bold',fontSize:20}}>Products</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{flex:1}}>
            <View style={styles.productContainer}>
              <Image 
                source={item.image ? { uri: item.image } : require('./assets/def.jpg')}
                style={styles.productImage}
              />
                  <TouchableOpacity onPress={() => handleDeleteProduct(item.id)} style={styles.deleteButton}>
              <Icon name="trash" size={20} color="black" style={{ marginTop:10,marginLeft:8 }} />
              </TouchableOpacity>

          
            </View>
                          <View style={{marginBottom:20,paddingLeft:18}}>
                          <Text style={styles.productName}>{item.name}</Text>
                          <Text style={styles.productPrice}>${item.price}</Text>
                        </View>
                        </View>
          )}
          numColumns={2}
        />
      ) : (
        <Text style={styles.noProductText}>No Product Found</Text>
      )}
 <TouchableOpacity style={styles.logoutButton} onPress={()=>navigation.navigate('LoginScreen')}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddProduct')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchInput: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    marginTop:50
  },
  productContainer: {
  flexDirection:'row',
    margin: 9,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#e5e8e8',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3, // Adds shadow on Android
  },
  productImage: {
    width: 130,
    height: 120,
    marginBottom: 10,     
    margin: 5,
    padding: 10,
    borderRadius: 8,

    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    
  },
  productPrice: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  
  },
  deleteButton: {
    marginBottom: 100,
  },
  deleteText: {
    color: 'red',
  },
  noProductText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
  searchIcon: {
    position:'absolute',
    marginTop:85,
   right:40
  },
  logoutButton: {
    backgroundColor: "#e87257",
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  logoutButtonText: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 110,
    right: 20,
    borderRadius:70,
    backgroundColor:'#4292ed'
  },
});

export default HomePage;
