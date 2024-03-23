export function getFormatDate(format: string, date = new Date()) {
  return format.replace(/(d+|y+|m+)/g, (match) => {
    if (match === 'yy') {
      return date.getFullYear().toString().slice(2);
    }
    if (match === 'yyyy') {
      return date.getFullYear() + '';
    }

    if (match === 'mm') {
      return fillZero(date.getMonth() + 1);
    }
    if (match === 'm') {
      return date.getMonth() + 1 + '';
    }

    if (match === 'dd') {
      return fillZero(date.getDate());
    }

    if (match === 'd') {
      return date.getDate() + '';
    }

    return match;
  });
}

function fillZero(value: number) {
  return value < 10 ? `0${value}` : value + '';
}
