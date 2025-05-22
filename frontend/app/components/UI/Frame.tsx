export default function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <div className="w-full h-full bg-white bg-opacity-90 backdrop-blur-xl rounded-xl shadow-lg overflow-auto">
        {/* Ensure children stretch */}
        <div className="w-full min-w-[1000px]">{children}</div>
      </div>
    </div>
  );
}
