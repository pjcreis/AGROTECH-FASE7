import { useForm } from 'react-hook-form'

// Formulário de cadastro de cultura.
// Usa o React Hook Form, conteúdo da Fase 7. A biblioteca cuida do
// estado dos campos e das validações, e devolve os erros prontos
// para a tela.

const opcoesSol = [
    'Sol pleno',
    'Meia-sombra',
    'Meia-sombra a sol pleno',
    'Sol pleno a meia-sombra'
]

const opcoesAgua = [
    'Rega diária',
    'Rega frequente',
    'Rega regular',
    'Rega moderada'
]

function FormCultura({ catalogo, aoSalvar, aoCancelar }) {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            nome: '',
            icone: '🌱',
            cicloDias: '',
            sol: 'Sol pleno',
            agua: 'Rega regular',
            dificuldade: 'Fácil',
            dica: ''
        }
    })

    function enviar(dados) {
        if (catalogo.existeNome(dados.nome)) {
            setError('nome', {
                type: 'duplicado',
                message: 'Já existe uma cultura com esse nome no catálogo.'
            })
            return
        }

        aoSalvar(dados)
    }

    return (
        <div className="vf-painel mb-4">
            <div className="vf-painel-topo">
                <h3>Cadastrar nova cultura</h3>
                <button type="button" className="vf-btn vf-btn-sec" onClick={aoCancelar}>
                    Cancelar
                </button>
            </div>

            <div className="vf-painel-corpo">
                <p className="vf-suave vf-pequeno mb-3">
                    A cultura cadastrada entra no catálogo e já pode ser usada em um plantio.
                    Ela começa com a rotina básica de manejo, calculada a partir do ciclo informado.
                </p>

                <form onSubmit={handleSubmit(enviar)} noValidate>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label" htmlFor="c-nome">Nome da cultura</label>
                            <input
                                id="c-nome"
                                type="text"
                                className={errors.nome ? 'form-control is-invalid' : 'form-control'}
                                placeholder="Por exemplo: Beterraba"
                                {...register('nome', {
                                    required: 'Informe o nome da cultura.',
                                    minLength: { value: 3, message: 'O nome precisa ter ao menos 3 letras.' },
                                    maxLength: { value: 30, message: 'Use no máximo 30 caracteres.' }
                                })}
                            />
                            {errors.nome && <span className="invalid-feedback d-block">{errors.nome.message}</span>}
                        </div>

                        <div className="col-md-2">
                            <label className="form-label" htmlFor="c-icone">Ícone</label>
                            <input
                                id="c-icone"
                                type="text"
                                maxLength="2"
                                className={errors.icone ? 'form-control is-invalid' : 'form-control'}
                                {...register('icone', {
                                    required: 'Escolha um ícone.'
                                })}
                            />
                            {errors.icone && <span className="invalid-feedback d-block">{errors.icone.message}</span>}
                        </div>

                        <div className="col-md-4">
                            <label className="form-label" htmlFor="c-ciclo">Dias até a colheita</label>
                            <input
                                id="c-ciclo"
                                type="number"
                                className={errors.cicloDias ? 'form-control is-invalid' : 'form-control'}
                                placeholder="Por exemplo: 70"
                                {...register('cicloDias', {
                                    required: 'Informe quantos dias a cultura leva até a colheita.',
                                    min: { value: 15, message: 'O ciclo precisa ter ao menos 15 dias.' },
                                    max: { value: 365, message: 'Use no máximo 365 dias.' }
                                })}
                            />
                            {errors.cicloDias && <span className="invalid-feedback d-block">{errors.cicloDias.message}</span>}
                        </div>

                        <div className="col-md-4">
                            <label className="form-label" htmlFor="c-sol">Necessidade de sol</label>
                            <select id="c-sol" className="form-select" {...register('sol')}>
                                {opcoesSol.map(function (o) {
                                    return <option key={o} value={o}>{o}</option>
                                })}
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label" htmlFor="c-agua">Necessidade de água</label>
                            <select id="c-agua" className="form-select" {...register('agua')}>
                                {opcoesAgua.map(function (o) {
                                    return <option key={o} value={o}>{o}</option>
                                })}
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label" htmlFor="c-dificuldade">Dificuldade</label>
                            <select id="c-dificuldade" className="form-select" {...register('dificuldade')}>
                                <option value="Fácil">Fácil</option>
                                <option value="Média">Média</option>
                            </select>
                        </div>

                        <div className="col-12">
                            <label className="form-label" htmlFor="c-dica">Dica de cultivo</label>
                            <textarea
                                id="c-dica"
                                rows="2"
                                className={errors.dica ? 'form-control is-invalid' : 'form-control'}
                                placeholder="Uma orientação curta para quem vai plantar"
                                {...register('dica', {
                                    required: 'Escreva uma dica para quem nunca plantou essa cultura.',
                                    maxLength: { value: 160, message: 'Use no máximo 160 caracteres.' }
                                })}
                            ></textarea>
                            {errors.dica && <span className="invalid-feedback d-block">{errors.dica.message}</span>}
                        </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <button type="button" className="vf-btn vf-btn-sec" onClick={aoCancelar}>
                            Cancelar
                        </button>
                        <button type="submit" className="vf-btn" disabled={isSubmitting}>
                            Salvar cultura
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default FormCultura
