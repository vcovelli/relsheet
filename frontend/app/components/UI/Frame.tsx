export default function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="w-full h-full bg-white bg-opacity-90 backdrop-blur-xl rounded-xl shadow-lg overflow-hidden">
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
