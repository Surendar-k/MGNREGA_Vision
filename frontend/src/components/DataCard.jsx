// // src/components/DataCard.jsx
// import React from "react";
// import { Briefcase, Wallet, Users, Home, CalendarDays, FileText, Activity, User } from "lucide-react";

// const DataCard = ({ record }) => {
//   return (
//     <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col gap-3 hover:shadow-xl transition transform hover:scale-105">
//       {/* District Info */}
//       <div className="flex items-center gap-2">
//         <CalendarDays className="text-blue-600" />
//         <span className="font-semibold text-gray-700">{record.district_name || record.district_code}</span>
//       </div>

//       {/* Month & Financial Year */}
//       <div className="flex items-center justify-between text-gray-600 text-sm">
//         <span>FY: {record.fin_year || "-"}</span>
//         <span>Month: {record.month || "-"}</span>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 gap-3 mt-2">
//         <StatCard icon={<Briefcase />} label="Total Works" value={record.Total_No_of_Works_Takenup} color="from-blue-500 to-indigo-500" />
//         <StatCard icon={<Wallet />} label="Funds ₹" value={record.Total_Exp} color="from-green-500 to-emerald-500" />
//         <StatCard icon={<Users />} label="Job Cards" value={record.Total_No_of_JobCards_issued} color="from-purple-500 to-pink-500" />
//         <StatCard icon={<Home />} label="Households" value={record.Total_Households_Worked} color="from-orange-500 to-amber-500" />

//         {/* Additional Fields */}
//         <StatCard icon={<User />} label="Total Workers" value={record.Total_No_of_Workers} color="from-teal-500 to-cyan-500" />
//         <StatCard icon={<Activity />} label="Completed Works" value={record.Number_of_Completed_Works} color="from-lime-500 to-green-500" />
//         <StatCard icon={<FileText />} label="Wages Paid" value={record.Wages} color="from-pink-500 to-rose-500" />
//         <StatCard icon={<FileText />} label="Approved Labour Budget" value={record.Approved_Labour_Budget} color="from-yellow-400 to-orange-500" />
//       </div>
//     </div>
//   );
// };

// const StatCard = ({ icon, label, value, color }) => (
//   <div className={`flex flex-col items-center justify-center gap-1 rounded-xl p-3 bg-gradient-to-br ${color} text-white`}>
//     <div className="bg-white/30 p-2 rounded-full">{icon}</div>
//     <span className="text-xs">{label}</span>
//     <span className="font-bold text-lg">{value || "-"}</span>
//   </div>
// );

// export default DataCard;
