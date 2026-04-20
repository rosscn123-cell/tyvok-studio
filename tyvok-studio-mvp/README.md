# Tyvok Studio Commercial Foundation

A Windows-oriented Electron + React desktop foundation for Tyvok laser devices.

## Included in this build
- Canvas editor with layer/process settings
- SVG import
- Project save/open
- G-code preview/export
- Real serial port scan/connect/disconnect
- G-code transmission to standard serial G-code controllers
- Frame / pause / resume / stop commands
- Device log streaming from Electron main process to renderer

## Recommended controller assumptions for this foundation
This build targets controllers that accept serial G-code and common GRBL-style realtime commands:
- Connect over a COM port
- Receive text G-code line-by-line
- Understand `!` pause, `~` resume, `Ctrl+X` stop/reset, `M5` laser off

## Install
```bash
npm install
```

## Run in development
```bash
npm run dev
```

## Build app
```bash
npm run build
```

## Build Windows installers
```bash
npm run dist:win
```

## Important note
This is a usable control foundation for standard serial G-code devices, but final production deployment still requires:
- validation on your real controller/firmware
- custom handshake / ack pacing if your board requires it
- device safety review and physical test coverage
- machine-specific homing/origin behavior confirmation
