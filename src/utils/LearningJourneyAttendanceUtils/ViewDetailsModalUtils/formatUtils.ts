export const getCalculatedSessionType = (startTime: string): string => {
  if (!startTime) return "";
  try {
    const [hours] = startTime.split(':').map(Number);
    return hours < 12 ? 'AM' : 'PM';
  } catch {
    return startTime;
  }
};

export const formatTime = (timeString: string): string => {
  if (!timeString) return "-";
  try {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-SG", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return timeString;
  }
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toISOString().split('T')[0];
  } catch {
    return dateString;
  }
};

export const formatDisplayDate = (dateString: string): string => {
  if (!dateString) return "-";
  try {
    return new Date(dateString).toLocaleDateString('en-SG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
  }).format(amount);
};

export const calculateAttendanceRate = (attended: number, registered: number): string => {
  if (registered === 0) return "-";
  return `${((attended / registered) * 100).toFixed(1)}%`;
};