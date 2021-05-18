const getDate = () => {
  const today = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  const isoDate = new Date().toISOString().slice(0,10)

  return {
    day: today.toLocaleString("en-US", options),
    year: today.getFullYear(),
    isoDate
  };
}

module.exports = getDate()