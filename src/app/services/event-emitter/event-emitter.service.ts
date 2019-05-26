import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class EventEmitterService {

  /**
   * Event emitter instance.
   */
  private emitter: EventEmitter<any> = new EventEmitter();

  /**
   * Returns event emitter instance.
   */
  public getEmitter(): EventEmitter<any>  {
    return this.emitter;
  }

  /**
   * Emits erbitrary event.
   */
  public emitEvent(object: object): void {
    this.emitter.emit(object);
  }

  /**
   * Emits progress bar start event.
   * Progress pars should be used locally in dialogs and similar.
   */
  public emitProgressStartEvent(): void {
    console.log('progress bar start event emitted');
    this.emitter.emit({progress: 'start'});
  }

  /**
   * Emits progress bar stop event.
   * Progress pars should be used locally in dialogs and similar.
   */
  public emitProgressStopEvent(): void {
    console.log('progress bar stop event emitted');
    this.emitter.emit({progress: 'stop'});
  }

}
