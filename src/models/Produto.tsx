export interface Produto {
  id?: string | null;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  estoque: number;
  imagemUrl?: string; // URL da imagem
}
