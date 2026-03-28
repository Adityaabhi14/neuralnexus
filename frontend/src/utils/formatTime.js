/* src/utils/formatTime.js */
export function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return `${seconds} seconds ago`;
  else if (minutes < 60) return `${minutes} minutes ago`;
  else if (hours < 24) return `${hours} hours ago`;
  else if (days === 1) return `1 day ago`;
  else return `${days} days ago`;
}
