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
  const [isLoading, setIsLoading] = useState(false);
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
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.surface} />
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        <Appbar.Header>
          <Appbar.Content title="Carrinho de Compras" titleStyle={{ color: theme.colors.onPrimary }} />
        </Appbar.Header>
        {cart.length > 0 ? (
          <View style={[styles.content, styles.container, { backgroundColor: theme.colors.background }]}>
            {isLoading ? (
              <ActivityIndicator size="large" color={theme.colors.primary} />
            ) : (
              <FlatList
                showsVerticalScrollIndicator={true}
                data={cart}
                keyExtractor={(item) => item.id!}
                renderItem={({ item }) => (
                  <View style={styles.productContainer}>
                    <ProdutoCard produto={item} isCardapio />
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
            )}
            <Button
              mode="contained"
              onPress={handleClearCart}
              style={[styles.button, styles.clearCartButton]}
            >
              Esvaziar Carrinho
            </Button>
          </View>
        ) : (
          <View style={[styles.view, styles.content, { backgroundColor: theme.colors.background }]}>
            <Text>Seu carrinho está vazio...</Text>
          </View>
        )}
      </SafeAreaView>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  view: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingTop: 10, paddingBottom: 10, justifyContent: 'center' },
  productContainer: { marginBottom: 16 },
  button: { marginTop: 8 },
  clearCartButton: { marginVertical: 16 },
});

export default CarrinhoScreen;