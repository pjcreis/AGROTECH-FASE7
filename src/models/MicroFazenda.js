// Classe MicroFazenda do diagrama de classes.
// É a raiz do modelo: contém os Plantios e as Colheitas (composição) e
// concentra as operações do sistema.

import Plantio from './Plantio.js'
import Colheita from './Colheita.js'
import { Rega, Adubacao, Inspecao, Personalizada } from './Tarefa.js'

class MicroFazenda {
    constructor(plantios, colheitas, proximoId, diasSimulados, proximoIdTarefa) {
        this.plantios = plantios || []
        this.colheitas = colheitas || []
        this.proximoId = proximoId || 1
        this.diasSimulados = diasSimulados || 0
        this.proximoIdTarefa = proximoIdTarefa || 9000
    }

    // Estado inicial usado na demonstração, com dois plantios em fases
    // diferentes. Recebe o catálogo para encontrar as culturas.
    static criarComExemplos(catalogo) {
        const fazenda = new MicroFazenda([], [], 1, 0)
        fazenda.adicionarPlantio(catalogo.buscar('alface'), 12, 'Varanda', 53)
        fazenda.adicionarPlantio(catalogo.buscar('rucula'), 8, 'Quintal', 28)

        // O passo a passo já vivido aparece concluído, para a tela começar
        // limpa. A alface fica com uma única atividade em atraso, que serve
        // de exemplo de pendência.
        fazenda.plantios[0].concluirHistorico(1)
        fazenda.plantios[1].concluirHistorico(0)

        return fazenda
    }

    // O React só redesenha a tela quando recebe um novo objeto, por isso
    // cada operação devolve uma cópia da micro-fazenda.
    clonar() {
        return new MicroFazenda(
            this.plantios,
            this.colheitas,
            this.proximoId,
            this.diasSimulados,
            this.proximoIdTarefa
        )
    }

    // Recebe a própria cultura, que vem do catálogo.
    adicionarPlantio(cultura, quantidadeMudas, local, diasPassados) {
        if (!cultura) {
            return false
        }
        const plantio = new Plantio(this.proximoId, cultura, quantidadeMudas, local, diasPassados || 0)
        this.plantios.push(plantio)
        this.proximoId = this.proximoId + 1
        return true
    }

    buscarPlantio(idPlantio) {
        return this.plantios.find(function (p) {
            return p.id === idPlantio
        })
    }

    removerPlantio(idPlantio) {
        this.plantios = this.plantios.filter(function (p) {
            return p.id !== idPlantio
        })
    }

    registrarColheita(idPlantio) {
        const plantio = this.buscarPlantio(idPlantio)
        if (!plantio) {
            return false
        }
        const colheita = new Colheita(
            plantio.id,
            plantio.cultura.nome,
            plantio.quantidadeMudas,
            plantio.local,
            this.diasSimulados
        )
        this.colheitas.push(colheita)
        this.removerPlantio(idPlantio)
        return true
    }

    simularDias(dias) {
        this.plantios.forEach(function (p) {
            p.avancarDias(dias)
        })
        this.diasSimulados = this.diasSimulados + dias
    }

    contarPorFase(fase) {
        return this.plantios.filter(function (p) {
            return p.obterFase() === fase
        }).length
    }

    // Cria a atividade da subclasse correspondente ao tipo escolhido.
    // É aqui que a herança aparece: o resto do sistema trata todas como
    // Tarefa, sem precisar saber qual subclasse é.
    // Quando repetirCada é informado, a atividade é expandida em
    // ocorrências numeradas até o fim do ciclo.
    adicionarTarefa(idPlantio, tipo, descricao, detalhe, diaInicial, repetirCada) {
        const plantio = this.buscarPlantio(idPlantio)
        if (!plantio) {
            return false
        }

        const ciclo = plantio.cultura.cicloDias
        const inicio = diaInicial > 0 ? diaInicial : 1
        const intervalo = repetirCada > 0 ? repetirCada : 0

        const dias = []
        if (intervalo > 0) {
            for (let dia = inicio; dia <= ciclo; dia = dia + intervalo) {
                dias.push(dia)
            }
        } else {
            dias.push(inicio)
        }

        const total = dias.length > 1 ? dias.length : 0

        for (let i = 0; i < dias.length; i++) {
            const id = this.proximoIdTarefa
            this.proximoIdTarefa = this.proximoIdTarefa + 1
            const ocorrencia = total > 0 ? i + 1 : 0

            let tarefa
            if (tipo === 'rega') {
                tarefa = new Rega(id, descricao, dias[i], ocorrencia, total, Number(detalhe))
            } else if (tipo === 'adubacao') {
                tarefa = new Adubacao(id, descricao, dias[i], ocorrencia, total, detalhe, 0)
            } else if (tipo === 'inspecao') {
                tarefa = new Inspecao(id, descricao, dias[i], ocorrencia, total, detalhe)
            } else {
                tarefa = new Personalizada(id, descricao, dias[i], ocorrencia, total, detalhe)
            }

            plantio.adicionarTarefa(tarefa)
        }

        return true
    }

    alternarTarefa(idPlantio, idTarefa) {
        const plantio = this.buscarPlantio(idPlantio)
        if (!plantio) {
            return false
        }
        const tarefa = plantio.tarefas.find(function (t) {
            return t.id === idTarefa
        })
        if (!tarefa) {
            return false
        }
        tarefa.alternar()
        return true
    }

    removerTarefa(idPlantio, idTarefa) {
        const plantio = this.buscarPlantio(idPlantio)
        if (!plantio) {
            return false
        }
        plantio.removerTarefa(idTarefa)
        return true
    }

    totalTarefas() {
        let total = 0
        this.plantios.forEach(function (p) {
            total = total + p.tarefas.length
        })
        return total
    }

    totalTarefasPendentes() {
        let total = 0
        this.plantios.forEach(function (p) {
            total = total + p.tarefasPendentes().length
        })
        return total
    }

    totalTarefasAtrasadas() {
        let total = 0
        this.plantios.forEach(function (p) {
            total = total + p.tarefasAtrasadas().length
        })
        return total
    }

    limpar() {
        this.plantios = []
        this.colheitas = []
        this.proximoId = 1
        this.diasSimulados = 0
    }
}

export default MicroFazenda
