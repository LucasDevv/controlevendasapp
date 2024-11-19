import { db, storage } from '../config/firebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Produto } from '../models/Produto';

const produtosCollection = collection(db, 'produtos');

// Upload de imagem
const uploadImageToFirebase = async (imageUri: string): Promise<string> => {
  try {

    // Validação da extensão do arquivo
    const allowedExtensions = ['jpg', 'jpeg', 'png'];
    const fileExtension = imageUri.split('.').pop()?.toLowerCase();

    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      throw new Error('Apenas imagens nos formatos JPG e PNG são permitidas.');
    }

    // Referência ao Firebase Storage para o local do upload
    const imageRef = ref(storage, `produtos/${Date.now()}.${fileExtension}`);

    // Converte a URI da imagem em um blob
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Faz o upload do blob para o Firebase Storage
    await uploadBytes(imageRef, blob);

    // Obtém a URL pública da imagem
    const url = await getDownloadURL(imageRef);

    return url;
  } catch (error) {
    console.error('Erro ao fazer upload de imagem:', error);
    throw new Error('Erro ao fazer upload de imagem.');
  }
};


// Deleção de imagem
const deleteImageFromFirebase = async (imageUrl: string): Promise<void> => {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
  }
};

// Criação de um produto
export const createProduto = async (produto: Produto) => {
  try {
    const imagemUrl : string = await uploadImageToFirebase(produto.imagemUrl!);
    const docRef = await addDoc(produtosCollection, { ...produto, imagemUrl });
    return { ...produto, imagemUrl, id: docRef.id };
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    throw error;
  }
};

// Obtenção de produtos
export const getProdutos = async (): Promise<Produto[]> => {
  try {
    const querySnapshot = await getDocs(produtosCollection);
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Produto));
    return data;
  } catch (error) {
    console.error('Erro ao obter produtos:', error);
    throw error;
  }
};

// Atualização de produto
export const updateProduto = async (produto: Produto, imageUri?: string) => {
  try {
    const produtoDoc = doc(db, 'produtos', produto.id!);
    let imagemUrl = produto.imagemUrl;

    if(imageUri != produto.imagemUrl){
      await deleteImageFromFirebase(produto.imagemUrl!);
      imagemUrl = await uploadImageToFirebase(imageUri!);
    }

    await updateDoc(produtoDoc, { ...produto, imagemUrl });
    return { ...produto, imagemUrl };
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    throw error;
  }
};

// Deleção de produto
export const deleteProduto = async (id: string, imagemUrl?: string) => {
  try {
    const produtoDoc = doc(db, 'produtos', id);
    if (imagemUrl) await deleteImageFromFirebase(imagemUrl);
    await deleteDoc(produtoDoc);
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    throw error;
  }
};
