import { useState } from 'react'
import { Icone, Topo } from './Vertical.jsx'
import FormCultura from './FormCultura.jsx'

function calcularMaiorCiclo(lista) {
    return Math.max.apply(null, lista.map(function (c) { return c.cicloDias }))
}

function CardCultura({ cultura, maiorCiclo, aoVerDetalhes }) {
    const facil = cultura.ehFacil()
    const especifica = cultura.temRotinaEspecifica()

    return (
        <article className="vf-cultura">
            <div className="vf-cultura-topo">
                <span className={facil ? 'vf-tile' : 'vf-tile vf-tile-media'} aria-hidden="true">{cultura.icone}</span>
                <span className={facil ? 'vf-chip vf-chip-folha' : 'vf-chip vf-chip-sol'}>{cultura.dificuldade}</span>
            </div>

            <h3>{cultura.nome}</h3>
            <p className="vf-cultura-desc">{cultura.descricao()}</p>

            <ul className="vf-fatos">
                <li>
                    <Icone nome="ciclo" tamanho={16} />
                    <span style={{ flex: 1 }}>
                        Ciclo de {cultura.cicloDias} dias
                        <span className="vf-ciclo-barra" style={{ '--pct': `${(cultura.cicloDias / maiorCiclo) * 100}%` }}></span>
                    </span>
                </li>
                <li className="sol"><Icone nome="sol" tamanho={16} /><span>{cultura.sol}</span></li>
                <li className="agua"><Icone nome="agua" tamanho={16} /><span>{cultura.agua}</span></li>
            </ul>

            <div className="vf-cultura-rodape">
                <span className={especifica ? 'vf-chip vf-chip-folha' : 'vf-chip'} style={{ justifySelf: 'start' }}>
                    {especifica ? 'Rotina própria' : 'Rotina básica'}
                </span>
                <button
                    type="button"
                    className="btn vf-btn-sec w-100"
                    onClick={function () { aoVerDetalhes(cultura) }}
                >
                    Ver detalhes
                </button>
            </div>
        </article>
    )
}

function DetalheCultura({ cultura, aoVoltar }) {
    const facil = cultura.ehFacil()

    return (
        <div className="vf-painel">
            <div className="vf-painel-topo">
                <button type="button" className="btn vf-btn-sec vf-btn-p" onClick={aoVoltar}>
                    <Icone nome="voltar" tamanho={16} /> Voltar ao guia
                </button>
            </div>
            <div className="vf-painel-corpo">
                <div className="vf-detalhe-id">
                    <span className={facil ? 'vf-tile' : 'vf-tile vf-tile-media'} aria-hidden="true">{cultura.icone}</span>
                    <div>
                        <h2>{cultura.nome}</h2>
                        <span className={facil ? 'vf-chip vf-chip-folha' : 'vf-chip vf-chip-sol'}>
                            Dificuldade {cultura.dificuldade.toLowerCase()}
                        </span>
                    </div>
                </div>

                <div className="vf-fatos-grandes">
                    <div className="vf-fato">
                        <Icone nome="ciclo" tamanho={22} />
                        <small>Ciclo</small>
                        <strong>{cultura.cicloDias} dias</strong>
                    </div>
                    <div className="vf-fato sol">
                        <Icone nome="sol" tamanho={22} />
                        <small>Sol</small>
                        <strong>{cultura.sol}</strong>
                    </div>
                    <div className="vf-fato agua">
                        <Icone nome="agua" tamanho={22} />
                        <small>Água</small>
                        <strong>{cultura.agua}</strong>
                    </div>
                </div>

                <div className="vf-dica">
                    <strong>Dica de cultivo</strong>
                    <p>{cultura.dica}</p>
                </div>

                <p className="vf-suave vf-pequeno mb-0">
                    {cultura.temRotinaEspecifica()
                        ? 'Esta cultura tem rotina de manejo própria. Ao registrar um plantio, as tarefas e as doses são criadas de acordo com ela.'
                        : 'Esta cultura ainda usa a rotina básica de manejo. A receita própria entra em uma próxima versão do sistema.'}
                </p>
            </div>
        </div>
    )
}

function Guia({ catalogo, aoCadastrarCultura }) {
    const [busca, setBusca] = useState('')
    const [selecionada, setSelecionada] = useState(null)
    const [cadastrando, setCadastrando] = useState(false)

    const culturas = catalogo.listar()
    const maiorCiclo = calcularMaiorCiclo(culturas)

    const encontradas = culturas.filter(function (c) {
        return c.nome.toLowerCase().indexOf(busca.trim().toLowerCase()) !== -1
    })

    function salvarCultura(dados) {
        aoCadastrarCultura(dados)
        setCadastrando(false)
        setBusca('')
    }

    return (
        <div className="vf">
            <Topo
                titulo="Guia de culturas"
                texto="Consulte as culturas indicadas para o cultivo vertical. Veja ciclo, necessidade de sol e água, nível de dificuldade e uma dica prática para cada uma."
            />

            <main>
                <div className="container">
                    {selecionada !== null ? (
                        <DetalheCultura
                            cultura={selecionada}
                            aoVoltar={function () { setSelecionada(null) }}
                        />
                    ) : (
                        <>
                            <div className="vf-busca">
                                <label htmlFor="busca-cultura" className="visually-hidden">Buscar cultura</label>
                                <Icone nome="busca" tamanho={18} />
                                <input
                                    type="text"
                                    id="busca-cultura"
                                    className="form-control"
                                    placeholder="Buscar cultura, por exemplo: alface"
                                    value={busca}
                                    onChange={function (evento) { setBusca(evento.target.value) }}
                                />
                            </div>
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                                <p className="vf-contagem mb-0" aria-live="polite">
                                    {encontradas.length} {encontradas.length === 1 ? 'cultura' : 'culturas'}
                                </p>
                                {!cadastrando && (
                                    <button
                                        type="button"
                                        className="vf-btn"
                                        onClick={function () { setCadastrando(true) }}
                                    >
                                        Cadastrar cultura
                                    </button>
                                )}
                            </div>

                            {cadastrando && (
                                <FormCultura
                                    catalogo={catalogo}
                                    aoSalvar={salvarCultura}
                                    aoCancelar={function () { setCadastrando(false) }}
                                />
                            )}

                            {encontradas.length === 0 ? (
                                <div className="vf-painel">
                                    <div className="vf-vazio">
                                        <span className="vf-tile"><Icone nome="busca" tamanho={26} /></span>
                                        <p className="mb-0">Nenhuma cultura encontrada para essa busca.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="vf-grade">
                                    {encontradas.map(function (c) {
                                        return (
                                            <CardCultura
                                                key={c.id}
                                                cultura={c}
                                                maiorCiclo={maiorCiclo}
                                                aoVerDetalhes={setSelecionada}
                                            />
                                        )
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}

export default Guia
