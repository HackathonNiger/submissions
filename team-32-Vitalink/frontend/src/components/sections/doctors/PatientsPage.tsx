import { useMoveBack } from "../../../hooks/useMoveBack";

export default function PatientsPage() {
  const moveBack = useMoveBack();

  return (
    <div className="w-full flex flex-col justify-center m-auto items-center place-content-center absolute top-0 left-0 h-full gap-2">
      <h1>comming soon</h1>
      <button onClick={moveBack} className="px-6 py-3 text-lg font-medium bg-gray-800 text-white rounded-md hover:bg-gray-700 transition">
        &larr; Go back
      </button>
    </div>
  );
}
