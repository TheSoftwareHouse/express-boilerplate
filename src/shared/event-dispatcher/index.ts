import { Logger } from "../logger";

export interface Event {
  name: string;
  payload: {};
}

export type EventSubscribersMeta = { name: string; method: string };

export interface EventSubscriberInterface {
  getSubscribedEvents(): EventSubscribersMeta[];
}

export type Subscriber = (event: Event) => Promise<void>;

type Subscribers = { name: string; subscriber: Subscriber };

export class EventDispatcher {
  private logger: Logger;

  private subscribers: Subscribers[] = [];

  constructor(logger: Logger, eventSubscribers: EventSubscriberInterface[] = []) {
    if (eventSubscribers) {
      this.addSubscribers(eventSubscribers);
    }

    this.logger = logger;
  }

  public subscribe(name: string, subscriber: Subscriber) {
    this.subscribers.push({ name, subscriber });
  }

  public addSubscribers(subscribers: EventSubscriberInterface[]) {
    subscribers.forEach((subscriber) => this.addSubscriber(subscriber));
  }

  public addSubscriber(subscriber: EventSubscriberInterface) {
    if (subscriber.getSubscribedEvents().length === 0) {
      return;
    }

    const subscribers = subscriber.getSubscribedEvents().map(({ name, method }) => ({
      name,
      subscriber: (subscriber as any)[method].bind(subscriber),
    }));

    this.subscribers.push(...subscribers);
  }

  public async dispatch(event: Event) {
    this.logger.debug(`Dispatching event ${event.name}@${JSON.stringify(event.payload)}`);

    const promises = this.subscribers
      .filter((s) => s.name === event.name)
      .map(({ subscriber }) =>
        subscriber(event).catch((e) => this.logger.debug(`Subscriber failed to handle event ${event.name}`, e)),
      );

    await Promise.all(promises);
  }
}
