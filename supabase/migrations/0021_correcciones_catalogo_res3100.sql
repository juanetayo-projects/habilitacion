-- Correcciones al catálogo Res.3100 (pedido 2026-10-09). Generado por
-- docs/generar_sql_correcciones_res3100.py desde Autoevaluacion_Res3100_v2.xlsx.
-- Respaldo previo: esquema respaldo_res3100_20261009 (grupos, servicios, criterios, autoevaluaciones y respuestas Res.3100).
-- Conserva ids (respuestas de auto-evaluaciones) y respeta ediciones manuales.

-- 1. numeral_servicio 11.1.x pisado con '11.1' por el modal de Catálogos
update criterios_res3100 set numeral_servicio = '11.1.1' where id between 1 and 24 and numeral_servicio = '11.1' and llave not like 'manual-%';
update criterios_res3100 set numeral_servicio = '11.1.2' where id between 25 and 209 and numeral_servicio = '11.1' and llave not like 'manual-%';
update criterios_res3100 set numeral_servicio = '11.1.3' where id between 210 and 269 and numeral_servicio = '11.1' and llave not like 'manual-%';
update criterios_res3100 set numeral_servicio = '11.1.4' where id between 270 and 325 and numeral_servicio = '11.1' and llave not like 'manual-%';
update criterios_res3100 set numeral_servicio = '11.1.5' where id between 326 and 430 and numeral_servicio = '11.1' and llave not like 'manual-%';
update criterios_res3100 set numeral_servicio = '11.1.6' where id between 431 and 470 and numeral_servicio = '11.1' and llave not like 'manual-%';
update criterios_res3100 set numeral_servicio = '11.1.7' where id between 471 and 472 and numeral_servicio = '11.1' and llave not like 'manual-%';

-- 2. Cambios v1 -> v2 en filas originales (solo si la BD conserva el valor de la v1)
update criterios_res3100 set complejidad = 'alta' where complejidad = 'Todas' and (id between 976 and 979 or id between 1062 and 1068 or id between 1078 and 1084 or id between 1197 and 1216 or id between 2402 and 2452 or id between 2569 and 2584);
update criterios_res3100 set complejidad = 'baja' where complejidad = 'Todas' and (id between 1967 and 2034 or id in (3644));
update criterios_res3100 set complejidad = 'mediana' where complejidad = 'Todas' and (id between 1452 and 1505 or id between 2326 and 2336 or id between 2527 and 2538);
update criterios_res3100 set complejidad = 'no aplica' where complejidad = 'Todas' and (id between 671 and 715 or id between 752 and 797 or id between 1217 and 1451);
update criterios_res3100 set item = '4.1.1' where item = '4.1' and id in (618);
update criterios_res3100 set item = '4.1.2' where item = '4.1' and id in (619);
update criterios_res3100 set item = '4.1.3' where item = '4.1' and id in (620);
update criterios_res3100 set item = '4.2.1' where item = '4.2' and id in (621);
update criterios_res3100 set item = '4.2.2' where item = '4.2' and id in (622);
update criterios_res3100 set item = '4.2.3' where item = '4.2' and id in (623);
update criterios_res3100 set item = '4.2.4' where item = '4.2' and id in (624);
update criterios_res3100 set item = '4.3.1' where item = '4.3' and id in (625);
update criterios_res3100 set item = '4.3.2' where item = '4.3' and id in (626);
update criterios_res3100 set item = '4.4.1' where item = '4.4' and id in (627);
update criterios_res3100 set item = '4.4.2' where item = '4.4' and id in (628);
update criterios_res3100 set item = '4.4.3' where item = '4.4' and id in (629);
update criterios_res3100 set item = '4.4.4' where item = '4.4' and id in (630);
update criterios_res3100 set item = '4.4.5' where item = '4.4' and id in (631);
update criterios_res3100 set item = '4.4.6' where item = '4.4' and id in (632);
update criterios_res3100 set item = '4.5.1' where item = '4.5' and id in (633);
update criterios_res3100 set item = '4.5.2' where item = '4.5' and id in (634);
update criterios_res3100 set modalidad = 'intramural' where modalidad = 'Todas' and (id between 1217 and 1257 or id between 1419 and 1451);
update criterios_res3100 set criterio = '17.1.2.3. Las pantallas o monitores grado médico utilizados para el despliegue de imágenes cuentan con una distancia máxima de 0.25 milímetros entre píxeles (dot pitch), para garantizar la interpretación adecuada de la información recibida.' where id = 264 and md5(criterio) = '68b41c17a7829434c670867b63ca28b4';
update criterios_res3100 set criterio = '1. Cuando el servicio interdependiente sea contratado, debe mediar un contrato o un acuerdo escrito entre las dos partes, en el que se establezca que el servicio interdependiente apoya el servicio principal, estableciendo como mínimo:' where id = 471 and md5(criterio) = '9e112283862f2b38dfd06d372ff6f81b';
update criterios_res3100 set criterio = '9.1.2. Ambiente de entrevista donde no se realiza examen físico ni procedimientos.' where id = 489 and md5(criterio) = '7296ff68535687651dc352234c9ff6c0';
update criterios_res3100 set criterio = '1. Cumple con los criterios definidos para el servicio de consulta externa general y adicionalmente cuenta con:' where id = 578 and md5(criterio) = '53c5c643e1e57cae23965ff087e06d86';
update criterios_res3100 set criterio = '1. Cumple con los criterios que le sean aplicables de todos los servicios y adicionalmente, cuenta con:' where id = 614 and md5(criterio) = 'd48d7060a531e62ced56d81053b8af6d';
update criterios_res3100 set criterio = '2. Si se requiere personal adicional para:' where id = 615 and md5(criterio) = '8711e331443bccf75af267a32f37529d';
update criterios_res3100 set criterio = '4. Consultorio o ambiente que, de acuerdo con la oferta, cumple con los siguientes requisitos:' where id = 617 and md5(criterio) = 'e48ee09bca148afb43551b7303cf5cfa';
update criterios_res3100 set criterio = '4.1.3 Lavamanos.' where id = 620 and md5(criterio) = '8c71145f1f0b12399142e6f484977dcc';
update criterios_res3100 set criterio = '4.2.4 Lavamanos.' where id = 624 and md5(criterio) = '63b6a28e2752142f4d93fa2a7e4c0230';
update criterios_res3100 set criterio = '4.3.2 Unidades sanitarias discriminadas por sexo.' where id = 626 and md5(criterio) = '8be88162a03a83d4f90872ce92c0482d';
update criterios_res3100 set criterio = '4.4.6 Lavamanos.' where id = 632 and md5(criterio) = 'd47aff514724c2501ec413e4ef49f696';
update criterios_res3100 set criterio = '5. Adicional a los criterios definidos para todos los servicios, la sede del prestador de servicios de salud que habilite el servicio de vacunación cuenta con:' where id = 635 and md5(criterio) = 'f5c3b6351fcf5faf804d0621b7764d00';
update criterios_res3100 set criterio = '6. Cumple con los criterios que le sean aplicables de todos los servicios y adicionalmente, cuenta con:' where id = 636 and md5(criterio) = 'dd6c8b73631d48dca46503c8bf2fa6de';
update criterios_res3100 set criterio = '7. Cumple con los criterios que le sean aplicables de todos los servicios y adicionalmente cuenta con:' where id = 637 and md5(criterio) = '9dd95416cc0688c1101bc28d92778385';
update criterios_res3100 set criterio = '9. Cumple con los criterios que le sean aplicables de todos los servicios y adicionalmente cuenta con la siguiente información documentada:' where id = 639 and md5(criterio) = '7727e550fa6825b3797a039bf5eaa3ab';
update criterios_res3100 set criterio = '11. Cumple con los criterios que le sean aplicables de todos los servicios y adicionalmente cuenta con:' where id = 641 and md5(criterio) = '546d866bf27ce75ca3846a74fd77e847';
update criterios_res3100 set criterio = '39. Cuando se realicen procedimientos con administración de medio de contraste e intervencionismo, disponibilidad de:' where id = 882 and md5(criterio) = 'de1b9d0633e13e8b137fc789c2b6ee62';
update criterios_res3100 set criterio = '4. Cumple con los criterios que le sean aplicables de todos los servicios y adicionalmente, cuenta con:' where id = 890 and md5(criterio) = '3411a3df19044c4c4a42ac23094c3a7f';
update criterios_res3100 set criterio = '5. Disponibilidad de:' where id = 891 and md5(criterio) = '057b179d02ffbfa1598fa9b3932620ab';
update criterios_res3100 set criterio = '8. Cumple con los criterios que le sean aplicables de todos los servicios y adicionalmente,' where id = 894 and md5(criterio) = 'fabaf99cd24b20de8a5482e637052d35';
update criterios_res3100 set criterio = '13. Cumplen con los criterios definidos para todos los servicios y adicionalmente, cuenta con la siguiente información documentada:' where id = 899 and md5(criterio) = 'a56e49e28ada77d2a7dfe09a6a3fdfe3';
update criterios_res3100 set criterio = '15.4. Cama hospitalaria cuando realice terapias con radionúclidos de actividad mayor a 30 mCi.' where id = 949 and md5(criterio) = '18c1570b993d91c4a48ba8d5bc891db6';
update criterios_res3100 set criterio = '19.1.2. Procedimientos diagnósticos para gammagrafías o PET - CT o SPECT CT.' where id = 961 and md5(criterio) = '43689e76fbb1c16ba5bcce51b5cbd995';
update criterios_res3100 set criterio = '47.1.6. Entrenamiento y capacitación al paciente, familia y cuidador, que incluya:' where id = 1942 and md5(criterio) = '52de058ddea21e1e4c6328305e00c5a4';
update criterios_res3100 set criterio = '13.6.3. Oxígeno medicinal' where id = 2076 and md5(criterio) = '00507bec7160ebd157be528240d4cd6a';
update criterios_res3100 set criterio = '12.6. Marcapaso externo no invasivo, cuando no esté incluido en el desfibrilador.' where id = 2493 and md5(criterio) = '31e54cae0f18b8baf05787342fe170c3';
update criterios_res3100 set criterio = '31.13. Política institucional basada en el respeto por los derechos y la dignidad humana, priorizando la autonomía personal y el libre desarrollo de la personalidad.' where id = 2824 and md5(criterio) = 'ccab490136206e7a55eb88cca5065e18';
update criterios_res3100 set criterio = '31.15.6. Ambiente o condiciones de recuperación posteriores al tratamiento.' where id = 2831 and md5(criterio) = 'de5c65f93271f8b79eeadb7195d25ff2';
update criterios_res3100 set criterio = '15.3. Baños o lavamanos, sanitarios y duchas individuales o separadas por barrera física fija, discriminados por sexo y para menores de edad, según la oferta.' where id = 2897 and md5(criterio) = '728c0fdb3aade88e9328d6f91b788332';
update criterios_res3100 set criterio = '23.1. Política institucional basada en el respeto por los derechos y la dignidad humana, priorizando la autonomía personal y el libre desarrollo de la personalidad.' where id = 2922 and md5(criterio) = '6187650b5a15b66f7ddbd5e9dfacb32b';
update criterios_res3100 set criterio = '18.1. Laringoscopio con hojas curvas y rectas de diferentes tamaños, según oferta.' where id = 3047 and md5(criterio) = '86255ca018779126cf567c347e2e7fa6';
update criterios_res3100 set criterio = '31.25.1. Trazado electrocardiográfico si no está incorporado en el desfibrilador' where id = 3512 and md5(criterio) = '346230c9c216b4ed7174f3ff655ebeae';
update criterios_res3100 set criterio = '16.1. Habitación individual de TPR con dimensión mínima de 16 m2, que cuenta con:' where id = 3686 and md5(criterio) = '55cf5c6f661334e6c3a01d3eca7e443a';

-- 3. Correcciones puntuales verificadas contra el PDF oficial
update criterios_res3100 set criterio = replace(criterio, 'Este mantenimito puede', 'Este mantenimiento puede') where id = 223;

-- 4. Sub-ítems nuevos (separados del ítem padre)
create temp table _nuevos (parent_id bigint, k int, item text, criterio text) on commit drop;
insert into _nuevos (parent_id, k, item, criterio) values
  (264, 1, '17.2', '17.2. Prestador de referencia'),
  (471, 1, '1.1', '1.1 Calidad en la entrega de los productos.'),
  (471, 2, '1.2', '1.2 Procedimientos documentados de atención en cada servicio interdependiente.'),
  (471, 3, '1.3', '1.3 Tiempos de entrega de los productos.'),
  (471, 4, '1.4', '1.4 Supervisión al contratista que garantice la seguridad del resultado del producto contratado.'),
  (489, 1, '9.1.3', '9.1.3. Consultorio donde se realizan procedimientos.'),
  (578, 1, '1.1', '1.1 <Aparte en rojo SUSPENDIDO provisionalmente> Profesional de la salud con título de especialista, según los programas académicos autorizados por el Ministerio de Educación Nacional.
Jurisprudencia Vigencia'),
  (578, 2, '1.2', '1.2 Para medicina alternativa y terapias alternativas y complementarias, cuenta con profesional de la salud con título de especialista en el ámbito de su disciplina, para lo cual deberá acreditar la respectiva certificación académica de esa norma de competencia, expedida por una institución de educación superior legalmente reconocida por el Estado y de acuerdo con lo documentado por el prestador de servicios de salud en el estándar de procesos prioritarios.'),
  (614, 1, '1.1', '1.1 Profesional de la medicina o profesional de la enfermería.'),
  (615, 1, '2.1', '2.1 La administración de la vacuna cuenta con auxiliar de enfermería o auxiliar de salud pública bajo la supervisión del profesional de la medicina o profesional de la enfermería.'),
  (615, 2, '2.2', '2.2 El manejo de la cadena de frío puede disponer de auxiliar de enfermería o auxiliar en salud pública o gestor comunitario en salud (en zonas de dispersión geográfica) o regentes de farmacia o químico farmacéutico con experiencia en cadena de frío.'),
  (617, 1, '4.1', 'Para los servicios en modalidad intramural de prestadores de servicios de salud que separen el servicio de vacunación en dos ambientes cuenta con:
4.1 Consultorio para administración de medicamentos biológicos que cuenta con:'),
  (620, 1, '4.2', '4.2 Ambiente para almacenamiento y alistamiento de dispositivos y termos que cuenta con:'),
  (624, 1, '4.3', '4.3 Disponibilidad de:'),
  (626, 1, '4.4', 'Para los servicios en modalidad intramural de prestadores de servicios de salud que integren en un solo ambiente el servicio de vacunación cuenta con:
4.4 Ambiente de vacunación, para administración de medicamentos biológicos, que cuenta con:'),
  (632, 1, '4.5', '4.5 Disponibilidad de:'),
  (635, 1, '5.1', '5.1 Ambiente para el alistamiento de termos y cajas térmicas.'),
  (635, 2, '5.2', '5.2 Ambiente de cadena de frío, que puede ser el mismo de la modalidad intramural, que incluye un mesón con poceta, con capacidad para el lavado de los termos, con grifo cuello de cisne o ducha teléfono.'),
  (635, 3, '5.3', '5.3 Área para el almacenamiento de dispositivos médicos e insumos, que puede estar ubicado en otro ambiente diferente al consultorio.'),
  (635, 4, '5.4', '5.4 Lavamanos.'),
  (636, 1, '6.1', '6.1 Refrigerador precalificado por la Organización Mundial de la Salud para almacenamiento de vacunas.'),
  (636, 2, '6.2', '6.2 Para los refrigeradores con alimentación eléctrica cuenta con regulador o estabilizador electrónico de voltaje independiente, o conexión a una fuente regulada con indicador de polo a tierra.'),
  (636, 3, '6.3', '6.3 Papelería, cajas de transporte y termos portavacunas precalificados por la Organización Mundial de la Salud para manejo de vacunas; y los demás insumos necesarios para la prestación del servicio.'),
  (637, 1, '7.1', '7.1 Congelador con la capacidad suficiente para almacenar los paquetes fríos necesarios para el alistamiento de la totalidad de las cajas térmicas y termos.'),
  (637, 2, '7.2', '7.2 Refrigerador precalificado por la Organización Mundial de la Salud para almacenamiento de vacunas.'),
  (637, 3, '7.3', '7.3 Caja térmica o termo porta vacunas precalificados por la Organización Mundial de la Salud, para el traslado de los biológicos.'),
  (639, 1, '9.1', '9.1 Vacunación segura.'),
  (639, 2, '9.2', '9.2 Reporte y manejo de Eventos Supuestamente Adversos Atribuidos a la Vacunación o Inmunización -ESAVI (medición, análisis, reporte, gestión y monitoreo).'),
  (639, 3, '9.3', '9.3 Vigilancia de inmunoprevenibles.'),
  (639, 4, '9.4', '9.4 Seguimiento al sistema de información del Programa Ampliado de Inmunizaciones -PAI y seguimiento a cohortes.'),
  (639, 5, '9.5', '9.5 Protocolo para la inmunización en casos de urgencia o para víctimas de violencia sexual por medio de la respuesta en red.'),
  (639, 6, '9.6', '9.6 Vacunación sin barreras.'),
  (641, 1, '11.1', '11.1 Instrumentos de registros establecidos para el PAI bajo los lineamientos del Ministerio de Salud y Protección Social.'),
  (641, 2, '11.2', '11.2 Registro nominal de la información del PAI, durante la atención.'),
  (641, 3, '11.3', '11.3 Registro del carné de vacunación definido por el Ministerio de Salud y Protección Social en forma clara, legible, sin tachones, enmendaduras y sin dejar espacios en blanco.'),
  (882, 1, '39.1', '39.1 Servicio de urgencias.'),
  (882, 2, '39.2', '39.2 Servicio de transporte asistencial.'),
  (890, 1, '4.1', '4.1 Ambiente exclusivo para el equipo generador de radiación no ionizante. La dimensión de este ambiente debe ser acorde al tipo de equipo generador de radiación no ionizante, su ficha técnica y a los procedimientos que se realicen, debe permitir movilización del talento humano, pacientes, usuarios y equipos biomédicos.'),
  (890, 2, '4.2', '4.2 Unidad sanitaria, cuando el procedimiento lo requiera.'),
  (891, 1, '5.1', '5.1 Vestidor para pacientes y área para casilleros, cuando el procedimiento lo requiera.'),
  (891, 2, '5.2', '5.2 Área para almacenamiento de dispositivos médicos e insumos.'),
  (891, 3, '5.3', '5.3 Sala de espera.'),
  (891, 4, '5.4', '5.4 Unidades sanitarias discriminadas por sexo.'),
  (894, 1, '8.1', '8.1 Cuenta con él o los equipos generadores de radiaciones no ionizantes, según los exámenes diagnósticos realizados.'),
  (894, 2, '8.2', '8.2 Cuando se realice resonancia magnética y ultrasonido cuenta con pantalla o monitor grado médico.'),
  (899, 1, '13.1', '13.1 Procedimientos para la realización de los exámenes diagnósticos.'),
  (899, 2, '13.2', '13.2 Instrucciones a los pacientes sobre la preparación de los procedimientos diagnósticos, cuando se requiera.'),
  (899, 3, '13.3', '13.3 Verificación de la calidad de imagen cuando aplique, que incluye la toma de medidas preventivas y correctivas.'),
  (899, 4, '13.4', '13.4 Control de calidad del equipo cuando aplique, que incluye la toma de medidas correctivas.'),
  (949, 1, '15.5', '15.5. Gammacámara, cuando realice terapias con radionúclidos para rastreos pos-terapia.'),
  (961, 1, '19.1.3', '19.1.3. Procedimiento de perfusión miocárdica con isonitrilos, cuando lo realice.'),
  (1942, 1, '47.1.6.1', '47.1.6.1. Manejo de asepsia y antisepsia en el domicilio.'),
  (2076, 1, '13.6.4', '13.6.4. Mezclador de gases medicinales'),
  (2493, 1, '12.7', '12.7. Oxígeno medicinal portátil'),
  (2824, 1, '31.14', '31.14. Tamizaje del riesgo asociado al consumo de sustancias psicoactivas e intervención motivacional breve por curso de vida y a mujeres embarazadas cuando aplique.'),
  (2831, 1, '31.16', '31.16. Planes de tratamiento y seguimiento.'),
  (2897, 1, '15.4', '15.4. Ambiente para uso múltiple que permita albergar a todos los usuarios participantes en el desarrollo de las terapias e intervenciones individuales, grupales y familiares.'),
  (2922, 1, '23.2', '23.2. Tamizaje e intervención motivacional breve por curso de vida y a mujeres embarazadas cuando aplique.'),
  (3047, 1, '18.2', '18.2. Tubos endotraqueales de diferentes calibres.'),
  (3512, 1, '31.25.2', '31.25.2. Presión no invasiva'),
  (3512, 2, '31.25.3', '31.25.3. Saturación de oxígeno que puede estar integrado en el monitor o externo'),
  (3686, 1, '16.1.1', '16.1.1. Baño, guardarropa y sistema de llamado.');

create temp table _orden (id bigint primary key, orden numeric) on commit drop;

-- 4a. Criterios manuales que ya cubrían un sub-ítem: se normalizan
with m as (
  select distinct on (n.parent_id, n.k) c.id, n.parent_id, n.k, n.item
  from _nuevos n
  join criterios_res3100 p on p.id = n.parent_id
  join criterios_res3100 c on c.llave like 'manual-%'
    and c.servicio_res3100_id = p.servicio_res3100_id
    and c.estandar = p.estandar
    and rtrim(trim(c.item), '.') = n.item
  order by n.parent_id, n.k, c.id
), upd as (
  update criterios_res3100 c set
    item = m.item, criterio = btrim(c.criterio, E' \n'),
    numeral_grupo = p.numeral_grupo, numeral_servicio = p.numeral_servicio,
    complejidad = p.complejidad, modalidad = p.modalidad, pagina = p.pagina
  from m join criterios_res3100 p on p.id = m.parent_id
  where c.id = m.id
  returning c.id, m.parent_id, m.k
)
insert into _orden select id, parent_id + k / 100.0 from upd;

-- 4b. Los que no existían se insertan copiando los datos del padre
with ins as (
  insert into criterios_res3100 (llave, numero, item, pagina, criterio, grupo_res3100_id, servicio_res3100_id,
    numeral_grupo, numeral_servicio, estandar, complejidad, modalidad)
  select n.item || ';' || n.criterio, 0, n.item, p.pagina, n.criterio, p.grupo_res3100_id, p.servicio_res3100_id,
    p.numeral_grupo, p.numeral_servicio, p.estandar, p.complejidad, p.modalidad
  from _nuevos n join criterios_res3100 p on p.id = n.parent_id
  where not exists (
    select 1 from criterios_res3100 c
    where c.servicio_res3100_id = p.servicio_res3100_id and c.estandar = p.estandar
      and rtrim(trim(c.item), '.') = n.item and c.id <> p.id
      and (c.llave like 'manual-%' or c.id in (select id from _orden))
  )
  returning id, item, criterio, servicio_res3100_id, estandar
)
insert into _orden
select ins.id, n.parent_id + n.k / 100.0
from ins join _nuevos n on n.item = ins.item and n.criterio = ins.criterio
join criterios_res3100 p on p.id = n.parent_id and p.servicio_res3100_id = ins.servicio_res3100_id and p.estandar = ins.estandar;

-- 5. Manuales 14.1–14.13 (Historia clínica, modalidad extramural): van tras el ítem 14 (id 461)
with m as (
  update criterios_res3100 set item = rtrim(trim(item), '.'), criterio = btrim(criterio, E' \n'), numeral_servicio = '11.1.6'
  where llave like 'manual-%' and estandar = 'Estándar de Historia Clínica y Registros' and item like '14.%'
  returning id, item
)
insert into _orden select id, 461 + split_part(item, '.', 2)::int / 100.0 from m;

-- 5b. Limpieza: espacios/saltos al final y la marca 'Jurisprudencia Vigencia' que trajo el texto web
update criterios_res3100 set criterio = replace(criterio, E'\nJurisprudencia Vigencia', '') where criterio like '%Jurisprudencia Vigencia%';
update criterios_res3100 set criterio = btrim(criterio, E' \n\r\t') where criterio <> btrim(criterio, E' \n\r\t');

-- 6. Renumeración en orden del documento + llave
insert into _orden select id, id from criterios_res3100 where id not in (select id from _orden) and llave not like 'manual-%';
do $$ begin
  if exists (select 1 from criterios_res3100 where id not in (select id from _orden)) then
    raise exception 'Hay criterios sin posición asignada: %',
      (select string_agg(id::text, ', ') from criterios_res3100 where id not in (select id from _orden));
  end if;
end $$;
update criterios_res3100 c set numero = o.rn, llave = coalesce(c.item, '') || ';' || c.criterio
from (select id, row_number() over (order by orden, id) rn from _orden) o where o.id = c.id;

-- 7. Estructura de 11.3.4.1 / 11.3.4.2
update servicios_res3100 set estructura = 'Complejidades: Baja, mediana y alta.
Modalidades de prestación:
Intramural
Extramural: Unidad móvil (no aplica la realización de procedimientos con medio de contraste e intervencionismo)
Telemedicina – Categorías:
Telexperticia sincrónico y asincrónico - prestador remisor y prestador de referencia
Entre dos profesionales
(Tomado de la estructura del servicio 11.3.4 Imágenes diagnósticas)' where numeral = '11.3.4.1' and coalesce(estructura, '') = '';
update servicios_res3100 set estructura = 'Complejidad: Mediana.
Modalidades de prestación:
Intramural
Extramural: Unidad móvil, Domiciliaria y Jornada de Salud
Telemedicina – Categorías:
Telexperticia sincrónico y asincrónico - prestador remisor y prestador de referencia
Entre dos profesionales
(Tomado de la estructura del servicio 11.3.4 Imágenes diagnósticas)' where numeral = '11.3.4.2' and coalesce(estructura, '') = '';
