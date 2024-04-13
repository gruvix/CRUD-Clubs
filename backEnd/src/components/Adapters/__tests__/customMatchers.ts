export function toMatchObjectExcept(
  received: object,
  expected: object,
  excludedProperties: string[] = [],
) {
  const receivedCopy = JSON.parse(JSON.stringify(received));
  const expectedCopy = JSON.parse(JSON.stringify(expected));

  excludedProperties.forEach((prop: string) => {
    delete receivedCopy[prop];
    delete expectedCopy[prop];
  });

  const pass = this.equals(receivedCopy, expectedCopy);

  const message = pass
    ? () =>
        `${this.utils.matcherHint('toMatchObjectExcept')} \n\n Expected value not to match except for excluded properties: \n ${this.utils.printExpected(expectedCopy)}\n Received: \n ${this.utils.printReceived(receivedCopy)}`
    : () =>
        `${this.utils.matcherHint('toMatchObjectExcept')} \n\n Expected value to match except for excluded properties: \n ${this.utils.printExpected(expectedCopy)}\n Received: \n ${this.utils.printReceived(receivedCopy)}`;

  return { pass, message };
}
