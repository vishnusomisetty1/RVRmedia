export default function BookingPage() {
  return (
    <div className="min-h-screen bg-white pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-black text-center mb-12">
          Book Us(Free Temporarily)
        </h1>
        <div className="w-full aspect-[3/4] md:aspect-[4/3] bg-[#f5f5dc] rounded-lg p-4">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSevbA8RdIBgkm_ILugVApZBtERPMLPZPzJgyxd8sebuaO4UVQ/viewform?embedded=true"
            className="w-full h-full"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
          >
            Loading form...
          </iframe>
        </div>
      </div>
    </div>
  );
}
