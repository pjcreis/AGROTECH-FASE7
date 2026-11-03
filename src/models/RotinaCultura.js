import { Rega, Adubacao, Inspecao, Personalizada } from './Tarefa.js'

class RotinaCultura {
    constructor(especifica, mlPorMudaPorRega, gramasAduboPorMuda, recorrentes, etapas) {
        this.especifica = especifica
        this.mlPorMudaPorRega = mlPorMudaPorRega
        this.gramasAduboPorMuda = gramasAduboPorMuda
        this.recorrentes = recorrentes || []
        this.etapas = etapas || []
    }

    volumePorRega(quantidadeMudas) {
        const litros = (this.mlPorMudaPorRega * quantidadeMudas) / 1000
        return Math.round(litros * 10) / 10
    }

    aduboPorAplicacao(quantidadeMudas) {
        return Math.round(this.gramasAduboPorMuda * quantidadeMudas)
    }

    criarTarefa(id, linha, dia, ocorrencia, total, quantidadeMudas) {
        if (linha.tipo === 'rega') {
            return new Rega(id, linha.descricao, dia, ocorrencia, total, this.volumePorRega(quantidadeMudas))
        }
        if (linha.tipo === 'adubacao') {
            return new Adubacao(id, linha.descricao, dia, ocorrencia, total,
                linha.adubo || 'orgânico', this.aduboPorAplicacao(quantidadeMudas))
        }
        if (linha.tipo === 'inspecao') {
            return new Inspecao(id, linha.descricao, dia, ocorrencia, total, linha.observacao || '')
        }
        return new Personalizada(id, linha.descricao, dia, ocorrencia, total, linha.observacao || '')
    }

    gerarTarefas(plantio, idBase) {
        const ciclo = plantio.cultura.cicloDias
        const mudas = plantio.quantidadeMudas
        const tarefas = []
        let contador = 1

        this.recorrentes.forEach((linha) => {
            const total = Math.floor(ciclo / linha.cada)
            for (let n = 1; n <= total; n++) {
                const dia = n * linha.cada
                tarefas.push(this.criarTarefa(idBase + contador, linha, dia, n, total, mudas))
                contador = contador + 1
            }
        })

        this.etapas.forEach((linha) => {
            tarefas.push(this.criarTarefa(idBase + contador, linha, linha.dia, 0, 0, mudas))
            contador = contador + 1
        })

        tarefas.sort(function (a, b) {
            return a.diaPrevisto - b.diaPrevisto
        })

        return tarefas
    }

    static generica(cicloDias) {
        const meio = Math.round(cicloDias / 2)
        const fim = cicloDias - 10

        return new RotinaCultura(
            false,
            120,
            15,
            [
                { tipo: 'rega', descricao: 'Regar as mudas', cada: 3 },
                { tipo: 'inspecao', descricao: 'Verificar folhas e pragas', cada: 10, observacao: 'Olhar folhas e caule' }
            ],
            [
                { tipo: 'inspecao', descricao: 'Conferir se as mudas pegaram', dia: 7 },
                { tipo: 'adubacao', descricao: 'Adubação de cobertura', dia: meio, adubo: 'orgânico' },
                { tipo: 'inspecao', descricao: 'Avaliar o ponto de colheita', dia: fim > meio ? fim : meio + 5 }
            ]
        )
    }
}

export default RotinaCultura
