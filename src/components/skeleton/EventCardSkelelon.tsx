import { Skeleton } from "../ui/skeleton";

const EventCardSkeleton = () => {
  return (
    <Skeleton className="w-full h-full rounded-xl p-4">
      <div className="w-full h-full space-y-4 flex flex-col justify-between">
        <Skeleton className="w-full h-26 rounded-xl bg-gray-200" />
        <div className="space-y-2">
          <Skeleton className="w-4/5 h-7 rounded-xl bg-gray-200" />
          <Skeleton className="w-2/5 h-7 rounded-xl bg-gray-200" />
        </div>
        <Skeleton className="w-2/5 h-7 rounded-xl bg-gray-200" />
      </div>
    </Skeleton>
  );
};

export default EventCardSkeleton;
