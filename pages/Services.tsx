import React from 'react';
import { Link } from 'react-router-dom';
import { AirtimeIcon, BillsIcon, DepositIcon, ExamPinIcon, SendIcon, WithdrawIcon, DataIcon, BettingIcon, TVIcon, ElectricityIcon, ChevronRightIcon, WaterIcon, SchoolIcon, LoanIcon, GroupSavingsIcon } from '../components/icons';

const ServiceCategory: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h2 className="px-4 text-sm font-bold text-text-muted-light dark:text-text-muted-dark mb-2 uppercase">{title}</h2>
        <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm">
            {children}
        </div>
    </div>
);

const ServiceItem: React.FC<{ icon: React.ReactNode; title: string; subtitle: string; to: string; }> = ({ icon, title, subtitle, to }) => (
    <Link to={to} className="w-full flex items-center p-4 border-b border-slate-100 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
        <div className="w-10 h-10 flex items-center justify-center mr-4">
            {icon}
        </div>
        <div className="flex-1 text-left">
            <p className="font-bold text-text-light dark:text-text-dark">{title}</p>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">{subtitle}</p>
        </div>
        <ChevronRightIcon />
    </Link>
);

const Services: React.FC = () => {
    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-6 px-2">All Services</h1>

            <ServiceCategory title="Finance">
                <ServiceItem icon={<DepositIcon />} title="Add Money" subtitle="Via Bank Transfer or Card" to="/add-money" />
                <ServiceItem icon={<WithdrawIcon />} title="Withdraw" subtitle="To Bank Account" to="/withdraw" />
                <ServiceItem icon={<SendIcon />} title="Transfer" subtitle="To FinXchange or Bank" to="/transfer" />
                <ServiceItem icon={<LoanIcon />} title="Loans" subtitle="Apply for quick and easy loans" to="/app/loans" />
                <ServiceItem icon={<GroupSavingsIcon />} title="Group Savings" subtitle="Save together with friends (Ajo/Esusu)" to="/app/group-savings" />
            </ServiceCategory>
            
            <ServiceCategory title="Airtime & Bills">
                <ServiceItem icon={<AirtimeIcon />} title="Airtime" subtitle="Top-up any mobile number" to="/airtime" />
                <ServiceItem icon={<DataIcon />} title="Data" subtitle="Buy mobile data bundles" to="/data" />
                <ServiceItem icon={<TVIcon />} title="TV" subtitle="Pay DSTV, GOTV and more" to="/tv" />
                <ServiceItem icon={<ElectricityIcon />} title="Electricity" subtitle="Pay your electricity bills" to="/electricity" />
                 <ServiceItem icon={<WaterIcon />} title="Water" subtitle="Pay your water bills" to="/water-bill" />
                <ServiceItem icon={<BillsIcon />} title="Internet" subtitle="Pay for Smile, Spectranet, etc." to="/internet" />
            </ServiceCategory>

            <ServiceCategory title="Education & More">
                <ServiceItem icon={<ExamPinIcon />} title="Exam PINs" subtitle="WAEC, NECO, JAMB" to="/exam-pin" />
                <ServiceItem icon={<SchoolIcon />} title="School Fees" subtitle="Pay tuition and other fees" to="/school-fees" />
                <ServiceItem icon={<BettingIcon />} title="Betting" subtitle="Fund your betting accounts" to="/betting" />
            </ServiceCategory>
        </div>
    );
};

export default Services;