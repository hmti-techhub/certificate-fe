import ThreeCircleLoading from "@/components/animation/ThreeCircleLoading";

const LoadingEvent = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <ThreeCircleLoading message="waiting for event data" />
    </div>
  );
};

export default LoadingEvent;
