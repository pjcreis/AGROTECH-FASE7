// Classe Catalogo.
// Guarda as culturas disponíveis no sistema e permite cadastrar novas.
// Antes desta fase o catálogo era fixo no código. Agora ele é um objeto
// com estado próprio, o que torna o cadastro de culturas possível.

import Cultura from './Cultura.js'
import RotinaCultura from './RotinaCultura.js'
import { culturasIniciais } from '../dados/culturas.js'

class Catalogo {
    constructor(culturas) {
        this.culturas = culturas || []
    }

    // Catálogo que o sistema traz de fábrica.
    static criarPadrao() {
        return new Catalogo(culturasIniciais())
    }

    // O React redesenha a tela quando recebe um novo objeto no estado,
    // por isso cada operação devolve uma cópia do catálogo.
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

    // Procura por nome, sem diferenciar maiúsculas de minúsculas, para
    // evitar que a mesma cultura seja cadastrada duas vezes.
    existeNome(nome) {
        const alvo = nome.trim().toLowerCase()
        return this.culturas.some(function (c) {
            return c.nome.trim().toLowerCase() === alvo
        })
    }

    // Transforma o nome digitado em um identificador sem acentos,
    // espaços ou maiúsculas.
    gerarId(nome) {
        return nome
            .trim()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
    }

    // Cadastra uma cultura nova. Ela nasce com a rotina básica de manejo,
    // calculada a partir do ciclo informado.
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

    // Culturas cadastradas pelo usuário usam a rotina básica.
    totalComRotinaPropria() {
        return this.culturas.filter(function (c) {
            return c.temRotinaEspecifica()
        }).length
    }
}

export default Catalogo
