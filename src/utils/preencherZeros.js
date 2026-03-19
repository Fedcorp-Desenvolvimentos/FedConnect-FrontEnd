function preencherZeros(valor, tamanho) {
  valor = String(valor).replace(/\D/g, "");
  return valor.padStart(tamanho, "0");
}

export default preencherZeros;