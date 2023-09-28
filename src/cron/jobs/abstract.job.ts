export abstract class AbstractJob {
  abstract doWork(): Promise<void>;

  getName() {
    return this.constructor.name;
  }
}
