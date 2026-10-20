import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setCodec("h264");
Config.setPixelFormat("yuv420p");
Config.setChromiumOpenGlRenderer("angle");
// Chromium preinstalado en el entorno de trabajo (sin descarga de Remotion).
// En otra máquina con acceso a internet esta línea puede eliminarse.
Config.setBrowserExecutable("/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell");
Config.setConcurrency(4);
