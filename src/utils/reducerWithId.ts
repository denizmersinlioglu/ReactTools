import { reduce } from "ramda";

interface Identifiable {
  id: string | number;
}

export const reduceWithId = (array: Identifiable[]) => {
  return reduce(
    (acc, element) => ({ ...acc, [element.id]: element }),
    {},
    array
  );
};
