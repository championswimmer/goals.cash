export class ErrorUnsupportedExtrapolation extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ERR_NO_EXTRAPOLATE";
  }
}