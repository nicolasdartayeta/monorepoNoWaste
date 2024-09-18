# Monorepo No Waste

## Inicializar el proyecto para usar custom hooks

Usar los hooks de la carpeta .githooks
```bash
git config core.hooksPath .githooks
```

Habilitar los hooks para que sean ejecutables (Linux/MacOS)
```bash
chmod +x .githooks/*
```
Desde donde se ejecute el commit tiene que estar Bun instalado con los paquetes Prettier y ESLint. En el Docker ya estan pero no esta instalado Git ahí.
