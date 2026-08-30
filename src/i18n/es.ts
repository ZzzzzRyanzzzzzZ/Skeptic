import type { Locale } from './en';

const strings: Record<string, string> = {
  'welcome.title': 'Bienvenido a Skeptic',
  'welcome.sub':
    'Pega un mensaje sospechoso y descubre por qué es una estafa, no solo si lo es.',
  'welcome.p1': 'Funciona con SMS, correos, mensajes directos o una captura de pantalla.',
  'welcome.p2': 'Explica cada punto de su razonamiento, en lenguaje sencillo.',
  'welcome.p3': 'Se ejecuta por completo en tu dispositivo. Nunca se sube nada.',
  'welcome.start': 'Empezar',
  'welcome.note': 'Sin cuenta. Sin rastreo. Funciona sin conexión.',
  'app.name': 'Skeptic',
  'app.tagline': 'Pega un mensaje sospechoso. Descubre por qué es una estafa.',
  'app.offline': 'Funciona por completo en tu dispositivo',
  'nav.analyze': 'Revisar un mensaje',
  'nav.practice': 'Practicar',
  'nav.model': 'Cómo funciona',
  'nav.learn': 'Guía de estafas',
  'settings.title': 'Pantalla',
  'settings.language': 'Idioma',
  'settings.textSize': 'Tamaño del texto',
  'settings.textSize.normal': 'Normal',
  'settings.textSize.large': 'Grande',
  'settings.textSize.huge': 'Máximo',
  'settings.contrast': 'Alto contraste',
  'settings.theme': 'Tema',

  'analyze.heading': 'Revisar un mensaje',
  'analyze.intro':
    'Pega un mensaje de texto, correo o DM. Nada de lo que escribas se envía a ningún servidor: el análisis ocurre en esta pestaña.',
  'analyze.placeholder':
    'Pega el mensaje aquí…\n\nPor ejemplo: «USPS: tu paquete está retenido. Paga la tarifa de $1.95 en usps-redelivery.icu/track»',
  'analyze.clear': 'Borrar',
  'analyze.paste': 'Pegar del portapapeles',
  'analyze.samples': 'O prueba un ejemplo:',
  'analyze.empty.title': 'Esperando un mensaje',
  'analyze.empty.body':
    'El resultado aparece aquí mientras escribes. Tu mensaje nunca sale de este dispositivo.',
  'analyze.evidence': 'Por qué',
  'analyze.evidence.none': 'No se encontraron señales de alarma.',
  'analyze.links': 'Enlaces en este mensaje',
  'analyze.links.none': 'No hay enlaces.',
  'analyze.actions': 'Qué hacer ahora',
  'analyze.message': 'El mensaje, con las señales marcadas',
  'analyze.model': 'Lo que vio el modelo',
  'analyze.model.intro':
    'Estas son las palabras exactas que movieron al modelo entrenado, y cuánto. No es una aproximación: son sus propios pesos.',
  'analyze.model.toward': 'Hacia estafa',
  'analyze.model.away': 'Hacia legítimo',
  'analyze.copy': 'Copiar informe',
  'analyze.copied': 'Informe copiado',
  'analyze.report': 'Denunciar',
  'analyze.confidence.low': 'Confianza baja: el mensaje es muy corto',
  'analyze.confidence.medium': 'Confianza media',
  'analyze.confidence.high': 'Confianza alta',
  'analyze.without': 'Sin esta señal: {score}',
  'analyze.points': '{points} puntos',
  'analyze.scoreLabel': 'Puntuación de riesgo',
  'analyze.family': 'Parece: {family}',
  'analyze.breakdown': 'Desglose de la puntuación',
  'analyze.breakdown.note':
    'Las señales suman {raw} puntos, que se proyectan en la escala 0–100. La curva se aplana a propósito: ninguna señal por sí sola puede llevar la puntuación al máximo, ni tampoco un montón de señales débiles.',

  'band.safe': 'Sin señales de alarma',
  'band.safe.body':
    'Nada aquí coincide con un patrón de estafa conocido. Aun así, mantente alerta: ninguna herramienta lo detecta todo.',
  'band.caution': 'Ten cuidado',
  'band.caution.body':
    'Hay algunas señales de alarma. No actúes según este mensaje hasta comprobarlo por otra vía.',
  'band.likely-scam': 'Probablemente es una estafa',
  'band.likely-scam.body': 'Tiene la forma de una estafa. No hagas clic, no respondas, no llames, no pagues.',
  'band.dangerous': 'Peligroso: casi con seguridad es una estafa',
  'band.dangerous.body':
    'Varias señales fuertes. No hagas clic, no respondas, no llames, no pagues. Bórralo.',

  'ev.model.language.title': 'La redacción coincide con mensajes de estafa',
  'ev.model.language.detail':
    'El modelo entrenado estima un {percent}% de probabilidad de estafa, solo por la redacción.',

  'ev.rule.urgency.title': 'Urgencia fabricada',
  'ev.rule.urgency.detail':
    'Presión para actuar antes de pensar, p. ej. «{quote}». Las organizaciones reales te dan tiempo.',
  'ev.rule.threat.title': 'Amenaza de consecuencias',
  'ev.rule.threat.detail':
    'Amenaza con pérdidas, cierre o problemas legales: «{quote}». El miedo es el objetivo: evita que compruebes.',
  'ev.rule.safeAccount.title': 'Te pide mover tu dinero',
  'ev.rule.safeAccount.detail':
    '«{quote}». Ningún banco, policía ni organismo público te pide mover dinero a una «cuenta segura». Esa petición solo viene de un delincuente.',
  'ev.rule.untraceablePayment.title': 'Quiere un pago imposible de rastrear',
  'ev.rule.untraceablePayment.detail':
    'Menciona {quote}. Las tarjetas de regalo, transferencias y criptomonedas se exigen porque no se pueden revertir.',
  'ev.rule.credentialRequest.title': 'Pide una contraseña, PIN o código',
  'ev.rule.credentialRequest.detail':
    '«{quote}». Ninguna organización legítima pide tu contraseña, tu PIN ni un código de un solo uso: ni por mensaje, ni por correo, ni por teléfono.',
  'ev.rule.sensitiveData.title': 'Menciona datos personales sensibles',
  'ev.rule.sensitiveData.detail':
    'Se refiere a {quote}. Por sí solo es común; junto a presión o un enlace es una señal de alarma.',
  'ev.rule.secrecy.title': 'Te pide guardar el secreto',
  'ev.rule.secrecy.detail':
    '«{quote}». El secreto existe para alejarte de quienes te dirían que es una estafa.',
  'ev.rule.tooGood.title': 'Demasiado bueno para ser cierto',
  'ev.rule.tooGood.detail':
    '«{quote}». Los premios inesperados y las ganancias garantizadas son el anzuelo más antiguo que existe.',
  'ev.rule.advanceFee.title': 'Pide una tarifa antes de recibir algo',
  'ev.rule.advanceFee.detail':
    '«{quote}». Pagar una pequeña tarifa para desbloquear una suma mayor, un paquete o un premio es la estafa del pago anticipado.',
  'ev.rule.techSupport.title': 'Soporte técnico falso',
  'ev.rule.techSupport.detail':
    '«{quote}». Los avisos emergentes nunca detectan virus reales, y ninguna empresa real pide acceso remoto así.',
  'ev.rule.extortion.title': 'Chantaje / sextorsión',
  'ev.rule.extortion.detail':
    '«{quote}». Estos mensajes se envían masivamente a millones de direcciones. No existe ningún vídeo.',
  'ev.rule.jobTask.title': 'Estafa de empleo o tareas',
  'ev.rule.jobTask.detail':
    '«{quote}». Dinero fácil por tareas simples, compras por adelantado o reenvío de paquetes son reclutamiento para el fraude.',
  'ev.rule.romance.title': 'Lenguaje de estafa romántica',
  'ev.rule.romance.detail':
    '«{quote}». Afecto seguido de un consejo de inversión o una petición de dinero es el patrón de una estafa larga.',
  'ev.rule.investment.title': 'Lenguaje de estafa de inversión',
  'ev.rule.investment.detail':
    '«{quote}». Las ganancias garantizadas no existen. «Validar» una billetera solo sirve para vaciarla.',
  'ev.rule.familyEmergency.title': 'Pretexto de emergencia familiar',
  'ev.rule.familyEmergency.detail':
    '«{quote}». Un familiar en apuros, desde un número nuevo, que necesita dinero ya: llámalo a su número de siempre para comprobarlo.',
  'ev.rule.govImpersonation.title': 'Suplanta a un organismo público',
  'ev.rule.govImpersonation.detail':
    'Dice ser {quote}. Los organismos contactan primero por correo postal y nunca exigen pago inmediato por teléfono.',
  'ev.rule.refund.title': 'Cargo o reembolso falso',
  'ev.rule.refund.detail':
    '«{quote}». Un cargo que no reconoces, con un número al que llamar, es el cebo para ponerte al teléfono.',
  'ev.rule.invoiceBec.title': 'Patrón de fraude del CEO / factura',
  'ev.rule.invoiceBec.detail':
    '«{quote}». Un jefe o proveedor que solo puede escribir, que tiene prisa y que cambió sus datos bancarios es el fraude de factura clásico.',
  'ev.rule.channelSwitch.title': 'Quiere pasar a otra aplicación',
  'ev.rule.channelSwitch.detail':
    '«{quote}». Pasar a WhatsApp o Telegram te aleja de una plataforma que puede moderar o avisarte.',
  'ev.rule.genericGreeting.title': 'Saludo genérico',
  'ev.rule.genericGreeting.detail':
    '«{quote}». Una organización con la que realmente tienes cuenta sabe tu nombre.',
  'ev.rule.wrongNumber.title': 'Apertura de «número equivocado»',
  'ev.rule.wrongNumber.detail':
    '«{quote}». Un desconocido que te escribió «por error» y sigue conversando está iniciando una estafa larga.',
  'ev.rule.rapportProbe.title': 'Preguntas personales de alguien que no conoces',
  'ev.rule.rapportProbe.detail':
    '«{quote}». Por sí solo es simple amabilidad. Justo después de un primer contacto inesperado, es como empieza una estafa larga.',
  'ev.rule.availabilityProbe.title': 'Comprueba si estás disponible',
  'ev.rule.availabilityProbe.detail':
    '«{quote}». Normal entre compañeros. Aquí solo importa por aquello con lo que viene acompañado.',
  'ev.rule.channelRestriction.title': 'Descarta hablar contigo directamente',
  'ev.rule.channelRestriction.detail':
    '«{quote}». Un compañero de verdad que está ocupado dice «llámame luego». Quitar el teléfono elimina la única comprobación que delataría una suplantación.',
  'ev.combo.strangerOpener.title': 'Contacto accidental y enseguida preguntas personales',
  'ev.combo.strangerOpener.detail':
    'Un número equivocado es inocente. Unas preguntas amables son inocentes. Las dos cosas en el mismo mensaje son la apertura documentada de una estafa de inversión o romántica, y el primer mensaje es la única parte que todavía puedes ver.',
  'ev.combo.pretextHandshake.title': 'Pregunta si estás libre y descarta una llamada',
  'ev.combo.pretextHandshake.detail':
    'Esta pareja es la jugada inicial del fraude del CEO: confirmar que la víctima está localizable y sola, y cerrar el único canal que probaría quién escribe de verdad. Llama a esa persona a un número que ya tuvieras.',
  'ev.combo.romanceMoney.title': 'Cariño junto a una petición de dinero',
  'ev.combo.romanceMoney.detail':
    'El cariño por sí solo no significa nada: así habla la gente con quien quiere. El cariño que llega junto a una crisis, una transferencia o un consejo de inversión es la forma del fraude romántico.',

  'ev.rule.neverAsksCode.title': 'Dice que nunca pedirá tu código',
  'ev.rule.neverAsksCode.detail':
    '«{quote}». Los mensajes de seguridad reales dicen esto. Los fraudulentos piden el código.',
  'ev.rule.legitOptOut.title': 'Tiene una baja real',
  'ev.rule.legitOptOut.detail':
    'Ofrece una forma normal de darse de baja, algo que los mensajes fraudulentos rara vez incluyen.',

  'ev.combo.credentialLink.title': 'Pide credenciales *y* enlaza a un sitio sospechoso',
  'ev.combo.credentialLink.detail':
    'Cada mitad sería una advertencia. Juntas son la definición de un intento de phishing.',
  'ev.combo.pressurePayment.title': 'Presión más un pago irreversible',
  'ev.combo.pressurePayment.detail':
    'La urgencia impide que pienses; el método de pago irreversible impide que recuperes el dinero.',
  'ev.combo.brandCallback.title': 'Dice ser {brand} y quiere que llames',
  'ev.combo.brandCallback.detail':
    'El número del mensaje es el del estafador. Busca tú mismo el número real de {brand}: en tu tarjeta, tu extracto o su sitio oficial.',
  'ev.combo.secretPayment.title': 'Secreto más petición de dinero',
  'ev.combo.secretPayment.detail':
    'Que te pidan enviar dinero sin decírselo a nadie es la firma tanto de la estafa del abuelo como del fraude romántico.',

  'ev.link.scriptUri.title': 'El enlace ejecuta código en lugar de abrir una página',
  'ev.link.scriptUri.detail': '{url} no es una dirección web normal. No la abras nunca.',
  'ev.link.punycode.title': 'Dominio internacional disfrazado',
  'ev.link.punycode.detail':
    '{host} usa punycode («xn--»), que permite que un dominio se muestre como una cosa y lleve a otra.',
  'ev.link.mixedScript.title': 'Letras parecidas en la dirección',
  'ev.link.mixedScript.detail':
    '{host} mezcla alfabetos: letras de otro sistema de escritura idénticas a las latinas. Eso se hace por un solo motivo.',
  'ev.link.ipHost.title': 'El enlace apunta a una dirección IP',
  'ev.link.ipHost.detail':
    '{host} es una dirección numérica, no un nombre de dominio. Las empresas legítimas no envían esto.',
  'ev.link.userinfo.title': 'La dirección oculta su destino real',
  'ev.link.userinfo.detail':
    'Todo lo que va antes de «@» es decoración. Este enlace lleva realmente a {real}, no a {shown}.',
  'ev.link.brandOutsideDomain.title': 'Aparece {brand}, pero el sitio es de otra persona',
  'ev.link.brandOutsideDomain.detail':
    '«{brand}» está en el subdominio o la ruta, pero el propietario real de esta dirección es {registrable}. Solo la parte justo antes de la primera barra indica a quién visitas.',
  'ev.link.brandInDomain.title': 'El nombre de {brand} en un dominio que {brand} no posee',
  'ev.link.brandInDomain.detail':
    '{host} toma prestado el nombre de la marca, pero no es una de las direcciones reales de {brand}.',
  'ev.link.lookalike.title': 'La dirección imita a {brand}',
  'ev.link.lookalike.detail': '{fake} es una copia casi idéntica del verdadero {real}.',
  'ev.link.shortener.title': 'El enlace acortado oculta el destino',
  'ev.link.shortener.detail':
    '{host} oculta dónde acabarás realmente. Los avisos legítimos no necesitan esconderlo.',
  'ev.link.abuseTld.title': 'Terminación de dominio asociada al abuso',
  'ev.link.abuseTld.detail':
    'Las direcciones «.{tld}» son baratas o gratuitas y desechables, por eso las prefieren las campañas de fraude.',
  'ev.link.deepSubdomain.title': 'Subdominio inusualmente profundo',
  'ev.link.deepSubdomain.detail':
    '{host} apila {count} subdominios, normalmente para empujar el dominio real fuera de la pantalla del móvil.',
  'ev.link.credentialPath.title': 'Página de acceso en un sitio no reconocido',
  'ev.link.credentialPath.detail':
    '{host} anuncia una página de inicio de sesión o verificación, pero no es un dominio que reconozcamos.',
  'ev.link.oddPort.title': 'Puerto no estándar',
  'ev.link.oddPort.detail': 'El enlace conecta por el puerto {port} en lugar del habitual 80 o 443.',
  'ev.link.noTls.title': 'Conexión sin cifrar',
  'ev.link.noTls.detail': '{host} usa http simple, así que lo que escribas viaja sin cifrar.',
  'ev.link.brandMismatch.title': 'El mensaje dice {claimed}, el enlace va a {actual}',
  'ev.link.brandMismatch.detail': 'La marca del texto y el destino no coinciden.',
  'ev.link.unrelatedDomain.title': 'Dice ser {claimed} pero enlaza a {actual}',
  'ev.link.unrelatedDomain.detail': '{actual} no es una dirección de {claimed}.',
  'ev.link.knownGood.title': 'El enlace va al dominio real de {brand}',
  'ev.link.knownGood.detail':
    '{host} es una dirección auténtica de {brand}. Útil, pero no es prueba por sí sola: revisa el resto del mensaje.',

  'ev.hdr.spfFail.title': 'El remitente no superó la autenticación SPF',
  'ev.hdr.spfFail.detail':
    'El servidor de correo comprobó si el mensaje salió de una máquina autorizada por el dominio que dice usar, y el resultado fue «{result}». El correo auténtico de una empresa real sí lo supera.',
  'ev.hdr.dkimFail.title': 'Firma DKIM rota o ausente',
  'ev.hdr.dkimFail.detail':
    'DKIM es la firma criptográfica del dominio emisor sobre el mensaje. Aquí devolvió «{result}», lo que significa que fue falsificada o alterada en tránsito.',
  'ev.hdr.dmarcFail.title': 'Falló DMARC: el dominio niega este mensaje',
  'ev.hdr.dmarcFail.detail':
    'DMARC es la política del propio dueño del dominio para el correo que dice venir de él. Este mensaje no la cumple, así que el dominio que menciona está declarando que no lo envió.',
  'ev.hdr.authPass.title': 'La autenticación del remitente fue correcta',
  'ev.hdr.authPass.detail':
    'SPF, DKIM y DMARC pasaron para {domain}, así que el mensaje salió realmente de ese dominio. Es relevante, pero un dominio real también puede enviarte algo malo: lee el resto.',
  'ev.hdr.noAuth.title': 'No hay resultados de autenticación que comprobar',
  'ev.hdr.noAuth.detail':
    'Estas cabeceras no incluyen veredicto SPF/DKIM/DMARC, así que no se pudo verificar al remitente en ningún sentido. A menudo solo significa que se pegaron las cabeceras a medias.',
  'ev.hdr.displayNameEmail.title': 'El nombre del remitente es una dirección falsa',
  'ev.hdr.displayNameEmail.detail':
    'Tu aplicación de correo mostrará «{display}», pero el mensaje vino realmente de {real}. Poner una dirección en el campo del nombre se hace solo para ocultar la verdadera.',
  'ev.hdr.displayNameSpoof.title': 'Dice ser {brand}, enviado desde {domain}',
  'ev.hdr.displayNameSpoof.detail':
    'El nombre del remitente dice {brand}, pero la dirección es {address}. {domain} no es un dominio de {brand}, y el campo del nombre puede contener cualquier cosa.',
  'ev.hdr.freemailBrand.title': '{brand} no te escribiría desde un correo gratuito',
  'ev.hdr.freemailBrand.detail':
    'El nombre del remitente dice {brand}, pero {address} es una cuenta de correo personal que cualquiera abre en dos minutos.',
  'ev.hdr.lookalikeFrom.title': 'El dominio del remitente imita a {brand}',
  'ev.hdr.lookalikeFrom.detail':
    '{fake} es una copia casi idéntica del auténtico {real}. La dirección se registró para que se lea mal de un vistazo.',
  'ev.hdr.abuseTldFrom.title': 'El dominio del remitente usa una terminación desechable',
  'ev.hdr.abuseTldFrom.detail':
    'La dirección está en un dominio «.{tld}»: barato, desechable y muy usado por las campañas de fraude.',
  'ev.hdr.replyToMismatch.title': 'Tu respuesta iría a otro sitio',
  'ev.hdr.replyToMismatch.detail':
    'El mensaje parece venir de {from}, pero al pulsar Responder se envía a {address} en {replyTo}. Así es como la conversación pasa discretamente al atacante.',
  'ev.hdr.returnPathMismatch.title': 'La dirección de rebote no coincide con el remitente',
  'ev.hdr.returnPathMismatch.detail':
    'El mensaje dice venir de {from} pero los rebotes van a {returnPath}. Los envíos masivos legítimos también hacen esto, así que por sí solo vale poco.',

  'ev.struct.invisible.title': 'Caracteres invisibles ocultos',
  'ev.struct.invisible.detail':
    'Contiene {count} carácter(es) de ancho cero que no puedes ver. Se insertan para burlar los filtros de spam.',
  'ev.struct.mixedScript.title': 'Letras parecidas en el texto',
  'ev.struct.mixedScript.detail':
    '«{quote}» mezcla alfabetos. Se sustituyen letras de otros sistemas de escritura para burlar filtros sin que tú lo notes.',
  'ev.struct.shouting.title': 'Casi todo en mayúsculas',
  'ev.struct.shouting.detail': 'El {percent}% de las letras son mayúsculas: gritar para alarmar.',
  'ev.struct.punctuation.title': 'Puntuación excesiva',
  'ev.struct.punctuation.detail':
    'Series de signos de exclamación o interrogación, usadas para fabricar urgencia.',

  'intro.step1.title': 'Pega cualquier cosa sospechosa',
  'intro.step1.body':
    'Un SMS, un mensaje directo o un correo entero con sus cabeceras. O suelta una captura y el texto se lee en tu dispositivo.',
  'intro.step2.title': 'Descubre exactamente por qué',
  'intro.step2.body':
    'Cada punto de la puntuación procede de una señal con nombre, y las palabras que la activaron se marcan dentro del mensaje.',
  'intro.step3.title': 'Sabe qué hacer después',
  'intro.step3.body':
    'Pasos adaptados al tipo de estafa, más un aviso en lenguaje sencillo que puedes reenviar a quien lo recibió.',
  'intro.privacy':
    'Sin cuenta, sin rastreo, sin subidas. El detector son unos cientos de kilobytes de matemáticas ejecutándose en esta pestaña, y funciona sin conexión.',

  'ocr.title': 'O suelta una captura de pantalla',
  'ocr.hint':
    'Arrastra una imagen aquí, pégala o elige un archivo. El texto se lee en tu dispositivo: la imagen nunca se sube.',
  'ocr.choose': 'Elegir una imagen',
  'ocr.loading': 'Iniciando el lector de texto…',
  'ocr.recognising': 'Leyendo el texto…',
  'ocr.empty': 'No se encontró texto legible en esa imagen. Prueba con una captura más nítida o escribe el mensaje.',
  'ocr.failed': 'No se pudo iniciar el lector de texto. Puedes pegar el mensaje como texto.',
  'ocr.done': 'Texto leído de la imagen: revísalo abajo y corrige lo que haya salido mal.',
  'ocr.drop': 'Suelta la imagen para leerla',

  'settings.sensitivity': 'Sensibilidad',
  'settings.sensitivity.cautious': 'Precavido',
  'settings.sensitivity.balanced': 'Equilibrado',
  'settings.sensitivity.strict': 'Estricto',
  'settings.sensitivity.hint':
    'Precavido avisa antes y da más falsas alarmas. Estricto solo avisa cuando está seguro. Equilibrado es el valor probado por defecto.',
  'analyze.speak': 'Leer en voz alta',
  'analyze.stop': 'Detener',
  'analyze.print': 'Imprimir',
  'analyze.share': 'Compartir este aviso',
  'analyze.share.intro':
    'Texto en lenguaje sencillo que puedes reenviar a quien recibió el mensaje.',
  'analyze.share.copy': 'Copiar aviso',
  'analyze.share.copied': 'Copiado',
  'share.header.dangerous': 'Este mensaje es casi con seguridad una estafa. No hagas clic, no respondas, no llames, no pagues.',
  'share.header.likely-scam': 'Este mensaje parece una estafa. No hagas clic, no respondas, no llames, no pagues.',
  'share.header.caution': 'Ten cuidado con este mensaje: tiene señales de alarma.',
  'share.header.safe': 'No se encontraron señales de estafa en este mensaje.',
  'share.why': 'Por qué:',
  'share.do': 'Qué hacer:',
  'share.footer': 'Comprobado con Skeptic, un detector de estafas sin conexión. No se subió nada.',
  'history.title': 'Comprobaciones recientes',
  'history.empty': 'Los mensajes que compruebes aparecerán aquí.',
  'history.clear': 'Borrar historial',
  'history.note':
    'Se guarda solo en este navegador, únicamente la primera línea, nunca se sube. Bórralo cuando quieras.',
  'history.restore': 'Abrir de nuevo',

  'practice.heading': 'Practica detectar estafas',
  'practice.intro':
    'La herramienta no siempre estará ahí. Este ejercicio entrena el instinto: mensajes reales de estafa y legítimos, mezclados. La dificultad se adapta a ti.',
  'practice.start': 'Empezar',
  'practice.scam': 'Estafa',
  'practice.legit': 'Legítimo',
  'practice.next': 'Siguiente mensaje',
  'practice.correct': 'Correcto',
  'practice.wrong': 'Casi',
  'practice.wasScam': 'Este era una estafa.',
  'practice.wasLegit': 'Este era auténtico.',
  'practice.score': 'Puntos',
  'practice.streak': 'Racha',
  'practice.level': 'Nivel',
  'practice.seen': 'Vistos',
  'practice.reset': 'Reiniciar progreso',
  'practice.weakest': 'Dónde fallas más',
  'practice.noWeak': 'Responde algunos más para ver dónde fallas.',
  'practice.done': 'Has visto todos los mensajes. Reinicia para volver a empezar.',
  'practice.explain': 'Por qué',
  'practice.q': '¿Es una estafa o un mensaje auténtico?',
  'practice.keys': 'Teclado: S para estafa, L para legítimo, N para siguiente.',
  'practice.accuracy': 'Aciertos',

  'model.heading': 'Cómo decide Skeptic',
  'model.intro':
    'Cuatro detectores independientes votan cada mensaje. Cada uno falla en situaciones distintas, y por eso hay cuatro.',
  'model.layer1.title': '1. Un modelo de lenguaje entrenado',
  'model.layer1.body':
    'Naive Bayes y regresión logística se ajustan sobre características TF-IDF y luego se combinan mediante stacking, de modo que un tercer modelo aprende cuánto fiarse de cada uno. El stacking también calibra la salida: un mensaje con 0,8 es realmente una estafa alrededor del 80% de las veces.',
  'model.layer2.title': '2. Un motor de reglas para las tácticas',
  'model.layer2.body':
    'Patrones escritos a mano para lo que un estafador no puede omitir: urgencia fabricada, secreto, pago irrastreable, robo de credenciales. Siguen funcionando con marcas y pretextos que no existían cuando se entrenó el modelo.',
  'model.layer3.title': '3. Un analizador de enlaces',
  'model.layer3.body':
    'Cada dirección se descompone: letras parecidas, punycode, marcas en la posición equivocada, distancia de edición a dominios reales, terminaciones desechables, acortadores, IPs y el truco de «@».',
  'model.layer4.title': '4. Un analizador de cabeceras de correo',
  'model.layer4.body':
    'Cuando la entrada es un correo en bruto, también se leen las cabeceras: veredictos SPF, DKIM y DMARC, un Reply-To que apunta a otro sitio, un nombre que dice ser un banco sobre un correo gratuito. El cuerpo está escrito para convencerte; las cabeceras son hechos verificables que el remitente no puede reescribir.',
  'model.surfaces': 'Dónde se ejecuta',
  'model.surfaces.body':
    'El detector es un módulo de TypeScript sin dependencias del navegador, así que el mismo código se ejecuta en esta página, en las pruebas y en un terminal (`npm run check -- "mensaje"`, que devuelve un código distinto de cero ante una estafa y sirve como filtro en una tubería). Las capturas las lee un motor OCR en WebAssembly servido desde este mismo origen, así que soltar una imagen tampoco envía nada a ninguna parte.',
  'model.metrics': 'Rendimiento medido',
  'model.metrics.intro':
    'Tres filas, y lo importante son las diferencias entre ellas. La partición interna sale del mismo generador que los datos de entrenamiento, así que casi no significa nada. El conjunto de validación son {n} mensajes escritos a mano, con otro estilo, que nunca se usaron para ajustar nada: la segunda fila es lo que logra el modelo por sí solo y la tercera lo que logran las cuatro capas juntas.',
  'model.metrics.internal': 'Partición interna',
  'model.metrics.holdout': 'Validación — solo el modelo',
  'model.metrics.pipeline': 'Validación — las cuatro capas',
  'model.accuracy': 'Exactitud',
  'model.precision': 'Precisión',
  'model.recall': 'Exhaustividad',
  'model.f1': 'F1',
  'model.auc': 'AUC ROC',
  'model.external': 'Probado con mensajes reales',
  'model.external.intro':
    'Todo lo anterior se mide sobre mensajes que escribimos nosotros. Es una limitación real, y enunciar una limitación no es lo mismo que acotarla, así que aquí queda acotada: {n} SMS que personas reales recibieron de verdad, del SMS Spam Collection (Almeida, Gómez Hidalgo y Yamakami, 2011), evaluados por el detector tal cual se publica, sin reentrenar ni excluir nada.',
  'model.external.flagged': 'Marcados (puntuación ≥ 50)',
  'model.external.warned': 'Avisados (puntuación ≥ 25)',
  'model.external.falseAlarms': 'Falsas alarmas',
  'model.external.caveat':
    'Lee con cuidado la exhaustividad: «spam» en ese corpus significa SMS *comercial* no solicitado (tonos, concursos, publicidad de tarificación especial). Skeptic busca fraude, así que buena parte de lo que no marca es publicidad legal que probablemente debería ignorar. El corpus además es del Reino Unido y Singapur hacia 2011, una época de números cortos de pago y no de dominios imitadores, lo que deja al analizador de enlaces casi sin nada que leer.',
  'model.external.found': 'Lo que encontró',
  'model.external.found.body':
    'La primera ejecución fue mala de una forma que importa: la herramienta se disparaba con uno de cada tres mensajes legítimos, porque leía expresiones de cariño corrientes como fraude romántico. «Good night my dear» sacaba 72 sobre 100. La causa estaba en los datos de entrenamiento: el corpus sintético tenía citas y logística y ni un solo mensaje cariñoso entre personas que se quieren, así que el modelo nunca había visto cómo habla la gente de verdad. Añadir ese registro, y sacar las expresiones de cariño de la regla romántica, bajó las falsas alarmas del 32,8% al 5,5%.',
  'model.external.cost':
    'Tuvo un coste. Enseñar al modelo que el cariño es normal perdió unos tres puntos de detección directa en nuestra propia validación. Para esta herramienta es el lado correcto del trato: una estafa que se escapa pero sigue marcada como «Ten cuidado» deja a la persona avisada, mientras que una falsa alarma le enseña a ignorar todos los avisos siguientes.',
  'model.external.residual':
    'El {rate} restante es el coste honesto de entrenar con datos sintéticos. Esos fallos vienen solo de la capa del modelo, sobre registros del inglés cotidiano a los que el corpus generado no llega. Perseguirlos añadiendo más plantillas sería ajustar a este corpus, y entonces dejaría de ser una prueba externa.',
  'model.external.examples': 'Mensajes legítimos que todavía falla',

  'model.ablation': 'Cuánto aporta cada capa',
  'model.ablation.intro':
    '«Cuatro detectores son mejores que uno» es una afirmación, y las afirmaciones sobre arquitectura son las más fáciles de colar sin medir. Aquí está la medición: cada capa por separado y luego añadidas una a una, sobre los mismos mensajes de validación. Fíjate en la última fila: la capa de cabeceras elimina la última falsa alarma.',
  'model.ablation.config': 'Capas',
  'model.ablation.note':
    'Así también mejoró el conjunto de validación. La primera ejecución dio 0,000 de exhaustividad para la capa de cabeceras, no porque estuviera rota, sino porque la validación era casi toda SMS y no le daba nada que leer. Se añadieron catorce correos en bruto y la capa pasó a ser medible. Una medición que no ve un componente es un fallo de la medición.',
  'abl.model': 'Solo el modelo',
  'abl.rules': 'Solo las reglas',
  'abl.links': 'Solo los enlaces',
  'abl.headers': 'Solo las cabeceras',
  'abl.model+rules': 'Modelo + reglas',
  'abl.model+rules+links': 'Modelo + reglas + enlaces',
  'abl.all': 'Las cuatro capas',
  'model.interval': 'Los rangos son intervalos de Wilson al 95%: con {n} mensajes, una estimación puntual sola exageraría lo que se sabe.',

  'model.confusion': 'Matriz de confusión',
  'model.confusion.intro': 'Sistema completo, sobre los {n} mensajes de validación.',
  'model.predicted': 'Predicho',
  'model.actual': 'Real',
  'model.legit': 'Legítimo',
  'model.scam': 'Estafa',
  'model.calibration': 'Calibración',
  'model.calibration.intro':
    'Los puntos sobre la diagonal indican que la probabilidad declarada coincide con la realidad. Una herramienta que dice «80% seguro» debería acertar el 80% de las veces. El tamaño del punto es el número de mensajes de ese tramo: los tramos centrales tienen muy pocos porque el conjunto de validación se separa con claridad.',
  'model.calibration.predicted': 'Probabilidad predicha',
  'model.calibration.observed': 'Frecuencia observada',
  'model.sweep': 'Compromiso precisión / exhaustividad',
  'model.sweep.intro':
    'El umbral decide qué error cometes. Aquí una falsa alarma es cara —enseña a la gente a ignorar los avisos—, así que el punto de operación favorece la precisión.',
  'model.features': 'Características más determinantes',
  'model.features.intro':
    'Los tokens con mayor peso aprendido. «zurlz» significa «aquí apareció un enlace»: las entidades se agrupan para que el modelo aprenda formas y no memorice dominios.',
  'model.features.scam': 'Empuja hacia estafa',
  'model.features.legit': 'Empuja hacia legítimo',
  'model.data': 'Datos de entrenamiento',
  'model.data.intro':
    'Los corpus reales de estafas contienen datos de víctimas y no pueden redistribuirse, así que el conjunto de entrenamiento se genera a partir de las formas documentadas en avisos de protección al consumidor. La clase negativa es deliberadamente difícil: códigos 2FA auténticos, alertas de fraude auténticas, incidencias de entrega auténticas, un jefe real con prisa. Sin eso, un clasificador solo aprende «menciona un banco ⇒ estafa».',
  'model.data.messages': 'mensajes de entrenamiento',
  'model.data.scam': 'estafa',
  'model.data.ham': 'legítimos',
  'model.data.vocab': 'características',
  'model.limits': 'Limitaciones honestas',
  'model.limits.body':
    'Los datos de entrenamiento son sintéticos, así que las cifras absolutas son optimistas frente a una bandeja de entrada real; la validación externa de arriba mide cuánto cuesta eso, y un 5,5% de falsas alarmas sobre mensajes reales sigue siendo demasiado para un uso sin supervisión. El léxico de reglas se amplió tras revisar los errores de validación, lo que convierte la cifra de las cuatro capas en una cota superior; la columna de solo modelo es la estimación limpia. La cobertura es mejor para estafas de consumo en inglés y español, y peor para ataques dirigidos y bien escritos. Skeptic es una segunda opinión, no una autoridad: se le escaparán cosas, y una puntuación baja nunca es permiso para enviar dinero.',

  'learn.heading': 'Guía de estafas',
  'learn.intro':
    'Cada familia de estafa, qué aspecto tiene y qué hacer. Sin cuenta, sin rastreo, funciona sin conexión.',
  'learn.flags': 'Qué aspecto tiene',
  'learn.actions': 'Qué hacer',
  'learn.rules.title': 'Tres reglas que detienen casi todo',
  'learn.rules.1':
    'Ve despacio. Toda estafa necesita que actúes antes de comprobar. Nada auténtico se estropea por esperar diez minutos.',
  'learn.rules.2':
    'Cuelga y llama a un número que hayas buscado tú: en tu tarjeta, tu extracto o el sitio oficial. Nunca el número del mensaje.',
  'learn.rules.3':
    'Nadie legítimo necesita tu contraseña, tu PIN ni un código que te enviaron por SMS. Nadie. Nunca.',
  'learn.report.title': 'Dónde denunciar una estafa',
  'learn.report.us':
    'Estados Unidos — FTC: reportfraud.ftc.gov · FBI IC3: ic3.gov · Reenvía los SMS fraudulentos al 7726',
  'learn.report.uk': 'Reino Unido — Action Fraud: actionfraud.police.uk · Reenvía los SMS al 7726',
  'learn.report.eu':
    'España / otros países — denuncia ante tu autoridad de consumo o policía nacional y avisa a tu banco',
  'learn.report.bank':
    'Si ya enviaste dinero o compartiste un código, llama a tu banco de inmediato. La rapidez importa más que la vergüenza.',

  'common.close': 'Cerrar',
  'common.of': 'de',
  'footer.privacy':
    'Sin cuentas, sin rastreo, y nada de lo que pegues se sube nunca. La página solo pide sus propios archivos y funciona sin conexión.',
  'footer.source': 'Código fuente',
};

const families: Locale['families'] = {
  phishing: {
    name: 'Phishing',
    summary: 'Un mensaje que finge ser un servicio que usas, para capturar tu contraseña.',
    flags: [
      'Un problema de cuenta que desconocías, con fecha límite',
      'Un enlace cuyo dominio no es exactamente el real',
      'Te pide «verificar», «confirmar» o «revalidar» tus datos',
    ],
  },
  'impersonation-bank': {
    name: 'Suplantación bancaria',
    summary: 'Alguien que dice ser el equipo antifraude de tu banco y te empuja a mover dinero.',
    flags: [
      'Una transacción que no reconoces y exige decisión inmediata',
      'Te pide mover dinero a una «cuenta segura»',
      'Te dice que no cuelgues o que no hables con la oficina',
    ],
  },
  'impersonation-gov': {
    name: 'Suplantación de organismos',
    summary: 'Hacienda, la seguridad social o la policía amenazándote por una supuesta deuda.',
    flags: [
      'Amenaza de detención, deportación o pérdida de prestaciones',
      'Exige el pago hoy, a menudo por tarjeta, transferencia o tarjeta regalo',
      'Te contacta primero por teléfono o SMS en vez de por correo',
    ],
  },
  delivery: {
    name: 'Estafa de paquetería',
    summary: 'Un aviso falso de entrega fallida que cobra una tarifa y roba tu tarjeta.',
    flags: [
      'Un paquete que no esperabas está «retenido»',
      'Una tarifa pequeña para liberarlo',
      'Un enlace de seguimiento en un dominio que no es el del transportista',
    ],
  },
  'tech-support': {
    name: 'Soporte técnico falso',
    summary: 'Un aviso falso de virus que acaba con un desconocido controlando tu ordenador.',
    flags: [
      'Una ventana o mensaje que dice que tu equipo está infectado',
      'Un número al que llamar «inmediatamente»',
      'Te pide instalar software de acceso remoto',
    ],
  },
  romance: {
    name: 'Estafa romántica',
    summary: 'Semanas de afecto y después una crisis o una oportunidad de inversión.',
    flags: [
      'Avanza muy rápido y siempre tiene una excusa para no verse',
      'Acaba mencionando trading, cripto o una emergencia repentina',
      'Quiere pasar la conversación a WhatsApp o Telegram',
    ],
  },
  investment: {
    name: 'Fraude de inversión o cripto',
    summary: 'Ganancias garantizadas, una plataforma que muestra beneficios y retiradas que nunca llegan.',
    flags: [
      'Rentabilidad garantizada o fija, «sin riesgo»',
      'Una comisión o impuesto exigido antes de poder retirar',
      'Te pide la frase de recuperación de tu billetera para «validarla»',
    ],
  },
  'job-task': {
    name: 'Estafa de empleo',
    summary: 'Dinero fácil por tareas simples que acaba en blanqueo o en un pago por adelantado.',
    flags: [
      'Sueldo diario alto por trabajo remoto sin experiencia ni entrevista',
      'El reclutamiento ocurre en Telegram o WhatsApp',
      'Debes comprar equipo, ingresar un cheque o reenviar paquetes',
    ],
  },
  prize: {
    name: 'Premios y herencias',
    summary: 'Has ganado o heredado algo y solo falta pagar una tarifa para liberarlo.',
    flags: [
      'Nunca participaste en el sorteo',
      'Primero hay una tarifa de gestión, aduana o envío',
      'Te piden confidencialidad',
    ],
  },
  'family-emergency': {
    name: 'Emergencia familiar',
    summary: 'Un familiar en apuros, escribiendo desde un número nuevo, que necesita dinero ya.',
    flags: [
      '«Este es mi nuevo número» o «perdí el teléfono»',
      'Un accidente, detención u hospital que exige dinero inmediato',
      'Te pide que no se lo cuentes al resto de la familia',
    ],
  },
  'invoice-bec': {
    name: 'Fraude de factura y del CEO',
    summary: 'Un proveedor o jefe cuyos datos bancarios han cambiado de repente.',
    flags: [
      'Datos de pago cambiados en una factura por lo demás normal',
      'Un superior que solo se comunica por mensaje',
      'Urgencia y petición de que quede entre vosotros',
    ],
  },
  refund: {
    name: 'Cargo o reembolso falso',
    summary: 'Una suscripción que nunca contrataste y un número al que llamar para cancelarla.',
    flags: [
      'Un cargo que no reconoces por un servicio que no usas',
      'Un teléfono en lugar de una página de tu cuenta',
      'El «reembolso» requiere datos bancarios o acceso remoto',
    ],
  },
  extortion: {
    name: 'Chantaje y sextorsión',
    summary: 'Dicen tener un vídeo comprometedor; se envía masivamente a millones de direcciones.',
    flags: [
      'Afirma haber hackeado tu cámara o tu dispositivo',
      'Cita una contraseña antigua salida de una filtración pública',
      'Exige pago en criptomonedas con fecha límite',
    ],
  },
  charity: {
    name: 'Fraude solidario',
    summary: 'Una petición urgente tras una catástrofe, con métodos de pago que ninguna ONG usa.',
    flags: [
      'Aparece justo después de una catástrofe en las noticias',
      'Solo acepta tarjetas regalo, cripto o transferencias',
      'Presión para donar ya, sin número de registro verificable',
    ],
  },
  unknown: {
    name: 'Poco claro',
    summary: 'Las señales no encajan con una familia concreta de estafa.',
    flags: [
      'Desconfía de cualquier petición inesperada de dinero o datos',
      'Verifica por un canal que elijas tú',
      'Consulta con alguien de confianza antes de actuar',
    ],
  },
};

const advice: Locale['advice'] = {
  phishing: [
    'No hagas clic en el enlace. Abre la aplicación o escribe la dirección tú mismo.',
    'Si ya escribiste tu contraseña, cámbiala ahora y también donde la hayas reutilizado.',
    'Activa la verificación en dos pasos en esa cuenta.',
    'Denuncia el mensaje y bórralo.',
  ],
  'impersonation-bank': [
    'Cuelga o deja de responder. No uses ningún número ni enlace del mensaje.',
    'Llama a tu banco al número impreso en tu tarjeta o extracto.',
    'Ningún banco real te pedirá mover dinero a otra cuenta.',
    'Si ya moviste dinero, llama a tu banco de inmediato: el mismo día importa.',
  ],
  'impersonation-gov': [
    'No pagues ni llames al número del mensaje.',
    'Los organismos escriben primero. Busca tú el número oficial y pregunta.',
    'Ningún organismo cobra en tarjetas regalo, cripto o transferencias urgentes.',
    'Denúncialo ante tu servicio nacional de fraude.',
  ],
  delivery: [
    'No pagues la tarifa. Los transportistas cobran aranceles por su propia app o un aviso en tu puerta.',
    'Comprueba el número de seguimiento en la web real del transportista, escrita por ti.',
    'Si introdujiste los datos de tu tarjeta, llama a tu banco y cancélala.',
  ],
  'tech-support': [
    'No llames al número. Cierra la página o reinicia el dispositivo.',
    'Nunca instales software de acceso remoto para quien te contactó a ti.',
    'Si diste acceso, desconecta de internet y haz revisar el equipo.',
    'Si pagaste, pide a tu banco una devolución del cargo.',
  ],
  romance: [
    'No envíes dinero, y no recibas ni reenvíes dinero por ellos.',
    'Haz una búsqueda inversa de sus fotos.',
    'Cuéntaselo a alguien de confianza: el aislamiento es como funciona esta estafa.',
    'Nunca inviertas en una plataforma que te recomiende alguien conocido por internet.',
  ],
  investment: [
    'Deja de ingresar dinero. Que la plataforma muestre beneficios no prueba nada.',
    'Nunca compartas la frase de recuperación. Quien la pida te está robando.',
    'Una retirada que exige un pago previo no es una retirada.',
    'Denúncialo: los «servicios de recuperación» que te escriban después son los mismos delincuentes.',
  ],
  'job-task': [
    'Nunca pagues para empezar un trabajo ni compres equipo por adelantado.',
    'No ingreses cheques y reenvíes dinero: eso es blanqueo y eres responsable.',
    'No recibas ni reenvíes paquetes para un empleador.',
    'Verifica la empresa en su web oficial, no en un enlace que te enviaron.',
  ],
  prize: [
    'No puedes ganar un sorteo en el que no participaste.',
    'Ningún premio legítimo exige un pago para entregarlo.',
    'No envíes documentos ni tu identificación.',
  ],
  'family-emergency': [
    'Para. Llama a tu familiar al número que ya tienes.',
    'Pregunta algo que solo esa persona sabría.',
    'Avisa a otro familiar antes de enviar nada: la petición de secreto es la señal.',
  ],
  'invoice-bec': [
    'No pagues. Verifica el cambio llamando a un número que ya tenías.',
    'Confirma en persona o por voz, nunca respondiendo al mensaje.',
    'Avisa a tu departamento financiero: suele formar parte de un intento mayor.',
  ],
  refund: [
    'No llames al número. Comprueba el cargo en tu banco o tu extracto real.',
    'Un reembolso auténtico nunca necesita acceso remoto a tu ordenador.',
    'Si no hubo cargo, no hay nada que cancelar.',
  ],
  extortion: [
    'No pagues. Se envían masivamente; casi nunca existe ningún vídeo.',
    'Si citan una contraseña real tuya, cámbiala en todas partes.',
    'Guarda el mensaje como prueba y denúncialo.',
  ],
  charity: [
    'Dona directamente en la web de la organización, escrita por ti.',
    'Consulta el registro de entidades de tu país.',
    'Ninguna ONG real cobra en tarjetas regalo o cripto.',
  ],
  unknown: [
    'No hagas clic, no respondas y no pagues todavía.',
    'Verifica por un canal que elijas tú: una app oficial o un número que busques.',
    'Pide a alguien de confianza que lo mire contigo.',
  ],
};

export const es: Locale = { code: 'es', name: 'Español', strings, families, advice };
