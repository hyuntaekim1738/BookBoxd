export default function BackgroundLayout({ children }) {
  return (
    <main
      className="bg-cover min-h-screen pt-32"
      style={{ 
        backgroundImage: "url('/home-page-background.jpg')",
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="w-[80rem] mx-auto bg-white bg-opacity-95 p-10 rounded-lg shadow-lg min-h-[34rem]">
        {children}
      </div>
    </main>
  );
} 


