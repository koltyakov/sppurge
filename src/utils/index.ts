export const formatTime = (date: Date) => {
  let hh = ('0' + date.getHours()).slice(-2);
  let mm = ('0' + date.getMinutes()).slice(-2);
  let ss = ('0' + date.getSeconds()).slice(-2);
  return `${hh}:${mm}:${ss}`;
};

export const escapeURIComponent = (input: string): string => {
  return encodeURIComponent(input.replace(/'/g, '%27'));
};
