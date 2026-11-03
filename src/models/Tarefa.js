class Tarefa {
    constructor(id, descricao, diaPrevisto, ocorrencia, totalOcorrencias) {
        this.id = id
        this.descricao = descricao
        this.diaPrevisto = diaPrevisto
        this.ocorrencia = ocorrencia || 0
        this.totalOcorrencias = totalOcorrencias || 0
        this.concluida = false
    }

    concluir() {
        this.concluida = true
    }

    reabrir() {
        this.concluida = false
    }

    alternar() {
        this.concluida = !this.concluida
    }

    estaPendente() {
        return this.concluida === false
    }

    estaAtrasada(diasPassados) {
        return this.estaPendente() && diasPassados >= this.diaPrevisto
    }

    semana() {
        return Math.ceil(this.diaPrevisto / 7)
    }

    rotuloOcorrencia() {
        if (this.totalOcorrencias > 1) {
            return `${this.tipo()} ${this.ocorrencia} de ${this.totalOcorrencias}`
        }
        return this.tipo()
    }

    detalhar() {
        return `No dia ${this.diaPrevisto} do ciclo.`
    }

    tipo() {
        return 'Tarefa'
    }
}

class Rega extends Tarefa {
    constructor(id, descricao, diaPrevisto, ocorrencia, totalOcorrencias, volumeLitros) {
        super(id, descricao, diaPrevisto, ocorrencia, totalOcorrencias)
        this.volumeLitros = volumeLitros
    }

    detalhar() {
        return `Molhar com cerca de ${this.volumeLitros} litros de água.`
    }

    tipo() {
        return 'Rega'
    }
}

class Adubacao extends Tarefa {
    constructor(id, descricao, diaPrevisto, ocorrencia, totalOcorrencias, tipoAdubo, quantidadeGramas) {
        super(id, descricao, diaPrevisto, ocorrencia, totalOcorrencias)
        this.tipoAdubo = tipoAdubo
        this.quantidadeGramas = quantidadeGramas || 0
    }

    detalhar() {
        if (this.quantidadeGramas > 0) {
            return `Aplicar cerca de ${this.quantidadeGramas} g de adubo ${this.tipoAdubo}.`
        }
        return `Aplicar adubo ${this.tipoAdubo}.`
    }

    tipo() {
        return 'Adubação'
    }
}

class Inspecao extends Tarefa {
    constructor(id, descricao, diaPrevisto, ocorrencia, totalOcorrencias, observacao) {
        super(id, descricao, diaPrevisto, ocorrencia, totalOcorrencias)
        this.observacao = observacao
    }

    detalhar() {
        if (this.observacao) {
            return this.observacao + '.'
        }
        return 'Observar as plantas e anotar o que chamar atenção.'
    }

    tipo() {
        return 'Inspeção'
    }
}

class Personalizada extends Tarefa {
    constructor(id, descricao, diaPrevisto, ocorrencia, totalOcorrencias, anotacao) {
        super(id, descricao, diaPrevisto, ocorrencia, totalOcorrencias)
        this.anotacao = anotacao || ''
    }

    detalhar() {
        if (this.anotacao) {
            return this.anotacao + '.'
        }
        return 'Atividade registrada por você.'
    }

    tipo() {
        return 'Outra'
    }
}

export { Tarefa, Rega, Adubacao, Inspecao, Personalizada }
