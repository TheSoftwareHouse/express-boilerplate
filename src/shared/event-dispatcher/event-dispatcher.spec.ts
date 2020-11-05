import { deepEqual, fail } from "assert";
import { use } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import "mocha";
import { Event, EventDispatcher, EventSubscriberInterface } from ".";
import { delay, SpiedObject } from "../../tools/tests";
import { winstonLogger } from "../logger";

use(chaiAsPromised);

type StubSubscriber = EventSubscriberInterface & {
  logEmail(event: Event): Promise<void>;
  sendEmail(event: Event): Promise<void>;
};

const stubSubscriber = ({
  getSubscribedEvents() {
    return [
      { name: "userCreated", method: "sendEmail" },
      { name: "testEvent", method: "logEmail" },
    ];
  },

  async logEmail(event: Event) {
    stubSubscriber.logEmail.calledWith = event;
  },

  async sendEmail(event: Event) {
    stubSubscriber.sendEmail.calledWith = event;
  },
} as unknown) as SpiedObject<StubSubscriber>;

describe("event dispatcher", () => {
  it("it support event subscribers", async () => {
    const dispatcher = new EventDispatcher(winstonLogger);
    dispatcher.addSubscriber(stubSubscriber);

    const testEvent = { name: "testEvent", payload: { foo: 1, bar: 2, baz: 3 } };
    const userCreatedEvent = { name: "userCreated", payload: { userId: 1 } };

    dispatcher.dispatch(testEvent);
    dispatcher.dispatch(userCreatedEvent);

    deepEqual(stubSubscriber.logEmail.calledWith, testEvent);
    deepEqual(stubSubscriber.sendEmail.calledWith, userCreatedEvent);
  });

  it("it support inline event subscribers", async () => {
    const dispatcher = new EventDispatcher(winstonLogger);

    const stubEvent = {
      name: "test",
      payload: {
        foo: 1,
        bar: 2,
        baz: 3,
      },
    };

    dispatcher.subscribe("test", async (event) => {
      deepEqual(event, stubEvent);
    });

    dispatcher.subscribe("test2", async () => {
      fail("event was not fired");
    });

    dispatcher.dispatch(stubEvent);
  });

  it("it support async operations", (done) => {
    const dispatcher = new EventDispatcher(winstonLogger);

    const stubEvent = {
      name: "testAsync",
      payload: {
        foo: 1,
        bar: 2,
        baz: 3,
      },
    };

    dispatcher.subscribe("testAsync", async (event) => {
      await delay(10);
      deepEqual(event, stubEvent);
      done();
    });

    dispatcher.dispatch(stubEvent);
  });

  it("Error thrown by a Subscriber should not block the execution of any further Subscriber", (done) => {
    const dispatcher = new EventDispatcher(winstonLogger);

    dispatcher.addSubscriber(stubSubscriber);

    dispatcher.subscribe("test", async () => {
      await delay(10);
      throw new Error("SomethingBadHappend");
    });

    dispatcher.subscribe("test", async () => {
      await delay(20);
      winstonLogger.debug("Event handled");
    });

    dispatcher
      .dispatch({
        name: "test",
        payload: { foo: 1 },
      })
      .finally(() => done());
  });
});
