class Cultura {
    constructor(id, nome, icone, cicloDias, sol, agua, dificuldade, dica, rotina) {
        this.id = id
        this.nome = nome
        this.icone = icone
        this.cicloDias = cicloDias
        this.sol = sol
        this.agua = agua
        this.dificuldade = dificuldade
        this.dica = dica
        this.rotina = rotina
    }

    descricao() {
        return `${this.nome}, ciclo de cerca de ${this.cicloDias} dias.`
    }

    ehFacil() {
        return this.dificuldade === 'Fácil'
    }

    // Indica se a cultura já tem receita de manejo própria.
    temRotinaEspecifica() {
        return this.rotina.especifica === true
    }
}

export default Cultura
