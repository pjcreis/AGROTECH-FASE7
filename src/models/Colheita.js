// Classe Colheita do diagrama de classes.
// Guarda o registro de um ciclo produtivo encerrado.

class Colheita {
    constructor(id, culturaNome, quantidade, local, diaRegistro) {
        this.id = id
        this.culturaNome = culturaNome
        this.quantidade = quantidade
        this.local = local
        this.diaRegistro = diaRegistro
    }

    resumo() {
        return `${this.culturaNome}, ${this.quantidade} mudas em ${this.local}.`
    }

    quando() {
        return this.diaRegistro === 0 ? 'Hoje' : `Dia ${this.diaRegistro}`
    }
}

export default Colheita
