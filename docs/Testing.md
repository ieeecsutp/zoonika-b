# Guía de Pruebas del Backend de Zoonika

Este documento describe la estrategia, herramientas y procedimientos para las pruebas del backend de Zoonika, asegurando la calidad, fiabilidad y mantenibilidad del código.

## 1. Estrategia de Pruebas

La estrategia de pruebas se centra en las **pruebas de integración a nivel de API**. El objetivo es verificar que los endpoints se comporten como se espera desde la perspectiva de un cliente (como una aplicación frontend), asegurando que todo el flujo (ruta -> controlador -> servicio -> base de datos) funcione correctamente.

Este enfoque garantiza que los contratos de la API sean estables y que las refactorizaciones internas no introduzcan regresiones en el comportamiento observable de la aplicación.

## 2. Herramientas Utilizadas

*   **Jest:** Es el framework principal para la ejecución de pruebas. Proporciona un corredor de pruebas, funcionalidades para aserciones y la capacidad de generar reportes de cobertura.
*   **Supertest:** Es una librería que permite realizar peticiones HTTP a la API de Express de una manera sencilla y declarativa, ideal para las pruebas de integración.
*   **ts-jest:** Un transformador para Jest que permite ejecutar pruebas escritas directamente en TypeScript, sin necesidad de un paso de compilación manual.
*   **Prisma Client:** Se utiliza para la configuración y limpieza de la base de datos de prueba antes de la ejecución de las suites de pruebas.

## 3. Estructura de las Pruebas: El Patrón AAA

Cada caso de prueba sigue el patrón **Arrange, Act, Assert (AAA)** para mantener la claridad y la legibilidad.

*   **Arrange (Organizar):** Se prepara todo lo necesario para la prueba. Esto puede incluir la creación de datos de prueba o la configuración de mocks.
*   **Act (Actuar):** Se ejecuta la acción que se quiere probar, como realizar una petición HTTP a un endpoint.
*   **Assert (Afirmar):** Se verifica que el resultado de la acción sea el esperado. Esto se hace mediante aserciones que comparan el resultado obtenido con el valor esperado.

### Ejemplo Práctico del Patrón AAA

```typescript
// test/auth.test.ts (fragmento)

describe('Auth Endpoints', () => {
  // ...

  it('should register a new user', async () => {
    // Arrange: Se definen los datos del usuario de prueba.
    const testUser = {
      nombre: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    // Act: Se realiza la petición POST al endpoint de registro.
    const res = await request(app)
      .post('/auth/register')
      .send(testUser);

    // Assert: Se comprueba que el código de estado y el cuerpo de la respuesta sean los correctos.
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toEqual(testUser.email);
  });

  // ...
});
```

## 4. Cómo Ejecutar las Pruebas

Para ejecutar todo el conjunto de pruebas, simplemente utiliza el siguiente comando en la raíz del proyecto:

```bash
npm test
```

Este comando buscará todos los archivos que terminen en `.test.ts` dentro del directorio `test/` y los ejecutará.

## 5. Reporte de Cobertura

El comando `npm test` está configurado para generar automáticamente un reporte de cobertura de código. Este reporte indica qué porcentaje de tu código está siendo probado.

### Cómo Ver el Reporte

1.  Ejecuta `npm test`.
2.  Se creará un directorio `coverage/` en la raíz del proyecto.
3.  Abre el archivo `coverage/lcov-report/index.html` en tu navegador web.

### Interpretación del Reporte

El reporte HTML es interactivo y te permite navegar por los archivos de tu proyecto. Verás una tabla con las siguientes métricas:

*   **% Stmts (Statements):** Porcentaje de sentencias (líneas de código) ejecutadas.
*   **% Branch:** Porcentaje de ramas de código (ej. `if/else`) que han sido probadas.
*   **% Funcs:** Porcentaje de funciones que han sido llamadas.
*   **% Lines:** Porcentaje de líneas de código ejecutadas.

Al hacer clic en un archivo, podrás ver exactamente qué líneas de código no están cubiertas por las pruebas (generalmente resaltadas en rojo), lo que te ayudará a identificar dónde necesitas añadir más casos de prueba.

*(Nota: Como modelo de IA, no puedo generar capturas de pantalla, pero al seguir los pasos anteriores podrás visualizar el reporte completo en tu entorno local.)*
