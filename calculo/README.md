# Página de soluciones de cálculo

Esta carpeta contiene una página estática para publicar soluciones propias de ejercicios de cálculo.

## Página publicada

Cuando GitHub Pages se actualice, la página quedará en:

`https://salecl.github.io/tienda-poleras/calculo/`

## Cómo subir una solución nueva

1. Sube el PDF de la solución a la carpeta:

   `calculo/soluciones/`

2. Edita el archivo:

   `calculo/soluciones.json`

3. Agrega una ficha con este formato:

```json
{
  "libro": "Cálculo de Stewart",
  "capitulo": "Capítulo 2",
  "ejercicio": "2.4 #18",
  "tema": "Regla de la cadena",
  "dificultad": "Medio",
  "archivo": "soluciones/capitulo-02-ejercicio-18.pdf",
  "descripcion": "Solución paso a paso con desarrollo algebraico."
}
```

4. Guarda el cambio. La página actualizará automáticamente la biblioteca.

## Nota legal y académica

Sube solo soluciones hechas por ti o material que tengas permiso de compartir. No subas libros completos, escaneos protegidos ni solucionarios oficiales copiados.
