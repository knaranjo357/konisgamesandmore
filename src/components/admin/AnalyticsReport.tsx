import React from 'react';

const AnalyticsReport: React.FC = () => {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-white mb-4">
        Analytics Dashboard
      </h2>
      <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg border border-gray-700">
        <iframe
          width="100%"
          height="600"
          src="https://lookerstudio.google.com/embed/reporting/fcb2f55f-2740-4a8c-918a-0fb61ae10b30/page/C4bPF"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default AnalyticsReport;
