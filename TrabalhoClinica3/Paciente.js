class Paciente {

#nome; #altura; #peso; #cidade;

constructor(nome="", altura=1, peso=1, cidade=""){
	this.#nome = nome;
	this.#altura = altura;
	this.#peso = peso;
	this.#cidade = cidade;
}

getAltura(){
	return this.#altura;
}

setAltura(altura){
	this.#altura = altura;
}

getNome(){
	return this.#nome;
}

setNome(nome){
	this.#nome = nome;
}

getPeso(){
	return this.#peso;
}

setPeso(peso){
	this.#peso = peso;
}

getCidade(){
	return this.#cidade;
}

setCidade(cidade){
	this.#cidade = cidade;
}

calcularIMC() {
    if (this.#altura <= 0) return 0;
    const imc = this.#peso / (this.#altura * this.#altura);
    return imc;
}

definirClassificacao() {
	const imc = this.calcularIMC();
	if (imc < 18.5) {
		return "Abaixo do peso";
	} 
	else if (imc < 25) {
		return "Peso normal";
	}
	else if (imc < 30) {
		return "Sobrepeso";
	}
	else {
		return "Obesidade";
	}
}

}

export default Paciente
