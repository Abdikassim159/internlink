
import { useState, useEffect } from 'react';

const CompanyStats = ({ stats }) => {
  const [animatedStats, setAnimatedStats] = useState({
    totalCompanies: 0,
    totalJobs: 0,
    avgRating: 0
  });

  useEffect(() => {
    const duration = 1500;
    const steps = 30;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setAnimatedStats({
        totalCompanies: Math.min(Math.round(stats.totalCompanies * progress), stats.totalCompanies),
        totalJobs: Math.min(Math.round(stats.totalJobs * progress), stats.totalJobs),
        avgRating: Math.min(Number((stats.avgRating * progress).toFixed(1)), stats.avgRating)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [stats]);

  return (
    <div className="flex flex-wrap justify-center gap-8">
      <div className="text-center">
        <p className="text-4xl md:text-5xl font-bold text-white mb-1">
          {animatedStats.totalCompanies}+
        </p>
        <p className="text-blue-200 text-sm uppercase tracking-wider">Partner Companies</p>
      </div>
      <div className="text-center">
        <p className="text-4xl md:text-5xl font-bold text-white mb-1">
          {animatedStats.totalJobs}+
        </p>
        <p className="text-blue-200 text-sm uppercase tracking-wider">Open Positions</p>
      </div>
      <div className="text-center">
        <p className="text-4xl md:text-5xl font-bold text-white mb-1">
          {animatedStats.avgRating} ★
        </p>
        <p className="text-blue-200 text-sm uppercase tracking-wider">Average Rating</p>
      </div>
    </div>
  );
};

export default CompanyStats;
