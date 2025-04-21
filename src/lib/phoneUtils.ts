export const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters
  const numbers = value.replace(/\D/g, '');

  // Return empty string if no numbers
  if (numbers.length === 0) return '';

  // Ensure the first digit is 0
  if (numbers[0] !== '0') return '';

  // Format the number as: 0 (111) 111 11 11
  let formatted = '0';
  if (numbers.length > 1)
  {
    formatted += ' (';
    formatted += numbers.slice(1, 4);
    if (numbers.length > 4)
    {
      formatted += ') ' + numbers.slice(4, 7);
      if (numbers.length > 7)
      {
        formatted += ' ' + numbers.slice(7, 9);
        if (numbers.length > 9)
        {
          formatted += ' ' + numbers.slice(9, 11);
        }
      }
    }
  }

  return formatted;
};