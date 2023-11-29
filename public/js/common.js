function timeFormat(current, previous) {
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;
  
    const diff = current - previous;
    if (diff < msPerMinute) {
      if (diff / 1000 < 30) return "Just Now";
      return Math.round(diff / 1000) + "seconds ago";
    } else if (diff < msPerHour) {
      return Math.round(diff / msPerMinute) + "minutes ago";
    } else if (diff < msPerDay) {
      return Math.round(diff / msPerHour) + "hours ago";
    } else if (diff < msPerMonth) {
      return Math.round(diff / msPerDay) + "days ago";
    } else if (diff < msPerYear) {
      return Math.round(diff / msPerMonth) + "months ago";
    } else {
      return Math.round(diff / msPerYear) + "years ago";
    }
  }
  