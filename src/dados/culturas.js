// Culturas que o sistema traz de fábrica.
// Cada item é uma instância da classe Cultura e recebe a sua rotina de
// manejo. As culturas sem receita própria usam a rotina genérica.
// A lista é criada por uma função porque o catálogo passou a ser um
// objeto com estado, que o usuário pode alimentar com novas culturas.

import Cultura from '../models/Cultura.js'
import { buscarRotina } from './rotinas.js'

function criar(id, nome, icone, ciclo, sol, agua, dificuldade, dica) {
    return new Cultura(id, nome, icone, ciclo, sol, agua, dificuldade, dica, buscarRotina(id, ciclo))
}

function culturasIniciais() {
    return [
        criar('alface', 'Alface', '🥬', 60, 'Meia-sombra a sol pleno', 'Rega diária', 'Fácil',
            'Colha as folhas externas primeiro para prolongar a produção.'),
        criar('rucula', 'Rúcula', '🌿', 40, 'Sol pleno a meia-sombra', 'Rega frequente', 'Fácil',
            'Ciclo curto. Faça plantios escalonados a cada 15 dias.'),
        criar('cenoura', 'Cenoura', '🥕', 90, 'Sol pleno', 'Rega moderada', 'Média',
            'Use um recipiente fundo para a raiz se desenvolver bem.'),
        criar('cebolinha', 'Cebolinha', '🧅', 70, 'Sol pleno', 'Rega moderada', 'Fácil',
            'Corte a 2 cm da base, que ela rebrota várias vezes.'),
        criar('couve', 'Couve', '🥬', 80, 'Sol pleno', 'Rega regular', 'Média',
            'Retire as folhas de baixo para cima, a planta produz por meses.'),
        criar('espinafre', 'Espinafre', '🍃', 55, 'Meia-sombra', 'Rega frequente', 'Média',
            'Prefere clima ameno. Evite os períodos de calor mais forte.'),
        criar('manjericao', 'Manjericão', '🌱', 65, 'Sol pleno', 'Rega moderada', 'Fácil',
            'Belisque as pontas com frequência para a planta ficar mais cheia.'),
        criar('salsa', 'Salsa', '🌿', 75, 'Meia-sombra a sol', 'Rega regular', 'Média',
            'A germinação é lenta. Tenha paciência nas primeiras semanas.')
    ]
}

export { culturasIniciais }
