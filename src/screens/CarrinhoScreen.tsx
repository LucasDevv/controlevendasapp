import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, StatusBar } from 'react-native';
import { FAB, Appbar, useTheme, Snackbar, ActivityIndicator, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../contexts/CartContext';
import ProdutoCard from '../components/ProdutoCard';
import { Produto } from '../models/Produto';

const CarrinhoScreen = () => {
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const { cart, removeFromCart, clearCart } = useCart();
  const theme = useTheme();

  const handleRemoveItem = (produto: Produto) => {
    removeFromCart(produto.id!);
    setSnackbarMessage(`${produto.nome} removido do carrinho.`);
    setSnackbarVisible(true);
  };

  const handleClearCart = () => {
    clearCart();
    setSnackbarMessage('Carrinho esvaziado com sucesso.');
    setSnackbarVisible(true);
  };

  return (
    <>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        <Appbar.Header>
          <Appbar.Content title="Carrinho de Compras" titleStyle={{ color: theme.colors.onPrimary }} />
        </Appbar.Header>
        <View style={[styles.content, styles.container, { backgroundColor: theme.colors.background }]}>
          {cart.length > 0 ? (
            <FlatList
              data={cart}
              horizontal
              keyExtractor={(item) => item.id!}
              renderItem={({ item }) => (
                <View style={styles.productContainer}>
                  <ProdutoCard produto={item} quantidade={item.quantidade} isCardapio />
                  <Button
                    mode="contained"
                    onPress={() => handleRemoveItem(item)}
                    style={styles.button}
                  >
                    Remover do Carrinho
                  </Button>
                </View>
              )}
            />
          ) : (
            <View style={styles.emptyCart}>
              <Text>Seu carrinho está vazio...</Text>
            </View>
          )}
          <Button mode="contained" onPress={handleClearCart} style={styles.clearCartButton}>
            Finalizar compra
          </Button>
        </View>
      </SafeAreaView>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  productContainer: { marginBottom: 16 },
  button: { marginTop: 8 },
  clearCartButton: { margin: 16 },
  emptyCart: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingTop: 10, paddingBottom: 10, justifyContent: 'center' },
});

export default CarrinhoScreen;