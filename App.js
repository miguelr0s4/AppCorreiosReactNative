import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Provider as PaperProvider, TextInput, Button, Snackbar } from 'react-native-paper';

const App = () => {
  const [cep, setCep] = useState('');
  const [addressData, setAddressData] = useState({});
  const [errorSnackbarVisible, setErrorSnackbarVisible] = useState(false);
  const [searchedCeps, setSearchedCeps] = useState([]);

  const fetchAddressData = async () => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      console.log(data);
      if (response.ok) {
        setAddressData(data);
        setSearchedCeps(prevCeps => [...prevCeps, cep]);
      } else {
        setErrorSnackbarVisible(true);
      }
    } catch (error) {
      console.error(error);
      setErrorSnackbarVisible(true);
    }
  };

  const dismissErrorSnackbar = () => {
    setErrorSnackbarVisible(false);
  };

  return (
    <PaperProvider>
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          label="CEP"
          value={cep}
          onChangeText={text => setCep(text)}
          style={styles.input}
        />
        <Button mode="contained" onPress={fetchAddressData}>
          Buscar Endereço
        </Button>

        {Object.keys(addressData).map(key => (
          <TextInput
            key={key}
            label={key.toUpperCase()}
            value={addressData[key] || ''}
            disabled
            style={styles.input}
          />
        ))}

        <Text style={styles.cepList}>
          CEPs pesquisados: {searchedCeps.join(", ")}
        </Text>

        <Snackbar
          visible={errorSnackbarVisible}
          onDismiss={dismissErrorSnackbar}
          duration={3000}
        >
          Ocorreu um erro ao buscar o endereço. Verifique o CEP e tente novamente.
        </Snackbar>
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    marginBottom: 12,
  },
  cepList: {
    fontSize: 16,
    marginBottom: 12,
    fontWeight: 'bold',
  },
});

export default App;
