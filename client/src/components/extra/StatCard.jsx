const StatCard = ({ title, value, subtitle, icon, color = 'indigo' }) => {
    const colors = {
        slate: 'bg-slate-100 text-slate-600',
        indigo: 'bg-indigo-100 text-indigo-600',
        emerald: 'bg-emerald-100 text-emerald-600',
        green: 'bg-green-100 text-green-600',
        amber: 'bg-amber-100 text-amber-600',
        red: 'bg-red-100 text-red-600'
    }

    return (
        <div className="bg-white rounded-2xl border-gray-500 shadow-sm p-5 hover:shadow-md transition">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-800">{value}</p>
                    {subtitle && (
                        <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
                    )}
                </div>
                <div
                    className={`h-12 w-12 rounded-xl flex items-center justify-center ${colors[color]}`}
                >
                    {icon}
                </div>
            </div>
        </div>
    )
}

export default StatCard