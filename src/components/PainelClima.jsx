import { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import {
    descobrirLocalizacao,
    buscarCidades,
    buscarTempo,
    descreverTempo,
    direcaoDoVento,
    faixaUv,
    rotuloDoDia,
    formatarDia,
    formatarHora
} from '../servicos/clima.js'

const Caixa = styled.section`
    background: #ffffff;
    border: 1px solid #e3e7e0;
    border-radius: 14px;
    overflow: hidden;
    margin-bottom: 20px;
`

const Topo = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    flex-wrap: wrap;
    padding: 12px 18px;
`

const Agora = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;

    .icone {
        font-size: 30px;
        line-height: 1;
    }

    .cidade {
        font-size: 13.5px;
        font-weight: 600;
        color: #1f3d2b;
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .resumo {
        font-size: 12.5px;
        color: #7b857f;
        margin-top: 1px;
    }

    .grau {
        font-size: 22px;
        font-weight: 500;
        color: #1f2d26;
        margin-right: 2px;
    }
`

const Acoes = styled.div`
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
`

const BotaoTexto = styled.button`
    background: none;
    border: none;
    padding: 0;
    font-size: 12.5px;
    color: #2e7040;
    cursor: pointer;

    &:hover {
        color: #1e4d2b;
        text-decoration: underline;
    }

    .seta {
        display: inline-block;
        margin-left: 4px;
        transform: ${function (props) { return props.$aberto ? 'rotate(180deg)' : 'none' }};
        transition: transform 0.2s;
    }
`

const rolar = keyframes`
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
`

const Faixa = styled.div`
    border-top: 1px solid #eef1ec;
    background: #fafbf9;
    overflow: hidden;
    padding: 8px 0;
    mask-image: linear-gradient(90deg, transparent, #000 36px, #000 calc(100% - 36px), transparent);
    -webkit-mask-image: linear-gradient(90deg, transparent, #000 36px, #000 calc(100% - 36px), transparent);
`

const Trilho = styled.div`
    display: flex;
    width: max-content;
    animation: ${rolar} 46s linear infinite;

    &:hover {
        animation-play-state: paused;
    }

    @media (prefers-reduced-motion: reduce) {
        animation: none;
        width: 100%;
        flex-wrap: wrap;
        justify-content: center;
    }
`

const Indicador = styled.span`
    display: inline-flex;
    align-items: baseline;
    gap: 6px;
    padding: 0 16px;
    font-size: 12.5px;
    white-space: nowrap;
    border-right: 1px solid #e6eae3;

    b {
        font-weight: 600;
        color: #8a9490;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        font-size: 10.5px;
    }

    span {
        color: #1f2d26;
        font-weight: 500;
    }

    small {
        color: #a3aba6;
        font-size: 11px;
    }
`

const Detalhes = styled.div`
    border-top: 1px solid #eef1ec;
    padding: 16px 18px 18px;
`

const Semana = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;

    @media (max-width: 900px) {
        grid-template-columns: repeat(4, 1fr);
    }

    @media (max-width: 520px) {
        grid-template-columns: repeat(2, 1fr);
    }
`

const Dia = styled.div`
    border: 1px solid #eef1ec;
    border-radius: 12px;
    padding: 10px 6px;
    text-align: center;
    background: ${function (props) { return props.$hoje ? '#f3f8f4' : '#ffffff' }};

    .nome {
        font-size: 10.5px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: ${function (props) { return props.$hoje ? '#2e7040' : '#8a9490' }};
    }

    .data { font-size: 10.5px; color: #a8b0ab; }
    .icone { font-size: 21px; margin: 6px 0 4px; }
    .temps { font-size: 13px; color: #1f2d26; }
    .temps span { color: #8a9490; margin-left: 4px; }

    .chuva {
        font-size: 11.5px;
        margin-top: 4px;
        color: ${function (props) { return props.$molhado ? '#1f6fb2' : '#a8b0ab' }};
    }
`

const Nota = styled.p`
    font-size: 11.5px;
    color: #9aa39e;
    margin: 14px 0 0;
`

const Busca = styled.div`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    padding: 0 18px 14px;

    input {
        flex: 1;
        min-width: 180px;
        padding: 8px 11px;
        font-size: 13.5px;
        border: 1px solid #e3e7e0;
        border-radius: 9px;
        outline: none;
    }

    input:focus {
        border-color: #4a9b5f;
        box-shadow: 0 0 0 3px rgba(74, 155, 95, 0.15);
    }

    button {
        padding: 8px 15px;
        font-size: 13.5px;
        font-weight: 500;
        color: #ffffff;
        background: #1e4d2b;
        border: none;
        border-radius: 9px;
        cursor: pointer;
    }
`

const Opcao = styled.button`
    display: block;
    width: calc(100% - 36px);
    text-align: left;
    margin: 0 18px 6px;
    padding: 9px 11px;
    font-size: 13px;
    background: #ffffff;
    border: 1px solid #e3e7e0;
    border-radius: 9px;
    cursor: pointer;

    &:hover { background: #f3f8f4; }
`

const Mensagem = styled.p`
    font-size: 12.5px;
    color: ${function (props) { return props.$erro ? '#b42318' : '#8a9490' }};
    margin: 0;
    padding: 14px 18px;
`

function inteiro(valor) {
    if (valor === null || valor === undefined || Number.isNaN(valor)) {
        return '—'
    }
    return Math.round(valor)
}

function decimal(valor, casas) {
    if (valor === null || valor === undefined || Number.isNaN(valor)) {
        return '—'
    }
    return valor.toFixed(casas === undefined ? 1 : casas)
}

function PainelClima() {
    const [local, setLocal] = useState(null)
    const [tempo, setTempo] = useState(null)
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState('')
    const [aberto, setAberto] = useState(false)
    const [trocando, setTrocando] = useState(false)
    const [termo, setTermo] = useState('')
    const [opcoes, setOpcoes] = useState([])

    useEffect(function () {
        let ativo = true

        async function iniciar() {
            try {
                const encontrado = await descobrirLocalizacao()
                if (!ativo) return
                setLocal(encontrado)

                const dados = await buscarTempo(encontrado)
                if (!ativo) return
                setTempo(dados)
            } catch (problema) {
                if (ativo) {
                    setErro(problema.message)
                }
            }
            if (ativo) {
                setCarregando(false)
            }
        }

        iniciar()

        return function () {
            ativo = false
        }
    }, [])

    async function procurarCidade() {
        if (termo.trim().length < 3) {
            setErro('Digite pelo menos três letras do nome da cidade.')
            return
        }
        setErro('')
        try {
            const encontradas = await buscarCidades(termo)
            if (encontradas.length === 0) {
                setErro('Nenhuma cidade encontrada com esse nome.')
            }
            setOpcoes(encontradas)
        } catch (problema) {
            setErro(problema.message)
        }
    }

    async function escolherCidade(escolhida) {
        setOpcoes([])
        setTrocando(false)
        setTermo('')
        setCarregando(true)
        setErro('')
        setLocal(escolhida)

        try {
            const dados = await buscarTempo(escolhida)
            setTempo(dados)
        } catch (problema) {
            setErro(problema.message)
        }
        setCarregando(false)
    }

    function campoDeBusca() {
        return (
            <>
                <Busca>
                    <input
                        type="text"
                        placeholder="Nome da cidade, por exemplo Guaxupé"
                        aria-label="Nome da cidade"
                        value={termo}
                        onChange={function (e) { setTermo(e.target.value) }}
                        onKeyDown={function (e) { if (e.key === 'Enter') procurarCidade() }}
                    />
                    <button type="button" onClick={procurarCidade}>Buscar</button>
                </Busca>
                {opcoes.map(function (o) {
                    return (
                        <Opcao key={o.id} type="button" onClick={function () { escolherCidade(o) }}>
                            {o.cidade}{o.estado ? `, ${o.estado}` : ''} · {o.pais}
                        </Opcao>
                    )
                })}
            </>
        )
    }

    if (carregando) {
        return (
            <Caixa>
                <Mensagem>Buscando as condições do tempo na sua região...</Mensagem>
            </Caixa>
        )
    }

    if (erro !== '' && !tempo) {
        return (
            <Caixa>
                <Mensagem $erro>{erro}</Mensagem>
                {campoDeBusca()}
            </Caixa>
        )
    }

    const agora = tempo.agora
    const hoje = tempo.dias[0]
    const solo = tempo.solo
    const condicao = descreverTempo(agora.codigo, agora.dia)
    const nomeLocal = [local.cidade, local.estado].filter(Boolean).join(', ') || 'Sua região'

    const indicadores = [
        { rotulo: 'Umidade do ar', valor: inteiro(agora.umidade), unidade: '%' },
        { rotulo: 'Vento', valor: inteiro(agora.vento), unidade: `km/h ${direcaoDoVento(agora.direcaoVento)}` },
        { rotulo: 'Pressão', valor: inteiro(agora.pressao), unidade: 'hPa' },
        { rotulo: 'Chuva hoje', valor: decimal(hoje.chuvaMm), unidade: 'mm' },
        { rotulo: 'Chance de chuva', valor: inteiro(hoje.chanceChuva), unidade: '%' },
        { rotulo: 'Índice UV', valor: decimal(hoje.uv), unidade: faixaUv(hoje.uv) },
        { rotulo: 'Evapotranspiração', valor: decimal(hoje.evapotranspiracao), unidade: 'mm' },
        { rotulo: 'Solo a 0 cm', valor: inteiro(solo.temperatura), unidade: '°C' },
        { rotulo: 'Umidade do solo', valor: solo.umidade === null ? '—' : decimal(solo.umidade * 100, 0), unidade: '%' },
        { rotulo: 'Sol', valor: formatarHora(hoje.nascerSol), unidade: `às ${formatarHora(hoje.porSol)}` }
    ]

    const faixaDupla = indicadores.concat(indicadores)

    return (
        <Caixa>
            <Topo>
                <Agora>
                    <span className="icone">{condicao.icone}</span>
                    <div>
                        <div className="cidade">📍 {nomeLocal}</div>
                        <div className="resumo">
                            <span className="grau">{inteiro(agora.temperatura)}°C</span>
                            {condicao.texto} · sensação de {inteiro(agora.sensacao)}°C ·
                            máxima {inteiro(hoje.tempMax)}°C e mínima {inteiro(hoje.tempMin)}°C
                        </div>
                    </div>
                </Agora>

                <Acoes>
                    <BotaoTexto type="button" onClick={function () { setTrocando(!trocando) }}>
                        {trocando ? 'Fechar busca' : 'Ver outra cidade'}
                    </BotaoTexto>
                    <BotaoTexto
                        type="button"
                        $aberto={aberto}
                        aria-expanded={aberto}
                        onClick={function () { setAberto(!aberto) }}
                    >
                        Previsão de sete dias<span className="seta">▾</span>
                    </BotaoTexto>
                </Acoes>
            </Topo>

            {trocando && campoDeBusca()}

            <Faixa aria-label="Indicadores meteorológicos">
                <Trilho>
                    {faixaDupla.map(function (ind, indice) {
                        return (
                            <Indicador key={`${ind.rotulo}-${indice}`} aria-hidden={indice >= indicadores.length}>
                                <b>{ind.rotulo}</b>
                                <span>{ind.valor}</span>
                                <small>{ind.unidade}</small>
                            </Indicador>
                        )
                    })}
                </Trilho>
            </Faixa>

            {aberto && (
                <Detalhes>
                    <Semana>
                        {tempo.dias.map(function (d, indice) {
                            const c = descreverTempo(d.codigo, true)
                            return (
                                <Dia key={d.data} $hoje={indice === 0} $molhado={d.chuvaMm !== null && d.chuvaMm >= 1}>
                                    <div className="nome">{rotuloDoDia(d.data, indice)}</div>
                                    <div className="data">{formatarDia(d.data)}</div>
                                    <div className="icone" title={c.texto}>{c.icone}</div>
                                    <div className="temps">
                                        {inteiro(d.tempMax)}°<span>{inteiro(d.tempMin)}°</span>
                                    </div>
                                    <div className="chuva">
                                        {decimal(d.chuvaMm)} mm · {inteiro(d.chanceChuva)}%
                                    </div>
                                </Dia>
                            )
                        })}
                    </Semana>

                    <Nota>
                        Dados meteorológicos do Open-Meteo, atualizados a cada consulta. As informações
                        são apresentadas para consulta e não substituem a avaliação de quem cuida do cultivo.
                    </Nota>
                </Detalhes>
            )}
        </Caixa>
    )
}

export default PainelClima
