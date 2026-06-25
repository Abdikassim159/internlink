// src/components/Home/TrustedBy.jsx

const TrustedBy = () => {
  const institutions = [
    { name: "Safaricom", logo: "https://www.safaricom.co.ke/images/safaricom-25.gif" },
    { name: "KCB Bank", logo: "https://ke.kcbgroup.com/imgs/kcb-bank.png" },
    { name: "Equity Bank", logo: "https://equitygroupholdings.com/ke/ke/Content/assets/img/equity-bank-logo.png" },
    { name: "KCA University", logo: "https://www.kcau.ac.ke/wp-content/uploads/2022/06/KCAU-logo.svg" },
    { name: "Strathmore University", logo: "https://strathmore.edu/wp-content/uploads/2025/12/logo.png" },
    { name: "University of Nairobi", logo: "https://www.uonbi.ac.ke/sites/default/files/UoN_Logo.png" },
    { name: "Moi university", logo: "https://oldsite.mu.ac.ke/images/demo/default/logo/logo.svg" },
    
    
  ];

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-blue-900 font-semibold text-sm mb-2">TRUSTED BY TOP INSTITUTIONS IN KENYA</p>
        </div>

        {/* Logos in a simple row - NO CARDS, just images inline */}
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
          {institutions.map((institution, index) => (
            <div key={index} className="flex items-center justify-center">
              <img 
                src={institution.logo}
                alt={institution.name}
                className="h-8 md:h-10 w-auto object-contain opacity-70 hover:opacity-100 transition cursor-pointer"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://placehold.co/120x40/e2e8f0/1e3a8a?text=${institution.name.charAt(0)}`;
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustedBy;