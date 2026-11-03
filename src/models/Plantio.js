class Plantio {
    constructor(id, cultura, quantidadeMudas, local, diasPassados) {
        this.id = id
        this.cultura = cultura
        this.quantidadeMudas = quantidadeMudas
        this.local = local
        this.diasPassados = diasPassados
        this.tarefas = []
        this.criarTarefasPadrao()
    }

    criarTarefasPadrao() {
        this.tarefas = this.cultura.rotina.gerarTarefas(this, this.id * 1000)
    }

    adicionarTarefa(tarefa) {
        this.tarefas.push(tarefa)
        this.ordenarTarefas()
    }

    ordenarTarefas() {
        this.tarefas.sort(function (a, b) {
            return a.diaPrevisto - b.diaPrevisto
        })
    }

    removerTarefa(idTarefa) {
        this.tarefas = this.tarefas.filter(function (t) {
            return t.id !== idTarefa
        })
    }

    tarefasPendentes() {
        return this.tarefas.filter(function (t) {
            return t.estaPendente()
        })
    }

    tarefasAtrasadas() {
        const dias = this.diasPassados
        return this.tarefas.filter(function (t) {
            return t.estaAtrasada(dias)
        })
    }

    proximasTarefas(quantidade) {
        const dias = this.diasPassados
        const futuras = this.tarefas.filter(function (t) {
            return t.estaPendente() && t.diaPrevisto > dias
        })
        return futuras.slice(0, quantidade)
    }

    tarefasPorSemana() {
        const grupos = []
        this.tarefas.forEach(function (t) {
            const semana = t.semana()
            let grupo = grupos.find(function (g) {
                return g.semana === semana
            })
            if (!grupo) {
                grupo = { semana: semana, tarefas: [] }
                grupos.push(grupo)
            }
            grupo.tarefas.push(t)
        })
        return grupos.sort(function (a, b) {
            return a.semana - b.semana
        })
    }

    semanaAtual() {
        const semana = Math.ceil(this.diasPassados / 7)
        return semana < 1 ? 1 : semana
    }


    concluirHistorico(quantasDeixarAbertas) {
        const dias = this.diasPassados
        const passadas = this.tarefas.filter(function (t) {
            return t.diaPrevisto <= dias
        })
        const limite = passadas.length - (quantasDeixarAbertas || 0)
        for (let i = 0; i < passadas.length; i++) {
            if (i < limite) {
                passadas[i].concluir()
            }
        }
    }

    avancarDias(dias) {
        this.diasPassados = this.diasPassados + dias
        if (this.diasPassados > this.cultura.cicloDias) {
            this.diasPassados = this.cultura.cicloDias
        }
    }

    calcularProgresso() {
        let pct = (this.diasPassados / this.cultura.cicloDias) * 100
        if (pct > 100) {
            pct = 100
        }
        return parseInt(pct)
    }

    obterFase() {
        const pct = this.calcularProgresso()
        if (pct >= 100) return 'Pronto'
        if (pct >= 50) return 'Crescendo'
        return 'Inicial'
    }

    diasRestantes() {
        const restantes = this.cultura.cicloDias - this.diasPassados
        return restantes < 0 ? 0 : restantes
    }

    estaPronto() {
        return this.diasPassados >= this.cultura.cicloDias
    }
}

export default Plantio
