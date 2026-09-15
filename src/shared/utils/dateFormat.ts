const locale = 'es-PE';

export const formatTaskDate = (isoDate: string) =>
  new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoDate));

export const formatLongTaskDate = (isoDate: string) => {
  const formatted = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoDate));

  return formatted.charAt(0).toLocaleLowerCase(locale) + formatted.slice(1);
};
