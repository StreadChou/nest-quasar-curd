import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";

export abstract class AbstractCollect {
  ctx: GeneratorCtx;

  protected constructor(ctx: GeneratorCtx) {
    this.ctx = ctx;
  }
}
