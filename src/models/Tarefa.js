// Classe Tarefa e suas subclasses, conforme o diagrama de classes.
// Tarefa é a classe base de toda atividade da rotina de manejo.
// Rega, Adubacao, Inspecao e Personalizada herdam dela e cada uma
// sobrescreve detalhar(), que é o ponto de polimorfismo do projeto.
//
// Toda tarefa acontece em um dia do ciclo. As atividades que se repetem
// são expandidas em ocorrências numeradas na hora de montar a rotina,
// por isso a tarefa também guarda a sua posição na sequência.

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

    // Fica em atraso quando o ciclo já passou do dia previsto e a
    // atividade ainda não foi marcada como feita.
    estaAtrasada(diasPassados) {
        return this.estaPendente() && diasPassados >= this.diaPrevisto
    }

    // Semana do ciclo em que a atividade acontece, usada para agrupar
    // o passo a passo na tela.
    semana() {
        return Math.ceil(this.diaPrevisto / 7)
    }

    // Numeração da atividade quando ela se repete ao longo do ciclo.
    rotuloOcorrencia() {
        if (this.totalOcorrencias > 1) {
            return `${this.tipo()} ${this.ocorrencia} de ${this.totalOcorrencias}`
        }
        return this.tipo()
    }

    // Cada subclasse sobrescreve este método.
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

// Atividade livre, sem categoria fixa. Usada pelas receitas para o que
// não é rega, adubação nem inspeção, como o desbaste da cenoura, e
// também pelo usuário, para registrar o que quiser.
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
