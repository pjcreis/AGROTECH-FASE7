import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icone, Topo, Metricas } from './Vertical.jsx'
import PainelClima from './PainelClima.jsx'

function FormPlantio({ culturas, aoAdicionar }) {
    const [idCultura, setIdCultura] = useState('')
    const [mudas, setMudas] = useState('')
    const [local, setLocal] = useState('')
    const [erro, setErro] = useState('')

    function enviar() {
        if (idCultura === '') {
            setErro('Selecione uma cultura.')
            return
        }
        if (mudas === '' || Number(mudas) <= 0) {
            setErro('Informe uma quantidade de mudas maior que zero.')
            return
        }
        if (local.trim() === '') {
            setErro('Informe o local do plantio.')
            return
        }

        setErro('')
        aoAdicionar(idCultura, Number(mudas), local.trim())
        setIdCultura('')
        setMudas('')
        setLocal('')
    }

    return (
        <div className="vf-painel">
            <div className="vf-painel-topo">
                <h2>Registrar plantio</h2>
            </div>
            <div className="vf-painel-corpo">
                <div className="mb-3">
                    <label htmlFor="plantio-cultura" className="form-label">Cultura</label>
                    <select
                        id="plantio-cultura"
                        className="form-select"
                        value={idCultura}
                        onChange={function (e) { setIdCultura(e.target.value) }}
                    >
                        <option value="">Selecione</option>
                        {culturas.map(function (c) {
                            return <option key={c.id} value={c.id}>{c.nome}</option>
                        })}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="plantio-mudas" className="form-label">Mudas</label>
                    <input
                        type="number"
                        id="plantio-mudas"
                        className="form-control"
                        min="1"
                        max="500"
                        placeholder="Exemplo: 10"
                        value={mudas}
                        onChange={function (e) { setMudas(e.target.value) }}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="plantio-local" className="form-label">Local</label>
                    <input
                        type="text"
                        id="plantio-local"
                        className="form-control"
                        maxLength="50"
                        placeholder="Exemplo: Varanda"
                        value={local}
                        onChange={function (e) { setLocal(e.target.value) }}
                    />
                </div>
                <button type="button" className="btn vf-btn w-100" onClick={enviar}>
                    Adicionar plantio
                </button>
                {erro !== '' && <div className="text-danger mt-3" role="alert">{erro}</div>}
            </div>
        </div>
    )
}

function Prateleira({ plantio, aoColher, aoRemover }) {
    const pct = plantio.calcularProgresso()
    const fase = plantio.obterFase()

    let classeChip = 'vf-chip vf-chip-agua'
    if (fase === 'Pronto') classeChip = 'vf-chip vf-chip-folha'
    else if (fase === 'Crescendo') classeChip = 'vf-chip vf-chip-sol'

    const pendentes = plantio.tarefasPendentes().length
    const atrasadas = plantio.tarefasAtrasadas().length

    return (
        <li className="vf-prateleira" style={{ '--pct': `${pct}%`, '--pn': pct / 100 }}>
            <div className="vf-prat-id">
                <span className="vf-tile" aria-hidden="true">{plantio.cultura.icone}</span>
                <div>
                    <div className="vf-prat-nome">
                        <strong>{plantio.cultura.nome}</strong>
                        <span className={classeChip}>{fase}</span>
                    </div>
                    <div className="vf-suave vf-pequeno">
                        {plantio.quantidadeMudas} mudas · {plantio.local}
                    </div>
                </div>
            </div>

            <div>
                <div className="vf-prat-pct">
                    <strong>{pct}%</strong>
                    <span>{plantio.estaPronto() ? 'ciclo completo' : `${plantio.diasRestantes()} dias restantes`}</span>
                </div>
                <div className="vf-suave vf-pequeno d-flex align-items-center gap-2 flex-wrap">
                    {pendentes} tarefa{pendentes === 1 ? '' : 's'} pendente{pendentes === 1 ? '' : 's'}
                    {atrasadas > 0 && <span className="vf-chip vf-chip-atraso">{atrasadas} em atraso</span>}
                </div>
            </div>

            <div className="vf-prat-acoes">
                {plantio.estaPronto() && (
                    <button
                        type="button"
                        className="btn vf-btn vf-btn-p"
                        onClick={function () { aoColher(plantio.id) }}
                    >
                        Colher
                    </button>
                )}
                <button
                    type="button"
                    className="btn vf-btn-sec vf-btn-p"
                    onClick={function () { aoRemover(plantio.id) }}
                >
                    Remover
                </button>
            </div>
        </li>
    )
}

// Página "Painel".
function Painel({ catalogo, fazenda, aoAdicionar, aoRemover, aoColher, aoSimular, aoLimpar }) {
    const vazio = fazenda.plantios.length === 0

    return (
        <div className="vf">
            <Topo
                titulo="Painel de plantios"
                texto="Registre plantios, simule a passagem do tempo e acompanhe cada ciclo até a colheita."
            />

            <main>
                <div className="container">
                    <PainelClima />

                    <Metricas
                        itens={[
                            { valor: fazenda.plantios.length, rotulo: 'Plantios ativos', cor: 'folha' },
                            { valor: fazenda.contarPorFase('Crescendo'), rotulo: 'Em crescimento', cor: 'sol' },
                            { valor: fazenda.contarPorFase('Pronto'), rotulo: 'Prontos para colheita', cor: 'agua' },
                            { valor: fazenda.colheitas.length, rotulo: 'Colheitas registradas', cor: 'folha' }
                        ]}
                    />

                    <div className="vf-layout">
                        <FormPlantio culturas={catalogo.listar()} aoAdicionar={aoAdicionar} />

                        <div>
                            <div className="vf-painel">
                                <div className="vf-painel-topo">
                                    <h2>Torre de cultivo</h2>
                                    <div className="d-flex gap-2 flex-wrap">
                                        <button
                                            type="button"
                                            className="btn vf-btn vf-btn-p"
                                            disabled={vazio}
                                            onClick={function () { aoSimular(7) }}
                                        >
                                            Simular 7 dias
                                        </button>
                                        <button
                                            type="button"
                                            className="btn vf-btn-sec vf-btn-p"
                                            disabled={vazio}
                                            onClick={aoLimpar}
                                        >
                                            Limpar tudo
                                        </button>
                                    </div>
                                </div>

                                {vazio ? (
                                    <div className="vf-vazio">
                                        <span className="vf-tile"><Icone nome="broto" tamanho={26} /></span>
                                        <p className="mb-0">
                                            Nenhum plantio registrado.<br />
                                            Use o formulário para começar.
                                        </p>
                                    </div>
                                ) : (
                                    <ul className="vf-torre">
                                        {fazenda.plantios.map(function (p) {
                                            return (
                                                <Prateleira
                                                    key={p.id}
                                                    plantio={p}
                                                    aoColher={aoColher}
                                                    aoRemover={aoRemover}
                                                />
                                            )
                                        })}
                                    </ul>
                                )}
                            </div>

                            {!vazio && (
                                <p className="vf-suave vf-pequeno mt-3 mb-0">
                                    As tarefas de rega, adubação e inspeção de cada plantio ficam na
                                    página <Link className="vf-link" to="/manejo">Manejo</Link>.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="vf-painel mt-4">
                        <div className="vf-painel-topo">
                            <h2>Histórico de colheitas</h2>
                        </div>
                        {fazenda.colheitas.length === 0 ? (
                            <div className="vf-vazio">
                                <p className="mb-0">
                                    Nenhuma colheita registrada ainda.<br />
                                    Quando um plantio chegar a 100%, registre a colheita.
                                </p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="vf-tabela">
                                    <thead>
                                        <tr>
                                            <th>Cultura</th>
                                            <th>Quantidade</th>
                                            <th>Local</th>
                                            <th>Quando</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fazenda.colheitas.slice().reverse().map(function (c) {
                                            return (
                                                <tr key={c.id}>
                                                    <td><strong>{c.culturaNome}</strong></td>
                                                    <td>{c.quantidade} mudas</td>
                                                    <td>{c.local}</td>
                                                    <td>{c.quando()}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Painel
