import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icone, Topo, Metricas } from './Vertical.jsx'

function ItemTarefa({ idPlantio, tarefa, diasPassados, aoAlternar, aoRemover }) {
    const chips = {
        'Rega': 'vf-chip vf-chip-agua',
        'Adubação': 'vf-chip vf-chip-sol',
        'Inspeção': 'vf-chip vf-chip-folha',
        'Outra': 'vf-chip'
    }

    const atrasada = tarefa.estaAtrasada(diasPassados)
    let classe = 'vf-tarefa'
    if (tarefa.concluida) classe = classe + ' concluida'
    if (atrasada) classe = classe + ' atrasada'

    return (
        <li className={classe}>
            <span className="vf-tarefa-dia" aria-hidden="true">Dia {tarefa.diaPrevisto}</span>

            <label className="vf-tarefa-check">
                <input
                    type="checkbox"
                    className="vf-check"
                    checked={tarefa.concluida}
                    onChange={function () { aoAlternar(idPlantio, tarefa.id) }}
                />
                <span>
                    <span className="vf-tarefa-desc">{tarefa.descricao}</span>
                    <span className="vf-tarefa-detalhe">{tarefa.detalhar()}</span>
                </span>
            </label>

            <div className="vf-tarefa-acoes">
                {atrasada && <span className="vf-chip vf-chip-atraso">Em atraso</span>}
                <span className={chips[tarefa.tipo()]}>{tarefa.rotuloOcorrencia()}</span>
                <button
                    type="button"
                    className="btn vf-btn-fantasma"
                    onClick={function () { aoRemover(idPlantio, tarefa.id) }}
                    aria-label={`Remover ${tarefa.descricao} do dia ${tarefa.diaPrevisto}`}
                >
                    Remover
                </button>
            </div>
        </li>
    )
}

function FormTarefa({ idPlantio, cicloDias, aoAdicionar }) {
    const [tipo, setTipo] = useState('outra')
    const [descricao, setDescricao] = useState('')
    const [dia, setDia] = useState('')
    const [repetir, setRepetir] = useState('')
    const [detalhe, setDetalhe] = useState('')
    const [erro, setErro] = useState('')

    const rotulos = {
        rega: { campo: 'Volume em litros', dica: 'Exemplo: 1.5', obrigatorio: true },
        adubacao: { campo: 'Tipo de adubo', dica: 'Exemplo: orgânico', obrigatorio: true },
        inspecao: { campo: 'O que observar', dica: 'Exemplo: sinais de praga', obrigatorio: false },
        outra: { campo: 'Observação', dica: 'Opcional', obrigatorio: false }
    }

    function enviar() {
        if (descricao.trim() === '') {
            setErro('Descreva a atividade.')
            return
        }
        if (dia === '' || Number(dia) <= 0) {
            setErro('Informe em que dia do ciclo ela acontece.')
            return
        }
        if (Number(dia) > cicloDias) {
            setErro(`O ciclo desta cultura tem ${cicloDias} dias.`)
            return
        }
        if (repetir !== '' && Number(repetir) <= 0) {
            setErro('O intervalo de repetição precisa ser maior que zero.')
            return
        }
        if (rotulos[tipo].obrigatorio && detalhe.trim() === '') {
            setErro(`Preencha o campo ${rotulos[tipo].campo.toLowerCase()}.`)
            return
        }

        setErro('')
        aoAdicionar(idPlantio, tipo, descricao.trim(), detalhe.trim(), Number(dia), repetir === '' ? 0 : Number(repetir))
        setDescricao('')
        setDetalhe('')
        setDia('')
        setRepetir('')
    }

    return (
        <div className="vf-form-tarefa">
            <h3>Acrescentar atividade ao plano</h3>
            <div className="row g-3">
                <div className="col-md-3">
                    <label className="form-label" htmlFor={`tipo-${idPlantio}`}>Tipo</label>
                    <select
                        id={`tipo-${idPlantio}`}
                        className="form-select form-select-sm"
                        value={tipo}
                        onChange={function (e) { setTipo(e.target.value); setDetalhe('') }}
                    >
                        <option value="outra">Outra</option>
                        <option value="rega">Rega</option>
                        <option value="adubacao">Adubação</option>
                        <option value="inspecao">Inspeção</option>
                    </select>
                </div>

                <div className="col-md-5">
                    <label className="form-label" htmlFor={`desc-${idPlantio}`}>O que fazer</label>
                    <input
                        id={`desc-${idPlantio}`}
                        type="text"
                        className="form-control form-control-sm"
                        maxLength="60"
                        placeholder="Exemplo: Virar o vaso para o sol"
                        value={descricao}
                        onChange={function (e) { setDescricao(e.target.value) }}
                    />
                </div>

                <div className="col-md-2 col-6">
                    <label className="form-label" htmlFor={`dia-${idPlantio}`}>No dia</label>
                    <input
                        id={`dia-${idPlantio}`}
                        type="number"
                        className="form-control form-control-sm"
                        min="1"
                        max={cicloDias}
                        placeholder={`1 a ${cicloDias}`}
                        value={dia}
                        onChange={function (e) { setDia(e.target.value) }}
                    />
                </div>

                <div className="col-md-2 col-6">
                    <label className="form-label" htmlFor={`rep-${idPlantio}`}>Repetir a cada</label>
                    <input
                        id={`rep-${idPlantio}`}
                        type="number"
                        className="form-control form-control-sm"
                        min="1"
                        max="90"
                        placeholder="dias"
                        value={repetir}
                        onChange={function (e) { setRepetir(e.target.value) }}
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label" htmlFor={`det-${idPlantio}`}>{rotulos[tipo].campo}</label>
                    <input
                        id={`det-${idPlantio}`}
                        type="text"
                        className="form-control form-control-sm"
                        maxLength="40"
                        placeholder={rotulos[tipo].dica}
                        value={detalhe}
                        onChange={function (e) { setDetalhe(e.target.value) }}
                    />
                </div>
            </div>

            <div className="d-flex align-items-center gap-3 mt-3 flex-wrap">
                <button type="button" className="btn vf-btn vf-btn-p" onClick={enviar}>
                    Adicionar ao plano
                </button>
                <span className="vf-suave vf-pequeno">
                    Deixe o campo de repetição vazio para uma atividade única.
                </span>
                {erro !== '' && <span className="text-danger vf-pequeno" role="alert">{erro}</span>}
            </div>
        </div>
    )
}

function PlanoDoPlantio({ plantio, filtro, aoAlternarTarefa, aoAdicionarTarefa, aoRemoverTarefa }) {
    const semanaAtual = plantio.semanaAtual()
    const grupos = plantio.tarefasPorSemana()

    function passaNoFiltro(t) {
        if (filtro === 'pendentes') return t.estaPendente()
        if (filtro === 'atrasadas') return t.estaAtrasada(plantio.diasPassados)
        return true
    }

    const gruposVisiveis = grupos
        .map(function (g) {
            return { semana: g.semana, todas: g.tarefas, tarefas: g.tarefas.filter(passaNoFiltro) }
        })
        .filter(function (g) {
            return g.tarefas.length > 0
        })

    return (
        <div className="vf-painel">
            <div className="vf-painel-topo">
                <h2>Passo a passo do cultivo</h2>
                <span className="vf-suave vf-pequeno">
                    {plantio.tarefas.length} atividades em {plantio.cultura.cicloDias} dias
                </span>
            </div>

            <div className="vf-painel-corpo">
                {gruposVisiveis.length === 0 ? (
                    <p className="vf-suave mb-3">Nenhuma atividade neste filtro.</p>
                ) : (
                    gruposVisiveis.map(function (g) {
                        const feitas = g.todas.filter(function (t) { return t.concluida }).length
                        const inicio = (g.semana - 1) * 7 + 1
                        const fim = g.semana * 7
                        const atual = g.semana === semanaAtual

                        return (
                            <section className={atual ? 'vf-semana vf-semana-atual' : 'vf-semana'} key={g.semana}>
                                <div className="vf-semana-topo">
                                    <h3>
                                        Semana {g.semana}
                                        <small>dias {inicio} a {fim}</small>
                                        {atual && <span className="vf-chip vf-chip-folha">Semana atual</span>}
                                    </h3>
                                    <span className="vf-suave vf-pequeno">
                                        {feitas} de {g.todas.length} concluídas
                                    </span>
                                </div>
                                <ul className="vf-tarefas">
                                    {g.tarefas.map(function (t) {
                                        return (
                                            <ItemTarefa
                                                key={t.id}
                                                idPlantio={plantio.id}
                                                tarefa={t}
                                                diasPassados={plantio.diasPassados}
                                                aoAlternar={aoAlternarTarefa}
                                                aoRemover={aoRemoverTarefa}
                                            />
                                        )
                                    })}
                                </ul>
                            </section>
                        )
                    })
                )}

                <FormTarefa
                    idPlantio={plantio.id}
                    cicloDias={plantio.cultura.cicloDias}
                    aoAdicionar={aoAdicionarTarefa}
                />
            </div>
        </div>
    )
}

function Manejo({ fazenda, aoAlternarTarefa, aoAdicionarTarefa, aoRemoverTarefa }) {
    const [selecionado, setSelecionado] = useState(0)
    const [filtro, setFiltro] = useState('todas')

    const total = fazenda.totalTarefas()
    const pendentes = fazenda.totalTarefasPendentes()
    const atrasadas = fazenda.totalTarefasAtrasadas()
    const concluidas = total - pendentes

    let plantio = fazenda.plantios.find(function (p) {
        return p.id === selecionado
    })
    if (!plantio) {
        plantio = fazenda.plantios[0]
    }

    const filtros = [
        { valor: 'todas', texto: 'Todas' },
        { valor: 'pendentes', texto: 'Pendentes' },
        { valor: 'atrasadas', texto: 'Em atraso' }
    ]

    // Uma barra com um segmento por semana do ciclo.
    let semanas = []
    if (plantio) {
        const totalSemanas = Math.ceil(plantio.cultura.cicloDias / 7)
        const atual = plantio.semanaAtual()
        for (let i = 1; i <= totalSemanas; i++) {
            semanas.push(i < atual ? 'feita' : i === atual ? 'atual' : '')
        }
    }

    return (
        <div className="vf">
            <Topo
                titulo="Rotinas de manejo"
                texto="Um passo a passo do plantio até a colheita, com as atividades na ordem dos dias e as doses calculadas pela quantidade de mudas."
            />

            <main>
                <div className="container">
                    <Metricas
                        itens={[
                            { valor: fazenda.plantios.length, rotulo: 'Plantios ativos', cor: 'folha' },
                            { valor: total, rotulo: 'Atividades no plano', cor: 'agua' },
                            { valor: concluidas, rotulo: 'Já concluídas', cor: 'sol' },
                            { valor: atrasadas, rotulo: 'Em atraso', cor: 'atraso' }
                        ]}
                    />

                    {!plantio ? (
                        <div className="vf-painel">
                            <div className="vf-vazio">
                                <span className="vf-tile"><Icone nome="agua" tamanho={26} /></span>
                                <p className="mb-0">
                                    Nenhum plantio registrado.<br />
                                    Cadastre um plantio no <Link to="/painel">Painel</Link> e o passo a passo
                                    daquela cultura é criado automaticamente.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="vf-abas">
                                {fazenda.plantios.map(function (p) {
                                    const ativo = p.id === plantio.id
                                    const pend = p.tarefasPendentes().length
                                    return (
                                        <button
                                            key={p.id}
                                            type="button"
                                            className={ativo ? 'vf-aba ativa' : 'vf-aba'}
                                            aria-pressed={ativo}
                                            onClick={function () { setSelecionado(p.id) }}
                                        >
                                            <span className="vf-tile" aria-hidden="true">{p.cultura.icone}</span>
                                            <span className="vf-aba-texto">
                                                <strong>{p.cultura.nome}</strong>
                                                <small>{p.quantidadeMudas} mudas · {p.local}</small>
                                            </span>
                                            <span className={pend === 0 ? 'vf-chip vf-chip-folha' : 'vf-chip vf-chip-sol'}>
                                                {pend === 0 ? 'Em dia' : `${pend} a fazer`}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>

                            <div className="vf-ciclo">
                                <div>
                                    <h2>{plantio.cultura.icone} {plantio.cultura.nome} · {plantio.local}</h2>
                                    <div className="vf-suave vf-pequeno">
                                        Dia {plantio.diasPassados} de {plantio.cultura.cicloDias} do ciclo,
                                        faltam {plantio.diasRestantes()} dias para a colheita.
                                    </div>
                                    <div
                                        className="vf-semanas"
                                        role="img"
                                        aria-label={`Semana ${plantio.semanaAtual()} de ${semanas.length}`}
                                    >
                                        {semanas.map(function (classe, i) {
                                            return <i key={i} className={classe}></i>
                                        })}
                                    </div>
                                </div>
                                <div className="vf-controles">
                                    <span className={plantio.cultura.temRotinaEspecifica() ? 'vf-chip vf-chip-folha' : 'vf-chip'}>
                                        {plantio.cultura.temRotinaEspecifica() ? 'Rotina da cultura' : 'Rotina básica'}
                                    </span>
                                    <div className="vf-segmentado" role="group" aria-label="Filtrar atividades">
                                        {filtros.map(function (f) {
                                            const ativo = filtro === f.valor
                                            return (
                                                <button
                                                    key={f.valor}
                                                    type="button"
                                                    className={ativo ? 'ativo' : ''}
                                                    aria-pressed={ativo}
                                                    onClick={function () { setFiltro(f.valor) }}
                                                >
                                                    {f.texto}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            <PlanoDoPlantio
                                plantio={plantio}
                                filtro={filtro}
                                aoAlternarTarefa={aoAlternarTarefa}
                                aoAdicionarTarefa={aoAdicionarTarefa}
                                aoRemoverTarefa={aoRemoverTarefa}
                            />
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}

export default Manejo
