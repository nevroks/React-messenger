export const formattedTimer = (timer: number): string => {
    return `00:${timer.toString().padStart(2, "0")}`;
  };
  