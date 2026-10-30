// Plantillas Excel de los catálogos (Servicios y Criterios) para diligenciar
// a mano y volver a cargar con "Importar" (pedido 2026-10-29, punto 3).
//
// A diferencia de la exportación (exportarCatalogo.ts, pensada para leer:
// logo, filtros, cabeceras de grupo coloreadas), la plantilla es una tabla
// plana — una sola fila de encabezados y un registro por fila — para que
// sea fácil de diligenciar, copiar/pegar y leer de vuelta sin ambigüedad:
//   - Hoja "Datos": los registros. La columna ID identifica registros
//     existentes (se actualizan); una fila sin ID es un registro nuevo.
//   - Hoja "Listas": valores válidos de Grupo/Servicio/Estándar/… que
//     alimentan las listas desplegables de "Datos".
//   - Hoja "Instrucciones".
// Mismas precauciones que exportarCatalogo.ts: sin `fitToPage` ni `views`.

import { supabase } from './supabase'
import type { ResolucionConfig } from '../domain/resoluciones'
import { descargar } from './exportarCatalogo'

const AZUL = '0D2D6B'
// Filas (además de las ya diligenciadas) que llevan las listas desplegables,
// para que quien agregue registros nuevos al final también las tenga.
const FILAS_NUEVAS_CON_LISTA = 1000

type Columna = {
  titulo: string
  ancho: number
  obligatoria?: boolean
  // Nombre de la lista (columna de la hoja "Listas") que valida la columna.
  lista?: string
  // Formato Texto: evita que Excel convierta numerales como "11.10" en 11.1.
  texto?: boolean
}

type Valor = string | number | null | undefined

async function crearPlantilla(params: {
  titulo: string
  columnas: Columna[]
  filas: Valor[][]
  listas: Record<string, string[]>
  instrucciones: string[]
  nombreArchivo: string
}) {
  const ExcelJS = (await import('exceljs')).default
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet('Datos', { pageSetup: { orientation: 'landscape' } })
  const wsListas = wb.addWorksheet('Listas')
  const wsInstr = wb.addWorksheet('Instrucciones')

  ws.columns = params.columnas.map((c) => ({ width: c.ancho }))
  params.columnas.forEach((c, i) => {
    if (c.texto) ws.getColumn(i + 1).numFmt = '@'
  })
  const encabezado = ws.getRow(1)
  params.columnas.forEach((c, i) => {
    const cell = encabezado.getCell(i + 1)
    cell.value = c.obligatoria ? `${c.titulo} *` : c.titulo
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${AZUL}` } }
    cell.alignment = { vertical: 'middle', wrapText: true }
  })
  encabezado.height = 30
  ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: params.columnas.length } }

  params.filas.forEach((fila, r) => {
    const row = ws.getRow(r + 2)
    fila.forEach((v, c) => {
      const cell = row.getCell(c + 1)
      cell.value = v === undefined || v === '' ? null : v
      cell.alignment = { vertical: 'top', wrapText: true }
    })
  })
  // ID en gris: es de referencia y no debe editarse.
  for (let r = 2; r <= params.filas.length + 1; r++) {
    ws.getRow(r).getCell(1).font = { color: { argb: 'FF94A3B8' } }
  }

  // Listas: una columna por lista, con su nombre en la fila 1.
  const nombresListas = Object.keys(params.listas)
  nombresListas.forEach((nombre, i) => {
    const col = wsListas.getColumn(i + 1)
    col.width = Math.min(60, Math.max(18, ...params.listas[nombre].map((v) => v.length)))
    const cab = wsListas.getRow(1).getCell(i + 1)
    cab.value = nombre
    cab.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    cab.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${AZUL}` } }
    params.listas[nombre].forEach((v, r) => {
      wsListas.getRow(r + 2).getCell(i + 1).value = v
    })
  })

  const ultimaFila = params.filas.length + 1 + FILAS_NUEVAS_CON_LISTA
  params.columnas.forEach((c, i) => {
    if (!c.lista) return
    const indiceLista = nombresListas.indexOf(c.lista)
    const valores = params.listas[c.lista] ?? []
    if (indiceLista < 0 || valores.length === 0) return
    const letraLista = letraColumna(indiceLista + 1)
    const letra = letraColumna(i + 1)
    // `dataValidations.add` acepta rangos ("F2:F5000") pero no está en los
    // tipos publicados de ExcelJS.
    const validaciones = (ws as unknown as { dataValidations: { add: (rango: string, v: object) => void } })
      .dataValidations
    validaciones.add(`${letra}2:${letra}${ultimaFila}`, {
      type: 'list',
      allowBlank: true,
      formulae: [`Listas!$${letraLista}$2:$${letraLista}$${valores.length + 1}`],
      // Advertencia (no bloqueo): permite pegar valores y los valida la
      // importación, que sí rechaza los que no existan.
      showErrorMessage: true,
      errorStyle: 'warning',
      errorTitle: 'Valor no está en la lista',
      error: `Use un valor de la hoja "Listas" (columna ${c.lista}).`,
    })
  })

  wsInstr.getColumn(1).width = 110
  const t = wsInstr.getCell('A1')
  t.value = params.titulo
  t.font = { size: 14, bold: true, color: { argb: `FF${AZUL}` } }
  params.instrucciones.forEach((linea, i) => {
    const cell = wsInstr.getCell(`A${i + 3}`)
    cell.value = linea
    cell.alignment = { wrapText: true, vertical: 'top' }
  })

  const buf = await wb.xlsx.writeBuffer()
  descargar(buf, params.nombreArchivo)
}

function letraColumna(n: number) {
  let s = ''
  while (n > 0) {
    const m = (n - 1) % 26
    s = String.fromCharCode(65 + m) + s
    n = Math.floor((n - 1) / 26)
  }
  return s
}

function sufijoArchivo(cfg: ResolucionConfig) {
  return `${cfg.labelCorto.replace(/[.\s]/g, '')}_${new Date().toISOString().slice(0, 10)}`
}

const INSTRUCCIONES_COMUNES = [
  '1. Diligencie la hoja "Datos": un registro por fila. Las columnas marcadas con * son obligatorias.',
  '2. ID: NO lo modifique. Si la fila tiene ID se ACTUALIZA ese registro; si la deja vacía se CREA un registro nuevo.',
  '3. Para agregar registros, escríbalos al final de la tabla dejando el ID vacío.',
  '4. Las columnas con lista desplegable deben tomar un valor de la hoja "Listas" (no cambie el nombre de las hojas).',
  '5. Borrar una fila de la plantilla NO elimina el registro en la aplicación: la importación solo crea y actualiza.',
  '6. Guarde el archivo como .xlsx y cárguelo con el botón "Importar" del mismo catálogo y resolución.',
]

// ============================================================
// Servicios
// ============================================================

export type ServicioPlantilla = {
  id: number
  numeral: string
  grupo: string
  nombre: string
  descripcion: string | null
  estructura: string | null
  activo: boolean
}

const COLUMNAS_SERVICIOS: Columna[] = [
  { titulo: 'ID', ancho: 8 },
  { titulo: 'Numeral', ancho: 12, obligatoria: true, texto: true },
  { titulo: 'Grupo', ancho: 40, obligatoria: true, lista: 'Grupos' },
  { titulo: 'Servicio', ancho: 40, obligatoria: true },
  { titulo: 'Descripción', ancho: 60 },
  { titulo: 'Estructura', ancho: 50 },
  { titulo: 'Activo', ancho: 10, lista: 'SiNo' },
]

export async function descargarPlantillaServicios(params: {
  cfg: ResolucionConfig
  grupos: string[]
  servicios: ServicioPlantilla[]
}) {
  await crearPlantilla({
    titulo: `Plantilla de Servicios — ${params.cfg.label}`,
    columnas: COLUMNAS_SERVICIOS,
    filas: params.servicios.map((s) => [
      s.id,
      s.numeral,
      s.grupo,
      s.nombre,
      s.descripcion,
      s.estructura,
      s.activo ? 'SI' : 'NO',
    ]),
    listas: { Grupos: params.grupos, SiNo: ['SI', 'NO'] },
    instrucciones: [
      ...INSTRUCCIONES_COMUNES,
      '7. Numeral: identificador único del servicio (p. ej. 11.2.1). Si una fila sin ID trae un Numeral que ya existe, se actualiza ese servicio en lugar de duplicarlo.',
      '8. Activo: SI / NO (vacío = SI). Un servicio inactivo no aparece al crear auto-evaluaciones.',
    ],
    nombreArchivo: `Plantilla_Servicios_${sufijoArchivo(params.cfg)}.xlsx`,
  })
}

// ============================================================
// Criterios
// ============================================================

export type CriterioPlantilla = {
  id: number
  numero: number
  item: string | null
  pagina: string | number | null
  criterio: string
  grupo: string
  servicio: string
  numeral_servicio: string
  estandar: string
  complejidad: string
  modalidad: string | null
}

const COLUMNAS_CRITERIOS: Columna[] = [
  { titulo: 'ID', ancho: 8 },
  { titulo: 'No.', ancho: 8 },
  { titulo: 'Item', ancho: 8, texto: true },
  { titulo: 'Página', ancho: 9 },
  { titulo: 'Criterio', ancho: 80, obligatoria: true },
  { titulo: 'Grupo', ancho: 30, obligatoria: true, lista: 'Grupos' },
  { titulo: 'Servicio', ancho: 30, obligatoria: true, lista: 'Servicios' },
  { titulo: 'Numeral servicio', ancho: 14, texto: true },
  { titulo: 'Estándar', ancho: 40, obligatoria: true, lista: 'Estandares' },
  { titulo: 'Complejidad', ancho: 16, obligatoria: true, lista: 'Complejidades' },
  { titulo: 'Modalidad', ancho: 30, lista: 'Modalidades' },
]

export async function descargarPlantillaCriterios(params: {
  cfg: ResolucionConfig
  grupos: string[]
  servicios: string[]
  estandares: string[]
  complejidades: string[]
  modalidades: string[]
  criterios: CriterioPlantilla[]
}) {
  await crearPlantilla({
    titulo: `Plantilla de Criterios — ${params.cfg.label}`,
    columnas: COLUMNAS_CRITERIOS,
    filas: params.criterios.map((c) => [
      c.id,
      c.numero,
      c.item,
      c.pagina,
      c.criterio,
      c.grupo,
      c.servicio,
      c.numeral_servicio,
      c.estandar,
      c.complejidad,
      c.modalidad,
    ]),
    listas: {
      Grupos: params.grupos,
      Servicios: params.servicios,
      Estandares: params.estandares,
      Complejidades: params.complejidades,
      Modalidades: params.modalidades,
    },
    instrucciones: [
      ...INSTRUCCIONES_COMUNES,
      '7. Grupo y Servicio deben existir en el catálogo de Servicios de la misma resolución (el Servicio debe pertenecer al Grupo).',
      '8. Numeral servicio: opcional. Si se deja vacío se toma el numeral del Servicio elegido.',
      '9. Estándar, Complejidad y Modalidad: use los valores de la hoja "Listas" para que los filtros y gráficas no se partan en variantes del mismo valor.',
    ],
    nombreArchivo: `Plantilla_Criterios_${sufijoArchivo(params.cfg)}.xlsx`,
  })
}

// ============================================================
// Lectura del archivo diligenciado
// ============================================================

export type ResultadoLectura<T> = {
  nuevos: T[]
  actualizados: (T & { id: number })[]
  sinCambios: number
  errores: string[]
}

type CeldaLeida = { text?: string; value?: unknown }

function texto(cell: CeldaLeida): string {
  const v = cell.value
  if (v == null) return ''
  if (typeof v === 'string') return v.trim()
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  // Rich text, fórmulas, hipervínculos… — ExcelJS expone el texto visible.
  return (cell.text ?? '').trim()
}

// Normaliza para comparar nombres sin depender de mayúsculas, tildes ni
// espacios dobles ("Consulta externa" == "CONSULTA  EXTERNA").
function clave(s: string) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase()
}

// Lee la hoja "Datos" y devuelve las filas como objetos {encabezado: texto}.
// Ubica los encabezados por nombre (ignorando el "*" de obligatoria), así
// que tolera columnas reordenadas.
async function leerFilas(archivo: File, columnas: Columna[]) {
  const ExcelJS = (await import('exceljs')).default
  const wb = new ExcelJS.Workbook()
  await wb.xlsx.load(await archivo.arrayBuffer())
  const ws = wb.getWorksheet('Datos') ?? wb.worksheets[0]
  if (!ws) throw new Error('El archivo no tiene hojas.')

  const indice = new Map<string, number>()
  ws.getRow(1).eachCell((cell, col) => {
    indice.set(clave(texto(cell).replace(/\*/g, '')), col)
  })
  const faltantes = columnas.filter((c) => c.obligatoria && !indice.has(clave(c.titulo))).map((c) => c.titulo)
  if (faltantes.length > 0) {
    throw new Error(
      `El archivo no tiene el formato de la plantilla: faltan las columnas ${faltantes.join(', ')}. Descargue la plantilla y diligénciela.`,
    )
  }

  const filas: { numeroFila: number; valores: Record<string, string> }[] = []
  ws.eachRow((row, numeroFila) => {
    if (numeroFila === 1) return
    const valores: Record<string, string> = {}
    let vacia = true
    for (const c of columnas) {
      const col = indice.get(clave(c.titulo))
      const v = col ? texto(row.getCell(col)) : ''
      valores[c.titulo] = v
      if (v) vacia = false
    }
    if (!vacia) filas.push({ numeroFila, valores })
  })
  return filas
}

function leerId(v: string, numeroFila: number, errores: string[]) {
  if (!v) return null
  if (!/^\d+$/.test(v)) {
    errores.push(`Fila ${numeroFila}: el ID "${v}" no es válido (déjelo vacío para crear un registro nuevo).`)
    return undefined
  }
  return Number(v)
}

type GrupoBD = { id: number; numeral: string; nombre: string }

// ---------- Servicios ----------

export type ServicioImportado = {
  numeral: string
  grupo_id: number
  nombre: string
  descripcion: string | null
  estructura: string | null
  activo: boolean
}

export async function leerPlantillaServicios(
  archivo: File,
  cfg: ResolucionConfig,
): Promise<ResultadoLectura<ServicioImportado>> {
  const filas = await leerFilas(archivo, COLUMNAS_SERVICIOS)
  const [{ data: gr }, { data: sr }] = await Promise.all([
    supabase.from(cfg.tablaGrupos).select('id, numeral, nombre'),
    supabase
      .from(cfg.tablaServicios)
      .select(`id, numeral, nombre, descripcion, estructura, activo, grupo_id:${cfg.columnaGrupoId}`),
  ])
  const grupos = (gr ?? []) as GrupoBD[]
  const existentes = (sr ?? []) as unknown as (ServicioImportado & { id: number })[]
  const grupoPorNombre = new Map(grupos.map((g) => [clave(g.nombre), g]))
  const porId = new Map(existentes.map((s) => [s.id, s]))
  const porNumeral = new Map(existentes.map((s) => [s.numeral, s]))

  const res: ResultadoLectura<ServicioImportado> = { nuevos: [], actualizados: [], sinCambios: 0, errores: [] }
  const numeralesVistos = new Set<string>()

  for (const { numeroFila, valores } of filas) {
    const errores: string[] = []
    let id = leerId(valores['ID'], numeroFila, errores)
    const numeral = valores['Numeral']
    const nombre = valores['Servicio']
    const grupo = grupoPorNombre.get(clave(valores['Grupo']))
    if (!numeral) errores.push(`Fila ${numeroFila}: falta el Numeral.`)
    if (!nombre) errores.push(`Fila ${numeroFila}: falta el nombre del Servicio.`)
    if (!valores['Grupo']) errores.push(`Fila ${numeroFila}: falta el Grupo.`)
    else if (!grupo) errores.push(`Fila ${numeroFila}: el Grupo "${valores['Grupo']}" no existe en ${cfg.labelCorto}.`)
    const activoTxt = clave(valores['Activo'])
    if (activoTxt && !['SI', 'NO', 'S', 'N'].includes(activoTxt)) {
      errores.push(`Fila ${numeroFila}: Activo debe ser SI o NO.`)
    }
    if (id && !porId.has(id)) errores.push(`Fila ${numeroFila}: el ID ${id} no existe en ${cfg.labelCorto}.`)
    if (numeral && numeralesVistos.has(numeral)) errores.push(`Fila ${numeroFila}: el Numeral ${numeral} está repetido en el archivo.`)
    if (numeral) numeralesVistos.add(numeral)
    // Fila sin ID con un Numeral que ya existe → se trata como actualización.
    if (id === null && numeral && porNumeral.has(numeral)) id = porNumeral.get(numeral)!.id
    // Un Numeral es único: no puede quedar en otro servicio distinto.
    const duenoNumeral = numeral ? porNumeral.get(numeral) : undefined
    if (id && duenoNumeral && duenoNumeral.id !== id) {
      errores.push(`Fila ${numeroFila}: el Numeral ${numeral} ya pertenece a otro servicio (ID ${duenoNumeral.id}).`)
    }
    if (errores.length > 0 || id === undefined) {
      res.errores.push(...errores)
      continue
    }

    const registro: ServicioImportado = {
      numeral,
      grupo_id: grupo!.id,
      nombre,
      descripcion: valores['Descripción'] || null,
      estructura: valores['Estructura'] || null,
      activo: !activoTxt || activoTxt.startsWith('S'),
    }
    if (id) {
      const actual = porId.get(id)!
      const igual = (Object.keys(registro) as (keyof ServicioImportado)[]).every(
        (k) => (actual[k] ?? null) === (registro[k] ?? null),
      )
      if (igual) res.sinCambios++
      else res.actualizados.push({ ...registro, id })
    } else {
      res.nuevos.push(registro)
    }
  }
  return res
}

export async function aplicarServicios(cfg: ResolucionConfig, lectura: ResultadoLectura<ServicioImportado>) {
  const aFila = (s: ServicioImportado) => ({
    numeral: s.numeral,
    [cfg.columnaGrupoId]: s.grupo_id,
    nombre: s.nombre,
    descripcion: s.descripcion,
    estructura: s.estructura,
    activo: s.activo,
  })
  if (lectura.nuevos.length > 0) {
    const { error } = await supabase.from(cfg.tablaServicios).insert(lectura.nuevos.map(aFila))
    if (error) throw new Error(`No se pudieron crear los servicios nuevos: ${error.message}`)
  }
  await actualizarEnLotes(cfg.tablaServicios, lectura.actualizados.map((s) => ({ id: s.id, fila: aFila(s) })))
}

// ---------- Criterios ----------

export type CriterioImportado = {
  numero: number
  item: string | null
  pagina: string | null
  criterio: string
  grupo_id: number
  servicio_id: number
  numeral_grupo: string
  numeral_servicio: string
  estandar: string
  complejidad: string
  modalidad: string | null
}

export async function leerPlantillaCriterios(
  archivo: File,
  cfg: ResolucionConfig,
): Promise<ResultadoLectura<CriterioImportado>> {
  const filas = await leerFilas(archivo, COLUMNAS_CRITERIOS)
  const [{ data: gr }, { data: sr }, existentes] = await Promise.all([
    supabase.from(cfg.tablaGrupos).select('id, numeral, nombre'),
    supabase.from(cfg.tablaServicios).select(`id, numeral, nombre, grupo_id:${cfg.columnaGrupoId}`),
    leerTodos<CriterioImportado & { id: number }>(cfg.tablaCriterios,
      `id, numero, item, pagina, criterio, grupo_id:${cfg.columnaGrupoId}, servicio_id:${cfg.columnaServicioId}, numeral_grupo, numeral_servicio, estandar, complejidad, modalidad`),
  ])
  const grupos = (gr ?? []) as GrupoBD[]
  const servicios = (sr ?? []) as unknown as { id: number; numeral: string; nombre: string; grupo_id: number }[]
  const grupoPorNombre = new Map(grupos.map((g) => [clave(g.nombre), g]))
  const porId = new Map(existentes.map((c) => [c.id, c]))

  const res: ResultadoLectura<CriterioImportado> = { nuevos: [], actualizados: [], sinCambios: 0, errores: [] }

  for (const { numeroFila, valores } of filas) {
    const errores: string[] = []
    const id = leerId(valores['ID'], numeroFila, errores)
    const grupo = grupoPorNombre.get(clave(valores['Grupo']))
    // El nombre del servicio se busca dentro del grupo elegido.
    const servicio = servicios.find(
      (s) => clave(s.nombre) === clave(valores['Servicio']) && (!grupo || s.grupo_id === grupo.id),
    )
    for (const c of COLUMNAS_CRITERIOS) {
      if (c.obligatoria && !valores[c.titulo]) errores.push(`Fila ${numeroFila}: falta ${c.titulo}.`)
    }
    if (valores['Grupo'] && !grupo) errores.push(`Fila ${numeroFila}: el Grupo "${valores['Grupo']}" no existe en ${cfg.labelCorto}.`)
    if (grupo && valores['Servicio'] && !servicio) {
      errores.push(`Fila ${numeroFila}: el Servicio "${valores['Servicio']}" no existe en el grupo "${grupo.nombre}".`)
    }
    const numeroTxt = valores['No.']
    if (numeroTxt && !/^\d+$/.test(numeroTxt)) errores.push(`Fila ${numeroFila}: No. debe ser un número entero.`)
    if (id && !porId.has(id)) errores.push(`Fila ${numeroFila}: el ID ${id} no existe en ${cfg.labelCorto}.`)
    if (errores.length > 0 || id === undefined) {
      res.errores.push(...errores)
      continue
    }

    const registro: CriterioImportado = {
      numero: numeroTxt ? Number(numeroTxt) : 0,
      item: valores['Item'] || null,
      pagina: valores['Página'] || null,
      criterio: valores['Criterio'],
      grupo_id: grupo!.id,
      servicio_id: servicio!.id,
      numeral_grupo: grupo!.numeral,
      numeral_servicio: valores['Numeral servicio'] || servicio!.numeral,
      estandar: valores['Estándar'],
      complejidad: valores['Complejidad'],
      modalidad: valores['Modalidad'] || null,
    }
    if (id) {
      const actual = porId.get(id)!
      const igual = (Object.keys(registro) as (keyof CriterioImportado)[]).every(
        (k) => String(actual[k] ?? '') === String(registro[k] ?? ''),
      )
      if (igual) res.sinCambios++
      else res.actualizados.push({ ...registro, id })
    } else {
      res.nuevos.push(registro)
    }
  }
  return res
}

export async function aplicarCriterios(cfg: ResolucionConfig, lectura: ResultadoLectura<CriterioImportado>) {
  const aFila = (c: CriterioImportado) => ({
    numero: c.numero,
    item: c.item,
    pagina: c.pagina,
    criterio: c.criterio,
    [cfg.columnaGrupoId]: c.grupo_id,
    [cfg.columnaServicioId]: c.servicio_id,
    numeral_grupo: c.numeral_grupo,
    numeral_servicio: c.numeral_servicio,
    estandar: c.estandar,
    complejidad: c.complejidad,
    modalidad: c.modalidad,
  })
  const marca = Date.now()
  for (let i = 0; i < lectura.nuevos.length; i += 500) {
    const lote = lectura.nuevos.slice(i, i + 500).map((c, j) => ({ ...aFila(c), llave: `import-${marca}-${i + j}` }))
    const { error } = await supabase.from(cfg.tablaCriterios).insert(lote)
    if (error) throw new Error(`No se pudieron crear los criterios nuevos (desde el ${i + 1}): ${error.message}`)
  }
  await actualizarEnLotes(cfg.tablaCriterios, lectura.actualizados.map((c) => ({ id: c.id, fila: aFila(c) })))
}

// ---------- utilidades de BD ----------

// La columna id es GENERATED ALWAYS, así que no se puede usar upsert: los
// cambios van como UPDATE por id, de a 10 en paralelo. Solo se envían las
// filas que cambiaron, normalmente pocas.
async function actualizarEnLotes(tabla: string, cambios: { id: number; fila: Record<string, unknown> }[]) {
  const fallidos: string[] = []
  for (let i = 0; i < cambios.length; i += 10) {
    const resultados = await Promise.all(
      cambios.slice(i, i + 10).map(({ id, fila }) => supabase.from(tabla).update(fila).eq('id', id).select('id')),
    )
    resultados.forEach((r, j) => {
      const id = cambios[i + j].id
      if (r.error) fallidos.push(`ID ${id}: ${r.error.message}`)
      else if (!r.data || r.data.length === 0) fallidos.push(`ID ${id}: sin permiso para actualizar`)
    })
  }
  if (fallidos.length > 0) {
    throw new Error(`No se pudieron actualizar ${fallidos.length} registro(s):\n${fallidos.slice(0, 10).join('\n')}`)
  }
}

async function leerTodos<T>(tabla: string, columnas: string): Promise<T[]> {
  const filas: T[] = []
  for (let desde = 0; ; desde += 1000) {
    const { data, error } = await supabase.from(tabla).select(columnas).order('id').range(desde, desde + 999)
    if (error) throw new Error(error.message)
    const lote = (data ?? []) as unknown as T[]
    filas.push(...lote)
    if (lote.length < 1000) break
  }
  return filas
}
