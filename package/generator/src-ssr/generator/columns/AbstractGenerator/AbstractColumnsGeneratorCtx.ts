import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";
import {AbstractTableGenerator} from "app/src-ssr/generator/instance/AbstractGenerator/AbstractTableGenerator";
import {TableColumns, TableColumnsExtension} from "app/src-ssr/types/Table";

export abstract class AbstractColumnsGeneratorCtx {
  ctx: GeneratorCtx;
  parent: AbstractTableGenerator;
  key: string;
  config: TableColumns;

  constructor(ctx: GeneratorCtx, parent: AbstractTableGenerator, key: string, config: TableColumns) {
    this.ctx = ctx;
    this.parent = parent;
    this.key = key;
    this.config = config;
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

  abstract start();

  abstract getString(prefix: string): string;
}
