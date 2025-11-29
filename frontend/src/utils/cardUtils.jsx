// Format card number with spaces (1234 5678 9012 3456)
export const formatCardNumber = (value) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || '';
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(' ');
  } else {
    return value;
  }
};

// Format expiry date (MM/YY)
export const formatExpiryDate = (value) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');

  if (v.length >= 2) {
    return v.slice(0, 2) + (v.length > 2 ? '/' + v.slice(2, 4) : '');
  }

  return v;
};

// Format CVV (3-4 digits)
export const formatCVV = (value) => {
  return value.replace(/[^0-9]/gi, '').slice(0, 4);
};

// Validate card number - only check length (13-19 digits)
export const validateCardNumber = (cardNumber) => {
  const value = cardNumber.replace(/\s+/g, '');
  // Just check if it's between 13-19 digits, no Luhn algorithm
  return /^\d{13,19}$/.test(value);
};

// Validate expiry date
export const validateExpiryDate = (expiryDate) => {
  const parts = expiryDate.split('/');

  if (parts.length !== 2) {
    return false;
  }

  const month = parseInt(parts[0], 10);
  const year = parseInt('20' + parts[1], 10);

  if (month < 1 || month > 12) {
    return false;
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false;
  }

  return true;
};

// Validate CVV
export const validateCVV = (cvv) => {
  return /^\d{3,4}$/.test(cvv);
};

// Detect card type from number
export const getCardType = (cardNumber) => {
  const value = cardNumber.replace(/\s+/g, '');

  if (/^4/.test(value)) {
    return 'visa';
  } else if (/^5[1-5]/.test(value)) {
    return 'mastercard';
  } else if (/^3[47]/.test(value)) {
    return 'amex';
  } else if (/^6(?:011|5)/.test(value)) {
    return 'discover';
  }

  return 'unknown';
};

// Get card icon component
export const getCardIcon = (cardType) => {
  const icons = {
    visa: (
      <svg className='h-8' viewBox='0 0 48 32' fill='none'>
        <rect width='48' height='32' rx='4' fill='#1434CB'/>
        <path d='M18.5 11.5h2.8l-1.7 9h-2.8l1.7-9zm8.3 5.8l1.5-4.1.9 4.1h-2.4zm3.2 3.2h2.6l-2.3-9h-2.4c-.5 0-1 .3-1.2.8l-4.2 8.2h3l.6-1.6h3.7l.2 1.6zm-7.5-5.9c0 2.4-3.3 2.5-3.3 3.6 0 .3.3.7 1 .8.7.1 1.5.1 2.2-.2l.4 1.8c-.5.2-1.2.4-2.1.4-2.8 0-4.8-1.5-4.8-3.6 0-1.6 1.4-2.4 2.5-2.9 1.1-.6 1.5-1 1.5-1.5 0-.8-.9-1.2-1.8-1.2-1.5 0-2.3.2-2.3.2l-.4-1.9s1-.4 2.7-.4c3 0 5 1.5 5 3.9z' fill='white'/>
      </svg>
    ),
    mastercard: (
      <svg className='h-8' viewBox='0 0 48 32' fill='none'>
        <rect width='48' height='32' rx='4' fill='#EB001B'/>
        <circle cx='18' cy='16' r='9' fill='#FF5F00'/>
        <circle cx='30' cy='16' r='9' fill='#F79E1B'/>
      </svg>
    ),
    amex: (
      <svg className='h-8' viewBox='0 0 48 32' fill='none'>
        <rect width='48' height='32' rx='4' fill='#006FCF'/>
        <text x='24' y='20' fontSize='10' fill='white' fontWeight='bold' textAnchor='middle'>AMEX</text>
      </svg>
    ),
    discover: (
      <svg className='h-8' viewBox='0 0 48 32' fill='none'>
        <rect width='48' height='32' rx='4' fill='#FF6000'/>
        <text x='24' y='20' fontSize='8' fill='white' fontWeight='bold' textAnchor='middle'>DISCOVER</text>
      </svg>
    ),
    unknown: (
      <svg className='h-8 w-12' viewBox='0 0 48 32' fill='none'>
        <rect width='48' height='32' rx='4' fill='#9CA3AF' stroke='#6B7280' strokeWidth='1'/>
        <path d='M12 16h24M12 12h16M12 20h20' stroke='white' strokeWidth='2' strokeLinecap='round'/>
      </svg>
    )
  };

  return icons[cardType] || icons.unknown;
};
