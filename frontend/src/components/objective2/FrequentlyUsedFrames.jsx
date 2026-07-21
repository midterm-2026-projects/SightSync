export default function FrequentlyUsedFrames({ frames }) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold">
        Frequently Used Frames
      </h3>

      <ul className="mt-2 list-disc pl-5">
        {frames.map((frame, index) => (
          <li key={index}>
            {frame.frame_name} ({frame.total_used} uses)
          </li>
        ))}
      </ul>
    </div>
  );
}