import { useState } from 'react'
import { Boton, Modal, Spinner } from '../ui/ui'
import type { ResultadoLectura } from '../../lib/plantillaCatalogo'

// Importación de una plantilla diligenciada (pedido 2026-10-29, punto 3), en
// dos pasos: 1) leer y validar el archivo — no toca la BD, muestra cuántos
// registros se crean/actualizan y los errores por fila; 2) confirmar y
// aplicar. Si hay errores no se aplica nada, para no dejar el catálogo a
// medio cargar.
export function ModalImportarPlantilla<T>({
  open,
  onClose,
  titulo,
  leer,
  aplicar,
  onImportado,
}: {
  open: boolean
  onClose: () => void
  titulo: string
  leer: (archivo: File) => Promise<ResultadoLectura<T>>
  aplicar: (lectura: ResultadoLectura<T>) => Promise<void>
  onImportado: () => void
}) {
  const [lectura, setLectura] = useState<ResultadoLectura<T> | null>(null)
  const [nombreArchivo, setNombreArchivo] = useState('')
  const [trabajando, setTrabajando] = useState<'' | 'leyendo' | 'aplicando'>('')
  const [error, setError] = useState('')
  const [terminado, setTerminado] = useState(false)

  function cerrar() {
    if (trabajando) return
    setLectura(null)
    setNombreArchivo('')
    setError('')
    setTerminado(false)
    onClose()
  }

  async function elegirArchivo(archivo: File | undefined) {
    if (!archivo) return
    setNombreArchivo(archivo.name)
    setLectura(null)
    setError('')
    setTerminado(false)
    setTrabajando('leyendo')
    try {
      setLectura(await leer(archivo))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo leer el archivo.')
    } finally {
      setTrabajando('')
    }
  }

  async function confirmar() {
    if (!lectura) return
    setTrabajando('aplicando')
    setError('')
    try {
      await aplicar(lectura)
      setTerminado(true)
      onImportado()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo importar.')
    } finally {
      setTrabajando('')
    }
  }

  const hayCambios = !!lectura && lectura.nuevos.length + lectura.actualizados.length > 0
  const puedeAplicar = !!lectura && lectura.errores.length === 0 && hayCambios && !terminado

  return (
    <Modal open={open} onClose={cerrar} titulo={titulo} ancho="max-w-2xl">
      <div className="flex flex-col gap-4 text-sm">
        <p className="text-xs text-slate-500">
          Cargue la plantilla diligenciada (.xlsx). Primero se valida el archivo y se muestra un resumen; nada se
          guarda hasta que confirme. Las filas con ID actualizan ese registro y las filas sin ID crean registros
          nuevos.
        </p>

        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-xs hover:bg-slate-100">
          <span className="rounded-md bg-azul px-3 py-1.5 font-medium text-white">Elegir archivo</span>
          <span className="truncate text-slate-600">{nombreArchivo || 'Ningún archivo seleccionado'}</span>
          <input
            type="file"
            accept=".xlsx"
            className="hidden"
            disabled={!!trabajando}
            onChange={(e) => {
              elegirArchivo(e.target.files?.[0])
              e.target.value = ''
            }}
          />
        </label>

        {trabajando && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Spinner /> {trabajando === 'leyendo' ? 'Validando archivo…' : 'Guardando cambios…'}
          </div>
        )}

        {lectura && (
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-lg bg-emerald-50 p-2">
              <div className="text-lg font-semibold text-emerald-700">{lectura.nuevos.length}</div>
              nuevos
            </div>
            <div className="rounded-lg bg-sky-50 p-2">
              <div className="text-lg font-semibold text-sky-700">{lectura.actualizados.length}</div>
              a actualizar
            </div>
            <div className="rounded-lg bg-slate-100 p-2">
              <div className="text-lg font-semibold text-slate-600">{lectura.sinCambios}</div>
              sin cambios
            </div>
          </div>
        )}

        {lectura && lectura.errores.length > 0 && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            <p className="mb-1 font-semibold">
              {lectura.errores.length} error(es) — corrija el archivo y vuelva a cargarlo (no se importó nada):
            </p>
            <ul className="max-h-48 list-disc overflow-y-auto pl-5">
              {lectura.errores.slice(0, 200).map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
            {lectura.errores.length > 200 && <p className="mt-1">… y {lectura.errores.length - 200} más.</p>}
          </div>
        )}

        {lectura && lectura.errores.length === 0 && !hayCambios && (
          <p className="rounded-lg bg-slate-100 p-3 text-xs text-slate-600">
            El archivo no trae cambios frente al catálogo actual.
          </p>
        )}

        {error && <p className="whitespace-pre-line rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</p>}

        {terminado && (
          <p className="rounded-lg bg-emerald-50 p-3 text-xs text-emerald-700">
            Importación completada: {lectura?.nuevos.length ?? 0} creados y {lectura?.actualizados.length ?? 0}{' '}
            actualizados.
          </p>
        )}

        <div className="flex gap-2">
          <Boton variante="secundario" onClick={cerrar} className="flex-1" disabled={!!trabajando}>
            {terminado ? 'Cerrar' : 'Cancelar'}
          </Boton>
          {!terminado && (
            <Boton onClick={confirmar} disabled={!puedeAplicar || !!trabajando} className="flex-1">
              Importar
            </Boton>
          )}
        </div>
      </div>
    </Modal>
  )
}
