import { Icone, Topo } from './Vertical.jsx'

const funcionalidades = [
    { id: 1, icone: '🌿', titulo: 'Cadastro de culturas', texto: 'Cadastre novas culturas no catálogo com ciclo, necessidade de sol e água, dificuldade e dica de cultivo.' },
    { id: 2, icone: '🪴', titulo: 'Registro de plantio', texto: 'Documente cada plantio com local, quantidade de mudas e variedade cultivada. Mantenha o histórico de todas as operações.' },
    { id: 3, icone: '📊', titulo: 'Acompanhamento do ciclo', texto: 'Visualize o estágio de cada plantio, desde a fase inicial até a maturação, com previsão de colheita.' },
    { id: 4, icone: '💧', titulo: 'Rotinas de manejo', texto: 'Um passo a passo por cultura, do plantio à colheita, com as atividades na ordem dos dias e as doses calculadas pela quantidade de mudas.' },
    { id: 5, icone: '🧺', titulo: 'Registro de colheita', texto: 'Encerre o ciclo produtivo registrando a colheita e mantenha o histórico de produção disponível.' },
    { id: 6, icone: '✅', titulo: 'Painel de produção', texto: 'Visualize um resumo com plantios ativos, próximas colheitas e tarefas pendentes em um único lugar.' }
]

function CardFuncionalidade({ icone, titulo, texto }) {
    return (
        <article className="vf-beneficio">
            <span className="vf-tile" aria-hidden="true">{icone}</span>
            <h3>{titulo}</h3>
            <p>{texto}</p>
        </article>
    )
}

const publico = [
    'Condomínios que querem implantar hortas verticais em áreas comuns.',
    'Escolas e centros comunitários que desejam organizar a produção local.',
    'Projetos sociais que precisam de rotina simples de plantio, manejo e colheita.',
    'Voluntários e responsáveis pela operação diária da horta.'
]

function Sistema() {
    return (
        <div className="vf">
            <Topo
                titulo="Um sistema para gerenciar a rotina da produção."
                texto="Acompanhe culturas, plantios, manejos e colheitas com uma estrutura simples, acessível e adequada à produção em pequena escala."
            />

            <main>
                <div className="container">
                    <h2 className="vf-secao-titulo">Funcionalidades principais</h2>
                    <p className="vf-suave mb-4">
                        Recursos essenciais para organizar a operação de uma micro-fazenda vertical.
                    </p>
                    <div className="vf-grade">
                        {funcionalidades.map(function (f) {
                            return (
                                <CardFuncionalidade
                                    key={f.id}
                                    icone={f.icone}
                                    titulo={f.titulo}
                                    texto={f.texto}
                                />
                            )
                        })}
                    </div>

                    <div className="row g-4 align-items-center mt-4 pt-3">
                        <div className="col-lg-5">
                            <h2 className="vf-secao-titulo">Para quem foi pensado</h2>
                            <p className="vf-suave">
                                O sistema é desenvolvido com foco em simplicidade e acessibilidade para diferentes públicos.
                                Não é necessário conhecimento técnico avançado para operá-lo.
                            </p>
                        </div>
                        <div className="col-lg-7">
                            <ul className="vf-lista">
                                {publico.map(function (texto) {
                                    return (
                                        <li key={texto}>
                                            <Icone nome="broto" tamanho={20} />
                                            <span>{texto}</span>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Sistema
