export function formatDate(date, showWeekDay = true) {
  let format = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  if (showWeekDay) format = { ...format, weekday: "long" };
  return new Intl.DateTimeFormat("en", format).format(new Date(date));
}

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}
