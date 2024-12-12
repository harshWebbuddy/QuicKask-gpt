declare module "*.jpg";
declare module "*.png";
declare module "*.woff2";
declare module "*.woff";
declare module "*.ttf";
declare module "*.scss" {
  const content: Record<string, string>;
  export default content;
}

declare module "*.svg";
declare module "langdetect";
declare module "bard-wrapper" {
  export class Bard {
    constructor(auth: string, locale?: string);
    setMemory(mem: boolean): void;
    query(prompt: string): Promise<string>;
  }
}
 

 