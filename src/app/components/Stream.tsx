export default function Stream() {
  return (
    <section className="py-20 bg-gray-100 text-center text-black">
      <h2 className="text-3xl font-bold mb-4 text-black">
        Watch Ratna & Suresh's Gruhapravesam 12/25/24
      </h2>
      <p className="mb-8 text-lg">
        Join us for the live stream of this special event!
      </p>

      {/* Centered Embedded YouTube Video */}
      <div className="flex justify-center mb-8">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/iAUQJF_cKEY"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <a
        href="https://youtu.be/iAUQJF_cKEY?si=ZvBBEfgqIYAI8fOT" // Replace with your actual YouTube link
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
      >
        Watch Live
      </a>
    </section>
  );
}
