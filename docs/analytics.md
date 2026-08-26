<!-- docs/analytics.md -->

# Plan de medición del Estudio Jurídico Farfán

## Objetivo

Medir si el sitio genera contactos útiles y qué fuente o página los origina.
Las páginas vistas sirven como contexto; no son la conversión principal.

## Eventos y objetivos de Plausible

| Evento exacto | Tipo | Disparador | Propiedades | Interpretación |
| --- | --- | --- | --- | --- |
| `Consulta enviada` | Conversión principal | Netlify acepta el formulario | `pagina` | Consulta efectivamente recibida |
| `WhatsApp` | Conversión secundaria | Clic en un enlace a WhatsApp | `pagina`, `origen` | Intención de iniciar una conversación |
| `Correo` | Conversión secundaria | Clic en un enlace `mailto:` | `pagina`, `origen` | Intención de escribir por correo |

No se envían nombres, correos, mensajes, documentos ni la materia seleccionada.
Un clic en WhatsApp o correo no demuestra que la conversación se haya completado;
por eso debe analizarse separado de `Consulta enviada`.

En Plausible, crear tres objetivos de tipo **Custom event** respetando exactamente
mayúsculas, espacios y acentos:

1. `Consulta enviada`
2. `WhatsApp`
3. `Correo`

## Convención UTM

- Minúsculas en todos los valores.
- `utm_source`: plataforma que origina la visita.
- `utm_medium`: tipo de distribución.
- `utm_campaign`: iniciativa estable o pieza publicada.
- `utm_content`: formato o variante cuando sea necesario.
- No agregar UTM a enlaces internos del sitio.

### Enlaces permanentes para perfiles

Instagram:

```text
https://estudiofarfan.com.ar/?utm_source=instagram&utm_medium=social&utm_campaign=perfil
```

Facebook:

```text
https://estudiofarfan.com.ar/?utm_source=facebook&utm_medium=social&utm_campaign=perfil
```

Google Business Profile:

```text
https://estudiofarfan.com.ar/?utm_source=google&utm_medium=organic&utm_campaign=google_business_profile
```

WhatsApp — estados, listas o mensajes de difusión:

```text
https://estudiofarfan.com.ar/?utm_source=whatsapp&utm_medium=messaging&utm_campaign=difusion
```

### Plantilla para publicar un artículo

Reemplazar `SLUG`, `PLATAFORMA` y `FORMATO` antes de compartir:

```text
https://estudiofarfan.com.ar/articulos/SLUG/?utm_source=PLATAFORMA&utm_medium=social&utm_campaign=articulo_SLUG&utm_content=FORMATO
```

Valores recomendados para `FORMATO`: `perfil`, `post`, `historia` o `reel`.
Para WhatsApp usar `utm_medium=messaging` y `utm_content=estado`, `lista` o
`mensaje_directo`.

## Revisión a los 30 días

Aplicar el período desde el primer día completo posterior al despliegue:

1. Comparar visitantes y conversiones únicas por `Source` y `Campaign`.
2. Para cada objetivo, revisar `Entry pages` y determinar qué contenido inicia
   recorridos que terminan en contacto.
3. Separar la conversión principal (`Consulta enviada`) de las intenciones
   (`WhatsApp` y `Correo`).
4. Contrastar las conversiones digitales con la cantidad manual de consultas
   calificadas que efectivamente recibió el estudio.
5. Decidir la próxima publicación por evidencia: fuente, página de entrada y
   consultas calificadas, no sólo por cantidad de visitas.
