import Cultura from './Cultura.js'
import RotinaCultura from './RotinaCultura.js'
import { culturasIniciais } from '../dados/culturas.js'

class Catalogo {
    constructor(culturas) {
        this.culturas = culturas || []
    }

    static criarPadrao() {
        return new Catalogo(culturasIniciais())
    }

    clonar() {
        return new Catalogo(this.culturas)
    }

    listar() {
        return this.culturas
    }

    buscar(id) {
        return this.culturas.find(function (c) {
            return c.id === id
        })
    }

    existeNome(nome) {
        const alvo = nome.trim().toLowerCase()
        return this.culturas.some(function (c) {
            return c.nome.trim().toLowerCase() === alvo
        })
    }

    gerarId(nome) {
        return nome
            .trim()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
    }

    adicionarCultura(dados) {
        const id = this.gerarId(dados.nome)
        const ciclo = Number(dados.cicloDias)

        const cultura = new Cultura(
            id,
            dados.nome.trim(),
            dados.icone || '🌱',
            ciclo,
            dados.sol,
            dados.agua,
            dados.dificuldade,
            dados.dica ? dados.dica.trim() : '',
            RotinaCultura.generica(ciclo)
        )

        this.culturas = this.culturas.concat(cultura)
        return cultura
    }

    removerCultura(id) {
        this.culturas = this.culturas.filter(function (c) {
            return c.id !== id
        })
    }

    totalComRotinaPropria() {
        return this.culturas.filter(function (c) {
            return c.temRotinaEspecifica()
        }).length
    }
}

export default Catalogo
