# Deepnight Analysis - Instrucciones de Despliegue y Edición

Este proyecto es una aplicación web estática construida con React, Vite y Tailwind CSS. Está lista para ser editada en Visual Studio Code y desplegada en Firebase Hosting.

## 1. Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu computadora:
- **Node.js** (versión 18 o superior)
- **Visual Studio Code**
- **Firebase CLI** (opcional, para desplegar desde terminal)

## 2. Instalación y Edición Local

1.  Descomprime el archivo ZIP en una carpeta.
2.  Abre la carpeta en **Visual Studio Code**.
3.  Abre una terminal en VS Code y ejecuta:

    ```bash
    npm install
    ```

4.  Para iniciar el servidor de desarrollo y ver los cambios en tiempo real:

    ```bash
    npm run dev
    ```

5.  Abre la URL que aparece en la terminal (generalmente `http://localhost:5173`) en tu navegador.

## 3. Estructura del Proyecto

*   `client/src/pages`: Aquí están las páginas del sitio (Home, Strategy, Content, Report).
*   `client/src/components`: Componentes reutilizables como el Layout, MetricCard, etc.
*   `client/src/index.css`: Estilos globales y configuración de Tailwind.
*   `client/public/images`: Imágenes y assets visuales.

## 4. Despliegue en Firebase Hosting

### Opción A: Usando Firebase CLI (Recomendado)

1.  Instala Firebase CLI si no lo tienes: `npm install -g firebase-tools`
2.  Inicia sesión en Firebase: `firebase login`
3.  Inicializa el proyecto (si es necesario): `firebase init hosting`
    *   Selecciona "Use an existing project" y elige tu proyecto de Firebase.
    *   Public directory: `dist`
    *   Configure as a single-page app: `Yes`
4.  Construye el proyecto para producción:

    ```bash
    npm run build
    ```

5.  Despliega:

    ```bash
    firebase deploy
    ```

### Opción B: Subida Manual

1.  Ejecuta `npm run build`. Esto creará una carpeta llamada `dist` con todos los archivos optimizados.
2.  Sube el contenido de la carpeta `dist` a tu hosting preferido.

## 5. Personalización

*   **Colores:** Puedes cambiar la paleta de colores editando las variables CSS en `client/src/index.css`.
*   **Datos:** Los datos mostrados en el dashboard están "hardcoded" en los archivos de las páginas (`client/src/pages/Home.tsx`, etc.). Puedes editarlos directamente allí o conectarlos a una API real en el futuro.
