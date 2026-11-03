// Serviço de clima.
// Consome APIs públicas com fetch, sem necessidade de chave.
//
// A localização é obtida em três camadas, nesta ordem:
// 1. Geolocalização do navegador, que é a mais precisa e pede permissão.
// 2. Localização aproximada pelo IP, caso o usuário recuse ou o recurso falhe.
// 3. Busca manual por nome da cidade, deixada como alternativa na tela.

const ENDERECO_PREVISAO = 'https://api.open-meteo.com/v1/forecast'
const ENDERECO_CIDADES = 'https://geocoding-api.open-meteo.com/v1/search'
const ENDERECO_IP = 'https://ipwho.is/'
const ENDERECO_REVERSO = 'https://api.bigdatacloud.net/data/reverse-geocode-client'

// ───────── Localização ─────────

function posicaoDoNavegador() {
    return new Promise(function (resolver) {
        if (!navigator.geolocation) {
            resolver(null)
            return
        }

        navigator.geolocation.getCurrentPosition(
            function (posicao) {
                resolver({
                    latitude: posicao.coords.latitude,
                    longitude: posicao.coords.longitude,
                    origem: 'navegador'
                })
            },
            function () {
                resolver(null)
            },
            { timeout: 8000, maximumAge: 600000 }
        )
    })
}

// Descobre o nome da cidade a partir das coordenadas.
async function nomeDoLugar(latitude, longitude) {
    try {
        const endereco = `${ENDERECO_REVERSO}?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`
        const resposta = await fetch(endereco)
        if (!resposta.ok) {
            return null
        }
        const dados = await resposta.json()
        return {
            cidade: dados.city || dados.locality || dados.localityInfo?.administrative?.[3]?.name || '',
            estado: dados.principalSubdivision || '',
            pais: dados.countryName || ''
        }
    } catch (problema) {
        return null
    }
}

// Localização aproximada pelo endereço IP.
async function posicaoPorIp() {
    const resposta = await fetch(ENDERECO_IP)
    if (!resposta.ok) {
        throw new Error('Não foi possível descobrir a sua localização.')
    }

    const dados = await resposta.json()
    if (dados.success === false || !dados.latitude) {
        throw new Error('Não foi possível descobrir a sua localização.')
    }

    return {
        latitude: dados.latitude,
        longitude: dados.longitude,
        cidade: dados.city || '',
        estado: dados.region || '',
        pais: dados.country || '',
        origem: 'ip'
    }
}

// Tenta o navegador e, se não der, usa o IP.
async function descobrirLocalizacao() {
    const doNavegador = await posicaoDoNavegador()

    if (doNavegador) {
        const lugar = await nomeDoLugar(doNavegador.latitude, doNavegador.longitude)
        return {
            latitude: doNavegador.latitude,
            longitude: doNavegador.longitude,
            cidade: lugar ? lugar.cidade : '',
            estado: lugar ? lugar.estado : '',
            pais: lugar ? lugar.pais : '',
            origem: 'navegador'
        }
    }

    return await posicaoPorIp()
}

// Busca manual, usada quando a pessoa quer ver outra cidade.
async function buscarCidades(nome) {
    const termo = nome.trim()
    if (termo.length < 3) {
        return []
    }

    const endereco = `${ENDERECO_CIDADES}?name=${encodeURIComponent(termo)}&count=5&language=pt&format=json`
    const resposta = await fetch(endereco)
    if (!resposta.ok) {
        throw new Error('Não foi possível buscar a cidade agora.')
    }

    const dados = await resposta.json()
    if (!dados.results) {
        return []
    }

    return dados.results.map(function (c) {
        return {
            id: c.id,
            cidade: c.name,
            estado: c.admin1 || '',
            pais: c.country || '',
            latitude: c.latitude,
            longitude: c.longitude,
            origem: 'manual'
        }
    })
}

// ───────── Previsão ─────────

// Busca o retorno completo: condição atual, dados do solo e sete dias.
async function buscarTempo(local) {
    const partes = [
        `latitude=${local.latitude}`,
        `longitude=${local.longitude}`,
        'current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,is_day',
        'hourly=soil_temperature_0cm,soil_moisture_0_to_1cm',
        'daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max,et0_fao_evapotranspiration,sunrise,sunset',
        'timezone=auto',
        'forecast_days=7'
    ]

    const resposta = await fetch(`${ENDERECO_PREVISAO}?${partes.join('&')}`)
    if (!resposta.ok) {
        throw new Error('Não foi possível buscar a previsão agora.')
    }

    const dados = await resposta.json()
    if (!dados.daily || !dados.daily.time) {
        throw new Error('A previsão veio em um formato inesperado.')
    }

    return {
        agora: montarAgora(dados),
        solo: montarSolo(dados),
        dias: montarDias(dados)
    }
}

function montarAgora(dados) {
    const atual = dados.current || {}
    return {
        temperatura: numero(atual.temperature_2m),
        sensacao: numero(atual.apparent_temperature),
        umidade: numero(atual.relative_humidity_2m),
        chuva: numero(atual.precipitation),
        vento: numero(atual.wind_speed_10m),
        direcaoVento: numero(atual.wind_direction_10m),
        pressao: numero(atual.surface_pressure),
        codigo: atual.weather_code,
        dia: atual.is_day === 1
    }
}

// A API devolve o solo hora a hora. Aqui pegamos a leitura mais
// próxima do momento atual.
function montarSolo(dados) {
    const horario = dados.hourly
    if (!horario || !horario.time) {
        return { temperatura: null, umidade: null }
    }

    const agora = new Date()
    let indice = 0
    let menorDiferenca = Infinity

    for (let i = 0; i < horario.time.length; i++) {
        const diferenca = Math.abs(new Date(horario.time[i]) - agora)
        if (diferenca < menorDiferenca) {
            menorDiferenca = diferenca
            indice = i
        }
    }

    return {
        temperatura: valorOuNulo(horario.soil_temperature_0cm, indice),
        umidade: valorOuNulo(horario.soil_moisture_0_to_1cm, indice)
    }
}

function montarDias(dados) {
    const diario = dados.daily
    const dias = []

    for (let i = 0; i < diario.time.length; i++) {
        dias.push({
            data: diario.time[i],
            codigo: valorOuNulo(diario.weather_code, i),
            tempMax: numero(valorOuNulo(diario.temperature_2m_max, i)),
            tempMin: numero(valorOuNulo(diario.temperature_2m_min, i)),
            chuvaMm: numero(valorOuNulo(diario.precipitation_sum, i)),
            chanceChuva: numero(valorOuNulo(diario.precipitation_probability_max, i)),
            ventoMax: numero(valorOuNulo(diario.wind_speed_10m_max, i)),
            uv: numero(valorOuNulo(diario.uv_index_max, i)),
            evapotranspiracao: numero(valorOuNulo(diario.et0_fao_evapotranspiration, i)),
            nascerSol: valorOuNulo(diario.sunrise, i),
            porSol: valorOuNulo(diario.sunset, i)
        })
    }

    return dias
}

function valorOuNulo(lista, indice) {
    if (!lista || lista[indice] === undefined) {
        return null
    }
    return lista[indice]
}

function numero(valor) {
    if (valor === null || valor === undefined) {
        return null
    }
    return valor
}

// ───────── Leitura dos dados ─────────

// Tabela de códigos de tempo do padrão da Organização Meteorológica Mundial.
const CODIGOS = {
    0: { texto: 'Céu limpo', icone: '☀️', noite: '🌙' },
    1: { texto: 'Predomínio de sol', icone: '🌤️', noite: '🌙' },
    2: { texto: 'Parcialmente nublado', icone: '⛅', noite: '☁️' },
    3: { texto: 'Nublado', icone: '☁️', noite: '☁️' },
    45: { texto: 'Névoa', icone: '🌫️', noite: '🌫️' },
    48: { texto: 'Névoa com geada', icone: '🌫️', noite: '🌫️' },
    51: { texto: 'Garoa fraca', icone: '🌦️', noite: '🌦️' },
    53: { texto: 'Garoa', icone: '🌦️', noite: '🌦️' },
    55: { texto: 'Garoa forte', icone: '🌧️', noite: '🌧️' },
    61: { texto: 'Chuva fraca', icone: '🌦️', noite: '🌦️' },
    63: { texto: 'Chuva', icone: '🌧️', noite: '🌧️' },
    65: { texto: 'Chuva forte', icone: '🌧️', noite: '🌧️' },
    71: { texto: 'Neve fraca', icone: '🌨️', noite: '🌨️' },
    73: { texto: 'Neve', icone: '🌨️', noite: '🌨️' },
    75: { texto: 'Neve forte', icone: '❄️', noite: '❄️' },
    80: { texto: 'Pancadas isoladas', icone: '🌦️', noite: '🌦️' },
    81: { texto: 'Pancadas de chuva', icone: '🌧️', noite: '🌧️' },
    82: { texto: 'Pancadas fortes', icone: '⛈️', noite: '⛈️' },
    95: { texto: 'Trovoada', icone: '⛈️', noite: '⛈️' },
    96: { texto: 'Trovoada com granizo', icone: '⛈️', noite: '⛈️' },
    99: { texto: 'Trovoada com granizo', icone: '⛈️', noite: '⛈️' }
}

function descreverTempo(codigo, ehDia) {
    const achado = CODIGOS[codigo]
    if (!achado) {
        return { texto: 'Condição indisponível', icone: '🌡️' }
    }
    return {
        texto: achado.texto,
        icone: ehDia === false ? achado.noite : achado.icone
    }
}

const ROSA_DOS_VENTOS = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO']

function direcaoDoVento(graus) {
    if (graus === null || graus === undefined) {
        return ''
    }
    const indice = Math.round(graus / 45) % 8
    return ROSA_DOS_VENTOS[indice]
}

// Classificação usual do índice ultravioleta.
function faixaUv(valor) {
    if (valor === null) return ''
    if (valor < 3) return 'baixo'
    if (valor < 6) return 'moderado'
    if (valor < 8) return 'alto'
    if (valor < 11) return 'muito alto'
    return 'extremo'
}

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function rotuloDoDia(dataTexto, indice) {
    if (indice === 0) {
        return 'Hoje'
    }
    const partes = dataTexto.split('-')
    const data = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]))
    return DIAS_SEMANA[data.getDay()]
}

function formatarDia(dataTexto) {
    const partes = dataTexto.split('-')
    if (partes.length !== 3) {
        return dataTexto
    }
    return `${partes[2]}/${partes[1]}`
}

function formatarHora(textoIso) {
    if (!textoIso) {
        return ''
    }
    const partes = textoIso.split('T')
    return partes.length === 2 ? partes[1].slice(0, 5) : ''
}

export {
    descobrirLocalizacao,
    buscarCidades,
    buscarTempo,
    descreverTempo,
    direcaoDoVento,
    faixaUv,
    rotuloDoDia,
    formatarDia,
    formatarHora
}
