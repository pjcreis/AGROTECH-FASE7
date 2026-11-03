import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Cabecalho from './components/Cabecalho.jsx'
import Rodape from './components/Rodape.jsx'
import Avisos from './components/Avisos.jsx'

import Home from './components/Home.jsx'
import Sistema from './components/Sistema.jsx'
import Guia from './components/Guia.jsx'
import Painel from './components/Painel.jsx'
import Manejo from './components/Manejo.jsx'
import Contato from './components/Contato.jsx'

import MicroFazenda from './models/MicroFazenda.js'
import Catalogo from './models/Catalogo.js'

function App() {
    const [catalogo, setCatalogo] = useState(function () {
        return Catalogo.criarPadrao()
    })
    const [fazenda, setFazenda] = useState(function () {
        return MicroFazenda.criarComExemplos(catalogo)
    })
    const [avisos, setAvisos] = useState([])

    function atualizar() {
        setFazenda(fazenda.clonar())
    }

    function mostrarAviso(texto) {
        const aviso = { id: Date.now(), texto: texto }
        setAvisos(function (anteriores) {
            return anteriores.concat(aviso)
        })
    }

    function fecharAviso(id) {
        setAvisos(function (anteriores) {
            return anteriores.filter(function (a) {
                return a.id !== id
            })
        })
    }

    function adicionarPlantio(idCultura, mudas, local) {
        fazenda.adicionarPlantio(catalogo.buscar(idCultura), mudas, local, 0)
        atualizar()
        mostrarAviso('Plantio registrado. O passo a passo da cultura foi criado.')
    }

    function cadastrarCultura(dados) {
        const nova = catalogo.adicionarCultura(dados)
        setCatalogo(catalogo.clonar())
        mostrarAviso(`${nova.nome} entrou no catálogo de culturas.`)
    }

    function removerPlantio(id) {
        fazenda.removerPlantio(id)
        atualizar()
        mostrarAviso('Plantio removido.')
    }

    function registrarColheita(id) {
        fazenda.registrarColheita(id)
        atualizar()
        mostrarAviso('Colheita registrada.')
    }

    function simularDias(dias) {
        fazenda.simularDias(dias)
        atualizar()
        mostrarAviso(`${dias} dias simulados.`)
    }

    function limparTudo() {
        fazenda.limpar()
        atualizar()
        mostrarAviso('Painel limpo.')
    }

    function alternarTarefa(idPlantio, idTarefa) {
        fazenda.alternarTarefa(idPlantio, idTarefa)
        atualizar()
    }

    function adicionarTarefa(idPlantio, tipo, descricao, detalhe, diaInicial, repetirCada) {
        fazenda.adicionarTarefa(idPlantio, tipo, descricao, detalhe, diaInicial, repetirCada)
        atualizar()
        mostrarAviso('Atividade adicionada ao plano.')
    }

    function removerTarefa(idPlantio, idTarefa) {
        fazenda.removerTarefa(idPlantio, idTarefa)
        atualizar()
        mostrarAviso('Atividade removida.')
    }

    return (
        <BrowserRouter>
            <Cabecalho />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sistema" element={<Sistema />} />
                <Route
                    path="/guia"
                    element={<Guia catalogo={catalogo} aoCadastrarCultura={cadastrarCultura} />}
                />
                <Route
                    path="/painel"
                    element={
                        <Painel
                            catalogo={catalogo}
                            fazenda={fazenda}
                            aoAdicionar={adicionarPlantio}
                            aoRemover={removerPlantio}
                            aoColher={registrarColheita}
                            aoSimular={simularDias}
                            aoLimpar={limparTudo}
                        />
                    }
                />
                <Route
                    path="/manejo"
                    element={
                        <Manejo
                            fazenda={fazenda}
                            aoAlternarTarefa={alternarTarefa}
                            aoAdicionarTarefa={adicionarTarefa}
                            aoRemoverTarefa={removerTarefa}
                        />
                    }
                />
                <Route path="/contato" element={<Contato aoEnviar={mostrarAviso} />} />
                <Route path="*" element={<Home />} />
            </Routes>

            <Rodape />
            <Avisos lista={avisos} aoFechar={fecharAviso} />
        </BrowserRouter>
    )
}

export default App
