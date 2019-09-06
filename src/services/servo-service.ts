import { Injectable } from '@furystack/inject';

export interface Servo {
  channel: number;
  min: number;
  max: number;
  center: number;
  plainValue: number;
  percentage: number;
}

@Injectable({ lifetime: 'singleton' })
export class ServoService {
  private readonly storeKey = this.constructor.name + '-stored-servos';

  public servos: Servo[];

  public getServoForChannel(channel: number) {
    const servo = this.servos.find(s => s.channel === channel);
    if (!servo) {
      throw Error('Servo not registered :(');
    }
    return servo;
  }

  private saveValues() {
    localStorage.setItem(this.storeKey, JSON.stringify(this.servos));
  }

  private setPlainValue(
    socket: WebSocket,
    ...values: Array<{ channel: number; value: number }>
  ) {
    try {
      socket.send(
        `servo ${values
          .map(v => `${v.channel}=${parseInt(v.value as any)}`)
          .join(';')}`
      );
    } catch (error) {
      /** ignore */
    }
    return values.map(v => {
      const s = this.getServoForChannel(v.channel);
      if (s.plainValue !== v.value) {
        s.plainValue = v.value;
        this.saveValues();
      }
      return s;
    });
  }

  public getPlainValueFromPercent(servo: Servo, percentValue: number) {
    if (percentValue === 0) {
      return servo.center;
    }
    if (percentValue > 0) {
      return (servo.max - servo.center) * percentValue + servo.center;
    } else {
      return (servo.center - servo.min) * percentValue + servo.center;
    }
  }

  public setValue(
    socket: WebSocket,
    ...values: Array<{ channel: number; percent: number }>
  ) {
    const withPlainValue = values.map(v => {
      const casted = { ...v } as typeof v & { value: number };
      const servo = this.getServoForChannel(v.channel);
      casted.value = this.getPlainValueFromPercent(servo, v.percent);
      servo.percentage = v.percent;
      return casted;
    });
    return this.setPlainValue(socket, ...withPlainValue);
  }

  public patch(
    channel: number,
    value: Partial<Servo>,
    socket: WebSocket,
    skipSend: boolean = false
  ) {
    const original = this.getServoForChannel(channel);
    Object.assign(original, value);
    if (!skipSend) {
      this.setValue(socket, { channel, percent: original.percentage });
    }
    this.servos = this.servos.map(s => (s.center === channel ? { ...s } : s));
    return original;
  }

  constructor() {
    const storedServos: null | string = localStorage.getItem(this.storeKey);
    if (!storedServos) {
      this.servos = new Array(8).fill({}, 0, 8).map(
        (_v, i) =>
          ({
            channel: i,
            min: 0,
            max: 180,
            center: 90,
            plainValue: 90,
            percentage: 0
          } as Servo)
      );
    } else {
      this.servos = JSON.parse(storedServos);
    }
  }
}
