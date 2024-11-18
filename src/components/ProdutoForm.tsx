import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Modal, Portal, TextInput, Button, IconButton, useTheme, Text, Snackbar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Produto } from '../models/Produto';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  onSave: (produto: Produto, novaImagemUrl?: string) => void;
  produto: Produto | null;
}

const ProdutoForm: React.FC<Props> = ({ visible, onDismiss, onSave, produto }) => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [categoria, setCategoria] = useState('');
  const [estoque, setEstoque] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const theme = useTheme();

  useEffect(() => {
    if (visible) {
      setIsLoading(false);
      if (produto) {
        setNome(produto.nome);
        setDescricao(produto.descricao);
        setPreco(produto.preco.toString());
        setCategoria(produto.categoria);
        setEstoque(produto.estoque.toString());
        setImagemUrl(produto.imagemUrl!);
      } else {
        setNome('');
        setDescricao('');
        setPreco('');
        setCategoria('');
        setEstoque('');
        setImagemUrl('');
      }
    }
  }, [produto, visible]);

  const handleSave = () => {
    setIsLoading(true);
    if (!nome || !descricao || !preco || !categoria || !estoque) {
      setSnackbarMessage('Preencha todos os campos.');
      setSnackbarVisible(true);
      return;
    }
    console.log("PRODUTO: ", produto);
    console.log("idProduto: ", produto?.id);
    const newProduto: Produto = {
      ...(produto?.id && { id: produto.id }), // Inclui o ID apenas se o produto existir
      nome,
      descricao,
      preco: parseFloat(preco),
      categoria,
      estoque: parseInt(estoque, 10),
      imagemUrl: produto ? produto.imagemUrl : imagemUrl, // Mantém a URL antiga para atualização
    };

    console.log("NEWPRODUTO: ", newProduto);
  
    if (produto) {
      // Atualização: envia o produto com imagem antiga e a nova imagem
      onSave(newProduto, imagemUrl); // `imagemUrl` será a nova imagem se selecionada
    } else {
      console.log("onsave: ", );
      onSave(newProduto); // `imagemUrl` já será parte do produto
    }
  };
  

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log("imagepicada: ", result.assets[0].uri);
      setImagemUrl(result.assets[0].uri);
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.background }]}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.header}>
                <Text style={styles.title}>Novo Produto</Text>
                <IconButton icon="close" onPress={onDismiss} style={styles.closeButton} />
              </View>
              <TextInput
                mode="outlined"
                label="Nome do Produto"
                value={nome}
                onChangeText={setNome}
                style={styles.input}
              />
              <TextInput
                mode="outlined"
                label="Descrição"
                value={descricao}
                onChangeText={setDescricao}
                style={styles.input}
              />
              <TextInput
                mode="outlined"
                label="Preço"
                value={preco}
                onChangeText={setPreco}
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                mode="outlined"
                label="Categoria"
                value={categoria}
                onChangeText={setCategoria}
                style={styles.input}
              />
              <TextInput
                mode="outlined"
                label="Estoque"
                value={estoque}
                onChangeText={setEstoque}
                keyboardType="numeric"
                style={styles.input}
              />
              <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
                <View style={styles.imagePicker}>
                  {imagemUrl ? (
                    <Image source={{ uri: imagemUrl }} style={styles.image} />
                  ) : (
                    <Text style={styles.imagePlaceholder}>Selecionar Imagem</Text>
                  )}
                </View>
              </TouchableOpacity>
              <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
                {isLoading ? <ActivityIndicator size="small"/> : "Salvar"}
              </Button>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
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
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 8 },
  closeButton: { alignSelf: 'flex-end' },
  input: { marginBottom: 10 },
  saveButton: { marginTop: 20, borderRadius: 8 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 18 },
  imagePicker: {
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    height: 150,
  },
  image: { width: '100%', height: '100%', borderRadius: 8 },
  imagePlaceholder: { color: '#aaa' },
});

export default ProdutoForm;
