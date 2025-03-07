import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";
import {TableColumns, TableColumnsExtension} from "app/src-ssr/types/Table";
import {AbsEntityGenerator} from "app/src-ssr/generator/FileGenerator/EntityGenerator/AbsEntityGenerator";

export abstract class AbsColumnsGeneratorCtx {
  ctx: GeneratorCtx;
  parent: AbsEntityGenerator;
  key: string;
  config: TableColumns;
  env: "backend" | "frontend"

  constructor(ctx: GeneratorCtx, parent: AbsEntityGenerator, key: string, config: TableColumns) {
    this.ctx = ctx;
    this.parent = parent;
    this.key = key;
    this.config = config;
    this.env = parent.isBackend() ? "backend" : "frontend";
  }

  get extension() {
    if (!this.config.splitExtension) return this.config.extension as TableColumnsExtension;
    if (this.isFrontend) return this.config.extension_frontend as TableColumnsExtension;
    if (this.isBackend) return this.config.extension_backend as TableColumnsExtension;
    return this.config.extension as TableColumnsExtension;
  }

  get isBackend() {
    return this.parent.isBackend();
  }

  get isFrontend() {
    return this.parent.isFrontend()
  }

  abstract start(): void;

  abstract getString(prefix: string): string;
}
