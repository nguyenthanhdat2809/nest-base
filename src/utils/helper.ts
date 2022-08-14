export const getDaysArray = function (start, end) {
  const arr = [];
  for (
    let dt = new Date(start);
    dt.setHours(0, 0, 0, 0) <= new Date(end).setHours(0, 0, 0, 0);
    dt.setDate(dt.getDate() + 1)
  ) {
    arr.push(new Date(dt));
  }
  return arr;
};

export const getDaysBetweenDates = (start, end) => {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const firstDate: any = new Date(start);
  const secondDate: any = new Date(end);

  return Math.round(Math.abs((firstDate - secondDate) / oneDay)) + 1;
};