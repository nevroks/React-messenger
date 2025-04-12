export const formatFileSize = (
    size: number, 
    locales: string = 'en-US', 
    decimalPlaces: number = 1
  ): string => {
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let unitIndex = 0;
    let adjustedSize = size;
  
    while (adjustedSize >= 1024 && unitIndex < units.length - 1) {
      adjustedSize /= 1024;
      unitIndex++;
    }
  
    const formatter = new Intl.NumberFormat(locales, {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    });
  
    return `${formatter.format(adjustedSize)} ${units[unitIndex]}`;
  };