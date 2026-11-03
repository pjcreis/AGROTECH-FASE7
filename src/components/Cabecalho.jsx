import { Link, NavLink } from 'react-router-dom'
import { Icone } from './Vertical.jsx'

function Cabecalho() {
    function classeDoLink({ isActive }) {
        return isActive ? 'nav-link active' : 'nav-link'
    }

    return (
        <nav className="navbar navbar-expand-lg sticky-top">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <span className="vf-marca"><Icone nome="broto" tamanho={20} /></span>
                    <span>Sistema Orquestrador de Micro-Fazendas <span>Verticais</span></span>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuPrincipal" aria-controls="menuPrincipal" aria-expanded="false" aria-label="Abrir menu">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="menuPrincipal">
                    <ul className="navbar-nav gap-lg-3">
                        <li className="nav-item"><NavLink className={classeDoLink} to="/">Home</NavLink></li>
                        <li className="nav-item"><NavLink className={classeDoLink} to="/sistema">O Sistema</NavLink></li>
                        <li className="nav-item"><NavLink className={classeDoLink} to="/guia">Guia de Culturas</NavLink></li>
                        <li className="nav-item"><NavLink className={classeDoLink} to="/painel">Painel</NavLink></li>
                        <li className="nav-item"><NavLink className={classeDoLink} to="/manejo">Manejo</NavLink></li>
                        <li className="nav-item"><NavLink className={classeDoLink} to="/contato">Fale Conosco</NavLink></li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Cabecalho
