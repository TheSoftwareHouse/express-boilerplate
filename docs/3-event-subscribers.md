## Event Subscribers

Our system allow you to dispatch and handle in-app specific events. You can use it to log some user actions or for example send an email after user creation.

If you wan to use this functionality, you need to create a subscriber.

A good practice is to put your subscribers in **subscribers** directory of coresponding feature. A simple subscriber looks like this:

```
import { Event, EventSubscriberInterface, EventSubscribersMeta } from "@tshio/event-dispatcher";
import { Logger } from "@tshio/logger";

type EmailEventSubscriberDependencies = {
  logger: Logger;
};

/**
 * Example subscriber
 */
export default class EmailEventSubscriber implements EventSubscriberInterface {
  public constructor(private dependencies: EmailEventSubscriberDependencies) {}

  /**
   * Register events and listeners
   * @example
   * return [
   *  { 'name': 'TestEvent', method: 'sendEmail' }
   * ]
   */
  getSubscribedEvents(): EventSubscribersMeta[] {
    return [{ name: "UserLoggedIn", method: "logUserLogin" }];
  }

  public async logUserLogin(event: Event) {
    this.dependencies.logger.info("User logged in", event.payload);
  }
}
```

It will react on **UserLoggedIn** event and call a method named **logUserLogin**.

In order to run it, we need to dispatch such event using **eventDispatcher**.

```
await this.eventDispatcher.dispatch({
  name: "UserLoggedIn",
  payload: {
    "some":"custom-event-data"
  },
});
```

A single subscriber can handle multiple events. 
A single event can be handled by multiple subscribers.
