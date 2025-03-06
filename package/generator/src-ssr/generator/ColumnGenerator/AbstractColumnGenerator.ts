import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";
import {TableColumns, TableColumnsExtension} from "app/src-ssr/types/Table";
import {AbsEntityGenerator} from "app/src-ssr/generator/FileGenerator/EntityGenerator/AbsEntityGenerator";

export abstract class AbstractColumnGenerator {
  ctx: GeneratorCtx;
  parent: AbsEntityGenerator;
  key: string;
  config: TableColumns;


  constructor(ctx: GeneratorCtx, parent: AbsEntityGenerator, key: string, config: TableColumns) {
    this.ctx = ctx;
    this.parent = parent;
    this.key = key;
    this.config = config;
  }

  get toBackend() {
    return this.parent.isBackend();
  }

  get toFrontend() {
    return this.parent.isFrontend()
  }

  get extension() {
    if (!this.config.splitExtension) return this.config.extension as TableColumnsExtension;
    if (this.toFrontend) return this.config.extension_frontend as TableColumnsExtension;
    if (this.toBackend) return this.config.extension_backend as TableColumnsExtension;
    return this.config.extension as TableColumnsExtension;
  }



}
