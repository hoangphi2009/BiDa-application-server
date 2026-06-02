/**
 * Tính số phút chơi (làm tròn lên)
 */
export const calcPlayingMinutes = (startTime, endTime) => {
  const diffMs = endTime - startTime;
  return Math.ceil(diffMs / 60000);
};

/**
 * Tính tiền giờ chơi, làm tròn lên bội số 500đ gần nhất
 */
export const calcSessionCost = (totalMinutes, pricePerHour) => {
  const pricePerMinute = pricePerHour / 60;
  const rawCost = totalMinutes * pricePerMinute;
  return Math.ceil(rawCost / 500) * 500;
};
