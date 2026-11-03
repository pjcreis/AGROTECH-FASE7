import { useState, useEffect } from 'react'
import { Topo } from './Vertical.jsx'

function Contato({ aoEnviar }) {
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [telefone, setTelefone] = useState('')
    const [perfil, setPerfil] = useState('')
    const [mensagem, setMensagem] = useState('')

    const [erros, setErros] = useState({})
    const [enviado, setEnviado] = useState(false)
    const [restantes, setRestantes] = useState(500)

    useEffect(function () {
        setRestantes(500 - mensagem.length)
    }, [mensagem])

    function validarNome(valor) {
        const partes = valor.trim().split(/\s+/).filter(Boolean)
        const regexNome = /^[A-Za-zÀ-ÿ]{2,}$/

        if (partes.length < 2) {
            return 'Informe seu nome e sobrenome.'
        }
        if (!regexNome.test(partes[0]) || !regexNome.test(partes[partes.length - 1])) {
            return 'Nome e sobrenome devem conter apenas letras e ter ao menos 2 letras cada.'
        }
        return ''
    }

    function validarEmail(valor) {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
        if (valor.trim() === '') {
            return 'Informe seu e-mail.'
        }
        if (!regexEmail.test(valor.trim())) {
            return 'Informe um e-mail válido.'
        }
        return ''
    }

    function validarTelefone(valor) {
        const regexTelefone = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/
        if (valor.trim() === '') {
            return 'Informe seu telefone.'
        }
        if (!regexTelefone.test(valor.trim())) {
            return 'Informe um telefone válido. Exemplo: (11) 99999-9999.'
        }
        return ''
    }

    function validarMensagem(valor) {
        if (valor.trim() === '') {
            return 'Escreva sua mensagem.'
        }
        if (valor.length > 500) {
            return 'A mensagem deve ter no máximo 500 caracteres.'
        }
        return ''
    }

    function enviarFormulario(evento) {
        evento.preventDefault()

        const novosErros = {
            nome: validarNome(nome),
            email: validarEmail(email),
            telefone: validarTelefone(telefone),
            perfil: perfil === '' ? 'Selecione o perfil da instituição.' : '',
            mensagem: validarMensagem(mensagem)
        }

        setErros(novosErros)

        const temErro = Object.values(novosErros).some(function (e) {
            return e !== ''
        })

        if (temErro) {
            setEnviado(false)
            return
        }

        setEnviado(true)
        aoEnviar('Mensagem validada com sucesso.')

        setNome('')
        setEmail('')
        setTelefone('')
        setPerfil('')
        setMensagem('')
    }

    function classeCampo(campo) {
        return erros[campo] ? 'form-control is-invalid' : 'form-control'
    }

    return (
        <div className="vf">
            <Topo
                titulo="Fale conosco"
                texto="Quer saber como organizar uma micro-fazenda vertical em sua instituição, condomínio ou projeto social? Envie uma mensagem."
            />

            <main>
                <div className="container">
                    <div className="vf-contato">
                        <div className="vf-painel">
                            <div className="vf-painel-topo"><h2>Envie sua mensagem</h2></div>
                            <div className="vf-painel-corpo">
                                <div>

                                        <form onSubmit={enviarFormulario} noValidate>
                                            <div className="mb-3">
                                                <label htmlFor="nome" className="form-label">Nome completo</label>
                                                <input
                                                    type="text"
                                                    className={classeCampo('nome')}
                                                    id="nome"
                                                    maxLength="80"
                                                    placeholder="Digite seu nome"
                                                    value={nome}
                                                    onChange={function (e) { setNome(e.target.value) }}
                                                />
                                                {erros.nome && <div className="invalid-feedback d-block">{erros.nome}</div>}
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="email" className="form-label">E-mail</label>
                                                <input
                                                    type="email"
                                                    className={classeCampo('email')}
                                                    id="email"
                                                    maxLength="100"
                                                    placeholder="seuemail@exemplo.com"
                                                    value={email}
                                                    onChange={function (e) { setEmail(e.target.value) }}
                                                />
                                                {erros.email && <div className="invalid-feedback d-block">{erros.email}</div>}
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="telefone" className="form-label">Telefone</label>
                                                <input
                                                    type="tel"
                                                    className={classeCampo('telefone')}
                                                    id="telefone"
                                                    placeholder="(11) 99999-9999"
                                                    value={telefone}
                                                    onChange={function (e) { setTelefone(e.target.value) }}
                                                />
                                                {erros.telefone && <div className="invalid-feedback d-block">{erros.telefone}</div>}
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="perfil" className="form-label">Perfil</label>
                                                <select
                                                    className={erros.perfil ? 'form-select is-invalid' : 'form-select'}
                                                    id="perfil"
                                                    value={perfil}
                                                    onChange={function (e) { setPerfil(e.target.value) }}
                                                >
                                                    <option value="">Selecione</option>
                                                    <option value="condominio">Condomínio</option>
                                                    <option value="escola">Escola</option>
                                                    <option value="centro-comunitario">Centro comunitário</option>
                                                    <option value="projeto-social">Projeto social</option>
                                                    <option value="outro">Outro</option>
                                                </select>
                                                {erros.perfil && <div className="invalid-feedback d-block">{erros.perfil}</div>}
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="mensagem" className="form-label">Mensagem</label>
                                                <textarea
                                                    className={erros.mensagem ? 'form-control is-invalid' : 'form-control'}
                                                    id="mensagem"
                                                    rows="5"
                                                    maxLength="500"
                                                    placeholder="Descreva brevemente sua necessidade (até 500 caracteres)"
                                                    value={mensagem}
                                                    onChange={function (e) { setMensagem(e.target.value) }}
                                                ></textarea>

                                                <div className="d-flex justify-content-between align-items-center mt-1">
                                                    <small className="vf-suave">Máximo de 500 caracteres.</small>
                                                    <small className={restantes <= 50 ? 'vf-suave fw-semibold' : 'vf-suave'} aria-live="polite">
                                                        {mensagem.length}/500 caracteres
                                                    </small>
                                                </div>

                                                {erros.mensagem && <div className="invalid-feedback d-block">{erros.mensagem}</div>}
                                            </div>

                                            <button className="btn vf-btn" type="submit">Enviar mensagem</button>
                                        </form>

                                        {enviado && (
                                            <div className="vf-ok" role="alert">
                                                <strong>Mensagem validada com sucesso.</strong><br />
                                                Em uma versão futura, sua solicitação será enviada para análise.
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Contato
