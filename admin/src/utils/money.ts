export const formatVND = (val: number) => {
  return (val * 1000).toLocaleString("vi-VN") + " VND";
};