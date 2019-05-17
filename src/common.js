const pushToList = (list, element) => list ? [...list, element] : [element];

export const groupBy = (groupFunc) => (list) => list.reduce(
  (acc, item) => ({
    ...acc,
    [groupFunc(item)]: pushToList(acc[groupFunc(item)], item)
  }), {});

