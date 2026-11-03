import { Link } from 'react-router-dom'
import { Icone } from './Vertical.jsx'

const beneficios = [
    { icone: 'broto', titulo: 'Mais controle', texto: 'Informações de cultivo reunidas em um só lugar.' },
    { icone: 'ciclo', titulo: 'Mais previsibilidade', texto: 'Acompanhe o que está crescendo e o que se aproxima da colheita.' },
    { icone: 'agua', titulo: 'Rotina organizada', texto: 'Rega, adubação e inspeção com periodicidade definida por plantio.' },
    { icone: 'sol', titulo: 'Menos desperdício', texto: 'Controle o que está crescendo e o que se aproxima da colheita para evitar desperdícios.' }
]

// Página inicial.
function Home() {
    return (
        <div className="vf">
            <header className="vf-hero">
                <div className="container">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-7">
                            <div className="vf-topo-bloco" style={{ maxWidth: 'none' }}>
                                <h1>Sua horta vertical, organizada do plantio à colheita.</h1>
                                <p>
                                    Uma solução simples para condomínios, escolas, centros comunitários e projetos sociais
                                    que querem produzir alimentos frescos em pequenos espaços, com mais controle e previsibilidade.
                                </p>
                                <a
                                    href="https://youtu.be/4PPs-TOZlXM"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn vf-btn"
                                >
                                    Assistir ao pitch da Fase 6
                                    <span className="visually-hidden"> (abre em nova aba)</span>
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <img
                                src="https://images.unsplash.com/photo-1682629088851-daa687df7f7f?w=800&q=80&auto=format&fit=crop"
                                alt="Torre de cultivo vertical com mudas de hortaliças"
                                className="vf-hero-img"
                            />
                        </div>
                    </div>
                </div>
            </header>

            <main>
                <div className="container">
                    <div className="row g-4 align-items-center">
                        <div className="col-lg-5">
                            <h2 className="vf-secao-titulo">Pouco espaço, mais organização.</h2>
                            <p className="vf-suave mb-0">
                                A Micro-Fazenda Vertical transforma varandas, áreas comuns, quintais e espaços institucionais
                                em pontos de produção local de alimentos. O sistema apoia a operação para que a horta
                                não dependa de anotações soltas ou da memória de quem está cuidando no dia.
                            </p>
                        </div>
                        <div className="col-lg-7">
                            <div className="vf-grade-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                                {beneficios.map(function (b) {
                                    return (
                                        <div className="vf-beneficio" key={b.titulo}>
                                            <span className="vf-tile"><Icone nome={b.icone} tamanho={22} /></span>
                                            <h3>{b.titulo}</h3>
                                            <p>{b.texto}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    <section className="vf-chamada">
                        <h2 className="vf-secao-titulo">Uma ferramenta simples para dar continuidade à produção.</h2>
                        <p>Veja como o sistema organiza culturas, plantios, manejo e colheitas.</p>
                        <div className="d-flex gap-3 justify-content-center flex-wrap">
                            <Link to="/sistema" className="btn vf-btn">Ver funcionalidades</Link>
                            <Link to="/manejo" className="btn vf-btn-sec">Conhecer as rotinas de manejo</Link>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default Home
