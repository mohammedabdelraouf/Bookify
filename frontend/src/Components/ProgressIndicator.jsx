const ProgressIndicator = ({ currentStep = 2 }) => {
  const steps = [
    { number: 1, label: 'Select Room', icon: '🏨' },
    { number: 2, label: 'Enter Details', icon: '📝' },
    { number: 3, label: 'Payment', icon: '💳' },
    { number: 4, label: 'Confirmation', icon: '✓' }
  ];

  return (
    <div className='w-full max-w-4xl mx-auto mb-8'>
      <div className='relative'>
        {/* Progress Bar Background */}
        <div className='absolute top-5 left-0 w-full h-1 bg-gray-200'>
          {/* Progress Bar Fill */}
          <div
            className='h-full bg-teal-600 transition-all duration-500'
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>

        {/* Steps */}
        <div className='relative flex justify-between'>
          {steps.map((step) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            const isPending = currentStep < step.number;

            return (
              <div key={step.number} className='flex flex-col items-center'>
                {/* Step Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    isCompleted
                      ? 'bg-teal-600 text-white'
                      : isCurrent
                      ? 'bg-teal-600 text-white ring-4 ring-teal-200'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? (
                    <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>

                {/* Step Label */}
                <div className='mt-2 text-center'>
                  <p
                    className={`text-sm font-medium transition-colors ${
                      isCurrent ? 'text-teal-600' : isPending ? 'text-gray-400' : 'text-gray-700'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
