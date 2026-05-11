'use client';

export default function QuranSelector({ surah, onSelect }) {
  return (
    <div className="islamic-card p-4 cursor-pointer hover:shadow-xl transition-all duration-300">
      <h3 className="text-lg font-bold text-islamic-dark arabic-text">
        سورة {surah.name}
      </h3>
      <p className="text-sm text-gray-600 mt-2">
        عدد الآيات: <span className="font-bold">{surah.verses}</span>
      </p>
    </div>
  );
}
