import { useEffect } from 'react'

function Aviso({ id, texto, aoFechar }) {
    useEffect(function () {
        const tempo = setTimeout(function () {
            aoFechar(id)
        }, 3000)

        return function () {
            clearTimeout(tempo)
        }
    }, [id])

    return (
        <div className="toast-custom" role="status">
            {texto}
        </div>
    )
}

function Avisos({ lista, aoFechar }) {
    return (
        <div id="toast-container" aria-live="polite">
            {lista.map(function (aviso) {
                return (
                    <Aviso
                        key={aviso.id}
                        id={aviso.id}
                        texto={aviso.texto}
                        aoFechar={aoFechar}
                    />
                )
            })}
        </div>
    )
}

export default Avisos
