export default function FrequentlyUsedLenses({ lenses }) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold">
        Frequently Used Lenses
      </h3>

      <ul className="mt-2 list-disc pl-5">
        {lenses.map((lens, index) => (
          <li key={index}>
            {lens.lens_name} ({lens.total_used} uses)
          </li>
        ))}
      </ul>
    </div>
  );
}