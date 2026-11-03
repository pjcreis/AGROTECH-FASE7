// Peças visuais compartilhadas por Painel, Manejo e Guia de Culturas.

const caminhos = {
    sol: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
    agua: <path d="M12 3s6 6.5 6 10.5a6 6 0 0 1-12 0C6 9.5 12 3 12 3z" />,
    ciclo: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    busca: <><circle cx="11" cy="11" r="6.5" /><path d="M16 16l5 5" /></>,
    voltar: <path d="M15 6l-6 6 6 6" />,
    broto: <><path d="M12 21v-9" /><path d="M12 12c0-4 3-6 7-6 0 4-3 6-7 6z" /><path d="M12 15c0-3-2.5-5-6-5 0 3 2.5 5 6 5z" /></>
}

function Icone({ nome, tamanho = 18 }) {
    return (
        <svg
            width={tamanho}
            height={tamanho}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {caminhos[nome]}
        </svg>
    )
}

function Topo({ titulo, texto }) {
    return (
        <header className="vf-topo">
            <div className="container">
                <div className="vf-topo-bloco">
                    <h1>{titulo}</h1>
                    <p>{texto}</p>
                </div>
            </div>
        </header>
    )
}

// itens: [{ valor, rotulo, cor }]  cor: folha | agua | sol | atraso
function Metricas({ itens }) {
    return (
        <div className="vf-metricas">
            {itens.map(function (item) {
                return (
                    <div className="vf-metrica" key={item.rotulo}>
                        <div className="vf-metrica-num">{item.valor}</div>
                        <div className="vf-metrica-rotulo">
                            <span className={`vf-ponto vf-ponto-${item.cor}`}></span>
                            {item.rotulo}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export { Icone, Topo, Metricas }
