import { Subject } from "rxjs";
import { withDevice } from "@ledgerhq/live-common/hw/deviceAccess";
import { DisconnectedDeviceDuringOperation, serializeError } from "@ledgerhq/errors";
import {
  transportCloseChannel,
  transportExchangeChannel,
  transportExchangeBulkChannel,
  transportOpenChannel,
} from "~/config/transportChannels";

type APDUMessage =
  | { type: "exchange"; apduHex: string; requestId: string }
  | { type: "exchangeBulk"; apdusHex: string[]; requestId: string };

const transports = new Map<string, Subject<APDUMessage>>();
const transportsBulkSubscriptions = new Map<string, { unsubscribe: () => void }>();
// TODO transportsBulkSubscriptions isn't used yet, but I think we need to propagate the information of an interruption.

export const transportOpen = ({
  data,
  requestId,
}: {
  data: { descriptor: string };
  requestId: string;
}) => {
  const subjectExist = transports.get(data.descriptor);

  const onEnd = () => {
    process.send?.({
      type: transportOpenChannel,
      data,
      requestId,
    });
  };

  // If already exists simply return success
  if (subjectExist) {
    return onEnd();
  }

  withDevice(data.descriptor)(transport => {
    const subject = new Subject<APDUMessage>();
    subject.subscribe({
      next: e => {
        if (e.type === "exchange") {
          transport
            .exchange(Buffer.from(e.apduHex, "hex"))
            .then(response =>
              process.send?.({
                type: transportExchangeChannel,
                data: response.toString("hex"),
                requestId: e.requestId,
              }),
            )
            .catch(error =>
              process.send?.({
                type: transportExchangeChannel,
                error: serializeError(error),
                requestId: e.requestId,
              }),
            );
        } else if (e.type === "exchangeBulk") {
          const apdus = e.apdusHex.map(apduHex => Buffer.from(apduHex, "hex"));
          const subscription = transport.exchangeBulk(apdus, {
            next: response => {
              process.send?.({
                type: transportExchangeBulkChannel,
                data: response.toString("hex"),
                requestId: e.requestId,
              });
            },
            error: error => {
              process.send?.({
                type: transportExchangeBulkChannel,
                error: serializeError(error),
                requestId: e.requestId,
              });
            },
            complete: () => {
              process.send?.({
                type: transportExchangeBulkChannel,
                requestId: e.requestId,
              });
            },
          });
          transportsBulkSubscriptions.set(e.requestId, subscription);
        }
      },
      complete: () => {
        transports.delete(data.descriptor);
      },
    });

    transports.set(data.descriptor, subject);

    onEnd();

    return subject;
  }).subscribe({
    error: error => {
      process.send?.({
        type: transportOpenChannel,
        error: serializeError(error),
        requestId,
      });
    },
  });
};

export const transportExchange = ({
  data,
  requestId,
}: {
  data: { descriptor: string; apduHex: string };
  requestId: string;
}) => {
  const subject = transports.get(data.descriptor);
  if (!subject) {
    process.send?.({
      type: transportExchangeChannel,
      error: serializeError(
        new DisconnectedDeviceDuringOperation("No open transport for the given descriptor"),
      ),
      requestId,
    });
    return;
  }
  subject.next({ type: "exchange", apduHex: data.apduHex, requestId });
};

export const transportExchangeBulk = ({
  data,
  requestId,
}: {
  data: { descriptor: string; apdusHex: string[] };
  requestId: string;
}) => {
  const subject = transports.get(data.descriptor);
  if (!subject) {
    process.send?.({
      type: transportExchangeBulkChannel,
      error: serializeError(
        new DisconnectedDeviceDuringOperation("No open transport for the given descriptor"),
      ),
      requestId,
    });
    return;
  }
  // apduHex isn't used for bulk case
  subject.next({ type: "exchangeBulk", apdusHex: data.apdusHex, requestId });
};

export const transportClose = ({
  data,
  requestId,
}: {
  data: { descriptor: string };
  requestId: string;
}) => {
  const subject = transports.get(data.descriptor);
  if (!subject) {
    process.send?.({
      type: transportCloseChannel,
      error: serializeError(
        new DisconnectedDeviceDuringOperation("No open transport for the given descriptor"),
      ),
      requestId,
    });
    return;
  }
  subject.subscribe({
    complete: () => {
      process.send?.({
        type: transportCloseChannel,
        data,
        requestId,
      });
    },
  });
  subject.complete();
};
