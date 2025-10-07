
import React from 'react';

const iconProps = {
    className: "w-6 h-6",
    strokeWidth: 2,
    fill: "none",
    stroke: "currentColor"
};

export const HomeIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
    </svg>
);

export const SaveIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a.75.75 0 000-1.5.75.75 0 000 1.5zM12 12.75h.008v.008H12v-.008zM12 12.75c.621 0 1.125-.504 1.125-1.125V9.375a3.375 3.375 0 00-6.75 0V11.25c0 .621.504 1.125 1.125 1.125z" />
    </svg>
);

export const TransactionsIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const SupportIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
);

export const ProfileIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const VoiceIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5a6 6 0 00-12 0v1.5a6 6 0 006 6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 12v.75a7.5 7.5 0 01-15 0V12" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75v2.25" />
    </svg>
);


export const AirtimeIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </svg>
);


export const BillsIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

export const CreditIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const DebitIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const DepositIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h6m3-5.25H21m-3 2.25H21m-3 2.25H21M4.5 21a2.25 2.25 0 002.25-2.25V5.25A2.25 2.25 0 004.5 3h-1.5a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 003 21h1.5z" />
    </svg>
);

export const ExamPinIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM16.5 18.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75h7.5m-15 0h7.5" />
    </svg>
);

export const SendIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
);

export const WithdrawIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0H21m-9 6h9M3.75 9h.008v.008H3.75V9zm0 3h.008v.008H3.75v-3zm0 3h.008v.008H3.75v-3z" />
    </svg>
);

export const ScanIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5A.75.75 0 014.5 3.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM3.75 19.5a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM19.5 4.5a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM19.5 19.5a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75h6" />
    </svg>
);

export const NotificationIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.31 6.032l-1.42 1.42a2.25 2.25 0 001.59 3.842h15.358a2.25 2.25 0 001.59-3.842l-1.42-1.42zM12 14.25a.75.75 0 01.75.75v.01a.75.75 0 01-1.5 0v-.01a.75.75 0 01.75-.75z" />
    </svg>
);

export const DataIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 6.75h15M4.5 12h15m-15 5.25h7.5" />
    </svg>
);

export const BettingIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
);

export const TVIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3.75v3.75m-3.75-3.75h7.5c1.24 0 2.25-1.01 2.25-2.25v-7.5c0-1.24-1.01-2.25-2.25-2.25h-7.5c-1.24 0-2.25 1.01-2.25 2.25v7.5c0 1.24 1.01 2.25 2.25 2.25z" />
    </svg>
);

export const ElectricityIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
);

export const MoreIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

export const EyeIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const EyeOffIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.98 8.223A10.477 10.477 0 001.95 12c0 1.221.324 2.368.895 3.37.693 1.256 1.633 2.317 2.73 3.122m1.94-1.286A8.973 8.973 0 0112 15c2.485 0 4.73-.848 6.44-2.276.593-.456 1.12-.964 1.558-1.52m-2.15-4.195A8.973 8.973 0 0012 9c-2.485 0-4.73.848-6.44 2.276A49.949 49.949 0 0012 15m-1.42-2.11a1 1 0 011.414 0l.429.429a1 1 0 010 1.414l-1.428 1.428a1 1 0 01-1.415 0l-.428-.428a1 1 0 010-1.414l1.428-1.428z" />
    </svg>
);

export const ChevronRightIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
);

export const ArrowLeftIcon: React.FC = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
);

export const ServicesIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 8.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6A2.25 2.25 0 0115.75 3.75h2.25A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75A2.25 2.25 0 0115.75 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
);

export const PlusIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
    </svg>
);

export const XIcon: React.FC = () => (
    <svg {...iconProps} className="w-5 h-5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const LoanIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0H21M3 13.5h6.75m6.75 0H21" />
    </svg>
);

export const GroupSavingsIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zM10.5 18.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zM10.5 18.75v-7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 18.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />
    </svg>
);

export const ReferralIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zM10.5 18.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zM10.5 18.75v-7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 18.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />
    </svg>
);

export const ChatIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.544-.467 1.125 1.125 0 01-.467-1.318l.8-2.4a1.125 1.125 0 00-.467-1.318A8.25 8.25 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
);

export const WaterIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 00.99-17.904A9 9 0 0012 2.997c-2.934 0-5.597 1.4-7.237 3.513M8.25 12a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0z" />
    </svg>
);

export const SchoolIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v6m-6-3h12" />
    </svg>
);

export const LanguageIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.625M21 21l-5.25-11.625M3 18.375V5.625m18 0V12.375m0-6.75H3" />
    </svg>
);

export const LogoutIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
);

export const NigeriaFlagIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className || "w-6 h-5 rounded-sm"} viewBox="0 0 3 2">
        <rect width="3" height="2" fill="#fff"/>
        <rect width="1" height="2" fill="#008751"/>
        <rect width="1" height="2" x="2" fill="#008751"/>
    </svg>
);

export const UKFlagIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className || "w-6 h-5 rounded-sm"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30">
        <clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
        <clipPath id="t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
        <g clipPath="url(#s)">
            <path d="M0,0 v30 h60 v-30 z" fill="#00247d"/>
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
            <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#cf142b" strokeWidth="4"/>
            <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
            <path d="M30,0 v30 M0,15 h60" stroke="#cf142b" strokeWidth="6"/>
        </g>
    </svg>
);

export const SearchIcon: React.FC = () => (
    <svg {...iconProps} className="w-5 h-5 text-text-muted-light dark:text-text-muted-dark" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

export const CardIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h6m3-5.25H21m-3 2.25H21m-3 2.25H21M4.5 21a2.25 2.25 0 002.25-2.25V5.25A2.25 2.25 0 004.5 3h-1.5a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 003 21h1.5z" />
    </svg>
);

export const FreezeIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
);

export const SettingsIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.007 1.11-1.226l.56-1.06a1.125 1.125 0 012.132 0l.56 1.06c.55.219 1.02.684 1.11 1.226l.16.963c.27.164.53.35.776.564l.87-.349a1.125 1.125 0 011.317 1.317l-.35.87c.213.245.4.505.563.776l.963.16c.542.09.944.444 1.226 1.11l1.06.56a1.125 1.125 0 010 2.132l-1.06.56c-.283.55-.784 1.02-1.226 1.11l-.963.16c-.164.27-.35.53-.564.776l.35.87a1.125 1.125 0 01-1.317 1.317l-.87-.35c-.245.213-.505.4-.776.563l-.16.963c-.09.542-.56 1.007-1.11 1.226l-.56 1.06a1.125 1.125 0 01-2.132 0l-.56-1.06c-.55-.219-1.02-.684-1.11-1.226l-.16-.963a4.954 4.954 0 01-.776-.564l-.87.35a1.125 1.125 0 01-1.317-1.317l.35-.87a4.95 4.95 0 01-.563-.776l-.963-.16c-.542-.09-1.007-.56-1.226-1.11l-1.06-.56a1.125 1.125 0 010-2.132l1.06-.56c.283-.55.784-1.02 1.226-1.11l.16-.963c.164-.27.35-.53.564-.776l-.35-.87a1.125 1.125 0 011.317-1.317l.87.35a4.953 4.953 0 01.776-.564l.16-.963zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />
    </svg>
);

export const BiometricIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.071 5.071a11.314 11.314 0 0113.858 0M6.485 6.485a9.143 9.143 0 0111.03 0M7.899 7.899a7 7 0 018.202 0M9.314 9.314a4.857 4.857 0 015.372 0M12 12.75a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75z"></path></svg>
);

export const ShieldCheckIcon: React.FC = () => (
    <svg {...iconProps} className="w-4 h-4" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
    </svg>
);

export const ImageIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
);

export const DocumentIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);

export const SpinnerIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className || "w-5 h-5 animate-spin"} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const KeypadIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 6.75h4.5m-4.5 3h4.5m-4.5 3h4.5m3.75 3h-10.5A2.25 2.25 0 013 16.5V7.5A2.25 2.25 0 015.25 5.25h10.5A2.25 2.25 0 0118 7.5v9A2.25 2.25 0 0115.75 18.75z" />
    </svg>
);

export const DevicePhoneMobileIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </svg>
);

export const MapPinIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
);

export const LockClosedIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
);

export const CheckIcon: React.FC = () => (
    <svg {...iconProps} className="w-5 h-5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);