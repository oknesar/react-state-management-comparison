import react from "@vitejs/plugin-react";
import ts from "typescript";
import { defineConfig, type Plugin } from "vite";

/**
 * Vite strips types with oxc, which passes standard decorators through untouched, and
 * no browser implements them yet. TypeScript can downlevel them, so the files of the
 * MobX decorator example are compiled by TypeScript before the normal pipeline runs.
 */
const standardDecorators = (): Plugin => ({
  name: "standard-decorators",
  enforce: "pre",
  transform(code, id) {
    if (!id.includes("mobx-decorators-seat-reservation")) {
      return null;
    }

    const { outputText, sourceMapText } = ts.transpileModule(code, {
      fileName: id,
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext,
        useDefineForClassFields: true,
        sourceMap: true,
      },
    });

    return { code: outputText, map: sourceMapText ? JSON.parse(sourceMapText) : null };
  },
});

// https://vite.dev/config/
export default defineConfig({
  build: { outDir: "docs" },
  plugins: [react(), standardDecorators()],
});
