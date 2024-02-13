const Layouts: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center space-y-6">
      <h2 className="text-3xl font-bold">ChatX</h2>
      {children}
    </div>
  );
};

export default Layouts;

interface LayoutProps {
  children: any;
}
