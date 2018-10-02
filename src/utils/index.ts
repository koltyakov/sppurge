export const formatTime = (date: Date) => {
  let hh = ('0' + date.getHours()).slice(-2);
  let mm = ('0' + date.getMinutes()).slice(-2);
  let ss = ('0' + date.getSeconds()).slice(-2);
  return `${hh}:${mm}:${ss}`;
};

export const escapeURIComponent = (input: string): string => {
  return encodeURIComponent(input.replace(/'/g, '%27'));
};

export const trimMultiline = (multiline: string): string => {
  return multiline
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('').trim();
};

export const isUrlHttps = (url: string): boolean => {
  return url.split('://')[0].toLowerCase() === 'https';
};

export const escapeUriPath = (url: string): string => {
  return encodeURIComponent(decodeURIComponent(
    url.toLowerCase()
  ))
    .replace(/%3A/g, ':')
    .replace(/%2F/g, '/');
};
