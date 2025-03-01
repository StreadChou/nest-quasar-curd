import {GeneratorCtx} from "app/src-ssr/generator/GeneratorCtx";

export abstract class AbstractGenerator {
  ctx: GeneratorCtx;

  protected constructor(ctx: GeneratorCtx) {
    this.ctx = ctx;
  }

  abstract start(): void;
}
