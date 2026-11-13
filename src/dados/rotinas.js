// Receitas de manejo por cultura.
// Nesta versão três culturas têm receita própria. As demais usam a rotina
// genérica, e vão ganhando a sua receita conforme o sistema evolui.

import RotinaCultura from '../models/RotinaCultura.js'

const alface = new RotinaCultura(
    true,
    150,
    20,
    [
        { tipo: 'rega', descricao: 'Regar no fim da tarde', cada: 2 },
        { tipo: 'inspecao', descricao: 'Checar lesmas e pulgões', cada: 5, observacao: 'Olhar o verso das folhas' }
    ],
    [
        { tipo: 'inspecao', descricao: 'Conferir se as mudas pegaram', dia: 5 },
        { tipo: 'adubacao', descricao: 'Primeira adubação de cobertura', dia: 12, adubo: 'orgânico' },
        { tipo: 'outra', descricao: 'Afastar folhas que encostam no substrato', dia: 25, observacao: 'Evita apodrecimento' },
        { tipo: 'adubacao', descricao: 'Segunda adubação de cobertura', dia: 35, adubo: 'orgânico' },
        { tipo: 'inspecao', descricao: 'Avaliar o ponto de colheita', dia: 50, observacao: 'Folhas firmes e cabeça cheia' }
    ]
)

const rucula = new RotinaCultura(
    true,
    100,
    15,
    [
        { tipo: 'rega', descricao: 'Regar no fim da tarde', cada: 2 },
        { tipo: 'inspecao', descricao: 'Checar sinais de pulgão', cada: 7, observacao: 'Olhar brotos novos' }
    ],
    [
        { tipo: 'inspecao', descricao: 'Conferir germinação e falhas', dia: 4 },
        { tipo: 'adubacao', descricao: 'Adubação de cobertura leve', dia: 10, adubo: 'orgânico' },
        { tipo: 'outra', descricao: 'Desbastar plantas muito próximas', dia: 18, observacao: 'Deixar 10 cm entre elas' },
        { tipo: 'inspecao', descricao: 'Avaliar colheita das folhas externas', dia: 32 }
    ]
)

const cenoura = new RotinaCultura(
    true,
    200,
    25,
    [
        { tipo: 'rega', descricao: 'Regar mantendo o substrato úmido', cada: 3 },
        { tipo: 'inspecao', descricao: 'Verificar se a raiz está exposta', cada: 10, observacao: 'O ombro verde amarga a cenoura' }
    ],
    [
        { tipo: 'inspecao', descricao: 'Conferir germinação', dia: 7, observacao: 'A cenoura germina devagar' },
        { tipo: 'outra', descricao: 'Desbaste das mudas', dia: 20, observacao: 'Deixar 5 cm entre plantas' },
        { tipo: 'adubacao', descricao: 'Adubação rica em potássio', dia: 30, adubo: 'potássio' },
        { tipo: 'outra', descricao: 'Amontoa', dia: 45, observacao: 'Cobrir o ombro da raiz com substrato' },
        { tipo: 'adubacao', descricao: 'Segunda adubação', dia: 60, adubo: 'potássio' },
        { tipo: 'inspecao', descricao: 'Checar diâmetro da raiz', dia: 80, observacao: 'Ponto de colheita por volta de 2 cm' }
    ]
)

const rotinas = {
    alface: alface,
    rucula: rucula,
    cenoura: cenoura
}

function buscarRotina(idCultura, cicloDias) {
    if (rotinas[idCultura]) {
        return rotinas[idCultura]
    }
    return RotinaCultura.generica(cicloDias)
}

export { rotinas, buscarRotina }
