export default function Home() {
  return (
    <main
      className="bg-cover p-10 flex items-center justify-center min-h-screen"
      style={{ backgroundImage: "url('/home-page-background.jpg')" }}
    >
      <div className="max-w-7xl mx-auto bg-white bg-opacity-95 p-10 rounded-lg shadow-lg -mt-16">
        <h1 className="text-4xl font-bold text-black mb-8 text-center">
          Welcome to BookBoxd
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-secondary">
            Welcome to BookBoxd! 
            Consider this your digital bookshelf, recording books you've read and your thoughts on them.
            Click the button below to log in and get started!
          </h2>
        </div>
        <div className="mt-6 flex justify-center">
          <button className="px-8 py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg transition-colors shadow-lg">
            Get Started!
          </button>
        </div>
      </div>
    </main>
  );
}
