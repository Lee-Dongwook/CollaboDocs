/* eslint-disable @typescript-eslint/no-explicit-any */

interface VersionHistoryProps {
  versions: any[];
  onRestore: (index: number) => void;
}

export default function VersionHistory({
  versions,
  onRestore,
}: VersionHistoryProps) {
  return (
    <div className="mt-4">
      <h2 className="text-lg font-bold">Version History</h2>
      {versions.map((version, index) => (
        <div key={index} className="mt-2">
          <button
            className="bg-gray-200 p-1 rounded hover:bg-gray-300"
            onClick={() => onRestore(index)}
          >
            Restore Version {index + 1}
          </button>
        </div>
      ))}
    </div>
  );
}
